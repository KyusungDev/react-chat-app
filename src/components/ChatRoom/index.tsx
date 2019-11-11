import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from 'antd';
import styled from 'styled-components';
import oc from 'open-color';
import history from 'helper/history';
import { has } from 'lodash-es';
import socket from 'socket';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${oc.gray[4]};
`;

const Header = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${oc.gray[6]};
`;

const Title = styled.div`
  font-size: 14px;
  margin-left: 10px;
`;

const ButtonWrapper = styled.div`
  margin-right: 5px;
`;

const ChatHistoryWrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 95px);
  overflow: hidden;
  overflow-y: auto;
`;

const MessageInputWrapper = styled.div`
  /* height: 55px; */
  width: 100%;
  padding: 0px 2px 0px 2px;
  display: flex;
`;

const MessageInputArea = styled.div`
  width: 480px;
`;

const MessageInputButton = styled.div`
  margin-top: 1px;
  margin-left: 4px;
  margin-right: 2px;
`;

const MyMessage = styled.div`
  border-radius: 15px;
  padding: 7px 15px;
  margin: 5px 5px 10px 50px;
  text-align: right;
  background-color: ${oc.yellow[4]};
`;

const AnotherMessage = styled.div`
  & > div:first-child {
    padding: 3px 10px;
    margin: 5px 0px 5px 5px;
    font-size: 12px;
  }

  & > div:last-child {
    border-radius: 15px;
    padding: 7px 15px;
    margin: 5px 50px 10px 5px;
    margin-top: 5px;
    text-align: left;
    background-color: ${oc.gray[0]};
  }
`;

interface IChatRoomProps {
  onLeave: Function;
  onSendMessage: Function;
}

interface ITalk {
  name: string;
  message: string;
}

const ChatRoom: React.FC<IChatRoomProps> = props => {
  const { user, room, messages } = history.location.state;

  useEffect(() => {
    socket.onMessage(receiveMessage);

    // let join = 0;
    // let left = 0;
    // for (const m of messages) {
    //   if (has(m, 'event')) {
    //     if (m.event.includes('joined')) join = join + 1;
    //     if (m.event.includes('left')) left = left + 1;
    //   }
    // }
    // setMembers(join - left);

    return () => {
      props.onLeave(room);
      socket.discardMessage();
    };
  }, []);

  useEffect(() => {
    if (chatScroll && chatScroll.current) {
      // @ts-ignore
      chatScroll.current.scrollTo(0, chatScroll.current.scrollHeight);
    }
  });

  const chatScroll = useRef(null);
  const [chat, setChat] = useState<ITalk[]>([]);
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState(0);

  const sendMessage = () => {
    const { onSendMessage } = props;
    onSendMessage(room, message, () => {
      setMessage('');
    });
  };

  const receiveMessage = (res: any) => {
    if (has(res, 'event')) {
      chat.push({
        name: res.user.name,
        message: res.event.includes('joined')
          ? `${res.user.name}님이 들어왔습니다.`
          : `${res.user.name}님이 나갔습니다.`
      });
    } else {
      chat.push({
        name: res.user.name,
        message: res.message
      });
    }

    setChat([...chat]);
    console.log('received', res);
  };

  const handleSendClick = (e: any) => {
    if (!message) return;

    sendMessage();
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return true;
      }

      e.preventDefault();
      sendMessage();
    }
  };

  console.log('rerender');
  const { onLeave } = props;

  return (
    <Wrapper>
      <Header>
        <Title>{room ? `${room.name}` : ''}</Title>
        <ButtonWrapper>
          <Button type="danger" size="small" onClick={() => onLeave(room.name)}>
            나가기
          </Button>
        </ButtonWrapper>
      </Header>
      <ChatHistoryWrapper ref={chatScroll}>
        {chat.map((c, index) =>
          c.name === user.name ? (
            <MyMessage key={index}>
              <div>{c.message}</div>
            </MyMessage>
          ) : (
            <AnotherMessage key={index}>
              <div>{c.name}</div>
              <div>{c.message}</div>
            </AnotherMessage>
          )
        )}
      </ChatHistoryWrapper>
      <MessageInputWrapper>
        <MessageInputArea>
          <Input.TextArea
            autoSize={false}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ resize: 'none' }}
          ></Input.TextArea>
        </MessageInputArea>
        <MessageInputButton>
          <Button
            style={{
              width: '58px',
              height: '50px',
              textAlign: 'center',
              paddingLeft: '10px'
            }}
            type="primary"
            onClick={handleSendClick}
          >
            보내기
          </Button>
        </MessageInputButton>
      </MessageInputWrapper>
    </Wrapper>
  );
};

export default ChatRoom;
