import { Circle, Fill, Stroke, Style } from 'ol/style.js'

const fill = new Fill( { color: 'rgba(100,100,100,0.25)', } )
const stroke = new Stroke( { color: 'red', width: 1.25, } )

const image = new Circle( { fill: fill, stroke: stroke, radius: 5, } )


export const DefaultPointStyle = new Style({
    image: image
})

export const DefaultLineStyle = new Style({
    stroke: stroke
})

export const DefaultPolygonStyle = new Style({
    stroke: stroke,
    fill: fill,
})
