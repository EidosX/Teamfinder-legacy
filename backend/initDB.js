import knexPlugin from 'knex'
import path from 'path'
import fs from 'fs'
import { Ranks } from './misc/Ranks.js'
import { ApplicationStatus } from './misc/Applications.js'
import { DefaultCategories } from './misc/Categories.js'

const dbPath = path.resolve('res/db/sqlite.db')
const knex = knexPlugin({
  client: 'sqlite3',
  connection: {
    filename: dbPath
  },
  useNullAsDefault: true
})
if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath))
if (!fs.existsSync(dbPath)) {
  await knex.schema.createTable('Users', table => {
    table.increments('id')
    table.string('nickname').unique()
    table.string('email').unique()
    table.integer('rank').notNullable().defaultTo(Ranks.DEFAULT)
    table.string('facebook').nullable().defaultTo(null)
    table.string('twitter').nullable().defaultTo(null)
  })

  await knex.schema.createTable('Categories', table => {
    table.increments('id')
    table.string('title').notNullable()
  })
  DefaultCategories.forEach(
    async title => await knex('Categories').insert({ title })
  )

  await knex.schema.createTable('Recruitments', table => {
    table.increments('id')
    table.integer('user_id').unsigned().references('Users')
    table.integer('category_id').unsigned().references('Categories')
    table.string('title').notNullable()
    table.string('description').notNullable()
  })

  await knex.schema.createTable('Applications', table => {
    table.increments('id')
    table.integer('user_id').unsigned().references('Users')
    table.integer('recruitment_id').unsigned().references('Recruitments')
    table.string('message').notNullable()
    table.integer('status').defaultTo(ApplicationStatus.WAITING)
  })
}

export default knex
