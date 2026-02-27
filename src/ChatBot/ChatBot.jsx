import React, { useState, useRef, useEffect } from 'react';
import AppIcon from "../Component/AppIcon";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue("");

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: "Thanks for your message! Our support team will get back to you shortly.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">

            {/* Chat Window */}
            <div
                className={`
          pointer-events-auto
          w-[calc(100vw-2rem)] sm:w-[380px]
          bg-white/80 dark:bg-slate-900/90 
          backdrop-blur-xl 
          border border-white/20 dark:border-slate-700/50
          shadow-2xl rounded-2xl overflow-hidden
          transition-all duration-300 ease-in-out origin-bottom-right
          flex flex-col
          ${isOpen ? 'opacity-100 scale-100 translate-y-0 mb-4' : 'opacity-0 scale-95 translate-y-10 h-0 w-0 overflow-hidden mb-0'}
        `}
                style={{ maxHeight: 'calc(100vh - 100px)', height: isOpen ? '500px' : '0' }}
            >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 text-white flex justify-between items-center shadow-md shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <AppIcon name="Bot" className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-base leading-tight">Help Support</h3>
                            <p className="text-xs text-blue-100/80 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <AppIcon name="X" className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`
                  max-w-[80%] p-2 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700'}
                `}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="relative flex items-center gap-2 p-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-300">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-3 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 min-w-0 focus:outline-none"
                        />
                        <button
                            type="button"
                            className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Attach file"
                        >
                            <AppIcon name="Paperclip" className="w-5 h-5" />
                        </button>
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="p-2.5 m-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform active:scale-95 flex items-center justify-center"
                        >
                            <AppIcon name="Send" className={`w-4 h-4 ${inputValue.trim() ? "translate-x-0.5" : ""}`} />
                        </button>
                    </div>
                    <div className="text-center mt-2 flex items-center justify-center gap-1.5 opacity-60">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <p className="text-[10px] font-medium tracking-wide text-slate-400 dark:text-slate-500 uppercase">
                            AI Support Active
                        </p>
                    </div>
                </form>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          pointer-events-auto
          group relative flex items-center justify-center 
          w-14 h-14 rounded-full 
          bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500
          text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
          transition-all duration-300 transform hover:scale-105 active:scale-95
          ${isOpen ? 'rotate-90' : 'rotate-0'}
        `}
            >
                <div className="absolute inset-0 rounded-full bg-white/20 block animate-ping opacity-0 group-hover:opacity-100 duration-1000"></div>
                {isOpen ? (
                    <AppIcon name="X" className="w-7 h-7" />
                ) : (
                    <AppIcon name="MessageSquare" className="w-7 h-7" />
                )}
            </button>
        </div>
    );
};

export default ChatBot;
