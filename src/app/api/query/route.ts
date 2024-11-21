import prisma from "@app/utils/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const requestBody: {
      query: string;
    } = await request.json();

    const queryCreated = await prisma.queries.create({
      data: { query: requestBody.query },
    });

    if (queryCreated) {
      return NextResponse.json({ query: queryCreated }, { status: 200 });
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
