
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import logDated from '../utils/logger';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const grant = await getDiscordTokenGrant(event);
  const discordUser = await getDiscordUser(event, grant);

  const jwtSecret = useRuntimeConfig().jwtSecret;

  let user = await prisma.user.findFirst({
    select: { id: true, username: true, tokenVersion: true },
    where: { id: discordUser.id }
  });

  if (!user)
    user = await prisma.user.create({
      select: { id: true, username: true, tokenVersion: true },
      data: { id: discordUser.id, username: discordUser.username }
    });

  if (user.username !== discordUser.username)
    user = await prisma.user.update({
      select: { id: true, username: true, tokenVersion: true },
      data: { username: discordUser.username },
      where: { id: discordUser.id }
    });

  const token = jwt.sign(user, jwtSecret);
  setCookie(event, 'token', token, {
    sameSite: true,
    secure: true,
    httpOnly: true
  });

  logDated(`${user.username} logged in using Discord`);

  return { id: user.id, username: user.username };
})
