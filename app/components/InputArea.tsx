import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InputAreaProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function InputArea({ input, handleInputChange, handleSubmit }: InputAreaProps) {
  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message..."
        className="flex-grow bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      />
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Send</Button>
    </form>
  );
}