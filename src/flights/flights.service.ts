import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { catchError, forkJoin, map, throwError, Observable } from 'rxjs';

import { FlightSlice } from './interfaces';
import { removeDuplicates } from './helpers/remove-duplicates';

@Injectable()
export class FlightsService {
  constructor(
    public readonly httpService: HttpService,
    public readonly configService: ConfigService,
  ) {}

  async findAll() {
    try {
      const urls: string[] = [
        this.configService.get('source1'),
        this.configService.get('source2'),
      ];
  
      return forkJoin(urls.map((source) => this.getFlights(source))).pipe(
        map(async (results: AxiosResponse[]) =>
          this.transformIncomingData(results),
        ),
      );

    } catch (e) {
      console.log(e);
      throwError(() => e);
    }
  }

  getFlights(source: string): Observable<AxiosResponse<FlightSlice[], any>> {
    return this.httpService
      .get<FlightSlice[]>(source)
      .pipe(catchError((e) => throwError(() => {  
        console.log(e);
        return `Not possible to load from source. Please try again`;
      })));
  }

  transformIncomingData(results: AxiosResponse[]) {
    let sources: FlightSlice[] = [];
    results.forEach(result => {
      sources = [...sources, ...result?.data?.flights];
    });
    const filteredflights = removeDuplicates(sources);
    return { flights: filteredflights };
  }
}
