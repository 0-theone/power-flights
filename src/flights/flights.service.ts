import { Injectable, } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, forkJoin, of, map } from 'rxjs';
import { FlightsSlice } from './interfaces';


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
            const objs =  {flights: results[0].data["flights"].concat(results[1].data["flights"])};
            return objs;
        }));

        return flights;
    }
}
