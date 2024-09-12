'use client';

import { useChat } from 'ai/react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { AI_CONFIG } from '@/config/ai-config';
import { useState, useRef, useEffect } from 'react';

export function ChatInterface() {
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/chat',
        initialMessages: [
            { role: 'system', content: `👋 You are now chatting with ${AI_CONFIG.model}.` },
        ],
        onError: (error: Error) => {
            console.error(error);
            setError('An error occurred while fetching the response. Please try again.');
        },
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
            <CardContent className="p-6 flex flex-col h-[70vh]">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="flex-grow overflow-y-auto mb-4">
                    <MessageList messages={messages} />
                    <div ref={messagesEndRef} />
                </div>
                <InputArea
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                />
            </CardContent>
        </Card>
    );
}