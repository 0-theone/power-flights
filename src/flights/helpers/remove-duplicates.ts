import { FlightSlice } from '../interfaces';

export const removeDuplicates = (array: FlightSlice[]) => {
  const seen = [];
  return array.filter((flight) => {
    const [outbound, back] = flight.slices;
    //as your data structure always has a round trip within a slice, I considered the combination of the two as an identifier.
    const id = `${outbound.flight_number}-${outbound.departure_date_time_utc}-${outbound.arrival_date_time_utc}-${back.flight_number}-${back.departure_date_time_utc}-${back.arrival_date_time_utc}`;

    if (!seen.includes(id)) {
      seen.push(id);
      return flight;
    }
  });
};
