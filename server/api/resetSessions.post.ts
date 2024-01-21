import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const user = await useAuth(event);

  await prisma.user.update({
    data: { tokenVersion: { increment: 1 } },
    where: { id: user.id }
  })

  return;
})
