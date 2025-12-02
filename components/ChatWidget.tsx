import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { ChatMessage } from '../types';
import { ChatIcon, XIcon, SendIcon, SparklesIcon } from './Icons';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! Welcome to Simayne Trading. Need help sourcing a product, a quote for bulk supply, or custom branding ideas?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session once
    if (!chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a placeholder for the model response
      const modelMsgId = Date.now();
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: modelMsgId }]);

      const streamResult = await sendMessageStream(chatSessionRef.current, userMsg.text);

      let fullText = '';
      for await (const chunk of streamResult) {
         const chunkText = chunk.text;
         if (chunkText) {
             fullText += chunkText;
             setMessages(prev => 
                prev.map(msg => 
                    msg.timestamp === modelMsgId 
                    ? { ...msg, text: fullText } 
                    : msg
                )
             );
         }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'I encountered an error. Please try again.', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-blue-500"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
          </span>
          <ChatIcon className="h-7 w-7" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex h-[600px] w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl transition-all sm:w-[450px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-900 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <SparklesIcon className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Simayne AI</h3>
                <p className="text-xs text-blue-200">Sourcing & Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-blue-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-slate-800/50 p-4 scrollbar-thin scrollbar-thumb-slate-700">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-700 text-slate-100 rounded-bl-none'
                    }`}
                  >
                   {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                  <div className="flex justify-start">
                      <div className="flex items-center space-x-2 rounded-2xl bg-slate-700 px-4 py-3 text-sm text-slate-100 rounded-bl-none">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400"></div>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-700 bg-slate-900 p-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about products or branding..."
                className="w-full rounded-full border border-slate-700 bg-slate-800 py-3 pl-5 pr-12 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500"
              >
                <SendIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;