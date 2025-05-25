"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api/api"; // your axios instance with bearer token
import echo from "@/lib/echo"; // your Laravel Echo setup
import userStore from "@/lib/store"; // import your user store for logged-in user info

interface User {
  id: string;
  name: string;
  status?: string;
  role?: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at?: string;
}

export default function ChatPage() {
  const loggedInUserId = userStore.user?.id;

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get<User[]>("/chat-users");
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch messages when user selected
  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      try {
        const res = await api.get<Message[]>("/messages", {
          params: { user_id: selectedUserId },
        });
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    fetchMessages();
  }, [selectedUserId]);

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!selectedUserId) return;

    const channelName = `chat.${selectedUserId}`;
    echo.private(channelName).listen("MessageSent", (e: { message: Message }) => {
      setMessages((prev) => [...prev, e.message]);
    });

    return () => {
      echo.leave(channelName);
    };
  }, [selectedUserId]);

  // Send new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;
    try {
      const res = await api.post<{ status: string; data: Message }>("/send-message", {
        message: newMessage,
        receiver_id: selectedUserId,
      });
      setMessages((prev) => [...prev, res.data.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div className="pt-16 h-[calc(100vh-5rem)] flex overflow-hidden">
      {/* Left Sidebar: User List */}
      <aside className="w-1/5 bg-gray-100 border-r overflow-y-auto p-4">
        <h2 className="text-lg font-bold mb-4">Chats</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`cursor-pointer p-2 rounded mb-2 ${
                selectedUserId === user.id ? "bg-blue-200" : "hover:bg-gray-200"
              }`}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-600">{user.status || "Offline"}</div>
              <div className="text-xs italic">{user.role || "User"}</div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Middle Chat Area */}
      <main className="flex-1 flex flex-col bg-white">
        {!selectedUserId ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Please select a user to start chatting</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b bg-white sticky top-0 z-10">
              <h2 className="text-xl font-semibold">
                Chat with {selectedUser?.name || "User"}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.length === 0 && (
                <p className="text-center text-gray-500">No messages yet.</p>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender_id === loggedInUserId
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-200 text-gray-800 self-start"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white flex gap-2">
              <input
                type="text"
                className="flex-1 border rounded px-4 py-2"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        )}
      </main>

      {/* Right Sidebar: User Info */}
      <aside className="w-1/4 bg-gray-50 border-l p-4">
        <h2 className="text-lg font-bold mb-4">User Info</h2>
        {selectedUserId ? (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {selectedUser?.name}
            </p>
            <p>
              <strong>Status:</strong> {selectedUser?.status || "Offline"}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser?.role || "User"}
            </p>
          </div>
        ) : (
          <p>Select a user to view info</p>
        )}
      </aside>
    </div>
  );
}
