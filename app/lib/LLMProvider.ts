import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';

class LLMProviderClass {
    private static instance: LLMProviderClass;

    private constructor() {}

    public static getInstance(): LLMProviderClass {
        if (!LLMProviderClass.instance) {
            LLMProviderClass.instance = new LLMProviderClass();
        }
        return LLMProviderClass.instance;
    }

    public async getResponse(messages: Array<{ role: string; content: string }>) {
        const result = await streamText({
            model: openai('gpt-4-turbo'),
            messages: convertToCoreMessages(messages),
        });

        return result.toDataStreamResponse();
    }
}

export const LLMProvider = LLMProviderClass.getInstance();