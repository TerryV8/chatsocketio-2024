import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotificationsFunc";
import moment from "moment";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { notifications, userChats, allUsers, markAllNotificationsAsRead } =
    useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const unreadNotificationsEnhanced = unreadNotifications.map(
    (notification) => {
      const sender = allUsers?.find(
        (user) => user._id === notification.senderId
      );

      return {
        ...notification,
        senderName: sender?.name,
      };
    }
  );

  console.log("unreadNotificationsEnhanced", unreadNotificationsEnhanced);

  return (
    <div className="notifications">
      <div className="notifications-icons" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-chat-left-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
        </svg>
        {unreadNotificationsEnhanced?.length > 0 && (
          <span className="notification-count">
            <span>{unreadNotificationsEnhanced.length}</span>
          </span>
        )}
      </div>
      {isOpen && (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div
              className="mark-as-read"
              onClick={() => markAllNotificationsAsRead()}
            >
              Mark all as read
            </div>
          </div>

          {unreadNotificationsEnhanced.length === 0 ? (
            <span className="notification">No notification yet...</span>
          ) : (
            unreadNotificationsEnhanced.map((notification, index) => (
              <div
                key={index}
                className="notification not-read"
                onClick={() => {
                    
                  setIsOpen(false);
                }}
              >
                <span>
                  <b
                    style={{ fontWeight: 800 }}
                  >{`${notification.senderName} `}</b>
                  sent you a new message
                </span>
                <span className="notification-time">
                  {moment(notification.date).calendar()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
