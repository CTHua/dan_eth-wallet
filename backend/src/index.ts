import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from "hono/cors"

const app = new Hono()

// CORS
app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/token_price', async (c) => {
  const symbol = c.req.query('symbol')
  const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`)
  const data = await response.json()
  console.log(data)
  return c.json(data)
})


serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
