import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios/dist';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import {
  catchError,
  combineLatest,
  map,
  throwError,
  Observable,
  timeout,
  of,
} from 'rxjs';

import { FlightSlice } from './interfaces';
import { removeDuplicates } from './helpers/remove-duplicates';

@Injectable()
export class FlightsService {
  constructor(
    public readonly httpService: HttpService,
    public readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    const flights = await this.cacheManager.get('flights');

    if (flights) {
      return flights;
    }

    const urls: string[] = [
      this.configService.get('source1'),
      this.configService.get('source2'),
    ];

    return combineLatest(urls.map((source) => this.getFlights(source)))
      .pipe(
        map(async (results: AxiosResponse[]) =>
          this.transformIncomingData(results),
        ),
      )
      .pipe(
        timeout(1000),
        catchError(() => of(`Request timed out after one second`)),
      );
  }

  getFlights(source: string): Observable<AxiosResponse<FlightSlice[], any>> {
    return this.httpService.get<FlightSlice[]>(source).pipe(
      catchError((e) =>
        throwError(() => {
          console.log(e);
          return `Not possible to load from source. Please try again`;
        }),
      ),
    );
  }

  async transformIncomingData(results: AxiosResponse[]) {
    let sources: FlightSlice[] = [];
    results.forEach((result) => {
      sources = [...sources, ...result?.data?.flights];
    });
    const flights = { flights: removeDuplicates(sources) };
    await this.cacheManager.set('flights', flights);
    return flights;
  }
}
