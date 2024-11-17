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
      return NextResponse.json({ user: createdUser }, { status: 200 });
    } else {
      return NextResponse.json(
        { response: "Something went wrong, try again" },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json(
      { response: "Something went wrong, try again" },
      { status: 500 }
    );
  }
}