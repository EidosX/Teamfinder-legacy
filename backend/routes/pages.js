import db from '../database.js'

export default async function initPagesRoutes({ app }) {
  const categories = await db('Categories')
  const recruitments = await db('Recruitments')
  for (let i = 0; i < 10; ++i)
    recruitments.push({
      id: 152,
      user_id: 1,
      category_id: 2,
      title: 'Jsp lol, ca va?',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt ex
        consequuntur eius facilis nam excepturi praesentium debitis corrupti, nobis
        corporis commodi fuga asperiores molestias voluptatem. Necessitatibus libero
        nisi deleniti natus nihil, et sed quae error pariatur veniam veritatis quas?
        Corporis molestias eaque necessitatibus quibusdam sed at illo voluptatem, quos
        iste, neque error? Iusto delectus soluta amet, culpa eveniet, perferendis
        quisquam adipisci earum saepe, dolores sint. Porro eveniet labore asperiores
        vitae temporibus est harum, dolorum aliquid animi nisi expedita itaque id,
        reprehenderit provident ducimus aspernatur delectus quidem reiciendis ad
        consectetur ex voluptatum veritatis corporis voluptatem. Praesentium earum vero
        nostrum quisquam dolore!`,
      created: '2021-04-22 19:58:06'
    })
  const users = await db('Users')
  users.push({
    id: 1,
    nickname: 'Red',
    email: 'red@example.com',
    rank: 0
  })
  app.get('/', (req, res) =>
    res.render('home', { categories, recruitments, users })
  )
}
