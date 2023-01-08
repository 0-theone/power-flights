import { Injectable, } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, forkJoin, of, map, filter } from 'rxjs';
import { FlightsSlice, Flight } from './interfaces';
import { createHash } from 'node:crypto'


@Injectable()
export class FlightsService {
    flights: any; //add config
    constructor(private readonly httpService: HttpService) {}
    async findAll() {
        const urls = ['https://coding-challenge.powerus.de/flight/source1', 'https://coding-challenge.powerus.de/flight/source2'];
        
        const flights = forkJoin(
            urls.map(source => 
                this.httpService.get<FlightsSlice[]>(source).pipe(catchError(e => of(e)))
            )
        ).pipe(map((results: any[]) => {
            const source = [...results[0].data?.flights, ...results[1].data?.flights];
            let seen = {};

            const filteredArray = source.filter((flights) => flights.slices.some((flight: Flight) => {
                const {flight_number,  departure_date_time_utc, arrival_date_time_utc } = flight;
                const id = `${flight_number}-${departure_date_time_utc}-${arrival_date_time_utc}`;
                if (!seen.hasOwnProperty(id)) {
                    seen[id] = true
                    return flight;
                }
            }))

            return {filteredArray, length: filteredArray.length}; 
        }));

        return flights;
    }
}
