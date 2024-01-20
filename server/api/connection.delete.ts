import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TEN_HOURS = 10 * 60 * 60 * 1000;

export default defineEventHandler(async (event) => {
  const user = await useAuth(event);

  const connection = await prisma.connectionString.update({
    select: { value: true, createdAt: true },
    where: {
      ownerId: user.id,
      createdAt: { gte: new Date(Date.now() - TEN_HOURS) },
      deleted: false
    },
    data: { deleted: true }
  });

  return { connection };
})
