"use server";

import Category from "@models/categoryModel";
import { Pinecone } from "@pinecone-database/pinecone";
import { connectToDB } from "@utils/database";

export async function getPineconeClient() {
  return new Pinecone({
    apiKey: process.env.PINECONE_KEY || "",
  });
}

export async function generateAndUpsertEmbedding(
  postId: string,
  title: string,
  description: string,
  categoryIds: string[]
) {
  if (!title && !description && categoryIds.length === 0) return;
  await connectToDB();

  const categoryDocs = await Category.find({ _id: { $in: categoryIds } });
  const categoryNames = categoryDocs.map((cat) => cat.name);

  const textToEmbed = `${title}. ${description}. Categories: ${categoryNames.join(
    ", "
  )}`;

  const pc = await getPineconeClient();
  const index = pc.Index("post");

  const result = await pc.inference.embed(
    "multilingual-e5-large",
    [textToEmbed],
    {
      input_type: "passage",
    }
  );

  const embedding = (result.data[0] as { values: number[] }).values;

  const vector = {
    id: postId,
    values: embedding,
    metadata: {
      title,
      description,
      postId,
      categories: categoryNames.join(", "),
    },
  };

  await index.upsert([vector]);
}

export const queryPosts = async (
  query: string
): Promise<string[]> => {
  if (!query.trim()) return [];

  const pc = await getPineconeClient();
  const index = pc.Index("post");

  const result = await pc.inference.embed("multilingual-e5-large", [query], {
    input_type: "query",
  });

  const embedding = (result.data[0] as { values: number[] }).values;

  const queryResponse = await index.query({
    vector: embedding,
    topK: 3,
    includeMetadata: false,
  });

  const postIds = queryResponse.matches?.map((match) => match.id) || [];

  return postIds;
};
