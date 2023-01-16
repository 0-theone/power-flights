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
      // Test with a failing request
      this.configService.get('source3'),
    ];

    const promises = urls.map(async (source, index) => await this.getFlights(source, index))
    const res = await this.fetchAll(promises);
    return this.filterDuplicates(res);
  }


  async fetchAll(promises: any) {
    const results = await Promise.allSettled(promises);
    return results;
  }

  async getFlights(source, index) {
    let cached = await this.cacheManager.get(`source${index}`);
    if (cached) {
      console.log('Return cached response', source);
      return cached;
    }

    const { data } = await firstValueFrom(
      this.httpService.get(source).pipe(
        catchError((error: AxiosError) => {
          throw 'An error happened!';
        }),
      ),
    );
    if (data) {
      console.log("set cache for", source)
      await this.cacheManager.set(`source${index}`, data);
    }
    return data;
  }

  filterDuplicates(results) {
    let sources: FlightSlice[] = [];
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        sources = [...sources, ...result.value.flights];
      }
    });
    const flights = { flights: removeDuplicates(sources) };
    return flights;
  }
}
