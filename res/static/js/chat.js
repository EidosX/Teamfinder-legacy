const socket = io()
{
  let myUserId = null
  /* INIT DOM */

  const divDOM = document.createElement('div')
  divDOM.innerHTML = `
    <div id="chat">
      <div id="chat-userlist"></div>
      <div id="chat-msg-container"></div>
    </div>
  `
  document.body.prepend(divDOM.children[0])
  document.write('<link rel="stylesheet" href="/static/css/chat.css">')

  function addMsg(msg, fromId, toId) {
    const strangerId = myUserId === fromId ? toId : fromId
    const isMyMsg = myUserId === fromId

    const userlistDOM = document.getElementById('chat-userlist')
    if (!userlistDOM.querySelector('.uid' + strangerId)) {
      fetch('/api/users?id=' + strangerId)
        .then(r => r.json())
        .then(info => {
          const nickname = info.response?.nickname
          if (nickname)
            userlistDOM.querySelector(
              `.user.uid${strangerId} > .nickname`
            ).innerText = nickname
        })
      userlistDOM.innerHTML += `
        <div class="user uid${strangerId}">
          <p class="nickname">Utilisateur ${strangerId}</p>
        </div>
      `
      document.getElementById('chat-msg-container').innerHTML += `
        <div class="messages uid${strangerId}"></div>
      `
    }
    const msgDOM = document.createElement('p')
    msgDOM.className = 'message uid' + strangerId
    if (isMyMsg) msgDOM.classList.add('mine')
    msgDOM.innerText = msg
    document
      .getElementById('chat-msg-container')
      .querySelector(`.messages.uid${strangerId}`)
      .append(msgDOM)
  }

  function clear() {
    document.getElementById('chat-userlist').innerHTML = ''
    document.getElementById('chat-msg-container').innerHTML = ''
  }

  /* SOCKET IO */

  socket.on('connection-status', response => {
    if (response.status !== 'CONNECTED') return socket.disconnect()

    myUserId = response.yourId
    for (const { from_id, to_id, message } of response.msgHistory)
      addMsg(message, from_id, to_id)
    console.log(response)
    console.log('Socket.io connected')
  })
  socket.on('disconnect', () => {
    clear()
    console.log('Socket.io disconnected')
  })

  socket.on('privmsg', ({ msg, fromId }) => {
    addMsg(msg, fromId, myUserId)
  })

  onLoginEvents.push(() => {
    socket.disconnect()
    socket.connect()
  })
  onDisconnectEvents.push(() => socket.disconnect())

  function sendMsg(msg, toId) {
    addMsg(msg, myUserId, toId)
    socket.emit('privmsg', { msg, toId })
  }
}
