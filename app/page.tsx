import { ChatInterface } from '@/components/ChatInterface';
import { AI_CONFIG } from '@/config/ai-config';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
      <main className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {AI_CONFIG.name}
        </h1>
        <ChatInterface />
      </main>
    </div>
  );
}
