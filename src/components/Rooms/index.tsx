import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { Button, Avatar } from 'antd';
import { IUser, IRoom } from 'types';
import socket from 'socket';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Header = styled.div`
  width: 100%;
  height: 40px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${oc.gray[6]};
`;

const UserAvatar = styled.div`
  margin-left: 5px;
`;

const UserName = styled.div`
  position: absolute;
  margin-left: 45px;
  font-size: 20px;
`;

const ButtonWrapper = styled.div`
  margin-right: 5px;
`;

const RoomWrapper = styled.div`
  width: 98%;
  height: 50px;
  background-color: ${oc.gray[2]};
  border-radius: 20px;
  margin: 5px 0px 5px 0px;
  padding: 10px 10px 10px 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const RoomTitle = styled.div`
  margin-left: 10px;
  font-size: 16px;
`;

interface IRoomsProps {
  user: IUser;
  onClickHome: Function;
  onClickRoom: Function;
}

const Rooms: React.FC<IRoomsProps> = props => {
  const { user, onClickHome, onClickRoom } = props;

  useEffect(() => {
    socket.getChatrooms((err: any, rooms: IRoom[]) => {
      setRooms(rooms);
    });
  }, []);

  const [rooms, setRooms] = useState<IRoom[]>([]);
  console.log(rooms);

  return (
    <Container>
      <Header>
        <UserAvatar>
          <Avatar shape="square" icon="user" />
        </UserAvatar>
        <UserName>{user.name}</UserName>
        <ButtonWrapper>
          <Button
            size="small"
            onClick={e => onClickHome()}
            // style={{ marginRight: '5px' }}
          >
            메인으로
          </Button>
          {/* <Button type="primary" size="small">
            방 만들기
          </Button> */}
        </ButtonWrapper>
      </Header>
      {rooms.map((item: IRoom) => (
        <RoomWrapper key={item.name} onClick={e => onClickRoom(item)}>
          <Avatar shape="square" icon="wechat" />
          <RoomTitle>{`${item.name} (${item.members})`}</RoomTitle>
        </RoomWrapper>
      ))}
    </Container>
  );
};

export default Rooms;
