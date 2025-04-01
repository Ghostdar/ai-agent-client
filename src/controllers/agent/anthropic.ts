import type { RequestHandler } from 'express'
import config from '../../config'
import { generateUniqueKey } from '../../utils/uniqueKey'
import { MCPClient } from './anthropic-model';
import path from 'node:path';


const anthropicSessionMap = new Map<string, MCPClient>();



export const newAnthropicSession: RequestHandler = (_req, res) => {
    if(anthropicSessionMap.size >= 10 ) {
        res.status(429).json({
            message: 'Too many sessions'
        });
        return;
    }
    const sessionId = generateUniqueKey(); 
    anthropicSessionMap.set(sessionId, new MCPClient());
    console.log(anthropicSessionMap)

    res.status(200).json({
        chatId: sessionId,
        version: config.version
    });
}




export const sendMessage: RequestHandler = async (_req, res) => {
    const { chatId, message } = _req.query;
    if(!chatId || !message) {
        res.status(400).json({
            message: 'params are required'
        });
        return;
    }
    const client = anthropicSessionMap.get(chatId as string);

    if(!client) {
        res.status(404).json({
            message: 'Session not found'
        });
        return;
    }

    try {
        const serverPath = path.resolve(process.cwd(), 'dist/mcp-package/google-search.js');
        await client.connectToServer(serverPath);
        const response = await client.processQuery(message as string);
        console.log(response)
        res.status(200).json({
            message: response.text,
            toolCalls: response.toolCalls ?? [],
            version: config.version
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error sending message'
        });
    }

}
