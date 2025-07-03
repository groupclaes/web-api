import server from './src'
import config from './config'

const main = async function () {
  const fastify = await server(config);

  ['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, async () => {
      await fastify?.close()
      process.exit(0)
    })
  })
}

main()