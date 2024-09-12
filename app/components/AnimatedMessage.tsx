import { motion } from 'framer-motion';

interface MessageProps {
  message: {
    role: string;
    content: string;
  };
}

export function AnimatedMessage({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg ${
        isUser ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
      } max-w-[80%] shadow-md`}
    >
      <p className="text-sm">{message.content}</p>
    </motion.div>
  );
}