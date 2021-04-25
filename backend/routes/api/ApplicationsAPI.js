import { ok, err } from './ApiTools.js'
import { authHookJson } from '../../hooks/AuthHook.js'
import db from '../../database.js'
import { io } from '../../server.js'
import { sendPrivMsg } from '../../socketio/initSocketIO.js'
import { ApplicationStatus } from '../../misc/Applications.js'

export default function applicationsAPI({ app }) {
  app.get('/api/applications/:id/accept/:status', authHookJson, async (req, res) => {
    const { status } = req.params
    if (status != ApplicationStatus.REFUSED && status != ApplicationStatus.VALIDATED)
      return res.send(err('Status invalide'))
    const application = await db('Applications').where('id', '=', req.params.id).first()
    if (!application) return res.send(err('ID de candidature introuvable'))
    if (application.status) return res.send(err('La candidature a déjà été traitée'))
    if (!application.recruitment_id) return res.send(err('Recrutement introuvable wtf'))
    const recruitment = await db('Recruitments')
      .where('id', '=', application.recruitment_id)
      .first()
    if (recruitment.user_id != res.locals.user.id)
      return res.send(err('Vous ne pouvez pas gerer les recrutements des autres'))
    await db('Applications').update({ status }).where('id', '=', req.params.id)
    res.send(ok())
    if (status == ApplicationStatus.VALIDATED) {
      await sendPrivMsg(
        io,
        '__application_accepted;recruitment:' + recruitment.id,
        res.locals.user.id,
        application.user_id
      )
    }
  })
}
