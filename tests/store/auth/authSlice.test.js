import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice"
import { authenticatedState, initialState, notAuthenticatedState } from "../../fixtures/authStates"
import { testUserCredentials } from "../../fixtures/testUser"

describe('Pruebas en authSlice', () => { 

    test('Debe regresar el estado inicial', () => { 

        expect(authSlice.getInitialState()).toEqual(initialState)

     })

     test('Debe realizar un login', () => { 

        let state = authSlice.reducer( initialState, onLogin( testUserCredentials ) )
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        })

    })
    
    test('Debe realizar el logout', () => { 

        const state = authSlice.reducer( authenticatedState, onLogout() )
        expect(state).toEqual(notAuthenticatedState)

     })

     test('Debe mostrar el mensaje de error correctamente al hacer logout', () => { 

        const errorMessage = 'Credenciales incorrectas'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) )
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage
        })
        
     })

     test('Debe limpiar el mensaje de error', () => { 

        const errorMessage = 'Credenciales incorrectas'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) )
        const newState = authSlice.reducer( state, clearErrorMessage() )
        expect(newState).toEqual(notAuthenticatedState)
        
     })
 
})