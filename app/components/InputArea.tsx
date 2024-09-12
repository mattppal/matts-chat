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
        className="flex-grow bg-white border-gray-300 text-black placeholder-gray-400"
      />
      <Button type="submit" className="bg-black text-white hover:bg-gray-800">Send</Button>
    </form>
  );
}