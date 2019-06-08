import convict from 'convict'

const definitions = {
  SERVER_URL: {
    env: 'VUE_APP_SERVER_URL',
    format: 'url',
    default: 'http://localhost:3000',
  },
  IMDB_URL: {
    env: 'VUE_APP_IMDB_URL',
    format: 'url',
    default: 'https://imdb.com',
  },
  IMAGE_PATH_WIDTH_500: {
    env: 'VUE_APP_IMAGE_PATH_WIDTH_500',
    format: 'url',
    default: 'https://image.tmdb.org/t/p/w500',
  },
}

const schema = convict(definitions)
schema.validate({ allowed: 'strict' })

const config = name => {
  if (schema.get(name) != null) return schema.get(name)
  throw Error(`environment variable ${definitions[name].env} is required`)
}

/*
 * Fail fast!
 */
Object.keys(definitions).forEach(key => {
  try {
    config(key)
  } catch (err) {
    throw new Error(`Missing config for ${key}`)
  }
})

export default config
