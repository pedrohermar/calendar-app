import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { authSlice } from "../../src/store"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { initialState, notAuthenticatedState } from "../fixtures/authStates"
import { testUserCredentials } from "../fixtures/testUser"
import calendarApi from "../../src/api/calendarApi"

const getMockStore = ( initialState ) => {
    
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: {...initialState}
        }
    })
}

describe('Pruebas en useAuthStore', () => { 

    beforeEach( () => localStorage.clear() )

    test('Debe regresar los valores por defecto', () => { 

        const mockStore = getMockStore({...initialState})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),        
            startRegister: expect.any(Function),    
            checkAuthToken: expect.any(Function),  
            startLogout: expect.any(Function)
        })
     })

    test('startLogin debe realizar el login correctamente', async () => { 

        const mockStore = getMockStore({...notAuthenticatedState})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        await act( async() => {
            await result.current.startLogin(testUserCredentials)
        })

        const { errorMessage, status, user } = result.current
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '65e5fbaf90093db56bef8db7' }
        })

        expect( localStorage.getItem('token')).toEqual( expect.any(String) )
        expect( localStorage.getItem('token-init-date')).toEqual( expect.any(String) )

      })

    test('startLogin debe fallar la autenticación', async() => { 

        const mockStore = getMockStore({...notAuthenticatedState})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        await act( async() => {
            await result.current.startLogin({ email: 'algo@correo.com', password: 'ABC123'})
        })

        const { errorMessage, status, user } = result.current
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Credenciales incorrectas',
            status: 'not-authenticated',
            user: {}
        })
        expect(localStorage.getItem('token')).toBeNull()

        await waitFor(
            () => expect( result.current.errorMessage ).toBe(undefined)
        )

     })

     test('startRegister debe crear un usuario', async() => {

        const newUser = { email: 'algo@correo.com', password: 'ABC123', name: 'Test User 2'}

        const mockStore = getMockStore({...notAuthenticatedState})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: "ALGUN-ID",
                name: "Test User",
                token: "ALGUN-TOKEN"
            }
        })

        await act( async() => {
            await result.current.startRegister(newUser)
        })

        const { errorMessage, status, user } = result.current
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: 'ALGUN-ID' }
        })

        spy.mockRestore()

      })

    test('startRegister debe fallar si el usuario ya existe', async() => { 

        const mockStore = getMockStore({...notAuthenticatedState})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        await act( async() => {
            await result.current.startRegister(testUserCredentials)
        })

        const { errorMessage, status, user } = result.current
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Un usuario existe con ese correo',
            status: 'not-authenticated',
            user: {}
        })

    })

    test('checkAuthToken debe fallar si no hay token', async() => { 

        const mockStore = getMockStore({...notAuthenticatedState})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        await act( async() => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        })
     })

    test('checkAuthToken debe autenticar el usuario si hay un token', async() => { 

        const { data } = await calendarApi.post('/auth', testUserCredentials)
        localStorage.setItem('token', data.token)

        const mockStore = getMockStore({...initialState})
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        await act( async() => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                name: 'Test User',
                uid: '65e5fbaf90093db56bef8db7'
            }
        })

    })

 })