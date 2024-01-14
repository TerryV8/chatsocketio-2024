import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";

const Chat = () => {
  const { userChats, isUserChatsLoading, userChatError } =
    useContext(ChatContext);
  const { user } = useContext(AuthContext);

  return (
    <Container>
      <Stack direction="horizontal" gap={4} className="align-items-start">
        <Stack className="flex-grow-0 messages-box pe-3">
          {isUserChatsLoading && <p>Loading chats... </p>}
          {userChats?.map((chat, index) => (
            <div key={chat.id || index}>
              <UserChat chat={chat} user={user} />
            </div>
          ))}
        </Stack>
        <p className="flex-grow-2" style={{ backgroundColor: "red" }}>
          ChatBox
        </p>
      </Stack>
    </Container>
  );
};

export default Chat;
