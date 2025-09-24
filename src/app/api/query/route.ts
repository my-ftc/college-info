import prisma from "@app/utils/prismaDb";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function checkStatus(threadId: string, runId: string) {
  let isComplete = false;
  while (!isComplete) {
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    if (runStatus.status === "completed") {
      isComplete = true;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

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

    const queryCreated = await prisma.queries.create({
      data: { query },
    });

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

    const [run1, run2] = await Promise.all([
      openai.beta.threads.runs.create(currentThreadId1, {
        assistant_id: process.env.ASSISTANT_ID_1!,
      }),
      openai.beta.threads.runs.create(currentThreadId2, {
        assistant_id: process.env.ASSISTANT_ID_2!,
      }),
    ]);

    await Promise.all([
      checkStatus(currentThreadId1, run1.id),
      checkStatus(currentThreadId2, run2.id),
    ]);

    const [messages1, messages2] = await Promise.all([
      openai.beta.threads.messages.list(currentThreadId1),
      openai.beta.threads.messages.list(currentThreadId2),
    ]);

    const response1: string = (messages1 as any).data[0].content[0].text.value;
    const response2: string = (messages2 as any).data[0].content[0].text.value;

    const response2Parts = response2.split("</a>");
    const modifiedResponse2 = response2Parts.slice(0, -1).join("</a>");

    return NextResponse.json(
      {
        query: queryCreated,
        threadId1: currentThreadId1,
        threadId2: currentThreadId2,
        response: `${response1}\n\n${modifiedResponse2}</a>`,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error:", e);
    return NextResponse.json(
      { response: "Something went wrong, try again", details: e.message },
      { status: 500 }
    );
  }
}
