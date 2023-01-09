import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, forkJoin, of, map } from 'rxjs';
import { FlightSlice } from './interfaces';
import { createHash } from 'node:crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FlightsService {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

    async findAll(): Promise<FlightSlice[]> {
        let flights: any=[];
        const urls: string[] =  this.configService.get<string>('sources').split(',');

        flights = forkJoin(
            urls.map(source => 
                this.httpService.get<FlightSlice[]>(source).pipe(catchError(e => of(e)))
            )
        ).pipe(map(async (results) => {
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
