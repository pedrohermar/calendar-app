import { useDispatch, useSelector } from "react-redux";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {
    const dispatch = useDispatch()
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = async( calendarEvent ) => {
    dispatch( onSetActiveEvent( calendarEvent ) )
  }

  const startSavingEvent = async( calendarEvent ) => {

    try {
      if( calendarEvent.id ){
          // Actualizando
          const { data } = await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent)
          dispatch( onUpdateEvent({ ...calendarEvent, user }) )
          return
      }
          // Creando
          const { data } = await calendarApi.post('/events', calendarEvent)
          console.log(data)
          dispatch( onAddNewEvent({ ...calendarEvent, id: data.event.id, user }) )
    } catch (error) {
      console.log(error)
      Swal.fire('Error al guardar', error.response.data.msg, 'error')
    }
  }

  const startDeletingEvent = async() => {
    dispatch( onDeleteEvent() )
  }

  const startLoadingEvents = async() => {
    try {

      const { data } = await calendarApi.get('/events')
      const events = convertEventsToDateEvents( data.events )
      dispatch( onLoadEvents(events) )
      
    } catch (error) {
      console.log('Error cargando los eventos')
      console.log(error)
    }
  }


  return {
    // Propiedades
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    //Métidos
    setActiveEvent,
    startSavingEvent, 
    startDeletingEvent,
    startLoadingEvents
  };
};
