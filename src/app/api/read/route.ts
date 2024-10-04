import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import { queryLLM } from '../../utils/commonUtils';
import { indexName } from "../../utils/config";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { query } = body;
    const client = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY ?? 'c6c1970d-eb0f-4ef8-811b-67a9a3bd98e2',
    });

    const text = await queryLLM(client, indexName, query);
    return NextResponse.json({
        data: text 
    })
}