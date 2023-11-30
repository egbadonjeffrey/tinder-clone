/* eslint-disable react/prop-types */
import Chat from "./Chat";
import ChatInput from "./ChatInput";
import axios from "axios";
import { useState, useEffect } from "react";

const ChatDisplay = ({ user, clickedUser }) => {
  const [usersMessages, setUsersMessages] = useState(null);
  const [clickedUsersMessages, setClickedUsersMessages] = useState(null);

  const userId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;

  const getUsersMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8080/messages", {
        params: { userId: userId, correspondingUserId: clickedUserId },
      });

      setUsersMessages(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getClickedUsersMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8080/messages", {
        params: { userId: clickedUserId, correspondingUserId: userId },
      });

      setClickedUsersMessages(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const messages = [];
  useEffect(() => {
    getUsersMessages();
    getClickedUsersMessages();
  }, [messages]);

  usersMessages?.forEach((message) => {
    const formattedMessage = {};
    formattedMessage["name"] = user?.first_name;
    formattedMessage["img"] = user?.url;
    formattedMessage["message"] = message.message;
    formattedMessage["timestamp"] = message.timestamp;
    messages.push(formattedMessage);
  });

  clickedUsersMessages?.forEach((message) => {
    const formattedMessage = {};
    formattedMessage["name"] = clickedUser?.first_name;
    formattedMessage["img"] = clickedUser?.url;
    formattedMessage["message"] = message.message;
    formattedMessage["timestamp"] = message.timestamp;
    messages.push(formattedMessage);
  });

  const descendingOrderMessages = messages?.sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  //   console.log("formattedMessages", messages);
  //   console.log("usersMessages", usersMessages);

  return (
    <>
      <Chat descendingOrderMessages={descendingOrderMessages} />
      <ChatInput
        user={user}
        clickedUser={clickedUser}
        getUsersMessages={getUsersMessages}
        getClickedUsersMessages={getClickedUsersMessages}
      />
    </>
  );
};

export default ChatDisplay;
