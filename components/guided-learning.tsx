'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ChevronRight, X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { useAnimatedText } from '@/hooks/use-animated-text';

interface SubChatProps {
  highlightedText: string;
  context: string;
  onClose: () => void;
}

function SubChat({ highlightedText, context, onClose }: SubChatProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const [chatId] = useState(() => `subchat-${Date.now()}`);
  
  const chat = useChat({
    id: chatId,
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  
  const { messages, sendMessage, isLoading } = chat;

  // Auto-send initial explanation request
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    if (!hasInitialized && sendMessage) {
      const timer = setTimeout(() => {
        const truncatedText = highlightedText.length > 100 
          ? highlightedText.substring(0, 100) + '...' 
          : highlightedText;
        
        sendMessage({ 
          text: `Explain "${truncatedText}" in 2-3 sentences. Keep it concise and simple.` 
        });
        setHasInitialized(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [hasInitialized, sendMessage, highlightedText]);

  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 w-[380px] max-w-[90vw] h-[580px] max-h-[85vh] bg-background/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-xl flex flex-col z-50 overflow-hidden ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease'
      }}
    >
      <div 
        className="flex items-center justify-between px-5 py-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="min-w-0 flex-1 pr-3">
          <p className="text-sm font-medium truncate text-foreground" title={highlightedText}>
            {highlightedText.length > 45 ? highlightedText.substring(0, 45) + '...' : highlightedText}
          </p>
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 flex-shrink-0 hover:bg-muted/50 rounded-full transition-colors" onClick={onClose}>
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        )}
        <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-muted/50 text-foreground'
            }`}>
              {message.parts && message.parts.length > 0 ? (
                message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <MarkdownRenderer 
                        key={i}
                        content={part.text}
                        className={`!p-0 !text-xs !leading-relaxed ${
                          message.role === 'user' 
                            ? '!text-white !prose-invert' 
                            : '!bg-transparent'
                        }`}
                      />
                    );
                  }
                  return null;
                })
              ) : (
                <div className="text-xs">
                  {JSON.stringify(message)}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted/50 text-foreground px-3 py-2 rounded-2xl">
              <div className="flex gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="px-5 py-4">
        <div className="flex gap-2 items-center rounded-full border border-border/50 bg-muted/30 px-4 py-2.5 focus-within:border-border transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask more..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/60"
          />
          {input.trim() && (
            <Button 
              type="submit" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full bg-foreground hover:bg-foreground/90 text-background transition-all" 
              disabled={isLoading}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

interface GuidedLearningProps {
  children: React.ReactNode;
}

export function GuidedLearning({ children }: GuidedLearningProps) {
  const [subChat, setSubChat] = useState<{ text: string; context: string } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        
        // If subchat is open, close it
        if (subChat) {
          setSubChat(null);
          return;
        }
        
        // Otherwise, open subchat with selected text
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim();
        
        if (selection && selectedText && selectedText.length > 0) {
          // Get surrounding context (paragraph or nearby text)
          const range = selection.getRangeAt(0);
          const contextElement = range.commonAncestorContainer.parentElement;
          const context = contextElement?.textContent?.slice(0, 200) || '';
          
          setSubChat({ text: selectedText, context });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [subChat]);

  return (
    <div ref={contentRef} className="relative">
      {children}
      {subChat && (
        <SubChat
          highlightedText={subChat.text}
          context={subChat.context}
          onClose={() => setSubChat(null)}
        />
      )}
    </div>
  );
}
