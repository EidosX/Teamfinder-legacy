import db from '../../database.js'

export default function searchPage({ app }) {
  app.get('/search/:search', async (req, res) => {
    const categories = await db('Categories')
    const recruitments = await db('Recruitments')
      .where('title', 'LIKE', `%${req.params.search}%`)
      .orderBy('created', 'desc')
    const users = await db('Users') // TODO: filter only needed
    res.render('home', { categories, recruitments, users })
  })
}
