import { renderHook } from "@testing-library/react"
import { Provider } from "react-redux"
import { useUiStore } from "../../src/hooks/useUiStore"
import { store, uiSlice } from "../../src/store"
import { configureStore } from "@reduxjs/toolkit"

const getMockStore = ( initialState ) => {

    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: {...initialState}
        }
    })
}

describe('Pruebas en useUiStore', () => { 

    const mockStore = getMockStore({ isDateModalOpen: false })

    test('Debe devolver los valores por defecto', () => { 

        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({children}) => <Provider store={ mockStore }>{ children }</Provider>
        })

        expect(result.current).toEqual({
            isDateModalOpen: false,
            openDateModal: expect.any(Function),
            closeDateModal: expect.any(Function)
      })

     })

 })