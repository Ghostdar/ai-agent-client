import express from 'express'
import { sendMessage, newAnthropicSession } from '../controllers/agent'

const root = express.Router()


root.get('/sendMessage', sendMessage)
root.get('/newSession', newAnthropicSession)

export default root