import "./index.css"

import React from "react"
import { useState } from 'react'
import ReactDOM from "react-dom/client"

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import App from "./App"


ReactDOM.createRoot( document.getElementById( "root" ) ).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="auto">
      <Notifications />
      <App />
    </MantineProvider>
  </React.StrictMode>,
)
