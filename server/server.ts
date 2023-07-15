import { config } from "dotenv"
config()

import fastify from "fastify"
import cors from "@fastify/cors"
import { userRoutes } from "./routes/users"

const app = fastify()
app.register(cors, {origin: process.env.CLIENT_URL }) //origin: process.env.CLIENT_URL
app.register(userRoutes)


app.listen({ port: parseInt(process.env.PORT!), host: '0.0.0.0'})
