import prisma from "@app/utils/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const requestBody: {
      email: string;
    } = await request.json();

    const userSelected = await prisma.user.findUnique({
      where: {
        email: requestBody.email,
      },
    });

    if (userSelected) {
      return NextResponse.json({ user: userSelected }, { status: 200 });
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

export async function PUT(request: NextRequest) {
  try {
    const requestBody: {
      email: string;
      name: string;
      phone: string;
      city: string;
      state: string;
    } = await request.json();

    const userSelected = await prisma.user.update({
      data: {
        name: requestBody.name,
        phone: requestBody.phone,
        city: requestBody.city,
        state: requestBody.state,
      },
      where: {
        email: requestBody.email,
      },
    });

    if (userSelected) {
      return NextResponse.json({ user: userSelected }, { status: 200 });
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
