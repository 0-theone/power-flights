import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios/dist';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import {
  catchError,
  combineLatest,
  map,
  throwError,
  Observable,
  timeout,
  of,
  firstValueFrom,
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
      this.configService.get('source3'),
    ];

    const promises = urls.map(async (source) => await this.getFlights(source))
    const res = await this.fetchAll(promises);
    console.log(res, "shazam")
  }


  async fetchAll(promises: any) {
    const results = await Promise.allSettled(promises);
    return results;
  }

  async getFlights(source) {
    const { data } = await firstValueFrom(
      this.httpService.get(source).pipe(
        catchError((error: AxiosError) => {
          throw 'An error happened!';
        }),
      ),
    );
    return data?.flights;
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
