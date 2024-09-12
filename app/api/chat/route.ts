import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { AI_CONFIG } from '@/config/ai-config';
import Anthropic from '@anthropic-ai/sdk';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
    const { messages } = await req.json();

    if (AI_CONFIG.provider === 'openai') {
        const response = await openai.createChatCompletion({
            model: AI_CONFIG.model,
            stream: true,
            messages,
        });
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    } else if (AI_CONFIG.provider === 'anthropic') {
        const systemMessage = messages.find((msg: { role: string }) => msg.role === 'system');
        const userMessages = messages.filter((msg: { role: string }) => msg.role !== 'system');

        const response = await anthropic.messages.create({
            model: AI_CONFIG.model,
            system: systemMessage?.content,
            messages: userMessages.map((msg: { role: string; content: string }) => ({
                role: msg.role === 'user' ? 'human' : 'assistant',
                content: msg.content,
            })),
            max_tokens: 1000,
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    controller.enqueue(chunk.content);
                }
                controller.close();
            },
        });

        return new StreamingTextResponse(stream);
    } else {
        throw new Error('Unsupported AI provider');
    }
}