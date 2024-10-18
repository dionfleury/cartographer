import { Tabs, Space, Flex, rem } from '@mantine/core'
import { IconIndentIncrease, IconCode, IconCodeDots } from '@tabler/icons-react'

import { Editor } from "@monaco-editor/react"

export const CodeEditor = () =>
{
    const iconStyle = { width: rem( 16 ), height: rem( 16 ) }

    return (
        <Tabs defaultValue="sld_1">
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
            </Tabs.List>

            <Tabs.Panel value="sld_1" >
                    <Editor height="calc(100vh - 102px)" defaultLanguage='xml' theme='vs-dark' />
            </Tabs.Panel>

            <Tabs.Panel value="YSLD">
                Messages tab content
            </Tabs.Panel>

            <Tabs.Panel value="Mapbox">
                Settings tab content
            </Tabs.Panel>
        </Tabs>
    )
}