import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

/**
 * Generate embeddings for a single text using OpenAI's text-embedding-3-small model
 * Returns a 1536-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Generate embeddings for multiple texts in batch
 * OpenAI supports up to 100 texts per request
 * Returns an array of 1536-dimensional vectors
 */
export async function generateEmbeddingsBatch(
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  if (texts.length > 100) {
    throw new Error('Batch size cannot exceed 100 texts');
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
      encoding_format: 'float',
    });

    return response.data.map((item) => item.embedding);
  } catch (error) {
    console.error('Error generating embeddings batch:', error);
    throw new Error('Failed to generate embeddings batch');
  }
}

/**
 * Generate embeddings for product data
 * Combines name, description, category, and tags into a single text for embedding
 */
export function createProductEmbeddingText(product: {
  name: string;
  description: string;
  category: string;
  tags: string[];
}): string {
  return `${product.name} | ${product.category} | ${product.description} | ${product.tags.join(', ')}`;
}
