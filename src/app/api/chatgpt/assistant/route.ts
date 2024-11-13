import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openAI = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY!,
  dangerouslyAllowBrowser: true,
});

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { query } = requestBody;

    // Create threads for both assistants in parallel
    const [thread1, thread2] = await Promise.all([
      openAI.beta.threads.create(),
      openAI.beta.threads.create()
    ]);

    // Send messages to both threads in parallel
    await Promise.all([
      openAI.beta.threads.messages.create(thread1.id, {
        role: "user",
        content: query,
      }),
      openAI.beta.threads.messages.create(thread2.id, {
        role: "user",
        content: query,
      })
    ]);

    // Create runs for both assistants in parallel
    const [run1, run2] = await Promise.all([
      openAI.beta.threads.runs.create(thread1.id, {
        assistant_id: process.env.ASSISTANT_ID!,
      }),
      openAI.beta.threads.runs.create(thread2.id, {
        assistant_id: process.env.LINK_ASSISTANT_ID!,
      })
    ]);

    // Wait for both runs to complete in parallel
    await Promise.all([
      checkStatus(thread1.id, run1.id),
      checkStatus(thread2.id, run2.id)
    ]);

    // Get messages from both threads in parallel
    const [messages1, messages2] = await Promise.all([
      openAI.beta.threads.messages.list(thread1.id),
      openAI.beta.threads.messages.list(thread2.id)
    ]);

    const response1: string = (messages1 as any).data[0].content[0].text.value;
    const response2: string = (messages2 as any).data[0].content[0].text.value;

    return NextResponse.json(
      { response: `${response1}\n\n${response2}` },
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