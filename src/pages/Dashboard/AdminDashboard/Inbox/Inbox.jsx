import { useEffect, useState, useRef } from "react";
import axios from "axios";

const Inbox = () => {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Fetch conversations
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await axios.get("https://dropvein-server.vercel.app/api/chats");
                setConversations(res.data || []);
                console.log(res.data)
            } catch (err) {
                console.error("Error fetching chats:", err);
            }
        };
        fetchChats();
    }, []);

    // Poll messages for active chat
    useEffect(() => {
        if (!activeChat) return;
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`https://dropvein-server.vercel.app/api/chats/${activeChat.id}`);
                setMessages(res.data.messages || []);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [activeChat]);

    // Auto scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSelectChat = async (chat) => {
        setActiveChat(chat);
        try {
            const res = await axios.get(`https://dropvein-server.vercel.app/api/chats/${chat.id}`);
            setMessages(res.data.messages || []);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            await axios.post(`https://dropvein-server.vercel.app/api/chats/${activeChat.id}/messages`, { text: newMessage });
            setMessages((prev) => [
                ...prev,
                { id: Date.now(), text: newMessage, createdAt: new Date(), author: { type: "manager" } },
            ]);
            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
                <h2 className="text-2xl font-bold p-4 border-b border-gray-300 dark:border-gray-700">Inbox</h2>
                {conversations.map((chat) => {
                    const unseenCount = chat.unseenCount || 0;
                    const isActive = activeChat?.id === chat.id;
                    return (
                        <div
                            key={chat.id}
                            onClick={() => handleSelectChat(chat)}
                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? "bg-gray-200 dark:bg-gray-700" : ""
                                }`}
                        >
                            <img
                                src={chat.user.avatarUrl}
                                alt={chat.user.name}
                                className="w-12 h-12 rounded-full mr-4 object-cover"
                            />
                            <div className="flex-1">
                                <div className={`flex justify-between items-center`}>
                                    <span className={`text-sm ${unseenCount ? "font-bold" : "font-medium"}`}>
                                        {chat.user?.name || chat.name || "Unknown"}
                                    </span>
                                    {unseenCount > 0 && (
                                        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                                            {unseenCount}
                                        </span>
                                    )}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-sm truncate mt-1">
                                    {chat.lastMessage?.text || chat.lastMessage?.plainText || "No messages yet"}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
                {activeChat ? (
                    <>
                        <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-semibold">
                            {activeChat.user?.name || activeChat.name}
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                            {[...messages]
                                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                                .map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`my-2 p-3 rounded-lg break-words flex ${msg.author.type !== "user"
                                            ? "justify-end" // senders like manager/admin
                                            : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`p-3 rounded-lg break-words ${msg.author.type !== "user"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                }`}
                                        >
                                            {msg.text}
                                            <div className="text-xs text-gray-400 mt-1 text-right">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input box */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-l px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r transition-colors"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
