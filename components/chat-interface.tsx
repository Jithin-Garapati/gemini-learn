'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Send, Plus, Sparkles, Mic, FileText, ChevronDown, Moon, Sun, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GuidedLearning } from '@/components/guided-learning';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ChatInterface() {
  const { messages, sendMessage } = useChat({
  id: 'main-chat',
  transport: new DefaultChatTransport({
    api: '/api/chat',
    prepareSendMessagesRequest({ messages, id }) {
      return {
        body: {
          messages: messages,
        }
      };
    },
  }),
  onError: (error) => {
    console.error('Chat error:', error);
  }
});

// Track loading state manually
const [isLoading, setIsLoading] = useState(false);

// Debug logging
console.log('sendMessage:', sendMessage);
console.log('Current messages:', messages);
console.log('Loading state:', isLoading);

// Input state management
const [input, setInput] = useState('');
const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  console.log('Input changed:', e.target.value);
  setInput(e.target.value);
};

  const [showThinking, setShowThinking] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form submit handler
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    console.log('Submitting message:', input);
    console.log('Messages before send:', messages);
    
    setIsLoading(true);
    try {
      // Use the AI SDK's sendMessage
      await sendMessage({ text: input });
      console.log('Message sent successfully');
      setInput(''); // Clear input after sending
      console.log('Input cleared');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Monitor messages changes
  useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '0px'; // Set to 0 to get accurate scrollHeight
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.max(48, Math.min(scrollHeight, 200));
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  // Initial height setup
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }
  }, []);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        onFormSubmit(e as any);
      }
    }
  };

  return (
    <GuidedLearning>
      <div className="flex h-screen flex-col bg-background overflow-hidden">

      {/* Chat Messages */}
      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full px-4 overflow-y-auto">
        {/* Theme Toggle - Floating */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {!mounted ? (
              <Sun className="h-5 w-5" />
            ) : theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="mx-auto max-w-3xl py-8">
          {messages.length === 0 ? (
            <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
              <div className="text-center w-full max-w-3xl px-4">
                <h2 className="mb-8 text-4xl font-normal text-blue-600 dark:text-blue-500">
                  Hello, Jithin
                </h2>
                
                {/* Centered Input Area */}
                <div className="mx-auto max-w-3xl">
                  <form onSubmit={onFormSubmit} className="relative">
                    <div className="flex flex-col gap-3 rounded-3xl border bg-background px-4 py-4 shadow-sm hover:shadow-md transition-shadow focus-within:shadow-md">
                      <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Gemini"
                        className="w-full !border-0 !bg-transparent !px-0 !py-0 !shadow-none text-base resize-none focus-visible:!ring-0 focus-visible:!ring-offset-0 !rounded-none overflow-hidden leading-7 placeholder:text-muted-foreground !min-h-[48px] !max-h-[200px]"
                        rows={1}
                        style={{ height: '48px' }}
                      />
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:bg-transparent">
                            <Plus className="h-5 w-5 text-muted-foreground" />
                          </Button>
                          <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 px-2 shrink-0 hover:bg-transparent">
                            <Settings2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Tools</span>
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 hover:bg-transparent">
                                <span className="text-sm text-muted-foreground">2.5 Flash</span>
                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Gemini 2.5 Pro</DropdownMenuItem>
                              <DropdownMenuItem>Gemini 2.0 Flash</DropdownMenuItem>
                              <DropdownMenuItem>Gemini 1.5 Pro</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-transparent"
                            onClick={(e) => {
                              if (input.trim()) {
                                onFormSubmit(e as any);
                              }
                            }}
                          >
                            {input.trim() ? (
                              <Send className="h-5 w-5 text-blue-500" />
                            ) : (
                              <Mic className="h-5 w-5 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                  
                  {/* Suggestion Chips */}
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <Button variant="secondary" size="sm" className="rounded-full h-9 px-4">
                      ✍️ Create Image
                    </Button>
                    <Button variant="secondary" size="sm" className="rounded-full h-9 px-4">
                      Write
                    </Button>
                    <Button variant="secondary" size="sm" className="rounded-full h-9 px-4">
                      Build
                    </Button>
                    <Button variant="secondary" size="sm" className="rounded-full h-9 px-4">
                      Deep Research
                    </Button>
                    <Button variant="secondary" size="sm" className="rounded-full h-9 px-4">
                      Create Video
                    </Button>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <Button variant="secondary" size="sm" className="rounded-full h-9 px-4">
                      Learn
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={message.id} className="space-y-4">
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="rounded-2xl bg-muted px-4 py-3 max-w-[80%]">
                        <div className="text-sm text-foreground">
                          {message.parts.map((part, i) => {
                            if (part.type === "text") {
                              return (
                                <MarkdownRenderer 
                                  key={i} 
                                  content={part.text}
                                  className="!p-0 !bg-transparent !text-sm"
                                />
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Show thinking dropdown */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto gap-1 px-0 py-0 text-sm font-normal hover:bg-transparent"
                          onClick={() => setShowThinking(!showThinking)}
                        >
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          <span className="text-muted-foreground">Show thinking</span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                      
                      {/* AI Response */}
                      <div className="text-sm leading-7 text-foreground">
                        {message.parts.map((part, i) => {
                          if (part.type === "text") {
                            return (
                              <MarkdownRenderer 
                                key={i}
                                content={part.text}
                                className="!text-sm !leading-7"
                              />
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Fade effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10"></div>
      </div>

      {/* Input Area - Only show when there are messages */}
      {messages.length > 0 && (
        <div className="bg-background flex-shrink-0 relative z-20">
          {/* Subtle hint for guided learning - shows after first AI response */}
          {messages.some(m => m.role === 'assistant') && (
            <div className="mx-auto max-w-3xl px-4 pt-3 pb-1 animate-in fade-in duration-1000">
              <p className="text-xs text-center text-muted-foreground">
                 Tip: Highlight any text and press <kbd className="px-1.5 py-0.5 text-[10px] bg-muted rounded border border-border">Ctrl+Shift+E</kbd> to learn more
              </p>
            </div>
          )}
          <div className="mx-auto max-w-3xl px-4 py-4">
            <form onSubmit={onFormSubmit} className="relative">
              <div className="flex flex-col gap-3 rounded-3xl border bg-background px-4 py-4 shadow-sm hover:shadow-md transition-shadow focus-within:shadow-md">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Gemini"
                  className="w-full !border-0 !bg-transparent !px-0 !py-0 !shadow-none text-base resize-none focus-visible:!ring-0 focus-visible:!ring-offset-0 !rounded-none overflow-hidden leading-7 placeholder:text-muted-foreground !min-h-[48px] !max-h-[200px]"
                  rows={1}
                  style={{ height: '48px' }}
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:bg-transparent">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 px-2 shrink-0 hover:bg-transparent">
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Tools</span>
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 hover:bg-transparent">
                          <span className="text-sm text-muted-foreground">2.5 Flash</span>
                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Gemini 2.5 Pro</DropdownMenuItem>
                        <DropdownMenuItem>Gemini 2.0 Flash</DropdownMenuItem>
                        <DropdownMenuItem>Gemini 1.5 Pro</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-transparent"
                      onClick={(e) => {
                        if (input.trim()) {
                          onFormSubmit(e as any);
                        }
                      }}
                    >
                      {input.trim() ? (
                        <Send className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Mic className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
            
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Gemini can make mistakes, so double-check it
            </p>
          </div>
        </div>
      )}
    </div>
    </GuidedLearning>
  );
}
