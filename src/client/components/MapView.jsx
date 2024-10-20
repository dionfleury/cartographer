import React, { useState, useEffect } from 'react'
import { Flex } from '@mantine/core'

import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import 'ol/ol.css'

import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { bbox as bboxStrategy } from 'ol/loadingstrategy.js'
import { Vector as VectorLayer } from 'ol/layer.js'

import { DefaultPointStyle, DefaultLineStyle, DefaultPolygonStyle } from '../scripts/defaultstyles'

export const MapView = ( { layer, style } ) =>
{

    const osmLayer = new TileLayer( { preload: Infinity, source: new OSM() } )

    const [ wfsSource ] = useState( new VectorSource( {
        format: new GeoJSON(),
        url: null,
        strategy: bboxStrategy
    } ) )

    const [ wfsLayer ] = useState( new VectorLayer( {
        source: wfsSource,
        style: DefaultPolygonStyle
    } ) )

    const [ map ] = useState( new Map( {
        layers: [ osmLayer, wfsLayer ],
        view: new View( {
            center: [ 0, 0 ],
            zoom: 0,
        } ),
    } ) )


    useEffect( () =>
    {
        if ( layer == null ) return

        console.log( layer )
        wfsSource.setUrl( ( extent ) => { return ( layer.getfeature_url + "&bbox=" + extent.join( ',' ) + ',EPSG:3857' ) } )
        wfsSource.refresh()

        let style = DefaultPolygonStyle // use Polygon as default
        switch ( layer.geometryType )
        {
            case "Point":
            case "MultiPoint":
                style = DefaultPointStyle
                break
            case "LineString":
            case "MultiLineString":
                style = DefaultLineStyle
                break
        }

        wfsLayer.setStyle( style )

    }, [ layer, style, wfsSource, wfsLayer ] )


    useEffect( () => { return () => map.setTarget( "map" ) }, [ map ] )

    return (
        <Flex direction="column" p="4px" h="100%">
            {/* <WFSLayerSelector layer={handleLayerSelection} /> */}
            <div style={{ height: '100%', width: '100%' }} id="map" className="map-container" />
        </Flex>
    )

}