// app/api/account/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Fetch the current user's profile with auth provider info
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        password: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Add auth info to the response
    const { password, accounts, ...userData } = user;

    // Create providers array, adding 'credentials' if password exists
    const providers = accounts.map((account) => account.provider);
    if (!!password) {
      providers.push("credentials");
    }

    const authInfo = {
      hasPassword: !!password,
      providers: providers,
    };

    return NextResponse.json({
      success: true,
      data: {
        ...userData,
        authInfo,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
