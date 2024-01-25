import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TEN_HOURS = 10 * 60 * 60 * 1000;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.code || !body.key) return { "error": "Invalid request body" };

  const byondSecret = useRuntimeConfig().byondSecret;
  if (!body.secret || body.secret !== byondSecret) return createError({
    statusCode: 400,
    message: "Invalid secret"
  });

  const isThereConnection = await prisma.connectionString.count({
    where: {
      value: body.code,
      createdAt: { gte: new Date(Date.now() - TEN_HOURS) },
    }
  });
  if (!isThereConnection) return { "error": "Code not found" };

  console.log(`${body.key} connected to the key "${body.code}"`);

  return { "username": body.key };
})
