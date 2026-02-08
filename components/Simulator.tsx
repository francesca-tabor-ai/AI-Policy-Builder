
import React, { useState, useRef, useEffect } from 'react';
import { Policy, ChatMessage } from '../types';
import { geminiService } from '../services/gemini';
// Added Plus to the imports from lucide-react
import { Send, User, Bot, RefreshCw, CheckCircle2, ShieldAlert, Zap, Terminal, Sparkles, Loader2, Plus } from 'lucide-react';

interface Props {
  policy: Policy;
}

const Simulator: React.FC<Props> = ({ policy }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const prompts = await geminiService.generateTestPrompts(policy);
        setSuggestions(prompts);
      } catch (err) {
        console.error("Failed to get suggestions", err);
      } finally {
        setLoadingSuggestions(false);
      }
    };
    fetchSuggestions();
    resetChat();
  }, [policy.id]);

  const handleSend = async (customInput?: string) => {
    const messageContent = customInput || input;
    if (!messageContent.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: messageContent,
      timestamp: Date.now()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const botResponse = await geminiService.simulateChat(policy, newHistory);
      const botMsg: ChatMessage = {
        role: 'assistant',
        content: botResponse,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => setMessages([]);

  return (
    <div className="h-full flex flex-col bg-white rounded-[40px] shadow-2xl border border-brand-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-10 py-6 border-b border-brand-border flex items-center justify-between bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
            <Terminal className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-extrabold text-brand-black leading-tight">
              Logic Simulation
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               <span className="text-[10px] text-brand-grey font-bold uppercase tracking-widest">Live Integration Node</span>
            </div>
          </div>
        </div>
        <button 
          onClick={resetChat}
          className="p-2.5 text-brand-grey hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
          title="Flush Buffer"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8 bg-[#FAFAFA]/30" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-8 max-w-lg mx-auto text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-zinc-100 rounded-[32px] flex items-center justify-center mx-auto shadow-sm">
                <Zap className="w-8 h-8 text-zinc-400 fill-current" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-brand-black tracking-tight">Policy initialized</p>
                <p className="text-xs text-brand-grey font-medium leading-relaxed">System is strictly enforcing the rules for <span className="text-indigo-600">"{policy.name}"</span>. Choose a suggestion or start your own probe.</p>
              </div>
            </div>

            <div className="w-full space-y-4 pt-4">
               <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">
                 {loadingSuggestions ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                 Suggested Probes
               </div>
               <div className="flex flex-col gap-2">
                 {loadingSuggestions ? (
                   [1,2,3].map(i => <div key={i} className="h-10 bg-zinc-50 rounded-2xl animate-pulse" />)
                 ) : (
                   suggestions.map((s, i) => (
                     <button 
                       key={i} 
                       onClick={() => handleSend(s)}
                       className="px-6 py-3 bg-white border border-brand-border rounded-2xl text-xs font-semibold text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all text-left shadow-sm flex items-center justify-between group"
                     >
                       <span>{s}</span>
                       <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </button>
                   ))
                 )}
               </div>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              m.role === 'assistant' 
                ? 'bg-white border-brand-border text-indigo-600 shadow-sm' 
                : 'bg-brand-black border-transparent text-white shadow-lg shadow-zinc-900/10'
            }`}>
              {m.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div className={`flex flex-col gap-1.5 ${m.role === 'assistant' ? 'max-w-[80%]' : 'max-w-[70%]'}`}>
              <div className={`px-6 py-4 rounded-[28px] text-[15px] font-medium leading-relaxed shadow-sm ${
                m.role === 'assistant' 
                  ? 'bg-white text-zinc-700 border border-zinc-100 rounded-tl-none' 
                  : 'bg-indigo-600 text-white rounded-tr-none'
              }`}>
                {m.content}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400 ${m.role === 'assistant' ? 'ml-1' : 'mr-1 text-right'}`}>
                {m.role === 'assistant' ? 'Policy Engine v3.1' : 'User Input Vector'} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white border border-brand-border text-indigo-400 flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-zinc-100 px-6 py-4 rounded-[28px] rounded-tl-none space-x-1.5 flex shadow-sm items-center">
              <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-brand-border bg-white backdrop-blur-md sticky bottom-0">
        {messages.length > 0 && (
          <div className="max-w-4xl mx-auto flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold text-zinc-500 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3" /> {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-3 relative max-w-4xl mx-auto">
          <input 
            className="flex-1 bg-zinc-50 border border-brand-border rounded-[24px] px-8 py-5 text-[15px] font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 outline-none pr-16 shadow-inner transition-all placeholder:text-zinc-400"
            placeholder="Inject test phrase..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="absolute right-3 top-3 p-3 bg-brand-black text-white rounded-2xl hover:bg-zinc-800 disabled:opacity-40 transition-all shadow-xl active:scale-90"
          >
            <Send className="w-5 h-5 fill-current" />
          </button>
        </div>
        <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-brand-grey uppercase tracking-[0.2em] max-w-4xl mx-auto border-t border-zinc-100 pt-6">
          <div className="flex gap-8">
             <span className="flex items-center gap-2 group cursor-help"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" /> Semantic Match</span>
             <span className="flex items-center gap-2 group cursor-help"><ShieldAlert className="w-3.5 h-3.5 text-indigo-500 group-hover:rotate-12 transition-transform" /> Guardrail Active</span>
          </div>
          <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-500 fill-current" /> Gemini 3 Flash / 0.1t</span>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
