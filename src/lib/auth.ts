import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import prisma from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { getOrCreateSessionId } from "@/lib/session-id";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user.id) {
        const sessionId = getOrCreateSessionId();
        await mergeCartsOnLogin(user.id, sessionId);
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.role = (user as User).role;
        token.firstName = (user as User).firstName;
        token.lastName = (user as User).lastName;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId as string,
          email: token.email as string,
          role: token.role as string,
          firstName: token.firstName as string | null | undefined,
          lastName: token.lastName as string | null | undefined,
        },
        accessToken: token.accessToken as string | undefined,
        error: token.error as string | undefined,
      };
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getServerAuthSession() {
  const session = await getServerSession(authOptions);

  if (session) {
    return {
      ...session,
      expires: session.expires
        ? new Date(session.expires).toISOString()
        : undefined,
    };
  }
  return null;
}

async function mergeCartsOnLogin(userId: string, sessionId: string) {
  const [userCart, sessionCart] = await Promise.all([
    prisma.cart.findFirst({ where: { userId }, include: { cartItems: true } }),
    prisma.cart.findFirst({
      where: { sessionId },
      include: { cartItems: true },
    }),
  ]);

  if (sessionCart) {
    if (userCart) {
      // Merge session cart items into user cart
      for (const item of sessionCart.cartItems) {
        const existingItem = userCart.cartItems.find(
          (i) => i.inventoryId === item.inventoryId && i.type === item.type
        );
        if (existingItem) {
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: {
              quantity: (existingItem.quantity ?? 0) + (item.quantity ?? 0),
            },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              ...item,
              cartId: userCart.id,
            },
          });
        }
      }
      // Delete the session cart
      await prisma.cart.delete({ where: { id: sessionCart.id } });
    } else {
      // If no user cart exists, simply update the session cart to be associated with the user
      await prisma.cart.update({
        where: { id: sessionCart.id },
        data: { userId, sessionId: null },
      });
    }
  }

  // Recalculate total price for the user's cart
  await recalculateCartTotal(userId);
}

async function recalculateCartTotal(userId: string) {
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      cartItems: {
        include: {
          inventory: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (cart) {
    const totalPrice = cart.cartItems.reduce((total, item) => {
      return (
        total + (item.inventory.product.tradePrice || 0) * (item.quantity || 0)
      );
    }, 0);

    await prisma.cart.update({
      where: { id: cart.id },
      data: { totalPrice },
    });
  }
}
