
export const events = [
    {
        id: '1',
        start: new Date('2024-03-11 15:00:00'),
        end: new Date('2024-03-11 17:00:00'),
        title: "Evento desde testing",
        notes: "Prueba realizada desde testing"
    },
    {
        id: '2',
        start: new Date('2024-04-11 15:00:00'),
        end: new Date('2024-04-11 17:00:00'),
        title: "Otro evento de test",
        notes: "Segundo evento de prueba creado en testing"
    },
]

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: { ...events[0] }
}