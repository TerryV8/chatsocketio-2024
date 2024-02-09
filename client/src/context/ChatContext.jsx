import { createContext, useState, useEffect, useCallback } from "react";

import { baseUrl, getRequest, postRequest } from "../utils/services";

import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

  // Some possible chats that the user can join with. It returns a list of users that can be proposed as potential chats with the current user
  const [potentialChats, setPotentialChats] = useState([]);

  const [currentChat, setCurrentChat] = useState(null);

  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const [socket, setSocket] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  console.log("currentChat", currentChat);

  console.log("onlineUsers", onlineUsers);

  const [notifications, setNotifications] = useState([]);

  console.log("notifications", notifications);

  const [allUsers, setAllUsers] = useState([]);

  // initialize socket
  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    //clean up function
    return () => newSocket.disconnect();
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      //remove the specified listener from the array for the event named getOnlineUsers
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // send message
  useEffect(() => {
    if (socket === null) return;

    console.log("sendMessage user", user);
    console.log("sendMessage currentChat", currentChat);

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    console.log("sendMessage { ...newMessage, recipientId }", {
      ...newMessage,
      recipientId,
    });

    socket.emit("sendMessage", { ...newMessage, recipientId });

    return () => {
      socket.off("sendMessage");
    };
  }, [newMessage]);

  // receive message
  useEffect(() => {
    console.log("receive message");

    if (socket === null) return;

    socket.on("getMessage", (res) => {
      console.log("getMessage res", res);
      console.log("getMessage currentChat", currentChat);

      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members?.some(
        (id) => id === res.senderId
      );

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsersChat = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };

    getUsersChat();
  }, [user]);

  useEffect(() => {
    const getUsers = async () => {
      // Get All the users
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return setUserChatsError(response);
      }

      // Find users that are not the current user and that are not already in a chat with the current user
      // So those users can be proposed as potential chats
      if (user && userChats) {
        const pChats = response.filter((u) => {
          if (user._id === u._id) {
            return false;
          }

          let isChatAlreadyCreated = false;

          if (userChats) {
            isChatAlreadyCreated = userChats.some((chat) => {
              return chat.members.includes(u._id);
            });
          }

          return !isChatAlreadyCreated;
        });

        setPotentialChats(pChats);
        setAllUsers(response);
      }
    };

    getUsers();
  }, [userChats]);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      console.log("Error during creating chat", response);
      return setUserChatsError(response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        setIsMessagesLoading(true);
        setMessagesError(null);

        const response = await getRequest(
          `${baseUrl}/messages/${currentChat._id}`
        );

        setIsMessagesLoading(false);

        if (response.error) {
          console.log("Error during getting messages", messages);
          return setMessagesError(response);
        }

        setMessages(response);
      }
    };

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) {
        return console.log("You must type something...");
      }

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );

      if (response.error) {
        console.log("Error during sending message", response);
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);

      // Clear the input field
      setTextMessage("");
    }
  );

  const markAllNotificationsAsRead = useCallback(() => {
    const mNotifications = notifications.map((notification) => {
      return { ...notification, isRead: true };
    });

    setNotifications(mNotifications);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
