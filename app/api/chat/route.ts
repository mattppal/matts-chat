import { AI_CONFIG } from "@/app/config/ai-config";

export const runtime = "edge";

export async function POST(req: Request) {
    const { messages } = await req.json();

    const openRouterRequest = {
        model: AI_CONFIG.model,
        messages,
        stream: true,
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": process.env.YOUR_SITE_URL || "", // Optional
            "X-Title": process.env.YOUR_SITE_NAME || "", // Optional
            "Content-Type": "application/json"
        },
        body: JSON.stringify(openRouterRequest),
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
        async transform(chunk, controller) {
            const text = decoder.decode(chunk);
            const lines = text.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    if (line.includes('[DONE]')) {
                        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                        return;
                    }
                    try {
                        const data = JSON.parse(line.slice(6));
                        const content = data.choices[0]?.delta?.content || '';
                        if (content) {
                            const formattedData = {
                                id: data.id,
                                object: 'chat.completion.chunk',
                                created: data.created,
                                model: data.model,
                                choices: [
                                    {
                                        index: 0,
                                        delta: { content },
                                        finish_reason: null
                                    }
                                ]
                            };
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify(formattedData)}\n\n`));
                        }
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                }
            }
        },
    });

    const stream = response.body?.pipeThrough(transformStream);

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
