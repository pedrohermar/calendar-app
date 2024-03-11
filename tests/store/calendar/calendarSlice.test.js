import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates"

describe('Pruebas en calendarSlice', () => { 

    test('Debe regresar el estado por defecto', () => { 

        const state = calendarSlice.getInitialState()
        expect( state ).toEqual( initialState )

     })

     test('onSetActiveEvent debe activar el evento', () => { 

        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) )
        expect( state.activeEvent ).toEqual( events[0] )

      })

      test('onAddNewEvent debe agregar el evento', () => { 

            const newEvent = {
                id: '3',
                start: new Date('2024-08-11 15:00:00'),
                end: new Date('2024-03-11 17:00:00'),
                title: "Nuevo evento Testing",
                notes: "Evento creado en testing"
            }

            const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) )
            expect( state.events ).toEqual([...events, newEvent])

       })

       test('onUpdateEvent debe actualizar el evento', () => { 

            const updatedEvent = {
                id: '1',
                start: new Date('2024-03-11 15:00:00'),
                end: new Date('2024-03-11 17:00:00'),
                title: "Evento desde testing actualizado",
                notes: "Actualización de evento de testing"
            }

            const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) )
            expect( state.events ).toContain( updatedEvent )

        })

        test('onDeleteEvent debe borrar el evento activo', () => { 
          
            const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() )
            expect( state.activeEvent ).toBe( null )
            expect( state.events ).not.toContain( events[0] )

         })

         test('onLoadEvents debe establecer los eventos', () => {

            const state = calendarSlice.reducer( initialState, onLoadEvents( events ) )
            expect( state.isLoadingEvents ).toBeFalsy()
            expect( state.events ).toEqual( events )

            const newState = calendarSlice.reducer( state, onLoadEvents() )
            expect( newState.events.length ).toBe( events.length )

         })

         test('onLogoutCalendar debe limpiar el estado', () => {

            // calendarWithActiveEventState
            const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() )
            expect( state ).toEqual(initialState)

         })

 })