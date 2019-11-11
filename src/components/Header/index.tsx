import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import oc from 'open-color';
import history from './../../helper/history';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${oc.gray[6]};
  height: 40px;
`;

const User = styled.div`
  width: 35px;
  height: 35px;
  margin-left: 5px;
  background-color: red;
  border-radius: 50%;
`;

const MainButtonWrapper = styled.div`
  margin-right: 5px;
`;

interface IHeaderProps {}

const Header: React.FC<IHeaderProps> = props => {
  console.log('header');
  return (
    <Wrapper>
      <User></User>
      <MainButtonWrapper>
        <Button
          onClick={() => {
            history.push('/');
          }}
        >
          메인
        </Button>
      </MainButtonWrapper>
    </Wrapper>
  );
};

export default Header;
