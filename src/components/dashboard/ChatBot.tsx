'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

const TypingIndicator = () => (
  <div style={{
    alignSelf: 'flex-start',
    display: 'flex',
    gap: '4px',
    padding: '12px 16px',
    backgroundColor: 'white',
    borderRadius: '12px 12px 12px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  }}>
    {[0, 1, 2].map((dot) => (
      <motion.div
        key={dot}
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--primary)',
          borderRadius: '50%',
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: dot * 0.2,
        }}
      />
    ))}
  </div>
);

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Bonjour ! Je suis SmartBot, votre assistant IA. Comment puis-je vous aider aujourd'hui ?", sender: 'bot', time: '14:00' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    const newMessage: Message = {
      id: Date.now(),
      text: userText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', {
        message: userText,
        history: messages.slice(-10)
      });

      const botResponse: Message = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorText = error.response?.data?.msg || "Désolé, je rencontre des difficultés pour me connecter à mon service d'intelligence. Veuillez vérifier votre configuration dans les paramètres.";
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      {/* Removed AISettingsModal - Configuration moved to Settings page */}

      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.5)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          right: 0,
          width: '380px',
          height: '500px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          borderRadius: '1.25rem',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          {/* Header */}
          <div style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  SmartBot <Sparkles size={14} />
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Assistant IA en ligne</div>
              </div>
            </div>
            
            <Link 
              href="/settings"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              title="Configurer l'IA"
            >
              <SettingsIcon size={18} />
            </Link>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'rgba(248, 250, 252, 0.5)'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: msg.sender === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                  backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'white',
                  color: msg.sender === 'user' ? 'white' : 'var(--foreground)',
                  fontSize: '0.875rem',
                  boxShadow: msg.sender === 'user' ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
                  lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#94a3b8',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {msg.time}
                </div>
              </div>
            ))}
            
            {isLoading && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              backgroundColor: '#f1f5f9',
              padding: '0.5rem',
              borderRadius: '2rem',
              border: '1px solid transparent',
              transition: 'all 0.2s'
            }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: inputValue.trim() ? 'var(--primary)' : '#94a3b8',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
