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
  adapter: {
    ...PrismaAdapter(prisma),
    // Override createUser to match your schema
    createUser: async (data) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          firstName: data.name?.split(" ")[0] || null, // Split full name into first name
          lastName: data.name?.split(" ").slice(1).join(" ") || null, // Rest of the name becomes last name
          avatar: data.image,
          emailVerified: data.emailVerified,
          role: "USER", // Set default role
        },
      });
      return user;
    },
  },
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
    async signIn({ user, account, profile }) {
      if (user.id) {
        const sessionId = getOrCreateSessionId();
        try {
          await mergeCartsOnLogin(user.id, sessionId);
        } catch (error) {
          console.error("Error merging carts:", error);
          // Don't block sign in if cart merging fails
        }
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

export async function mergeCartsOnLogin(userId: string, sessionId: string) {
  try {
    // First check if user exists to prevent foreign key constraint error
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("User not found during cart merge");
      return;
    }

    const [userCart, sessionCart] = await Promise.all([
      prisma.cart.findFirst({
        where: { userId },
        include: { cartItems: true },
      }),
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
            // Update existing item
            await prisma.cartItem.update({
              where: { id: existingItem.id },
              data: {
                quantity: (existingItem.quantity ?? 0) + (item.quantity ?? 0),
              },
            });
          } else {
            // Create new item in user's cart
            await prisma.cartItem.create({
              data: {
                cartId: userCart.id,
                inventoryId: item.inventoryId,
                quantity: item.quantity,
                type: item.type,
              },
            });
          }
        }
        // Delete the session cart after merging
        await prisma.cart.delete({
          where: { id: sessionCart.id },
        });
      } else {
        // If no user cart exists, create one and move all items
        const newUserCart = await prisma.cart.create({
          data: {
            userId,
            totalPrice: sessionCart.totalPrice,
          },
        });

        // Move all items to the new cart
        await Promise.all(
          sessionCart.cartItems.map((item) =>
            prisma.cartItem.update({
              where: { id: item.id },
              data: { cartId: newUserCart.id },
            })
          )
        );

        // Delete the session cart
        await prisma.cart.delete({
          where: { id: sessionCart.id },
        });
      }
    }

    // Recalculate total price
    await recalculateCartTotal(userId);
  } catch (error) {
    console.error("Error during cart merge:", error);
    // Don't throw the error to prevent login failure
    // but log it for debugging
  }
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
