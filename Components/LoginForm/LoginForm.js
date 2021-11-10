import { useState } from 'react';

import styles from './LoginForm.module.scss'
const LoginForm = ({ socket, userName, setUserName, loginError, userLength}) => {

    const handlerSubmitLogin = (e) => {
        e.preventDefault();
        socket.emit('validate user', userName);
    }

    return (

        <form className={`${styles.loginForm} common-wrapper`} onSubmit={(e) => handlerSubmitLogin(e) }>
          <h1>Login</h1>
          <input type="text" placeholder="Username" onChange={(e) => setUserName(e.target.value)}/>
          <input type="submit" />
          { loginError && <p>Login error, try again</p> }
          <p>{userLength} user connected</p>
        </form>
    )
}

export default LoginForm;