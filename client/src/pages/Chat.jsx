import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import PotentialChats from "../components/chat/PotentialChats";
// import { useFetchRecipientUser } from "../hooks/useFetchRecipientUser";
import ChatBox from "../components/chat/ChatBox";

const Chat = () => {
  const {
    userChats,
    isUserChatsLoading,
    userChatError,
    updateCurrentChat,
    messages,
    isMessagesLoading,
    messageError,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  // const { recipientUser } = useFetchRecipientUser(current, user);

  console.log("messages", messages);

  return (
    <Container>
      <PotentialChats />
      <Stack direction="horizontal" gap={4} className="align-items-start">
        <Stack className="flex-grow-0 messages-box pe-3">
          {isUserChatsLoading && <p>Loading chats... </p>}
          {userChats?.map((chat, index) => (
            <div
              key={chat.id || index}
              onClick={() => {
                updateCurrentChat(chat);
              }}
            >
              <UserChat chat={chat} user={user} />
            </div>
          ))}
        </Stack>
        <ChatBox />
        {/* <div className="flex-grow-2" style={{ backgroundColor: "red" }}>
          {messages?.map((message) => (
            <div key={message._id}>
              <div>
                {message.senderId === user._id
                  ? recipientUser?.name
                  : user.name}
              </div>
              <div>{message.senderId}</div>
              <div>{user._id}</div>

              <div>{message.text}</div>
              <br />
            </div>
          ))}
        </div> */}
      </Stack>
    </Container>
  );
};

export default Chat;
