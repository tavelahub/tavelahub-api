import { prisma } from '../../lib/prisma';

function getUserByEmail(email: string) {
  return prisma.user.findUniqueOrThrow({
    where: { email },
    include: { password: true },
  });
}

export { getUserByEmail };
