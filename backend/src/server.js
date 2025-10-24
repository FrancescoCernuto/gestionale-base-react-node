import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use((req, res, next) => {
  req.companyId = req.header('x-company-id') || 'Bar Fancellis'
  next()
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true, company: req.companyId, ts: new Date().toISOString() })
})

import fatture from '../routes/fatture.js'
import utenze from '../routes/utenze.js'
import fornitoriBeni from '../routes/fornitoriBeni.js'
import fornitoriServizi from '../routes/fornitoriServizi.js'

app.use('/api/fatture', fatture)
app.use('/api/utenze', utenze)
app.use('/api/fornitori-beni', fornitoriBeni)
app.use('/api/fornitori-servizi', fornitoriServizi)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`✅ Backend pronto su http://localhost:${PORT}`)
})
