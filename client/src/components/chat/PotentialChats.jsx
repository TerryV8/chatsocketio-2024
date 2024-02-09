import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  console.log("potentialChats", potentialChats);
  console.log("onlineUsers", onlineUsers);

  // console.log("onlineUsers.include(u?._id)", onlineUsers.include(u?._id));
  return (
    <>
      <div className="potential-chats">
        {potentialChats?.map((u) => (
          <div
            className="single-user"
            key={u?._id}
            onClick={() => createChat(user._id, u._id)}
          >
            {u?.name}
            {onlineUsers?.some((user) => user.userId === u?._id) && (
              <span className="user-online"></span>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default PotentialChats;
