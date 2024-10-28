import express from "express"
import ViteExpress from "vite-express"
import cors from "cors"
import https from "https"
import fs from "fs"
import path from "path"


ViteExpress.config( { mode: process.env.NODE_ENV } )

const app = express()

app.use( cors() )

app.get( "/hello", ( req, res ) => { res.send( "Hello Vite + React!" ) } )

if ( process.env.NODE_ENV === "production" )
{
  const certFile = process.env.CERT_FILE
  const keyFile = process.env.CERTKEY_FILE

  const options = {
    key: fs.readFileSync( path.resolve( keyFile ) ),
    cert: fs.readFileSync( path.resolve( certFile ) ),
  }

  const server = https.createServer( options, app )

  server.listen( 3443, () => console.log( "Server is listening on port 3000..." ) )
}

ViteExpress.listen( app, 3000, () => console.log( "Server is listening on port 3000..." ) )
