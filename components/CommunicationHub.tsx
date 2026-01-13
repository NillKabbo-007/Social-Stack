
import React, { useState } from 'react';

const CommunicationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'calls' | 'contacts'>('inbox');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [msgInput, setMsgInput] = useState('');

  const chats = [
    { id: 1, name: 'Alice Marketing', lastMsg: 'Budget approved for Q4', time: '10:42 AM', type: 'whatsapp', unread: 2 },
    { id: 2, name: 'John TikTok Agent', lastMsg: 'Video is trending now!', time: 'Yesterday', type: 'messenger', unread: 0 },
    { id: 3, name: 'Support Bot', lastMsg: 'Ticket #492 resolved.', time: 'Mon', type: 'bot', unread: 0 },
  ];

  const messages = [
    { id: 1, sender: 'Alice Marketing', text: 'Hey, have you seen the latest ROAS numbers?', time: '10:30 AM', own: false },
    { id: 2, sender: 'Me', text: 'Yes! They look fantastic. +30% DoD.', time: '10:32 AM', own: true },
    { id: 3, sender: 'Alice Marketing', text: 'Great. Budget approved for Q4 scaling.', time: '10:42 AM', own: false },
  ];

  const handleCall = () => {
    setIsCalling(true);
    setTimeout(() => setIsCalling(false), 3000); // Simulate call connecting
  };

  const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if(!msgInput.trim()) return;
      setMsgInput('');
      // In a real app, this would append to messages state
  };

  return (
    <div className="h-[calc(100vh-140px)] animate-in fade-in duration-500 flex flex-col md:flex-row gap-6">
      {/* Sidebar List */}
      <div className="w-full md:w-80 glass-panel rounded-3xl border-slate-700/50 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
           <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Comms Hub</h2>
           <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
              {['inbox', 'calls', 'contacts'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setActiveTab(t as any)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                  >
                      {t}
                  </button>
              ))}
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {chats.map(chat => (
                <div 
                    key={chat.id} 
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 border ${selectedChat === chat.id ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-transparent border-transparent hover:bg-slate-800/50'}`}
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                            {chat.name[0]}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0f172a] flex items-center justify-center text-[8px] text-white ${chat.type === 'whatsapp' ? 'bg-[#25D366]' : chat.type === 'messenger' ? 'bg-[#00B2FF]' : 'bg-indigo-500'}`}>
                            <i className={`fa-brands ${chat.type === 'whatsapp' ? 'fa-whatsapp' : chat.type === 'messenger' ? 'fa-facebook-messenger' : 'fa-robot'}`}></i>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                            <h4 className={`text-xs font-bold truncate ${selectedChat === chat.id ? 'text-indigo-400' : 'text-slate-200'}`}>{chat.name}</h4>
                            <span className="text-[9px] text-slate-500">{chat.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{chat.lastMsg}</p>
                    </div>
                    {chat.unread > 0 && (
                        <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-[9px] font-bold text-white shadow-lg shadow-rose-500/30">
                            {chat.unread}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass-panel rounded-3xl border-slate-700/50 flex flex-col overflow-hidden relative">
         {selectedChat ? (
             <>
                <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold">AM</div>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Alice Marketing</h3>
                            <p className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleCall} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-all flex items-center justify-center"><i className="fa-solid fa-phone"></i></button>
                        <button onClick={handleCall} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition-all flex items-center justify-center"><i className="fa-solid fa-video"></i></button>
                        <button className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-all flex items-center justify-center"><i className="fa-solid fa-ellipsis-vertical"></i></button>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900/20">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.own ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${msg.own ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-300 rounded-bl-none'}`}>
                                <p>{msg.text}</p>
                                <p className={`text-[9px] mt-2 text-right ${msg.own ? 'text-indigo-200' : 'text-slate-500'}`}>{msg.time}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSend} className="p-4 bg-slate-900/50 border-t border-slate-700/50 flex gap-3">
                    <button type="button" className="text-slate-400 hover:text-white transition-colors p-2"><i className="fa-solid fa-paperclip"></i></button>
                    <input 
                        type="text" 
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        placeholder="Type a message..." 
                        className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-indigo-500 text-white"
                    />
                    <button type="submit" className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white flex items-center justify-center shadow-lg transition-all"><i className="fa-solid fa-paper-plane"></i></button>
                </form>

                {/* Call Overlay */}
                {isCalling && (
                    <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in duration-300">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl text-white">AM</div>
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/50 animate-ping"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-white">Alice Marketing</h3>
                            <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm animate-pulse">Calling...</p>
                        </div>
                        <div className="flex gap-6">
                            <button onClick={() => setIsCalling(false)} className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-2xl flex items-center justify-center shadow-2xl transition-transform hover:scale-110"><i className="fa-solid fa-phone-slash"></i></button>
                            <button className="w-16 h-16 rounded-full bg-slate-700 hover:bg-slate-600 text-white text-xl flex items-center justify-center transition-transform hover:scale-110"><i className="fa-solid fa-microphone-slash"></i></button>
                        </div>
                    </div>
                )}
             </>
         ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-500">
                 <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                    <i className="fa-solid fa-comments text-4xl opacity-50"></i>
                 </div>
                 <p className="text-sm font-bold uppercase tracking-widest">Select a conversation</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default CommunicationHub;
