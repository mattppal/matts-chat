import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';

interface InputAreaProps {
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

export function InputArea({ input, handleInputChange, handleSubmit, isLoading }: InputAreaProps) {
    return (
        <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-grow bg-white border-gray-300 text-black placeholder-gray-400"
                disabled={isLoading}
            />
            <Button type="submit" className="bg-black text-white hover:bg-gray-800" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send'}
            </Button>
        </form>
    );
}