import { authHook } from '../../hooks/AuthHook.js'

export default function deleteAccountPage({ app }) {
  app.get('/delete-account', authHook, (req, res) => res.render('delete-account'))
}
