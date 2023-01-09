import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, forkJoin, of, map } from 'rxjs';
import { FlightSlice } from './interfaces';
import { createHash } from 'node:crypto'

@Injectable()
export class FlightsService {
    constructor(private readonly httpService: HttpService) {}
    async findAll(): Promise<FlightSlice[]> {
        let flights: any=[];
        const urls = ['https://coding-challenge.powerus.de/flight/source1', 'https://coding-challenge.powerus.de/flight/source2'];
        
        flights = forkJoin(
            urls.map(source => 
                this.httpService.get<FlightSlice[]>(source).pipe(catchError(e => of(e)))
            )
        ).pipe(map(async (results: any[]) => {
            const source = [...results[0].data?.flights, ...results[1].data?.flights];
            const filteredflights = this.removeDuplicates(source);
            return {flights: filteredflights}; 
        }));

        return flights;
    }

    removeDuplicates(array: FlightSlice[]) {
        let seen = {};
        return array.filter(flight => {
            const hash = createHash('md5').update(JSON.stringify(flight.slices)).digest('hex');
            if (!seen.hasOwnProperty(hash)) {
              seen[hash] = true
              return flight;
            }
        });
    }
}
