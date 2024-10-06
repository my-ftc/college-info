import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openAI = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { query } = requestBody;

    const thread = await openAI.beta.threads.create();
    const message = await openAI.beta.threads.messages.create(thread.id, {
      role: "user",
      content: query,
    });
    const run = await openAI.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID!,
    });

    await checkStatus(thread.id, run.id);
    const messages: any = await openAI.beta.threads.messages.list(thread.id);

    return NextResponse.json(
      { response: messages.body.data[0].content[0].text.value },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json(
      { response: "Something went wrong, try again" },
      { status: 500 }
    );
  }
}

async function checkStatus(threadId: string, runId: string) {
  let isComplete = false;
  while (!isComplete) {
    const runStatus = await openAI.beta.threads.runs.retrieve(threadId, runId);
    if (runStatus.status === "completed") {
      isComplete = true;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}
