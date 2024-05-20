import {useState} from 'react';
import './App.css';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from '@chatscope/chat-ui-kit-react';
import axios from 'axios';
import Speech from 'react-speech';
import {enableAutoTTS} from 'enable-auto-tts';
enableAutoTTS();
import {useSpeechRecognition} from 'react-speech-kit';
export default function Test() {
  const [text, setText] = useState('');
  const [messageList, setMessageList] = useState([]);
  const {listen, stop} = useSpeechRecognition({
    onResult: result => {
      setText(result);
    },
  });
  async function getAnswer(test) {
    try {
      const res = await axios.get(
        `http://lpnserver.net:51087/test2?c=${test}?`,
      );
      console.log(res.data);
      setTimeout(async () => {
        setMessageList(messageList => [
          ...messageList,
          {message: res.data, sender: 'Bot', direction: 0},
        ]);
      }, 2000);
    } catch (error) {
      console.error('Create record error', error);
    }
  }
  return (
    <div style={{position: 'relative', height: '700px'}}>
      <button
        style={{position: 'absolute', zIndex: 100}}
        onMouseDown={listen}
        onMouseUp={stop}>
        🎤
      </button>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messageList.map(item => {
              return (
                <>
                  <Speech text="ngủ" lang="vi-VN" />
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
            onChange={text => {
              setText(text);
            }}
            placeholder="Type message here"
            onSend={() => {
              setMessageList(messageList => [
                ...messageList,
                {message: text, sender: 'You', direction: 1},
              ]);

              getAnswer(text);

              setText('');
            }}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
