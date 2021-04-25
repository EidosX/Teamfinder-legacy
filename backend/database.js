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
    table.string('password').notNullable()
    table.integer('rank').notNullable().defaultTo(Ranks.DEFAULT)
    table.string('profile_pic_url').nullable()
  })

  await knex.schema.createTable('Messages', table => {
    table.increments('id')
    table.integer('from_id').notNullable().unsigned().references('Users.id')
    table.integer('to_id').notNullable().unsigned().references('Users.id')
    table.string('message').notNullable()
    table.integer('read').notNullable().defaultTo(0)
    table.datetime('created').notNullable().defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('Categories', table => {
    table.increments('id')
    table.string('title').notNullable()
    table.string('color').notNullable()
  })
  DefaultCategories.forEach(
    async ({ title, color }) => await knex('Categories').insert({ title, color })
  )

  await knex.schema.createTable('Recruitments', table => {
    table.increments('id')
    table.integer('user_id').unsigned().references('Users.id')
    table.integer('category_id').unsigned().references('Categories.id')
    table.string('title').notNullable()
    table.string('description').notNullable()
    table.datetime('created').notNullable().defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('Applications', table => {
    table.increments('id')
    table.integer('user_id').unsigned().references('Users.id')
    table.integer('recruitment_id').unsigned().references('Recruitments.id')
    table.string('message').notNullable()
    table.integer('status').defaultTo(ApplicationStatus.WAITING)
    table.datetime('created').notNullable().defaultTo(knex.fn.now())
  })
}
export default knex
