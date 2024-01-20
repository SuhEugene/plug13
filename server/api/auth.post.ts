
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import getDiscordUser from '../utils/getDiscordUser';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const grant = await getDiscordTokenGrant(event);
  const discordUser = await getDiscordUser(event, grant);

  const jwtSecret = useRuntimeConfig().jwtSecret;

  let user = await prisma.user.findFirst({
    select: { id: true, tokenVersion: true },
    where: { id: discordUser.id }
  });
  if (!user)
    user = await prisma.user.create({
      select: { id: true, tokenVersion: true },
      data: { id: discordUser.id }
    });
  
  const token = jwt.sign(user, jwtSecret);
  setCookie(event, 'token', token, {
    sameSite: true,
    secure: true
  });

  return { id: user.id };
})
