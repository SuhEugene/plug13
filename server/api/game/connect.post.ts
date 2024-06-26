import { PrismaClient } from "@prisma/client";
import logDated from "~/server/utils/logger";
const prisma = new PrismaClient();

const TEN_HOURS = 10 * 60 * 60 * 1000;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.code || !body.key) return { "error": "Неверное тело запроса. Пожалуйста, уведомьте об этом разработчика" };

  const byondSecret = useRuntimeConfig().byondSecret;
  if (!body.secret || body.secret !== byondSecret) return { "error": "Неверный секрет билда. Пожалуйста, уведомьте об этом разработчика." }

  const userConnection = await prisma.connectionString.findFirst({
    where: {
      value: body.code.replace("-", "").toUpperCase(),
      createdAt: { gte: new Date(Date.now() - TEN_HOURS) },
    },
    select: { owner: { select: { username: true } }, value: true }
  });
  if (!userConnection) return { "error": "Неверный код подключения!" };

  logDated(`${body.key} connected to the key ${userConnection.value} of user ${userConnection.owner.username}`);

  return { "username": userConnection.owner.username };
})
