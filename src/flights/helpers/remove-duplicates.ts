import { FlightSlice } from '../interfaces';

export const removeDuplicates = (array: FlightSlice[]) => {
    let seen = [];
    return array.filter((flight) => {
        const [from, to] = flight.slices;
        const id = `${from.flight_number}-${from.departure_date_time_utc}-${from.arrival_date_time_utc}-h${to.flight_number}-${to.departure_date_time_utc}-${to.arrival_date_time_utc}`;
       
        if (!seen.includes(id)) {
            seen.push(id)
            return flight;
        }
    });
}