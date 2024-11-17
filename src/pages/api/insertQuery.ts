// pages/api/insertQuery.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { query } = req.body;

    try {
      await prisma.queries.create({
        data: {
          query,
        },
      });
      res.status(200).json({ message: "Query saved successfully" });
    } catch (error) {
      console.error("Error inserting query into database:", error);
      res.status(500).json({ error: "Failed to save query" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
