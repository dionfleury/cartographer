import express from "express"
import ViteExpress from "vite-express"
import cors from "cors"

import 'dotenv/config'

ViteExpress.config( { mode: process.env.NODE_ENV } )

const app = express()

app.use( cors() )


app.get( "/hello", ( req, res ) =>
{
  res.send( "Hello Vite + React!" )
} )

ViteExpress.listen( app, 3000, () =>
  console.log( "Server is listening on port 3000..." ),
)
