import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  createPineconeIndex,
  updatePineconeIndex,
} from "../../utils/commonUtils";
import { indexName } from "../../utils/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function POST() {
  const client = new Pinecone({
    apiKey:
      process.env.PINECONE_API_KEY ?? "c6c1970d-eb0f-4ef8-811b-67a9a3bd98e2",
  });

  const existingIndexes = await client.listIndexes();

  const loader = new DirectoryLoader("./documents", {
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
  });

  const docs = await loader.load();
  const vectorDimensions = 1536;

  try {
    // Check if the index already exists
    if (
      Array.isArray(existingIndexes.indexes) &&
      !existingIndexes.indexes.some(
        (existingIndexes) => existingIndexes.name === indexName
      )
    ) {
      console.log(`Creating "${indexName}"...`);
      await createPineconeIndex(client, indexName, vectorDimensions);
    } else {
      console.log(`Index ${indexName} already exists.`);
    }
    await updatePineconeIndex(client, indexName, docs);
  } catch (err) {
    console.error(err);
  }

  return NextResponse.json({
    data: "Successfully created index and loaded documents into Pinecone...",
  });
}
