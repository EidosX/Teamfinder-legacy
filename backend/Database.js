import knexPlugin from 'knex'
import fs from 'fs'
import path from 'path'

const database = async dbFile => {
  let knex = knexPlugin({
    client: 'sqlite3',
    connection: { filename: dbFile }
  })
  if (!fs.existsSync(dbFile)) {
    fs.mkdirSync(path.dirname(dbFile), { recursive: true })
    await createDb(knex)
  }
  return knex
}
export default database

const Rank = {
  USER: 'USER',
  MOD: 'MOD'
}

const ApplicationStatus = {
  REJECTED: 'REJECTED',
  WAITING: 'WAITING',
  ACCEPTED: 'ACCEPTED'
}

async function createDb(knex) {
  await knex.schema
    .createTable('Users', table => {
      table.increments('id')
      table.string('nickname').notNullable().unique()
      table.string('email').notNullable().unique()
      table.string('rank').nullable().defaultTo(Rank.USER)
    })
    .createTable('SocialMedias', table => {
      table.increments('id')
      table.string('name')
    })
    .createTable('SocialLinks', table => {
      table.integer('social_media_id').references('SocialMedias.id')
      table.integer('user_id').references('Users.id').notNullable()
      table.string('link').notNullable()
      table.primary(['social_media_id', 'user_id'])
    })

    .createTable('Categories', table => {
      table.increments('id')
      table.string('title').notNullable()
    })
    .createTable('Recruitments', table => {
      table.increments('id')
      table.integer('user_id').references('Users.id').notNullable()
      table.integer('category_id').references('Categories.id').notNullable()
      table.string('title').notNullable()
      table.string('description').notNullable()
    })
    .createTable('Applications', table => {
      table.increments('id')
      table.integer('user_id').references('Users.id').notNullable()
      table
        .integer('recruitment_id')
        .references('Recruitments.id')
        .notNullable()
      table.string('message').notNullable()
      table.string('status').notNullable().defaultTo('WAITING')
    })
}
