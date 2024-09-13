'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { AI_CONFIG } from '@/app/config/ai-config';
import { v4 as uuidv4 } from 'uuid';

interface Message {
    id: string;
    role: string;
    content: string;
    isError?: boolean;
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { id: uuidv4(), role: 'system', content: `👋 You are now chatting with ${AI_CONFIG.model}.` },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: uuidv4(), role: 'user', content: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let aiMessageId = uuidv4();
            let aiMessageContent = '';

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            break;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content || '';
                            aiMessageContent += content;
                            setMessages(prevMessages => {
                                const lastMessage = prevMessages[prevMessages.length - 1];
                                if (lastMessage.id === aiMessageId) {
                                    return [
                                        ...prevMessages.slice(0, -1),
                                        { ...lastMessage, content: aiMessageContent },
                                    ];
                                } else {
                                    return [
                                        ...prevMessages,
                                        { id: aiMessageId, role: 'assistant', content: aiMessageContent },
                                    ];
                                }
                            });
                        } catch (error) {
                            console.error('Error parsing SSE data:', error);
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    id: uuidv4(),
                    role: 'system',
                    content: 'An error occurred while fetching the response. Please try again.',
                    isError: true
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-white border-gray-200 shadow-xl">
            <CardContent className="p-6 flex flex-col h-[70vh]">
                <div className="flex-grow overflow-y-auto mb-4">
                    <MessageList messages={messages} />
                    <div ref={messagesEndRef} />
                </div>
                <InputArea
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </CardContent>
        </Card>
    );
}