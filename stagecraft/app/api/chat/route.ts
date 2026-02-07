import OpenAI from "openai";
import {
  inventorySemanticSearch,
  checkProductAvailability,
  createCartBundle,
} from "@/lib/ai/tools";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "placeholder-key-for-build",
});

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "inventory_semantic_search",
      description:
        "Search for theatrical costumes, props, and equipment using semantic understanding. Use this when the user describes what they need for a role, character, production, or theatrical context. This tool understands context like historical periods (1920s, Victorian), character names (Hamlet, Ophelia), production styles (modern-dress, period-accurate), and theatrical requirements.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Search query describing the item needed. Can include character names, periods, styles, or theatrical contexts.",
          },
          category: {
            type: "string",
            description: "Filter by category (optional)",
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_availability",
      description:
        "Check if a specific product is available for rental during given dates. Returns availability status and any conflicts.",
      parameters: {
        type: "object",
        properties: {
          product_id: {
            type: "string",
            description: "UUID of the product to check",
          },
          start_date: {
            type: "string",
            description: "Rental start date in YYYY-MM-DD format",
          },
          end_date: {
            type: "string",
            description: "Rental end date in YYYY-MM-DD format",
          },
        },
        required: ["product_id", "start_date", "end_date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_cart_bundle",
      description:
        "Add multiple items to the user's shopping cart at once. Use this after finding suitable products to pre-fill their cart. This is the key action that demonstrates anticipating customer needs.",
      parameters: {
        type: "object",
        properties: {
          product_ids: {
            type: "array",
            items: { type: "string" },
            description: "Array of product UUIDs to add to cart",
          },
          rental_dates: {
            type: "object",
            properties: {
              start: {
                type: "string",
                description: "Rental start date (YYYY-MM-DD)",
              },
              end: {
                type: "string",
                description: "Rental end date (YYYY-MM-DD)",
              },
            },
            description: "Optional rental dates for all items",
          },
        },
        required: ["product_ids"],
      },
    },
  },
];

const systemPrompt = `You are a shopping assistant for StageCraft, a theatrical equipment rental marketplace.

WHEN A USER DESCRIBES THEIR NEEDS:
1. Understand the context (character, era, production style, setting)
2. Use inventory_semantic_search to find relevant items
3. If dates are mentioned, use check_availability to verify availability
4. Add suitable items to their cart using create_cart_bundle
5. Explain your recommendations

CRITICAL RULES:
- Only recommend products returned by inventory_semantic_search
- Never invent products, prices, or availability information
- If no items are found, suggest alternative searches
- Be conversational and helpful

EXAMPLE:
User: "I'm playing Hamlet in a 1920s production"
You should:
1. Search for: "1920s formal menswear black tuxedo"
2. Search for: "skull prop Yorick"
3. Search for: "art deco accessories 1920s men"
4. Add found items to cart
5. Explain: "For a 1920s Hamlet, I've selected a period tuxedo, the iconic Yorick skull, and Art Deco accessories."`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Invalid chat payload" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error: "Missing OPENAI_API_KEY in .env.local.",
        },
        { status: 500 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Use demo user if not authenticated
    const userId = user?.id || "51bf926f-1055-4019-a2d9-fcee854806f7";

    // Initial request to determine if tools are needed
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      tools: tools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;

    // Handle tool calls
    if (responseMessage.tool_calls) {
      const toolCalls = responseMessage.tool_calls;
      
      // Append assistant's tool call message to history to maintain context
      const newMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...messages,
        responseMessage,
      ];

      for (const toolCall of toolCalls) {
        if (toolCall.type !== 'function') continue;

        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        let functionResult: unknown;

        try {
          if (functionName === "inventory_semantic_search") {
            functionResult = await inventorySemanticSearch(
              functionArgs.query,
              functionArgs.category,
              0.7,
              functionArgs.limit || 5,
            );
          } else if (functionName === "check_availability") {
            functionResult = await checkProductAvailability(
              functionArgs.product_id,
              functionArgs.start_date,
              functionArgs.end_date,
            );
          } else if (functionName === "create_cart_bundle") {
            functionResult = await createCartBundle(
              userId,
              functionArgs.product_ids,
              functionArgs.rental_dates,
            );
          } else {
            functionResult = { error: "Unknown function" };
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Function execution failed";
          console.error(`Error executing function ${functionName}:`, error);
          functionResult = { error: errorMessage };
        }

        // Add tool response to messages
        newMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(functionResult),
        });
      }

      // Generate final response using tool outputs
      const finalResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: newMessages,
      });

      return Response.json({
        message: finalResponse.choices[0].message.content,
      });
    }

    return Response.json({
      message: responseMessage.content || "No response generated",
    });

  } catch (error: unknown) {
    console.error("Error in chat API:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Failed to process chat request: ${errorMessage}` },
      { status: 500 },
    );
  }
}