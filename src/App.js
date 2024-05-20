import { useState } from "react";
import "./App.css";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import Speech from "react-speech";
export default function Test() {
  const [text, setText] = useState("");
  const [messageList, setMessageList] = useState([]);
  async function getAnswer(test) {
    try {
      const res = await axios.get(
        `http://lpnserver.net:51087/test2?c=${test}?`
      );
      console.log(res.data);
      setTimeout(async () => {
        setMessageList((messageList) => [
          ...messageList,
          { message: res.data, sender: "Bot", direction: 0 },
        ]);
      }, 2000);
    } catch (error) {
      console.error("Create record error", error);
    }
  }
  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer
          onClick={() => {
            console.log("hi");
          }}
        >
          <MessageList>
            {messageList.map((item) => {
              return (
                <>
                  <Message
                    model={{
                      message: item?.message,
                      sender: item?.sender,
                      direction: item?.direction,
                    }}
                  />
                </>
              );
            })}
          </MessageList>
          <MessageInput
            value={text}
            onChange={(text) => {
              setText(text);
            }}
            placeholder="Type message here"
            onSend={() => {
              setMessageList((messageList) => [
                ...messageList,
                { message: text, sender: "You", direction: 1 },
              ]);

              getAnswer(text);

              setText("");
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
