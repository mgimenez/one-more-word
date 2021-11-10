import Head from 'next/head'
// import Image from 'next/image'
import Header from '../Components/Header/Header'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import LoginForm from '../Components/LoginForm/LoginForm';
import FormGame from '../Components/FormGame/FormGame';

let socket = null;
export default function Home() {

  const [val, setVal] = useState('');
  const [message, setMessage] = useState('');
  const [userLength, setUserLength] = useState(0);
  const [userName, setUserName] = useState('');
  const [userList, setUserList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    socketConnect();
    
  }, [])

  const socketConnect = () => {
    fetch('/api/socketio').finally(() => {
      socket = io();

      socket.on('connect', () => {
        console.log('connect')
      })

      socket.on('disconnect', () => {
        console.log('disconnect')
      })

      socket.on('new user', (data) => {
        console.log('new user')
        setUserLength(data.userCount)
        setUserList(data.userList)
      })

      socket.on('loginError', (data) => {
        setLoginError(true);
      });

      socket.on('loginSuccess', (data) => {
        setLoginError(false);
        socket.emit('add user', data.userName);
        setIsLoggedIn(true);
      });

      socket.on('login', (data) => {
        setUserList(data.userList);
        setUserLength(data.userCount);
        console.log(data)
        setShowMessage(data.index === data.currentIndex)
      });

      socket.on('user joined', (data) => {
        setUserList(data.userList);
        setUserLength(data.userCount);
      });

      socket.on('user left', (data) => {
        console.log('user left')
        setUserList(data.userList);
        setUserLength(data.userCount);
      });

      socket.on('msgServer', (msg) => {
        setMessage(msg)
        setShowMessage(true)
        setTimeout(() => {
          setShowMessage(false)
        }, 3000)
      })
    })
  }

  const handlerLogOut = (e) => {
    e.preventDefault()
    socket.disconnect()
    setIsLoggedIn(false);
    setUserLength(userLength-1)
    socketConnect()
  }

  return (
    <>
      <Head>
        <title>ONE MORE WORD</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      { !isLoggedIn &&
        <LoginForm socket={socket} userName={userName} setUserName={setUserName} loginError={loginError} userLength={userLength} />
      }
      { isLoggedIn && 
        <FormGame userName={userName} userLength={userLength} userList={userList} socket={socket} handlerLogOut={handlerLogOut} message={message} setVal={setVal} val={val} showMessage={showMessage} setShowMessage={setShowMessage} />
      }
      

    </>
  )
}