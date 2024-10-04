import { OpenAIEmbeddings} from '@langchain/openai';
import { RecursiveCharacterTextSplitter} from 'langchain/text_splitter';
import { OpenAI } from '@langchain/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';
// import { timeout } from './config';

import questionnaireData from "@app/data/questionnaire-data.json";

export const fetchQuestions = () => {
  const chosenQuestions: string[] = [];

  questionnaireData.forEach((questionnaireDataObj) => {
    const categoryQuestionsArr = questionnaireDataObj.categoryQuestions;

    if (categoryQuestionsArr?.length) {
      const randomIndexForOne: number = Math.floor(
        Math.random() * categoryQuestionsArr?.length
      );

      chosenQuestions.push(categoryQuestionsArr[randomIndexForOne]);
    }
  });

  return chosenQuestions;
};

export const createPineconeIndex = async (pineconeClient: any, indexName: string, vectorDimension: number) => {
  console.log(`Creating "${indexName}"...`);

  // 1. Create the index
  await pineconeClient.createIndex({
    name: indexName,
    dimension: vectorDimension,
    metric: 'cosine',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1'
      }
    },
  });
  // 2. Wait for the index to become active
  // console.log('Waiting for the index to become active...');

  // await pineconeClient.waitForActiveIndex({
  //   indexName,
  //   maxTime: timeout,
  // });

  console.log('Index is active.');
}

export const updatePineconeIndex = async (client: any, indexName: string, documents: any) => {
  // 1. Retrieve the index's information
  const index = client.Index(indexName);
  console.log(`Retrieving information for index "${indexName}"...`);

  // 2. Process the documents
  for (const doc of documents) {
    // 3. Add the document to the index
    console.log(`Processing document: "${doc.metadata.source}"...`);
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;

    //4. Splitting the document into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });

    const chunks = await textSplitter.createDocuments([text]);

    // 5. Embed the chunks using the OpenAI Embeddings API
    console.log('Embedding the chunks...');
    const embeddingsArray = await new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY ?? 'sk-proj-eNDD89dvOAc6yWiAUBhOT3BlbkFJ748qsjNGMFvEmajBc8fZ',
      apiKey: process.env.OPENAI_API_KEY ?? 'sk-proj-eNDD89dvOAc6yWiAUBhOT3BlbkFJ748qsjNGMFvEmajBc8fZ',
    }).embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, ' '))
    );

    // 6. Add the embeddings to the index
    console.log('Adding the embeddings to the index...');
    const batchSize = 100;
    let batch: any = [];
    for (let i = 0; i < embeddingsArray.length; i++) {
      const chunk = chunks[i];
      const vector = {
        id: `${txtPath}_${i}`,
        values: embeddingsArray[i],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          txtPath: txtPath,
        },
      };
      batch = [...batch, vector];

      if (batch.length === batchSize || i === chunks.length - 1) {
        await index.upsert(batch);
        batch = [];
      }
    }
  }
}

export const queryLLM = async (client: any, indexName: string, llmPrompt: string) => {
  // 1. Retrieve Pinecone index
  const index = client.Index(indexName);
  console.log(`Retrieved "${index.indexName}"...`);

  // 2. Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY ?? 'sk-proj-eNDD89dvOAc6yWiAUBhOT3BlbkFJ748qsjNGMFvEmajBc8fZ',
    apiKey: process.env.OPENAI_API_KEY ?? 'sk-proj-eNDD89dvOAc6yWiAUBhOT3BlbkFJ748qsjNGMFvEmajBc8fZ',
  }).embedQuery(llmPrompt);

  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK: 10,
    includeMetadata: true,
    includeValues: true,
  });

  // 3. Log the number of matches
  console.log(`Found ${queryResponse.matches.length} matches.`);

  // 4. Log the prompt
  console.log('Prompt:', llmPrompt);

  if (queryResponse.matches.length) {
    const llm = new OpenAI();
    const chain = loadQAStuffChain(llm);

    //5. Extract and concat page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match: any) => match.metadata.pageContent)
      .join(" ");

    // 6. Query the LLM with relevant context and the user prompt
    const result = await chain.invoke({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: llmPrompt,
    });

    // 7. Return the result
    console.log(`Answer: ${result.text}`);
    return result.text;
  } else {
    return "Sorry, we were unable to find the answer to your question.";
  }
}
