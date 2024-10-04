import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import { queryLLM } from '../../utils/commonUtils';
import { indexName } from "../../utils/config";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const prompt = "Don't tell that you are referring to a document for these answers. Also, don't ask the user to refer to other documents. Also, remember the context of questions.";
        let { query } = body;

        // Append the prompt to the query
        query = `${query} ${prompt}`;

        const client = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY ?? 'c6c1970d-eb0f-4ef8-811b-67a9a3bd98e2',
        });

        const response = await queryLLM(client, indexName, query);
        return NextResponse.json({ response: response }, { status: 200 });
    } catch (e) {
        console.error("Error:", e);
        return NextResponse.json(
            { response: "Something went wrong, try again" },
            { status: 500 }
        );
    }
}
