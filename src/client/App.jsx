import { useState, createContext } from "react"
import "./App.css"

import { Grid, Burger, Group, Skeleton, Flex } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { Header } from "./components/Header"
import { CodeEditorPanel } from "./components/CodeEditorPanel"
import { StylingPanel } from "./components/StylingPanel"
import { DataPreviewPanel } from "./components/DataPreviewPanel"
import { WFSLayerSelector } from "./components/WFSLayerSelector"

import { MapStylingContextProvider } from "./context/MapStylingContext"

function App()
{
  const [ count, setCount ] = useState( 0 )
  const [ opened, { toggle } ] = useDisclosure()

  const [ selectedLayer, setSelectedLayer ] = useState( null )
  const [ currentStyle, setCurrentStyle ] = useState( null )

  function handleLayerSelected( layer ) { setSelectedLayer( layer ) }
  function handleStyleChanged( style ) { setCurrentStyle( style ) }

  return (


    <div className="app">
      <Header />

      <MapStylingContextProvider>
        <Grid gutter="0px" w="100vw" h="calc(100vh - 56px)">
          <Grid.Col span={4}>
            <Flex direction="column" align="stretch" h="100%">
              <WFSLayerSelector onLayerSelected={handleLayerSelected} />
              <StylingPanel layer={selectedLayer} onStyleChanged={handleStyleChanged} />
            </Flex>
          </Grid.Col>
          <Grid.Col span={4}>
            <CodeEditorPanel style={currentStyle} />
          </Grid.Col>
          <Grid.Col h="100%" span={4}>
            <DataPreviewPanel layer={selectedLayer} style={currentStyle} />
          </Grid.Col>
        </Grid>
      </MapStylingContextProvider>

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

    // </div>
  )
}

export default App
