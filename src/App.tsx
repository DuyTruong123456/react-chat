import React, {useEffect, useRef, useState} from 'react';
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
  const getSound = async text => {
    const options = {
      method: 'GET',
      url: 'https://voicerss-text-to-speech.p.rapidapi.com/',
      params: {
        key: '7966da533b0a49069243b60eb5a7f612',
        src: text,
        hl: 'en-us',
        r: '0',
        c: 'mp3',
        f: '8khz_8bit_mono',
      },
      headers: {
        'X-RapidAPI-Key': '9352759e23msh356753776dc498ap107a84jsn3a09b8c8d4bc',
        'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.post(
        'https://viettelgroup.ai/voice/api/tts/v1/rest/syn',
        {
          text: text,
          voice: 'hn-quynhanh',
          id: '2',
          without_filter: false,
          speed: 1.0,
          tts_return_option: 3,
        },
        {
          responseType: 'blob',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            token:
              'T6v7kZz4PnCH6iDQvpgDPbrPEDOLe91ky96Cs10TSA-bK9kul2llvipZ0-CsvC80',
          },
        },
      );
      console.log('response', response.data);
      let audio = new Audio(convertToSRC(response.data));
      audio.play();
    } catch (error) {
      console.error(error);
    }
  };
  const [passingText, setPassingText] = useState('');
  const [text, setText] = useState('');
  const [messageList, setMessageList] = useState([
    {message: 'Hello, How can i help you?', sender: 'Bot', direction: 0},
  ]);
  const {listen, stop} = useSpeechRecognition({
    onResult: result => {
      setText(result);
    },
  });
  const convertToSRC = blob => {
    const url = URL.createObjectURL(blob);
    return url;
  };

  async function getAnswer(test) {
    try {
      const res = await axios.get(
        `http://lpnserver.net:51087/test2?c=${passingText + test}?`,
      );
      console.log(res.data);
      setPassingText(passingText + test);
      setMessageList(messageList => [
        ...messageList,
        {message: res.data, sender: 'Bot', direction: 0},
      ]);
      getSound(res.data);
    } catch (error) {
      console.error('Create record error', error);
    }
  }
  return (
    <div style={{position: 'relative', height: '700px'}}>
      {true && (
        <div style={{position: 'absolute', zIndex: 100, right: 0}}>
          <button
            style={{
              zIndex: 100,
              width: '50px',
              height: '50px',
            }}
            onMouseDown={listen}>
            🎤
          </button>
          <button
            style={{
              zIndex: 100,
              width: '50px',
              height: '50px',
            }}
            onMouseDown={stop}>
            ⬛
          </button>
        </div>
      )}
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messageList.map(item => {
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
const style = {
  play: {
    button: {
      width: '28',
      height: '28',
      cursor: 'pointer',
      pointerEvents: 'none',
      outline: 'none',
      backgroundColor: 'yellow',
      border: 'solid 1px rgba(255,255,255,1)',
      borderRadius: 6,
    },
  },
};
