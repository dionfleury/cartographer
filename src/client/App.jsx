import { useState } from "react"
import "./App.css"

import { Grid, Burger, Group, Skeleton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { Header } from "./components/Header"
import { MapView } from "./components/MapView"
import { CodeEditor } from "./components/CodeEditor"

function App()
{
  const [ count, setCount ] = useState( 0 )
  const [ opened, { toggle } ] = useDisclosure()

  return (


    <div className="app">

      <Header />

      <Grid w="calc(100vw - 8px)">
        <Grid.Col span={4}>1</Grid.Col>
        <Grid.Col span={4}><CodeEditor /></Grid.Col>
        <Grid.Col span={4}><MapView /></Grid.Col>

      </Grid>


    </div>








    // <div className="App">
    //   <div>
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src="/vite.svg" className="logo" alt="Vite logo" />
    //     </a>

    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount( ( count ) => count + 1 )}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR!
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    //   <ThemeSwitcher />
    // </div>
  )
}

export default App
