import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Input } from 'antd';
import { IUser, IRoom } from 'types';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  margin-bottom: 20px;
  width: 200px;
`;

interface IUserProps {
  user: IUser;
  loading: boolean;
  onSignIn: Function;
}

const User: React.FC<IUserProps> = (props: IUserProps) => {
  useEffect(() => {
    console.log('didmount');
  }, []);

  useEffect(() => {
    setUserName(props.user.name);
  }, [props.user]);

  const [username, setUserName] = useState<string>('');

  const handleInputChange = (e: any) => setUserName(e.target.value);
  const handleSignInClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.onSignIn({ name: username, logo: '' });
  };

  return (
    <Wrapper>
      <InputWrapper>
        <Input
          value={username}
          maxLength={20}
          onChange={handleInputChange}
        ></Input>
      </InputWrapper>
      <Button
        type="primary"
        style={{ width: '200px' }}
        onClick={handleSignInClick}
        disabled={!username}
        loading={props.loading}
      >
        Sing In
      </Button>
    </Wrapper>
  );
};

export default User;
