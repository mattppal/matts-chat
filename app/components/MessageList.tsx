import { AnimatedMessage } from './AnimatedMessage';

interface Message {
  role: string;
  content: string;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <AnimatedMessage key={index} message={message} />
      ))}
    </div>
  );
}