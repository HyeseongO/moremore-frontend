import { useState, useEffect, useRef } from 'react';
import { IoSend, IoClose } from 'react-icons/io5';
import { Socket } from 'socket.io-client';

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    nickname: string;
  };
  createdAt: string;
}

interface ChatSidebarProps {
  roomId: string;
  socket: Socket | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: number;
  currentUserNickname: string;
}

export function ChatSidebar({
  roomId,
  socket,
  isOpen,
  onClose,
  currentUserId,
  currentUserNickname,
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('messages-history', (history: Message[]) => {
      setMessages(history);
      scrollToBottom();
    });

    socket.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socket.on('user-typing', ({ userId, nickname, isTyping }: any) => {
      if (userId !== currentUserId) {
        if (isTyping) {
          setTypingUsers((prev) => [...new Set([...prev, nickname])]);
        } else {
          setTypingUsers((prev) => prev.filter((u) => u !== nickname));
        }
      }
    });

    socket.on('error', ({ message }: { message: string }) => {
      console.error('채팅 에러:', message);
    });

    socket.emit('get-messages', { roomId, limit: 50 });

    return () => {
      socket.off('messages-history');
      socket.off('new-message');
      socket.off('user-typing');
      socket.off('error');
    };
  }, [socket, roomId, currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();

    if (!socket || !inputMessage.trim()) return;

    socket.emit('send-message', {
      roomId,
      content: inputMessage.trim(),
    });

    setInputMessage('');
    handleTyping(false);
  };

  const handleTyping = (typing: boolean) => {
    if (!socket) return;

    socket.emit('typing', { roomId, isTyping: typing });

    if (typing) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(false);
      }, 3000);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);

    if (!isTyping) {
      setIsTyping(true);
      handleTyping(true);
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}

      <div
        className={`fixed right-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl transition-all duration-300 z-50 
        ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} 
        w-96 h-[600px] flex flex-col overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-2xl">
          <h3 className="font-semibold text-lg text-gray-800">채팅</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition">
            <IoClose size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              아직 메시지가 없습니다. 대화를 시작해보세요!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 ${
                  message.sender.id === currentUserId ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block max-w-[70%] ${
                    message.sender.id === currentUserId
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  } rounded-2xl px-4 py-2.5`}
                >
                  {message.sender.id !== currentUserId && (
                    <p className="text-xs font-semibold mb-1 opacity-80">
                      {message.sender.nickname}
                    </p>
                  )}
                  <p className="text-sm break-words">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}

          {typingUsers.length > 0 && (
            <div className="text-sm text-gray-500 italic px-2">
              {typingUsers.join(', ')}님이 입력 중...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <IoSend size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
