import { config } from "dotenv"
config()

import fastify from "fastify"
import cors from "@fastify/cors"
import { userRoutes } from "./routes/users"

const app = fastify()
app.register(cors, { origin: false,
    methods: ['GET', 'PUT', 'POST'],
    preflight:false})
app.register(userRoutes)

app.listen({ port: parseInt(process.env.PORT!) })
