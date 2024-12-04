import { PrismaClient } from "@prisma/client";
import { PrismaClient as EdgePrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: PrismaClient | undefined;
}

// Create a single type that represents our Prisma client
type PrismaClientType = PrismaClient | ReturnType<typeof createEdgeClient>;

function createEdgeClient() {
  return new EdgePrismaClient().$extends(withAccelerate());
}

function createClient(): PrismaClientType {
  if (process.env.NODE_ENV === "production") {
    return createEdgeClient();
  }

  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    });
  }

  return global.prisma;
}

// Use type assertion to ensure consistent typing
const prisma = createClient() as PrismaClient;

export default prisma;
