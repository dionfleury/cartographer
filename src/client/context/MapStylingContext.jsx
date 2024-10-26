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
                draft.style.Rules[ action.ruleIndex ].Symbolizers[ action.symbolizerIndex ] = action.symbolizer
                break
            }
            case 'addSymbolizer': {
                const rule = draft.style.Rules[ action.ruleIndex ]
                rule.Symbolizers.push( rule.Symbolizers[ rule.Symbolizers.length - 1 ] )
                break
            }
            case 'removeSybolizer': {
                draft.style.Rules[ action.ruleIndex ].Symbolizers.splice( action.symbolizerIndex )
                break
            }
            case 'moveSymbolizerUp': {
                const { symbolizerIndex, ruleIndex } = action
                const symbolizers = draft.style.Rules[ ruleIndex ].Symbolizers;
                [ symbolizers[ symbolizerIndex - 1 ], symbolizers[ symbolizerIndex ] ] = [ symbolizers[ symbolizerIndex ], symbolizers[ symbolizerIndex - 1 ] ]
                break
            }
            case 'moveSymbolizerDown': {
                const { symbolizerIndex, ruleIndex } = action
                const symbolizers = draft.style.Rules[ ruleIndex ].Symbolizers;
                [ symbolizers[ symbolizerIndex ], symbolizers[ symbolizerIndex + 1 ] ] = [ symbolizers[ symbolizerIndex + 1 ], symbolizers[ symbolizerIndex ] ]
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