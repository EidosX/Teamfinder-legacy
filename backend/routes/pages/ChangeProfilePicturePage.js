import { authHook } from '../../hooks/AuthHook.js'
import multer from 'multer'
import db from '../../database.js'
import fs from 'fs'
import path from 'path'

const storageDir = path.resolve('res/static/uploads/profilepics')
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true })

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, storageDir),
    filename: (req, file, cb) => cb(null, req.session.userId + '')
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true)
    else cb(null, false)
  }
})

export default function changeProfilePicturePage({ app }) {
  app.get('/change-profile-picture', authHook, (req, res) => {
    res.render('change-profile-picture')
  })
  app.post(
    '/change-profile-picture',
    [authHook, upload.single('profilepic')],
    async (req, res) => {
      if (!req.file) return res.send('Veuillez envoyer une image')
      await db('Users')
        .update({
          profile_pic_url: '/' + 'static/uploads/profilepics/' + req.session.userId
        })
        .where('id', '=', req.session.userId)
      res.redirect('/users/me')
    }
  )
}
