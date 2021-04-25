import db from '../../database.js'

export const homePageMiddleware = async res => {
  const categories = await db('Categories')
  const recruitments = await db('Recruitments').orderBy('created', 'desc')
  const users = await db('Users') // TODO: filter only needed
  res.render('home', { categories, recruitments, users })
}

export default function homePage({ app }) {
  app.get('/', (req, res) => homePageMiddleware(res))
}
