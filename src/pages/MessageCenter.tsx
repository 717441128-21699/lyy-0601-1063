import { useState } from 'react';
import {
  Bell,
  Briefcase,
  Calendar,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  Search,
  Settings,
  Send,
  MoreVertical,
  Clock,
  User,
  Building2,
  Inbox,
  CheckCheck,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { chatConversations } from '../data/messages';
import type { Message, ChatConversation } from '../types';

const typeMap: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
  system: { label: '系统通知', icon: Bell, color: 'text-primary-600', bgColor: 'bg-primary-100' },
  interview: { label: '面试通知', icon: Calendar, color: 'text-accent-600', bgColor: 'bg-accent-100' },
  application: { label: '投递通知', icon: Briefcase, color: 'text-success-600', bgColor: 'bg-success-100' },
  chat: { label: '聊天消息', icon: MessageSquare, color: 'text-primary-600', bgColor: 'bg-primary-100' },
};

export const MessageCenter = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const messages = useStore(state => state.messages);
  const markMessageAsRead = useStore(state => state.markMessageAsRead);
  const getUnreadCount = useStore(state => state.getUnreadCount);

  const tabs = [
    { id: 'all', label: '全部消息' },
    { id: 'system', label: '系统通知' },
    { id: 'interview', label: '面试通知' },
    { id: 'application', label: '投递通知' },
    { id: 'chat', label: '聊天消息' },
  ];

  const filteredMessages = messages.filter(msg => {
    if (activeTab !== 'all' && msg.type !== activeTab) return false;
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        msg.title.toLowerCase().includes(keyword) ||
        msg.content.toLowerCase().includes(keyword) ||
        msg.senderName.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  const handleMessageClick = (message: Message) => {
    if (!message.isRead) {
      markMessageAsRead(message.id);
    }
  };

  const handleMarkAllRead = () => {
    filteredMessages.forEach(msg => {
      if (!msg.isRead) {
        markMessageAsRead(msg.id);
      }
    });
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage('');
    }
  };

  const unreadCount = getUnreadCount();

  return (
    <div className="py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">消息中心</h1>
            <p className="text-slate-500 mt-1">
              共 {messages.length} 条消息，{unreadCount} 条未读
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索消息..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="input pl-9 w-64"
              />
            </div>
            <button onClick={handleMarkAllRead} className="btn btn-secondary">
              <CheckCheck className="w-4 h-4 mr-1.5" />
              全部已读
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="card">
              <div className="border-b border-slate-100 overflow-x-auto">
                <nav className="flex gap-1 px-4">
                  {tabs.map(tab => {
                    const tabUnreadCount = tab.id === 'all'
                      ? unreadCount
                      : messages.filter(m => m.type === tab.id && !m.isRead).length;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {tab.label}
                        {tabUnreadCount > 0 && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              activeTab === tab.id
                                ? 'bg-primary-100 text-primary-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {tabUnreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map(message => {
                    const typeInfo = typeMap[message.type];

                    return (
                      <div
                        key={message.id}
                        onClick={() => handleMessageClick(message)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                          !message.isRead ? 'bg-primary-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 ${typeInfo.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <typeInfo.icon className={`w-5 h-5 ${typeInfo.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 min-w-0">
                                {!message.isRead && (
                                  <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                                )}
                                <h4 className="font-medium text-slate-800 truncate">
                                  {message.title || message.senderName}
                                </h4>
                              </div>
                              <span className="text-xs text-slate-400 flex-shrink-0">
                                {message.createdAt}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                              {message.content}
                            </p>
                            {message.type === 'chat' && (
                              <div className="mt-2">
                                <span className="text-xs text-slate-400">
                                  来自：{message.senderName}
                                </span>
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">暂无消息</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="card sticky top-20">
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">聊天会话</h3>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {chatConversations.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-3 cursor-pointer transition-colors hover:bg-slate-50 ${
                      activeChat?.id === chat.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={chat.participantAvatar}
                          alt={chat.participantName}
                          className="w-10 h-10 rounded-full object-cover bg-slate-100"
                        />
                        {chat.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium text-slate-800 text-sm truncate">
                            {chat.participantName}
                          </h4>
                          <span className="text-xs text-slate-400 flex-shrink-0">
                            {chat.lastMessageTime.split(' ')[1]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.jobTitle && (
                          <p className="text-xs text-primary-600 mt-1 truncate">
                            {chat.jobTitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {activeChat && (
                <div className="border-t border-slate-100 p-3">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                    <img
                      src={activeChat.participantAvatar}
                      alt={activeChat.participantName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {activeChat.participantName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{activeChat.jobTitle}</p>
                    </div>
                  </div>

                  <div className="h-40 overflow-y-auto mb-3 space-y-2">
                    <div className="flex justify-start">
                      <div className="bg-slate-100 rounded-xl rounded-tl-none px-3 py-2 max-w-[80%]">
                        <p className="text-sm text-slate-700">{activeChat.lastMessage}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={e => setChatMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="输入消息..."
                      className="input flex-1 text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="btn btn-primary p-2.5"
                      disabled={!chatMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
