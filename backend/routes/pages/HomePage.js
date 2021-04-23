import db from '../../database.js'

export default function homePage({ app }) {
  app.get('/', async (req, res) => {
    const categories = await db('Categories')
    const recruitments = await db('Recruitments')
    const users = await db('Users') // TODO: filter only needed
    res.render('home', { categories, recruitments, users })
  })
}
