const express = require("express")
const { Socket } = require("socket.io")
// imported express
// using that express function
const app = express()

// const { Server } = require("http")

const server = require('http').Server(app)
// make the connection of http with the express which is required to build app
const io = require("socket.io")(server)
// imported the socket.io and passed an return value server so that socket knows about which
// value to be passed and connect with 
const {v4:uuidV4} = require("uuid")


app.set('view engine' , 'ejs')
app.use(express.static('public'))

app.get("/",(request,response)=>{
    response.redirect(`/${uuidV4()}`)
})

app.get("/:room",(request,response)=>{
    response.render('room',{roomId : request.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId,userId)
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', ()=>{
            socket.to(roomId).emit('user-disconnected' , userId)
        })
  })
})

server.listen('3000',()=>{
    console.log("Server is ready");
})