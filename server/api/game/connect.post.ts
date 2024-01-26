import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TEN_HOURS = 10 * 60 * 60 * 1000;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.code || !body.key) return { "error": "Неверное тело запроса. Пожалуйста, уведомьте об этом разработчика" };

  const byondSecret = useRuntimeConfig().byondSecret;
  if (!body.secret || body.secret !== byondSecret) return { "error": "Неверный секрет билда. Пожалуйста, уведомьте об этом разработчика." }

  const isThereConnection = await prisma.connectionString.count({
    where: {
      value: body.code.replace("-", "").toUpperCase(),
      createdAt: { gte: new Date(Date.now() - TEN_HOURS) },
    }
  });
  if (!isThereConnection) return { "error": "Неверный код подключения!" };

  console.log(`${body.key} connected to the key "${body.code}"`);

  return { "username": body.key };
})
