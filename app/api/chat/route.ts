import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, AnthropicStream, StreamingTextResponse } from "ai";
import { AI_CONFIG } from "@/config/ai-config";
import Anthropic from "@anthropic-ai/sdk";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (AI_CONFIG.provider === "openai") {
      const response = await openai.createChatCompletion({
        model: AI_CONFIG.model,
        stream: true,
        messages,
      });
      const stream = OpenAIStream(response);
      return new StreamingTextResponse(stream);
    } else if (AI_CONFIG.provider === "anthropic") {
      const systemMessage = messages.find(
        (msg: { role: string }) => msg.role === "system",
      );
      const userMessages = messages.filter(
        (msg: { role: string }) => msg.role !== "system",
      );

      const response = await anthropic.messages.create({
        model: AI_CONFIG.model,
        system: systemMessage?.content || undefined,
        messages: userMessages.map(
          (msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          }),
        ),
        max_tokens: 1000,
        stream: true,
      });

      const stream = AnthropicStream(response);
      return new StreamingTextResponse(stream);
    } else {
      throw new Error("Unsupported AI provider");
    }
  } catch (error: unknown) {
    console.error("Error in POST function:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
