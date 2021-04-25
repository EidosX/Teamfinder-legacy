const socket = io()
{
  let myUserId = null
  let selectedUserID = null

  /* INIT DOM */

  const divDOM = document.createElement('div')
  divDOM.innerHTML = `
    <div id="chat" class="hidden">
      <div id="chat-userlist"></div>
      <div class="right">
        <div id="chat-msg-container"></div>
        <form id=chat-form>
          <input id="chat-input" type="text" autocomplete="off" placeholder="Entrez un message . . .">
        </form>
      </div>
    </div>
    <div>
    <svg id="chat-open-btn" class="hidden"><image href="/static/svg/message.svg" /></svg>
  `
  document.body.prepend(...divDOM.children)
  document.write('<link rel="stylesheet" href="/static/css/chat.css">')

  document.getElementById('chat-open-btn').onclick = () =>
    document.getElementById('chat').classList.toggle('hidden')

  setTimeout(() => {
    document.getElementById('chat-open-btn').classList.add('with-trans')
    document.getElementById('chat').classList.add('with-trans')
  }, 200)

  document.getElementById('chat-form').onsubmit = e => {
    e.preventDefault()
    if (!selectedUserID || !myUserId) return
    inputDOM = document.getElementById('chat-input')
    sendMsg(inputDOM.value, selectedUserID)
    inputDOM.value = ''
  }

  function addMsg(msg, fromId, toId, read = true) {
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
        <div class="messages uid${strangerId} hidden"></div>
      `
    }
    let isSpecial = false
    const tmp = '__application_accepted;recruitment:'
    if (msg.startsWith(tmp)) {
      const rId = msg.substr(tmp.length)
      if (isMyMsg)
        msg = `Vous avez accepté sa candidature pour <a href=/recruitment/${rId}>ce recrutement</a>`
      else
        msg = `Votre candidature a été acceptée pour <a href=/recruitment/${rId}>ce recrutement</a>`
      isSpecial = true
    }

    if (!read && !isMyMsg) {
      const userInListDOM = userlistDOM.querySelector('.uid' + strangerId)
      userInListDOM.classList.add('unread')
      document.getElementById('chat-open-btn').classList.add('unread')
    }
    const msgDivDOM = document.createElement('div')
    msgDivDOM.className = 'message uid' + strangerId
    if (isMyMsg) msgDivDOM.classList.add('mine')
    if (isSpecial) msgDivDOM.classList.add('special')

    msgDivDOM.innerHTML = `
      <p>${msg}</p>
    `
    const msgsDOM = document
      .getElementById('chat-msg-container')
      .querySelector(`.messages.uid${strangerId}`)
    const fullScroll =
      msgsDOM.scrollTop - msgsDOM.scrollHeight + msgsDOM.offsetHeight == 0
    msgsDOM.append(msgDivDOM)
    if (fullScroll) msgsDOM.scrollTop = msgsDOM.scrollHeight
  }

  function clear() {
    document.getElementById('chat-userlist').innerHTML = ''
    document.getElementById('chat-msg-container').innerHTML = ''
  }

  /* User selection */
  document.addEventListener('click', e => {
    if (!e.target.matches('#chat-userlist .user')) return
    const isSelected = e.target.classList.contains('selected')
    for (const e of document.getElementById('chat-userlist').children)
      e.classList.remove('selected')
    if (!isSelected) {
      selectedUserID = parseInt(
        Array.from(e.target.classList)
          .find(s => s.startsWith('uid'))
          .substring(3)
      )
      e.target.classList.add('selected')

      e.target.classList.remove('unread')
      if (!e.target.parentElement.querySelector('.unread'))
        document.getElementById('chat-open-btn').classList.remove('unread')
      socket.emit('read-all-from-user', { userId: selectedUserID })
    } else selectedUserID = null
    for (const e of document.getElementById('chat-msg-container').children) {
      if (e.classList.contains('uid' + selectedUserID)) {
        e.classList.remove('hidden')
        e.scrollTop = e.scrollHeight
      } else e.classList.add('hidden')
    }
  })

  /* SOCKET IO */

  socket.on('connection-status', response => {
    if (response.status !== 'CONNECTED') return socket.disconnect()

    myUserId = response.yourId
    for (const { from_id, to_id, message, read } of response.msgHistory)
      addMsg(message, from_id, to_id, read)
    document.getElementById('chat-open-btn').classList.remove('hidden')
    console.log('Socket.io connected')
  })
  socket.on('disconnect', () => {
    clear()
    myUserId = null
    selectedUserID = null
    console.log('Socket.io disconnected')
    document.getElementById('chat-open-btn').classList.add('hidden')
    document.getElementById('chat').classList.add('hidden')
  })

  socket.on('privmsg', ({ msg, fromId, read }) => {
    if (selectedUserID === fromId) {
      read = true
      socket.emit('read-all-from-user', { userId: fromId })
    }
    addMsg(msg, fromId, myUserId, read)
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
