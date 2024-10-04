import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { query } = requestBody;

    const response = await askChatGPT(query);
    return NextResponse.json({ response: response }, { status: 200 });
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json(
      { response: "Something went wrong, try again" },
      { status: 500 }
    );
  }
}

const openAI = new OpenAI({
  apiKey:
    process.env.CHATGPT_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function askChatGPT(query: string) {
  const completion = await openAI.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant" },
      { role: "user", content: query },
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0]?.message.content;
}
