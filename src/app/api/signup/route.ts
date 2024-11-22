import prisma from "@app/utils/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const requestBody: {
      email: string;
      name: string;
      phone: string;
      city: string;
      state: string;
    } = await request.json();

    const userExists = await prisma.user.findFirst({
      where: {
        email: requestBody.email,
      },
    });

    if (userExists) {
      return NextResponse.json(
        { user: userExists, newUser: false },
        { status: 200 }
      );
    } else {
      const createdUser = await prisma.user.create({
        data: {
          name: requestBody.name,
          email: requestBody.email,
          phone: requestBody.phone,
          city: requestBody.city,
          state: requestBody.state,
        },
      });

      if (createdUser) {
        return NextResponse.json(
          { user: createdUser, newUser: true },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { response: "Something went wrong, try again" },
          { status: 500 }
        );
      }
    }
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json(
      { response: "Something went wrong, try again" },
      { status: 500 }
    );
  }
}
