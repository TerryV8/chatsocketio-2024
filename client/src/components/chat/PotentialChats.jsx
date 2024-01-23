import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { potentialChats, createChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  console.log("potentialChats", potentialChats);
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
            <span className="user-online"></span>
          </div>
        ))}
      </div>
    </>
  );
};

export default PotentialChats;
