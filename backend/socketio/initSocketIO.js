import db from '../database.js'

export default function initSocketIO({ io }) {
  io.on('connection', async socket => {
    if (socket.request.session.userId) {
      socket.user = await db('Users')
        .select('id', 'nickname', 'profile_pic_url')
        .where('id', '=', socket.request.session.userId)
        .first()

      const msgHistory = await db('Messages')
        .where('from_id', '=', socket.user.id)
        .orWhere('to_id', '=', socket.user.id)
        .select('id', 'from_id', 'to_id', 'message', 'read')

      socket.emit('connection-status', {
        status: 'CONNECTED',
        yourId: socket.user.id,
        msgHistory
      })
    } else {
      socket.emit('connection-status', { status: 'NOT CONNECTED' })
    }

    socket.on('privmsg', async ({ msg, toId }) => {
      if (!socket.user) return
      if (!toId || !msg) return
      if (toId === socket.user.id) return
      for (const [_, s] of io.of('/').sockets) {
        if (s.user?.id == toId) s.emit('privmsg', { msg, fromId: socket.user.id })
      }
      await db('Messages').insert({ from_id: socket.user.id, to_id: toId, message: msg })
    })

    socket.on('read-all-from-user', async ({ userId }) => {
      if (!socket.user?.id) return
      if (!parseInt(userId)) return
      await db('Messages')
        .update({ read: 1 })
        .where('from_id', '=', userId)
        .andWhere('to_id', '=', socket.user.id)
    })
  })
}
