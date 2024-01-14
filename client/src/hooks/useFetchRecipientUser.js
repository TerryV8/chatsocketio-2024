// Custom hook to get the details to the other user in the chat

import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members?.find((memberId) => memberId !== user?._id);

  useEffect(() => {
    const getRecipientUser = async () => {
      if (!recipientId) return;
      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

      if (response.error) {
        return setError(response);
      }

      setRecipientUser(response);
    };

    getRecipientUser();
  }, [chat, user]);

  return { recipientUser };
};
