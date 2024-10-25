import React, { useState, useEffect } from 'react'
import { Flex } from '@mantine/core'

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


import { DefaultPointStyle, DefaultLineStyle, DefaultPolygonStyle } from '../scripts/defaultstyles'

import { useMapStylingContext } from '../context/MapStylingContext'

export const MapView = ( { layer, style } ) =>
{
    const state = useMapStylingContext()

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
        style: DefaultPolygonStyle
    } ) )

    const [ map ] = useState( new Map( {
        layers: [ osmLayer, wfsLayer ],
        view: new View( {
            projection: 'EPSG:3857',
            center: [ 0, 0 ],
            zoom: 0,
        } ),
    } ) )


    useEffect( () =>
    {
        if ( state.dataSource == {} ) return
        setGeoJSONFormat( new GeoJSON( { featureProjection: state.dataSource.CRS } ) )
        wfsSource.setUrl( ( extent ) => { return ( state.dataSource.getFeatureURL + "&bbox=" + extent.join( ',' ) + ',EPSG:3857' ) } )
        wfsSource.refresh()
        wfsLayer.setStyle(state.dataSource.defaultStyle)
    }, [ state ] )


    useEffect( () =>
    {
        map.setTarget( "map" )
        return () => map.setTarget( null )
    }, [ map ] )

    return (
        <Flex direction="column" p="4px" h="100%">
            {/* <WFSLayerSelector layer={handleLayerSelection} /> */}
            <div style={{ height: '100%', width: '100%' }} id="map" className="map-container" />
        </Flex>
    )

}