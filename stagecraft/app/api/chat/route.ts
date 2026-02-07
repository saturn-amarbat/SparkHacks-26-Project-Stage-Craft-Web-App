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
4. Present the found items to the user and explain your recommendations
5. Only use create_cart_bundle when the user explicitly asks to add items to their cart

CRITICAL RULES:
- Only recommend products returned by inventory_semantic_search
- Never invent products, prices, or availability information
- If no items are found, suggest alternative searches
- Be conversational and helpful
- Do NOT automatically add items to cart. Show recommendations first and let the user decide.
- When presenting items, describe each one briefly so the user can decide.
- When the user asks to add items to cart, use create_cart_bundle with the product IDs from your most recent search results.
- When the user asks for NEW items (e.g., "find me a fog machine"), ALWAYS run a new inventory_semantic_search first, then present results. Do not reuse old search results for new queries.

EXAMPLE:
User: "I'm playing Hamlet in a 1920s production"
You should:
1. Search for: "1920s formal menswear black tuxedo"
2. Search for: "skull prop Yorick"
3. Search for: "art deco accessories 1920s men"
4. Explain: "For a 1920s Hamlet, I found these items for you: [describe each]. Would you like to add any of these to your cart?"`;

export async function POST(req: Request) {
  try {
    const { messages, recentProductIds } = await req.json();

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

    if (!user?.id) {
      return Response.json(
        {
          error: "User not authenticated. Please sign in to add items to cart.",
        },
        { status: 401 },
      );
    }

    const cartUser = {
      id: user.id,
      email: user.email || null,
      full_name: (user.user_metadata?.full_name as string | undefined) || null,
      avatar_url:
        (user.user_metadata?.avatar_url as string | undefined) || null,
    };

    const isUuid = (value: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value,
      );

    const recentSearchProducts: Array<Record<string, unknown>> = [];

    // Pre-seed with product IDs from frontend (from previous search results)
    if (Array.isArray(recentProductIds)) {
      for (const id of recentProductIds) {
        if (typeof id === "string" && isUuid(id)) {
          recentSearchProducts.push({ id });
        }
      }
    }

    // All add-to-cart and search requests are handled by the AI via tools.
    // recentSearchProducts is pre-seeded from recentProductIds so the AI's
    // create_cart_bundle calls can resolve previously shown products.

    // Initial request to determine if tools are needed
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      tools: tools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;

    // Handle tool calls
    if (responseMessage.tool_calls) {
      const toolCalls = responseMessage.tool_calls;

      // Append assistant's tool call message to history to maintain context
      const newMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
        [
          { role: "system", content: systemPrompt },
          ...messages,
          responseMessage,
        ];

      for (const toolCall of toolCalls) {
        if (toolCall.type !== "function") continue;

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

            if (functionResult && typeof functionResult === "object") {
              const products = (
                functionResult as {
                  products?: Array<{ id?: string; name?: string }>;
                }
              ).products;

              if (Array.isArray(products)) {
                for (const product of products) {
                  if (product?.id && isUuid(product.id)) {
                    recentSearchProducts.push(product as Record<string, unknown>);
                  }
                }
              }
            }
          } else if (functionName === "check_availability") {
            functionResult = await checkProductAvailability(
              functionArgs.product_id,
              functionArgs.start_date,
              functionArgs.end_date,
            );
          } else if (functionName === "create_cart_bundle") {
            const requestedIds = Array.isArray(functionArgs.product_ids)
              ? functionArgs.product_ids
              : [];
            const validRequestedIds = requestedIds.filter(
              (id: unknown): id is string =>
                typeof id === "string" && isUuid(id),
            );
            const knownIds = new Set(
              recentSearchProducts.map((product) => product.id as string),
            );
            const filteredRequestedIds = validRequestedIds.filter((id: string) =>
              knownIds.has(id),
            );
            const finalProductIds =
              filteredRequestedIds.length > 0
                ? filteredRequestedIds
                : Array.from(knownIds);

            if (finalProductIds.length === 0) {
              functionResult = {
                success: false,
                error:
                  "No recent search results available to add. Please search again.",
                itemsAdded: 0,
              };
            } else {
              functionResult = await createCartBundle(
                cartUser,
                finalProductIds,
                functionArgs.rental_dates,
              );

              if (functionResult && typeof functionResult === "object") {
                functionResult = {
                  ...(functionResult as Record<string, unknown>),
                  resolved_product_ids: finalProductIds,
                  used_fallback: filteredRequestedIds.length === 0,
                };
              }
            }
          } else {
            functionResult = { error: "Unknown function" };
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Function execution failed";
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
        products: recentSearchProducts.length > 0 ? recentSearchProducts : undefined,
      });
    }

    return Response.json({
      message: responseMessage.content || "No response generated",
    });
  } catch (error: unknown) {
    console.error("Error in chat API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Failed to process chat request: ${errorMessage}` },
      { status: 500 },
    );
  }
}
