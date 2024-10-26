import { Tabs, Space, Flex, rem, useMantineColorScheme } from '@mantine/core'
import { IconIndentIncrease, IconCode, IconCodeDots, IconLayersSubtract, IconBrandJavascript } from '@tabler/icons-react'

import { Editor } from "@monaco-editor/react"
import { useEffect, useState, useRef } from 'react'

import { generateSLDStyle, JSLDtoSLD } from '../scripts/style'
import { useMapStylingContext } from '../context/MapStylingContext'


export const CodeEditorPanel = () =>
{
    const iconStyle = { width: rem( 16 ), height: rem( 16 ) }

    const { colorScheme, setColorScheme } = useMantineColorScheme()

    const [ olStyle, setOlStyle ] = useState( null )

    const { style } = useMapStylingContext()

    const theme = colorScheme == 'dark' ? 'vs-dark' : 'light'

    const editorRefJSLD = useRef( null )
    const editorRefSLD = useRef( null )
    const editorRefYSLD = useRef( null )
    const editorRefMapBox = useRef( null )
    const editorRefOL = useRef( null )

    const handleFormat = ( editorRef ) => { if ( editorRef.current ) editorRef.current.getAction( 'editor.action.formatDocument' ).run() }

    const handleEditorMount = ( editor, monaco, editorRef ) => { editorRef.current = editor }


    useEffect( () =>
    {
        if ( style == {} ) return
        handleFormat( editorRefJSLD )
        // handleFormat( editorRefSLD )
    }, [ style ] )


    return (
        <Tabs defaultValue="JSLD" h="100%">
            <Tabs.List>
                <Tabs.Tab value="JSLD" leftSection={<IconBrandJavascript style={iconStyle} />}>
                    JSLD
                </Tabs.Tab>
                <Tabs.Tab value="sld_1" leftSection={<IconCode style={iconStyle} />}>
                    SLD 1.0
                </Tabs.Tab>
                <Tabs.Tab value="YSLD" leftSection={<IconIndentIncrease style={iconStyle} />}>
                    YSLD
                </Tabs.Tab>
                <Tabs.Tab value="Mapbox" leftSection={<IconCodeDots style={iconStyle} />}>
                    Mapbox
                </Tabs.Tab>
                <Tabs.Tab value="OpenLayers" leftSection={<IconLayersSubtract style={iconStyle} />}>
                    OpenLayers
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="JSLD" h="calc(100% - 38px)">
                <Editor
                    value={JSON.stringify( style )}
                    height="100%"
                    defaultLanguage='json'
                    theme={theme}
                    onMount={( editor, monaco ) => handleEditorMount( editor, monaco, editorRefJSLD )} />
            </Tabs.Panel>
            <Tabs.Panel value="sld_1" h="calc(100% - 38px)">
                <Editor
                    value={JSLDtoSLD( style )}
                    height="100%"
                    defaultLanguage='xml'
                    theme={theme}
                    onMount={( editor, monaco ) => handleEditorMount( editor, monaco, editorRefSLD )} />
            </Tabs.Panel>
            <Tabs.Panel value="YSLD" h="calc(100% - 38px)">
                <Editor
                    height="100%" defaultLanguage='yaml'
                    theme={theme}
                    onMount={( editor, monaco ) => handleEditorMount( editor, monaco, editorRefSLD )} />
            </Tabs.Panel>
            <Tabs.Panel value="Mapbox" h="calc(100% - 38px)">
                <Editor
                    height="100%"
                    defaultLanguage='json'
                    theme={theme}
                    onMount={( editor, monaco ) => handleEditorMount( editor, monaco, editorRefSLD )} />
            </Tabs.Panel>
            <Tabs.Panel value="OpenLayers" h="calc(100% - 38px)">
                <Editor
                    value={olStyle}
                    height="100%"
                    defaultLanguage='javascript'
                    theme={colorScheme == 'dark' ? 'vs-dark' : 'light'} />
            </Tabs.Panel>
        </Tabs>
    )
}