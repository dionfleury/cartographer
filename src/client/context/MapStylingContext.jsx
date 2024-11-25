import { createContext, useContext, useReducer } from "react"
import { produce } from "immer"


export const MapStylingContext = createContext( null )
export const DispatchContext = createContext( null )

export const MapStylingContextProvider = ( { children } ) =>
{
    const [ state, dispatch ] = useReducer( mapStylingReducer, initialState )
    return (
        <MapStylingContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </MapStylingContext.Provider>
    )
}

export const useMapStylingContext = () => useContext( MapStylingContext )
export const useDispatch = () => useContext( DispatchContext )

function mapStylingReducer( state, action )
{
    return produce( state, draft =>
    {
        // TODO: Find a way to define reused variables once without throwing errors
        // const symbolizers = draft.style.NamedLayers[0].UserStyles[0].FeatureTypeStyles[0].Rules[action.ruleIndex]
        switch ( action.type )
        {
            case 'setDataSource': {
                draft.dataSource = action.dataSource
                break
            }
            case 'setStyle': {
                draft.style = action.style
                break
            }
            case 'setSymbolizer': {
                const rules = draft.style?.NamedLayers[ 0 ]?.UserStyles[ 0 ]?.FeatureTypeStyles[ 0 ]?.Rules
                // draft.style.Rules[ action.ruleIndex ].Symbolizers[ action.symbolizerIndex ] = action.symbolizer
                rules[ action.ruleIndex ].Symbolizers[ action.symbolizerIndex ] = action.symbolizer
                break
            }
            case 'addSymbolizer': {
                const rules = draft.style?.NamedLayers[ 0 ]?.UserStyles[ 0 ]?.FeatureTypeStyles[ 0 ]?.Rules
                // const rule = draft.style.Rules[ action.ruleIndex ]
                const rule = rules[ action.ruleIndex ]
                rule.Symbolizers.push( rule.Symbolizers[ rule.Symbolizers.length - 1 ] )
                break
            }
            case 'removeSybolizer': {
                const rules = draft.style?.NamedLayers[ 0 ]?.UserStyles[ 0 ]?.FeatureTypeStyles[ 0 ]?.Rules
                // draft.style.Rules[ action.ruleIndex ].Symbolizers.splice( action.symbolizerIndex )
                rules[ action.ruleIndex ].Symbolizers.splice( action.symbolizerIndex )
                break
            }
            case 'moveSymbolizerUp': {
                const { symbolizerIndex, ruleIndex } = action
                const rules = draft.style?.NamedLayers[ 0 ]?.UserStyles[ 0 ]?.FeatureTypeStyles[ 0 ]?.Rules
                // const symbolizers = draft.style.Rules[ ruleIndex ].Symbolizers;
                const symbolizers = rules[ ruleIndex ].Symbolizers;
                [ symbolizers[ symbolizerIndex - 1 ], symbolizers[ symbolizerIndex ] ] = [ symbolizers[ symbolizerIndex ], symbolizers[ symbolizerIndex - 1 ] ]
                break
            }
            case 'moveSymbolizerDown': {
                const { symbolizerIndex, ruleIndex } = action
                const rules = draft.style?.NamedLayers[ 0 ]?.UserStyles[ 0 ]?.FeatureTypeStyles[ 0 ]?.Rules
                // const symbolizers = draft.style.Rules[ ruleIndex ].Symbolizers;
                const symbolizers = rules[ ruleIndex ].Symbolizers;
                [ symbolizers[ symbolizerIndex ], symbolizers[ symbolizerIndex + 1 ] ] = [ symbolizers[ symbolizerIndex + 1 ], symbolizers[ symbolizerIndex ] ]
                break
            }
            case "filterChange": {
                const { ruleIndex, filter } = action
                const rule = draft.style?.NamedLayers[ 0 ]?.UserStyles[ 0 ]?.FeatureTypeStyles[ 0 ]?.Rules[ ruleIndex ]
                rule.Filter = {
                    _type: filter.operator,
                    _attrib: `matchCase="${filter.matchCase}"`,
                    PropertyName: filter.attribute,
                    Literal: filter.value
                }
                break
            }
            case "filterClear": {
                const { ruleIndex } = action
                const rule = draft.style?.NamedLayers[ 0 ]?.UserStyles[ 0 ]?.FeatureTypeStyles[ 0 ]?.Rules[ ruleIndex ]
                rule.Filter = null
                break
            }
            case "ruleNameChange": {
                const { ruleIndex, ruleName, ruleTitle } = action
                const rule = draft.style?.NamedLayers[ 0 ]?.UserStyles[ 0 ]?.FeatureTypeStyles[ 0 ]?.Rules[ ruleIndex ]
                rule.Name = ruleName
                rule.Title = ruleTitle
                break
            }
            case "addRule": {
                const rules = draft.style?.NamedLayers[ 0 ]?.UserStyles[ 0 ]?.FeatureTypeStyles[ 0 ]?.Rules
                const lastRule = rules[rules.length -1]
                rules[rules.length] = {...lastRule, Filter: null}
                break
            }
            default:
                return state
        }
    } )
}

const initialState = {
    dataSource: {},
    style: {},
    helloWorld: { message: "HelloWorld" }
}