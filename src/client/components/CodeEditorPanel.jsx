import { Tabs, Space, Flex, rem, useMantineColorScheme } from '@mantine/core'
import { IconIndentIncrease, IconCode, IconCodeDots, IconLayersSubtract } from '@tabler/icons-react'

import { Editor } from "@monaco-editor/react"
import { useEffect, useState } from 'react'

import { generateSLDStyle } from '../scripts/style'


export const CodeEditorPanel = ( { style } ) =>
{
    const iconStyle = { width: rem( 16 ), height: rem( 16 ) }

    generateSLDStyle()

    const { colorScheme, setColorScheme } = useMantineColorScheme()

    const [ olStyle, setOlStyle ] = useState( null )

    useEffect( () =>
    {
        if ( style == null ) return

        console.log( style )
        let openLayersStyle = "import { Style, Fill, Stroke } from 'ol/style.js'\n\n"
        for ( const entry of style )
        {
            const declaration = `const style = new Style({\n`
            const fill = `\tfill: new Fill("${entry.rule.fill.color}"),\n`
            const stroke = `\tstroke: new Stroke("${entry.rule.stroke.color}"),\n`
            const close = "})"
            openLayersStyle += declaration
            openLayersStyle += fill
            openLayersStyle += stroke
            openLayersStyle += close

            setOlStyle( openLayersStyle )
        }

    }, [ style ] )

    return (
        <Tabs defaultValue="sld_1" h="100%">
            <Tabs.List>
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

            <Tabs.Panel value="sld_1" h="calc(100% - 38px)">
                <Editor height="100%" defaultLanguage='xml' theme={colorScheme == 'dark' ? 'vs-dark' : 'light'} />
            </Tabs.Panel>
            <Tabs.Panel value="YSLD" h="calc(100% - 38px)">
                <Editor height="100%" defaultLanguage='yaml' theme={colorScheme == 'dark' ? 'vs-dark' : 'light'} />
            </Tabs.Panel>
            <Tabs.Panel value="Mapbox" h="calc(100% - 38px)">
                <Editor height="100%" defaultLanguage='json' theme={colorScheme == 'dark' ? 'vs-dark' : 'light'} />
            </Tabs.Panel>
            <Tabs.Panel value="OpenLayers" h="calc(100% - 38px)">
                <Editor value={olStyle} height="100%" defaultLanguage='javascript' theme={colorScheme == 'dark' ? 'vs-dark' : 'light'} />
            </Tabs.Panel>
        </Tabs>
    )
}