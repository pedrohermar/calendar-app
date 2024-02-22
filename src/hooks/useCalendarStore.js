import { useDispatch, useSelector } from "react-redux";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";

export const useCalendarStore = () => {
    const dispatch = useDispatch()
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = async( calendarEvent ) => {
    dispatch( onSetActiveEvent( calendarEvent ) )
  }

  const startSavingEvent = async( calendarEvent ) => {


    if( calendarEvent._id ){
        // Actualizando
        dispatch( onUpdateEvent( calendarEvent ))
    } else {
        // Creando
        const { data } = await calendarApi.post('/events', calendarEvent)
        console.log(data)
        dispatch( onAddNewEvent({ ...calendarEvent, id: data.event.id, user }) )
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
