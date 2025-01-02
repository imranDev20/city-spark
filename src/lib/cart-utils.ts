import { Prisma } from "@prisma/client";

export function getCartWhereInput(
  userId?: string,
  sessionId?: string
): Prisma.CartWhereInput {
  const baseCondition: Prisma.CartWhereInput = { status: "ACTIVE" };

  if (userId && sessionId) {
    return { AND: [{ ...baseCondition, userId }, { sessionId }] };
  } else if (userId) {
    return { ...baseCondition, userId };
  } else if (sessionId) {
    return { ...baseCondition, sessionId };
  }

  throw new Error("Neither userId nor sessionId is available");
}
