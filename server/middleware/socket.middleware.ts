import { PrismaClient } from '@prisma/client';
import { Socket, Server } from 'socket.io';
import { parse } from 'cookie-es';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const TEN_HOURS = 10 * 60 * 60 * 1000;

declare global { var io: Server };

export default defineEventHandler((event) => {
  const jwtSecret = useRuntimeConfig().jwtSecret;

  if (global.io) {
    event.context.appSocket = global.io;
    return;
  }
  console.log('Initiating socket.middleware');

  const socket = event.node.res.socket as any;
  global.io = new Server(socket?.server);
  event.context.appSocket = global.io;

  global.io.use(async (socket, next) => {
    if (!socket.request.headers.cookie)
      return next(new Error("No cookie present"));
    const { token } = parse(socket.request.headers.cookie);
    if (!token)
      return next(new Error("No token present"));

    try { jwt.verify(token, jwtSecret) }
    catch (e) { return next(new Error((e as any)?.message || "Bad token")); }

    next();
  });

  global.io.on('connection', (socket: Socket) => {
    const { token } = parse(socket.request.headers.cookie as string);
    const user = jwt.decode(token);
    if (!user || typeof user === "string") return socket.disconnect(true);
    console.log("Client connected", socket.id);

    (async () => {
      const isThereUser = await prisma.user.count({ where: { id: user.id, tokenVersion: user.tokenVersion } });
      if (!isThereUser) return socket.disconnect(true);
      socket.join(user.id);
      socket.emit("ready");

      socket.on("get-connection", async () => {
        const connection = await prisma.connectionString.findFirst({
          where: {
            ownerId: user.id,
            createdAt: { gte: new Date(Date.now() - TEN_HOURS) },
            deleted: false
          }
        });
        if (!connection) return socket.emit("connection-string", null);;

        socket.join(connection.value);
        socket.emit("connection-string", { value: connection.value, createdAt: connection.createdAt });

        // Если этот таймаут доживёт, то он кикнет как положено
        // Если не доживёт - в любом случае строчка будет запрошена вновь
        setTimeout(() => {
          socket.connected && socket.leave(connection.value);
          socket.emit("connection-string", null);
        }, connection.createdAt.getTime() - Date.now() + TEN_HOURS );
      })

    })();

  })
})
