import React, { Component } from 'react';
import socket from './socket';
import history from './helper/history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import oc from 'open-color';

import { notification } from 'antd';
import { IUser, IRoom } from 'types';
import styled from 'styled-components';
// import Header from './components/Header';
import Rooms from './components/Rooms';
import User from './components/User';
import ChatRoom from './components/ChatRoom';
import 'App.css';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

// const HeaderWapper = styled.div`
//   width: 400px;
//   height: 40px;
// `;

const ContentWrapper = styled.div`
  width: 350px;
  height: 500px;
  background-color: ${oc.gray[4]};
`;

export interface IAppState {
  user: IUser;
  loading: boolean;
}

class App extends Component {
  public state: IAppState = {
    user: {
      name: '',
      logo: ''
    },
    loading: false
  };

  public componentDidMount() {
    history.listen((location: any, action: string) => {
      if (location && action) {
        if (
          location.pathname === '/' &&
          (action === 'POP' || action === 'PUSH')
        ) {
          console.log(location, action);
          socket.unregister(() => {});
        }
      }
    });
  }

  public handleSendMessage(room: IRoom, message: string, callback: Function) {
    console.log(room, message);
    socket.message(room.name, message, callback);
  }

  public handleSignIn = (user: IUser) => {
    this.setState({
      isLoading: true
    });

    socket.register(user.name, (err: any) => {
      this.setState({
        user: {
          name: user.name,
          logo: user.logo
        },
        isLoading: false
      });

      if (err) {
        console.log(err);
        notification['error']({
          message: '중복된 이름 입니다.'
        });
        return;
      }

      history.push(`/rooms`);
    });
  };

  public handleHomeClick = () => {
    history.push('/');
  };

  public handleRoomClick = (room: IRoom) => {
    socket.join(room.name, (err: any, messages: any) => {
      if (err) {
        console.log(err);
        notification['error']({
          message: '사용자 정보가 없습니다.'
        });
      } else {
        history.push(`/chat/${room.name}`, {
          user: this.state.user,
          room,
          messages
        });
      }
    });
  };

  public handleLeave = (room: IRoom) => {
    socket.leave(room.name, (err: any) => {
      if (err) console.log(err);
      history.push('/rooms');
    });
  };

  render() {
    const { user, loading } = this.state;

    return (
      <Router history={history}>
        <AppContainer>
          {/* <HeaderWapper>
            <Header></Header>
          </HeaderWapper> */}
          <ContentWrapper>
            <ContentWrapper>
              {/* {user.name ? ( */}
              <Switch>
                <Route
                  exact
                  path="/"
                  component={() => (
                    <User
                      user={user}
                      loading={loading}
                      onSignIn={this.handleSignIn}
                    />
                  )}
                />
                <Route
                  path="/rooms"
                  component={() => (
                    <Rooms
                      user={user}
                      onClickHome={this.handleHomeClick}
                      onClickRoom={this.handleRoomClick}
                    />
                  )}
                />
                <Route
                  path="/chat/:name"
                  component={() => (
                    <ChatRoom
                      onLeave={this.handleLeave}
                      onSendMessage={this.handleSendMessage}
                    />
                  )}
                />
                <Redirect to="/" />
              </Switch>
              {/* ) : (
                <Switch>
                  <Route
                    exact
                    path="/"
                    component={() => (
                      <User
                        user={user}
                        loading={loading}
                        onSignIn={this.handleSignIn}
                      />
                    )}
                  />
                  <Redirect to="/" />
                </Switch>
              )} */}
            </ContentWrapper>
          </ContentWrapper>
        </AppContainer>
      </Router>
    );
  }
}

export default App;
