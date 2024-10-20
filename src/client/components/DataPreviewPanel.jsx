import { Tabs, Space, Flex, rem, useMantineColorScheme } from '@mantine/core'
import { IconMap, IconSchema, IconTable, IconChartHistogram } from '@tabler/icons-react'

import { useEffect, useState } from 'react'

import { MapView } from "./MapView"
import { SchemaView } from './SchemaView'


const iconStyle = { width: rem( 16 ), height: rem( 16 ) }


export const DataPreviewPanel = ( { layer } ) =>
{


    return (
        <Tabs defaultValue="Map" h="100%">
            <Tabs.List>
                <Tabs.Tab value="Map" leftSection={<IconMap style={iconStyle} />}>
                    Map
                </Tabs.Tab>
                <Tabs.Tab value="Schema" leftSection={<IconSchema style={iconStyle} />}>
                    Schema
                </Tabs.Tab>
                <Tabs.Tab value="Table" leftSection={<IconTable style={iconStyle} />}>
                    Table
                </Tabs.Tab>
                <Tabs.Tab value="Histogram" leftSection={<IconChartHistogram style={iconStyle} />}>
                    Histogram
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="Map" h="calc(100% - 38px)">
                <MapView layer={layer} />
            </Tabs.Panel>
            <Tabs.Panel value="Schema" h="calc(100% - 38px)">
                <SchemaView layer={layer} />
            </Tabs.Panel>
            <Tabs.Panel value="Table" h="calc(100% - 38px)">
            </Tabs.Panel>
            <Tabs.Panel value="Histogram" h="calc(100% - 38px)">
            </Tabs.Panel>
        </Tabs>
    )
}