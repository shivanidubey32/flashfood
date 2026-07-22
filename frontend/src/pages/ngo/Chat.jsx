import { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Search, User } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem('ngo_chat')) || [
      { id: 1, text: 'Hi, we have 50 extra meals ready for pickup.', sender: 'Grand Hotel', time: '10:00 AM', isMe: false },
      { id: 2, text: 'Great! I will assign a volunteer right away.', sender: 'Me', time: '10:05 AM', isMe: true }
    ];
  });
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('ngo_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: 'Me', time: timeString, isMe: true }]);
    setNewMessage('');
    
    // Simulate auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: 'Thanks! We will keep the food warm.', 
        sender: 'Grand Hotel', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        isMe: false 
      }]);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-slate-100 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search chats..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 bg-slate-50 border-l-4 border-blue-500 cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900">Grand Hotel Banquet</h3>
              <span className="text-xs text-slate-500">10:05 AM</span>
            </div>
            <p className="text-sm text-slate-600 truncate">Thanks! We will keep the food warm.</p>
          </div>
          <div className="p-4 hover:bg-slate-50 cursor-pointer border-l-4 border-transparent transition-colors">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900">Fresh Supermarket</h3>
              <span className="text-xs text-slate-500">Yesterday</span>
            </div>
            <p className="text-sm text-slate-600 truncate">The vegetables are ready for pickup.</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">G</div>
            <div>
              <h3 className="font-bold text-slate-900">Grand Hotel Banquet</h3>
              <p className="text-xs text-green-500 font-bold">● Online</p>
            </div>
          </div>
          <div className="flex space-x-3 text-slate-400">
            <button className="p-2 hover:bg-slate-100 rounded-full"><Phone className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full"><Video className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="text-center">
            <span className="bg-slate-200 text-slate-500 text-xs font-bold px-3 py-1 rounded-full">Today</span>
          </div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${msg.isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 font-bold ${msg.isMe ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="flex space-x-3">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
