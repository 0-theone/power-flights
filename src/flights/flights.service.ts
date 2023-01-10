import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, forkJoin, map, throwError, Observable } from 'rxjs';
import { FlightSlice } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { removeDuplicates } from './helpers/remove-duplicates'

@Injectable()
export class FlightsService {
    constructor(public readonly httpService: HttpService, public readonly configService: ConfigService) {}
   
    async findAll() {    
        const urls: string[] = [this.configService.get('source1'), this.configService.get('source2')];

        return forkJoin(
            urls
            .map(source => this.getFlights(source)))
            .pipe(map(async (results: AxiosResponse[]) => {
                const sources = [...results[0].data?.flights, ...results[1].data?.flights];
                const filteredflights = removeDuplicates(sources);
                return {flights: filteredflights}; 
            })
        );
    }

    getFlights(source: string): Observable<AxiosResponse<FlightSlice[], any>> {
        return this.httpService.get<FlightSlice[]>(source).pipe(catchError(e => throwError(() => e)))
    }
}
