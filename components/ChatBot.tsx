
import React, { useState, useRef, useEffect } from 'react';
import { startAIChat } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      if (!chatRef.current) {
        chatRef.current = startAIChat("You are OmniHub AI, a world-class multi-channel marketing strategist. Help the user with ad copy, budget allocation, and platform trends.");
      }

      const stream = await chatRef.current.sendMessageStream({ message: userMsg });
      let fullText = '';
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullText;
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="glass-panel w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-indigo-500/30">
          <div className="p-4 bg-indigo-600 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2 text-white">
              <i className="fa-solid fa-sparkles"></i> OmniHub AI
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-slate-200">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/50">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 mt-10">
                <i className="fa-solid fa-robot text-4xl mb-2 opacity-20"></i>
                <p className="text-sm">Ask me about your campaign performance or strategy!</p>
              </div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl text-slate-200 text-xs flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-slate-700/50 bg-slate-900">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-slate-800 border-none rounded-xl py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-indigo-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-400">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/40 flex items-center justify-center text-white text-xl hover:scale-110 transition-transform animate-pulse"
        >
          <i className="fa-solid fa-comment-dots"></i>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
