import { PrismaClient } from "@prisma/client";
import { RndStrAlphabet, randomString } from "~/utils/simpleFunctions";
import logDated from "../utils/logger";
const prisma = new PrismaClient();

const TEN_HOURS = 10 * 60 * 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;

export default defineEventHandler(async (event) => {
  const user = await useAuth(event);
  const now = new Date().getTime();

  const connection = await prisma.connectionString.findFirst({
    where: {
      ownerId: user.id,
      createdAt: { gte: new Date(now - TEN_HOURS) },
      deleted: false
    }
  });
  if (connection) return { connection };

  const closeToRequestConnection = await prisma.connectionString.count({
    where: {
      ownerId: user.id,
      createdAt: { gte: new Date(now - FIVE_MINUTES) },
    }
  });
  if (closeToRequestConnection) throw createError({
    statusCode: 400,
    message: "Новый код можно создать только раз в 5 минут."
  });

  const newConnection = await prisma.connectionString.create({
    select: { value: true, createdAt: true },
    data: { ownerId: user.id, value: randomString(RndStrAlphabet.useUpper | RndStrAlphabet.useNumbers, 10) }
  });

  logDated(`${user.username} created a new connection code`);

  if(event.context.appSocket)
    event.context.appSocket.in(user.id).emit("update-connection");

  return { connection: newConnection };
})
