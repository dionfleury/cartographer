import React, { useState, useEffect, useRef } from 'react'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import 'ol/ol.css'
import { DataLoader } from './DataLoader'



export const MapView = () =>
{

    useEffect( () =>
    {
        const osmLayer = new TileLayer( {
            preload: Infinity,
            source: new OSM(),
        } )

        const map = new Map( {
            target: "map",
            layers: [ osmLayer ],
            view: new View( {
                center: [ 0, 0 ],
                zoom: 0,
            } ),
        } )
        return () => map.setTarget( null )
    }, [] )

    return (
        <div>
            <DataLoader />
            <div style={{ height: '600px', width: '100%' }} id="map" className="map-container" />
        </div>
    )

    return <div id="map" style={{ width: '100%', height: '400px' }}></div>
}