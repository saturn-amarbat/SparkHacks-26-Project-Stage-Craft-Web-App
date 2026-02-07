import ChatInterface from '@/components/chat/chat-interface';

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 h-[calc(100vh-4rem)]">
      <div className="h-full flex flex-col">
        <div className="py-4 border-b">
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Describe your role. We&apos;ll handle the rest.
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
