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
  let audio = new Audio('/tmp/hello.mp3');
  const start = () => {
    audio.play();
  };
  const [text, setText] = useState('');
  const [messageList, setMessageList] = useState([
    {message: 'Hello, How can i help you?', sender: 'Bot', direction: 0},
  ]);
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
      setMessageList(messageList => [
        ...messageList,
        {message: res.data, sender: 'Bot', direction: 0},
      ]);
    } catch (error) {
      console.error('Create record error', error);
    }
  }
  return (
    <div style={{position: 'relative', height: '700px'}}>
      {false && (
        <button
          style={{position: 'absolute', zIndex: 100}}
          onMouseDown={listen}
          onMouseUp={stop}>
          🎤
        </button>
      )}
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messageList.map(item => {
              return (
                <>
                  {item.sender === 'Bot' && (
                    //<Speech text={item?.message} lang="vi-VN" />
                    //<button onClick={start}>Play</button>
                    <></>
                  )}
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
