import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import prisma from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

interface AdapterUser {
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}
export const authOptions: NextAuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (data: AdapterUser) => {
      console.log(data);

      try {
        const user = await prisma.user.create({
          data: {
            email: data.email,
            firstName: data.name?.split(" ")[0] || null,
            lastName: data.name?.split(" ").slice(1).join(" ") || null,
            avatar: data.image || null,
            image: data.image || null,
            emailVerified: data.emailVerified,
            role: "USER",
            phone: (data as any).phone || null,
          },
        });
        return user;
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
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
      httpOptions: {
        timeout: 10000,
      },
    }),
  ],
  events: {
    signIn: async ({ user }) => {
      if (user.id) {
        try {
          const cookieStore = await cookies();
          const sessionId = cookieStore.get("sessionId")?.value;

          if (sessionId) {
            await mergeCartsOnLogin(user.id, sessionId);
          }
        } catch (error) {
          console.error("Error merging carts:", error);
        }
      }
    },
  },
  callbacks: {
    // Add this callback to link accounts with same email
    async signIn({ user, account, profile }) {
      if (!account) return true;

      if (account.provider !== "credentials") {
        // Only proceed if we have an email
        if (!user.email) return true;

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: {
            accounts: {
              where: {
                provider: account.provider,
              },
            },
          },
        });

        // If user exists but doesn't have this provider linked
        if (existingUser && existingUser.accounts.length === 0) {
          try {
            // Check if this account already exists (to prevent unique constraint errors)
            const existingAccount = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            });

            // Only create if it doesn't exist
            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                },
              });
            }
          } catch (error) {
            console.error("Error linking account:", error);
            // Continue the sign-in process even if linking fails
          }
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.role = (user as User).role;
        token.firstName = (user as User).firstName;
        token.lastName = (user as User).lastName;
        token.phone = (user as User).phone;
        token.image = (user as User).avatar || (user as User).image;
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
          phone: token.phone as string | null | undefined,
          image: token.image as string | null | undefined,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
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
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
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

    if (!sessionCart) return;

    if (userCart) {
      // Merge items into existing user cart
      await Promise.all(
        sessionCart.cartItems.map(async (item) => {
          const existingItem = userCart.cartItems.find(
            (i) => i.inventoryId === item.inventoryId && i.type === item.type
          );

          if (existingItem) {
            return prisma.cartItem.update({
              where: { id: existingItem.id },
              data: {
                quantity: (existingItem.quantity ?? 0) + (item.quantity ?? 0),
              },
            });
          }

          return prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              inventoryId: item.inventoryId,
              quantity: item.quantity,
              type: item.type,
            },
          });
        })
      );

      await prisma.cart.delete({ where: { id: sessionCart.id } });
    } else {
      // Convert session cart to user cart
      await prisma.cart.update({
        where: { id: sessionCart.id },
        data: { userId, sessionId: null },
      });
    }

    await recalculateCartTotal(userId);
  } catch (error) {
    console.error("Error during cart merge:", error);
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
              product: {
                select: {
                  retailPrice: true,
                  promotionalPrice: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (cart) {
    let deliveryTotalWithVat = 0;
    let collectionTotalWithVat = 0;
    let hasDeliveryItems = false;

    // Calculate totals with VAT included
    cart.cartItems.forEach((item) => {
      const priceWithVat =
        item.inventory.product.promotionalPrice &&
        item.inventory.product.promotionalPrice > 0
          ? item.inventory.product.promotionalPrice
          : item.inventory.product.retailPrice || 0;

      const itemTotalWithVat = priceWithVat * (item.quantity || 0);

      if (item.type === "FOR_DELIVERY") {
        deliveryTotalWithVat += itemTotalWithVat;
        hasDeliveryItems = true;
      } else {
        collectionTotalWithVat += itemTotalWithVat;
      }
    });

    // Apply delivery charge if there are delivery items
    const deliveryCharge = hasDeliveryItems ? 5 : 0;
    const deliveryVat = deliveryCharge * 0.2; // 20% VAT on delivery

    // Calculate VAT-exclusive amounts
    const deliveryTotalWithoutVat = deliveryTotalWithVat / 1.2;
    const collectionTotalWithoutVat = collectionTotalWithVat / 1.2;
    const subTotalWithVat = deliveryTotalWithVat + collectionTotalWithVat;
    const subTotalWithoutVat =
      deliveryTotalWithoutVat + collectionTotalWithoutVat;
    const vat = subTotalWithVat - subTotalWithoutVat + deliveryVat; // VAT from products plus delivery VAT

    // Final totals including delivery and its VAT
    const totalPriceWithVat = subTotalWithVat + deliveryCharge + deliveryVat;
    const totalPriceWithoutVat = subTotalWithoutVat + deliveryCharge;

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        deliveryTotalWithVat,
        deliveryTotalWithoutVat,
        collectionTotalWithVat,
        collectionTotalWithoutVat,
        subTotalWithVat,
        subTotalWithoutVat,
        deliveryCharge,
        vat,
        totalPriceWithVat,
        totalPriceWithoutVat,
      },
    });
  }
}
