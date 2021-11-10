
import { Server } from 'socket.io'

const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        console.log('*First use, starting socket.io')

        const io = new Server(res.socket.server)
        let userList = [];
        let userCount = 0;
        let prevMsg = '';
        let currentIndex = null;

        const getNextSocketId = () => {
            // console.log('*getNextSocketId', userList)
            let nextIndex = userList.indexOf(userList.find(u => u.current === true)) + 1;
            // console.log('*getNextSocketId', userList)
            nextIndex = nextIndex >= userList.length ? 0 : nextIndex;
            userList[nextIndex].current = true;
            return userList[nextIndex].id;
        }
        
        io.on('connection', function(socket) {
            let addedUser = false;
            console.log('connection', io.sockets.sockets.length)
            socket.emit('new user', {
                userList: userList,
                userCount: userCount
            });

            socket.on('validate user', function(userName) {
                let loginError = false;

                

                for (let i = 0; i < userList.length; i++) {
                    if (userName === userList[i]) {
                        loginError = true;
                        io.emit('loginError', {
                            userName: userName
                        });
                    }
                }
                if (!loginError) {
                    console.log('on validate user > emit loginSuccess', userName)
                    socket.emit('loginSuccess', {
                        userName: userName
                    });
                }

            });

            socket.on('add user', (userName) => {
                if (!addedUser) ++userCount;
                
                // socket.userName = userName;
                userList.push({
                    name: userName,
                    id: socket.id
                });

                currentIndex = currentIndex === null ? userList.length - 1 : currentIndex;
                
                // console.log('addUser:', userList)
                addedUser = true;



                socket.emit('login', {
                    userCount: userCount,
                    userName: userName,
                    userList: userList,
                    index: userList.length - 1,
                    currentIndex: currentIndex 
                    
                });

                // echo globally (all clients) that a person has connected
                socket.broadcast.emit('user joined', {
                    userCount: userCount,
                    userName: userName,
                    userList: userList
                });

            });

            socket.on('disconnect', () => {

                if (addedUser) {
                    --userCount;

                    let total = userList.length;
                    for (let i = 0; i < total; i++) {
                        if (userList[i].id === socket.id) {
                            userList.splice(i, 1);
                        }
                    }

                    // echo globally that this client has left
                    socket.broadcast.emit('user left', {
                        username: socket.userName,
                        userCount: userCount,
                        userList: userList
                    });
                }
            });

            // socket.broadcast.emit('SRV_userConnected')
            // socket.on('hello', () => {
            //     userLength++;
            //     console.log('userLength', userLength)
            //     socket.emit('hello', userLength)
            // })

            socket.on('msgClient', msg => {
                // let removedLastWord = msg.slice(0, msg.length - 1);
                let prevWords = msg.split(' ')
                let newWord = prevWords.pop();
                prevWords = prevWords.join(' ');
                if (prevMsg === prevWords) {
                    console.log('bien')
                } else {
                    console.log('mal')
                }

                prevMsg = msg;
                console.log({
                    msg: msg, 
                    prevWords: prevWords,
                    newWord: newWord
                })


                // lastWord = lastWord[lastWord.length - 1];

                // console.log(getCurrentSocket())
                console.log('UL', userList);
                io.to(getNextSocketId()).emit('msgServer', msg)

                // socket.broadcast.emit('msgServer', msg)
                // socket.emit('msgServer', msg)
            })
        })

        res.socket.server.io = io
    } else {
        console.log('socket.io already running')
    }
    res.end()
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default ioHandler