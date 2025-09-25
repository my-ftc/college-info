import prisma from "@app/utils/prismaDb";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const {
      query,
      threadId1,
      threadId2,
    }: {
      query: string;
      threadId1?: string;
      threadId2?: string;
    } = await request.json();

    // Save query to DB
    const queryCreated = await prisma.queries.create({
      data: { query },
    });

    // Ensure threads exist
    let currentThreadId1 = threadId1;
    let currentThreadId2 = threadId2;

    if (!currentThreadId1) {
      const thread1 = await openai.beta.threads.create();
      currentThreadId1 = thread1.id;
    }
    if (!currentThreadId2) {
      const thread2 = await openai.beta.threads.create();
      currentThreadId2 = thread2.id;
    }

    // Add user message
    await Promise.all([
      openai.beta.threads.messages.create(currentThreadId1, {
        role: "user",
        content: query,
      }),
      openai.beta.threads.messages.create(currentThreadId2, {
        role: "user",
        content: query,
      }),
    ]);

    // Start runs (but don’t wait for them here)
    const [run1, run2] = await Promise.all([
      openai.beta.threads.runs.create(currentThreadId1, {
        assistant_id: process.env.ASSISTANT_ID_1!,
      }),
      openai.beta.threads.runs.create(currentThreadId2, {
        assistant_id: process.env.ASSISTANT_ID_2!,
      }),
    ]);

    return NextResponse.json(
      {
        query: queryCreated,
        threadId1: currentThreadId1,
        threadId2: currentThreadId2,
        runId1: run1.id,
        runId2: run2.id,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error in /api/query:", e);
    return NextResponse.json(
      { response: "Something went wrong, try again", details: e.message },
      { status: 500 }
    );
  }
}
