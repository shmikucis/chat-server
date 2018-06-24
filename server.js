const express = require('express')
const _ = require('lodash')
const http = require('http')
const socketIO = require('socket.io')
const users = require('./users')
const messages = require('./messages')
const log = require('./log')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const port = 4001

// if user doesn't send any messages then he is disconnected from server
const inactivityTimeout = 1000*60*10 // in miliseconds



// start server
server.listen(port, () => log.log(`Listening on port ${port}`))

// terminates gracefully
process.once('SIGINT', () => closeServer('SIGINT') )
process.once('SIGTERM', () => closeServer('SIGTERM') )

function closeServer(code) {
  console.log(`${code} received...`)
  server.close()
}


// start connection with user
io.on('connection', function (socket) {
  log.log('user connected')

  let userId
  let inactivityTimer
  
  // validate username and register it
  socket.on('registerUser', userName => {
    const re = { error: null }
    const isSuccess = users.add(userName)

    if(isSuccess === true) {
      userId = users.getLastUser()
      messages.addBot(`${userId} came online`)
      socket.broadcast.emit('receiveChatMessage', messages.getLast())
      setInactivityTimer()
    }
    else re.error = isSuccess

    socket.emit('registerUser', re)
  })

  // display message history for newly joined users
  socket.on('getAllMessages', () => {
    socket.emit('getAllMessages', messages.getAll())
  })

  // receive chat message
  socket.on('sendChatMessage', message => {
    const isSuccess = messages.add(userId, message.text)
    if(isSuccess){
      socket.emit('receiveChatMessage', messages.getLast())
      socket.broadcast.emit('receiveChatMessage', messages.getLast())
      setInactivityTimer()
    }
  })

  // user disconnected
  socket.on('disconnect', () => {
    // remove only registered users
    if(userId){
      messages.addBot(`${userId} left the chat, connection lost`)
      socket.broadcast.emit('receiveChatMessage', messages.getLast())
      users.remove(userId)
      userId = null
    } else log.log('user disconnected')
  })

  // sets inactivity timeout. If user sends chat message then resets timeout, otherwise disconnet user
  function setInactivityTimer(){
    if(inactivityTimer) {
      clearTimeout(inactivityTimer)
      inactivityTimer = null
    }

    inactivityTimer = setTimeout(() => {
      messages.addBot(`${userId} was disconnected due to inactivity`)
      socket.broadcast.emit('inactiveDisconnect', messages.getLast())
      socket.emit('inactiveDisconnectMe')

      users.remove(userId)
      userId = null

      // disconnect user
      socket.disconnect()
    }, inactivityTimeout)
  }

})