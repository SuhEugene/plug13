import { PrismaClient } from '@prisma/client';
import type { H3Event, EventHandlerRequest } from 'h3';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function getUser(id: string, tokenVersion: number) {
  const user = await prisma.user.findFirst({
    select: { id: true },
    where: { id, tokenVersion }
  });
  if (!user) throw Error("Токен устарел");
  return user;
}

export default async (event: H3Event<EventHandlerRequest>) => {
  const cookies = parseCookies(event);
  if (!cookies.token) throw createError({
    statusCode: 401,
    statusMessage: "Отсутствует токен"
  });

  const jwtSecret = useRuntimeConfig().jwtSecret;
  try {
    const verification = jwt.verify(cookies.token, jwtSecret);

    if (typeof verification === 'string') throw Error("JWT невалиден");
    if (verification.id  === undefined || verification.tokenVersion === undefined) throw Error("Данные JWT невалидны");

    return await getUser(verification.id, verification.tokenVersion);

  } catch (e) {
    throw createError({
      statusCode: 400,
      statusMessage: (e as Error)?.message || "Не получается верифицировать токен" 
    });
  }
}