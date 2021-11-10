import { useState, useEffect} from 'react';
import styles from './FormGame.module.scss'
const FormGame = ({ userName, userLength, userList, socket, handlerLogOut, message, setVal, val, showMessage, setShowMessage}) => {

    const [showMessageLocal, setShowMessageLocal] = useState(true)

    useEffect(() => {
        // console.log('new msg')
        setShowMessageLocal(true)
    }, [message])

    const handlerSubmitGame = (e) => {
        e.preventDefault();
        socket.emit('msgClient', val)
        setVal('');
        setShowMessageLocal(false)
        
    }

    const handlerChangeGame = ({ target }) => {
        setVal(target.value)
    }



    return (
        <div className={`${styles.formGame} common-wrapper`}>

            <p>Username: {userName}</p>
            <p>{userLength} users connected</p>
            <a href="/logout" onClick={handlerLogOut} >Logout</a>
            <ul>
                {userList.map((user, i) => <li key={i}> {user.name}</li>)}
            </ul>
                <form onSubmit={(e) => handlerSubmitGame(e)}>
                    <h1>Game</h1>
                {!showMessage && showMessageLocal && 
                        <>
                            <input type="text" value={val} onChange={(e) => handlerChangeGame(e)} />
                            <input type="submit" />
                        </>
                    }
                </form>
            { showMessage && <div>{message}</div> }
        </div>
    )
}

export default FormGame;