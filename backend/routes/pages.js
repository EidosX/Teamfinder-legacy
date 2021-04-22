import db from '../database.js'

export default async function initPagesRoutes({ app }) {
  const categories = await db('Categories')
  app.get('/', (req, res) => res.render('home', { categories }))
}
