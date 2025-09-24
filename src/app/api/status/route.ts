import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId")!;
    const runId = searchParams.get("runId")!;
    const isSecond = searchParams.get("isSecond") === "true";

    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    if (runStatus.status !== "completed") {
      return NextResponse.json({ status: runStatus.status });
    }

    const messages = await openai.beta.threads.messages.list(threadId);
    const response: string = (messages as any).data[0].content[0].text.value;

    const finalResponse = isSecond
      ? response.split("</a>").slice(0, -1).join("</a>") + "</a>"
      : response;

    return NextResponse.json({
      status: "completed",
      response: finalResponse,
    });
  } catch (e: any) {
    console.error("Error in /api/status:", e);
    return NextResponse.json(
      { response: "Something went wrong", details: e.message },
      { status: 500 }
    );
  }
}
