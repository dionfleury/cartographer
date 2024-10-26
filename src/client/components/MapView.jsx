import React, { useState, useEffect } from 'react'
import { Accordion, Drawer, Flex, ScrollArea, Table, Text } from '@mantine/core'

import { Map, View } from 'ol'
import { Vector as VectorLayer } from 'ol/layer.js'
import VectorSource from 'ol/source/Vector'
import TileLayer from 'ol/layer/Tile'
import GeoJSON from 'ol/format/GeoJSON'
import OSM from 'ol/source/OSM'
import { bbox as bboxStrategy } from 'ol/loadingstrategy.js'
import 'ol/ol.css'

import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'



import { useMapStylingContext } from '../context/MapStylingContext'
import { JSLDtoOpenLayers } from '../scripts/style'
import { useDisclosure } from '@mantine/hooks'

export const MapView = () =>
{
    const { style, dataSource } = useMapStylingContext()
    const [ drawerContents, setDrawerContents ] = useState( null )
    const [ opened, { open, close } ] = useDisclosure( false )


    // TODO: Add way of adding other projections at runtime
    proj4.defs( "EPSG:28992", "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs" )
    register( proj4 )

    const osmLayer = new TileLayer( { preload: Infinity, source: new OSM() } )

    const [ geoJSONFormat, setGeoJSONFormat ] = useState( new GeoJSON() )

    const [ wfsSource ] = useState( new VectorSource( {
        format: geoJSONFormat,
        url: null,
        strategy: bboxStrategy
    } ) )

    const [ wfsLayer ] = useState( new VectorLayer( {
        source: wfsSource,
        style: null
    } ) )
    const [ highlightLayer ] = useState( new VectorLayer( {
        source: new VectorSource(),
        style: {
            'stroke-color': 'rgba(25, 113, 194, 1)',
            'stroke-width': 8,
            "shape-stroke-color": 'rgba( 25, 113, 194, 1 )',
            "shape-points": 4,
            "shape-radius": 8,
            "shape-radius2": 0.01,
            "shape-stroke-width": 8,
            "shape-angle": Math.PI / 4
        }
    } ) )

    const [ map ] = useState( new Map( {
        layers: [ osmLayer, wfsLayer, highlightLayer ],
        view: new View( {
            projection: 'EPSG:3857',
            center: [ 0, 0 ],
            zoom: 0,
        } ),
    } ) )

    function handleFeatureClick( event )
    {
        const features = map.getFeaturesAtPixel( event.pixel )
        if ( features.length < 1 ) return

        highlightLayer.getSource().addFeatures( features )

        const tables = features.map( feature =>
        {
            const rows = Object.keys( feature.values_ ).sort().map( key =>
            {
                if ( key === "geometry" ) return
                return ( <Table.Tr key={key}><Table.Td><Text fw={500} ta="right">{key}</Text></Table.Td><Table.Td>{feature.values_[ key ]}</Table.Td></Table.Tr> )
            } )
            return (
                <Table >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Field</Table.Th>
                            <Table.Th>Value</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            )
        } )

        if ( features.length === 1 ) return setDrawerContents( tables[ 0 ] )

        const accordionItems = tables.map( ( table, index ) =>
        {
            return (
                <Accordion.Item key={index} value={`feature-${index}`}>
                    <Accordion.Control>Feature {index + 1}</Accordion.Control>
                    <Accordion.Panel>{table}</Accordion.Panel>
                </Accordion.Item>
            )
        } )
        return setDrawerContents( ( <Accordion defaultValue="feature-0">{accordionItems}</Accordion> ) )

    }
    function handleDrawerClose()
    {
        highlightLayer.getSource().clear()
        close()
    }

    useEffect( () => { if ( drawerContents ) open() }, [ drawerContents ] )

    useEffect( () =>
    {
        if ( Object.keys( dataSource ).length === 0 ) return

        // console.log( [ style, dataSource ] )

        setGeoJSONFormat( new GeoJSON( { featureProjection: dataSource.CRS } ) )
        wfsSource.setUrl( ( extent ) => { return ( dataSource.getFeatureURL + "&bbox=" + extent.join( ',' ) + ',EPSG:3857' ) } )
        wfsSource.refresh()

        wfsLayer.setStyle( dataSource.defaultStyle )

    }, [ dataSource ] )

    useEffect( () =>
    {
        if ( Object.keys( style ).length === 0 ) return

        wfsLayer.setStyle( JSLDtoOpenLayers( style ) )
    }, [ style ] )

    useEffect( () =>
    {
        map.setTarget( "map" )
        map.on( "click", handleFeatureClick )
        return () =>
        {
            map.setTarget( null )
            map.removeEventListener( "click", handleFeatureClick )
        }
    }, [] )

    return (
        <Flex direction="column" p="4px" h="100%">
            <div style={{ height: '100%', width: '100%' }} id="map" className="map-container" />
            <Drawer offset={16} scrollAreaComponent={ScrollArea.Autosize} size="xl" radius="md" opened={opened} onClose={handleDrawerClose} title="Feature Info">
                {drawerContents}
            </Drawer>
        </Flex>
    )

}