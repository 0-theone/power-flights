import { Injectable, } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, forkJoin, of, map } from 'rxjs';
import { FlightSlice, Flight } from './interfaces';
import { createHash } from 'node:crypto'

@Injectable()
export class FlightsService {
    constructor(private readonly httpService: HttpService) {}
    async findAll() {
        const urls = ['https://coding-challenge.powerus.de/flight/source1', 'https://coding-challenge.powerus.de/flight/source2'];
        
        const flights = forkJoin(
            urls.map(source => 
                this.httpService.get<FlightSlice[]>(source).pipe(catchError(e => of(e)))
            )
        ).pipe(map(async (results: any[]) => {
            const source = [...results[0].data?.flights, ...results[1].data?.flights];
            const flights = this.removeDuplicates(source);

            return {flights}; 
        }));

        return flights;
    }

    removeDuplicates(array: FlightSlice[]) {
        let seen = {};
        const filtered = array.filter(flight => {
            const hash = createHash('md5').update(JSON.stringify(flight.slices)).digest('hex');
            if (!seen.hasOwnProperty(hash)) {
              seen[hash] = true
              return flight;
            }
        });
        return filtered;
    }
}
