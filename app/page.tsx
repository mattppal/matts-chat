import { ChatInterface } from '@/components/ChatInterface';
import { AI_CONFIG } from '@/config/ai-config';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center text-black">
            {AI_CONFIG.name}
          </h1>
          <ChatInterface />
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-600">
        made with ❤️ by <Link href="https://x.com/mattppal" className="underline hover:text-black">matt</Link> & deployed on <Link href="https://replit.com?utm_source=matt&utm_medium=app&utm_campaign=chat-with-o1" className="underline hover:text-black">replit</Link> 👾
      </footer>
    </div>
  );
}
