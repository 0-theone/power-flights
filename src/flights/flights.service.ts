import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  RequestTimeoutException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios/dist';
import { ConfigService } from '@nestjs/config';
import {
  catchError,
  timeout,
  firstValueFrom,
  Observable,
  TimeoutError,
  throwError,
} from 'rxjs';

import { FlightResponse, FlightSlice } from './interfaces';
import { removeDuplicates } from './helpers/remove-duplicates';

@Injectable()
export class FlightsService implements NestInterceptor {
  constructor(
    public readonly httpService: HttpService,
    public readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      timeout(1000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }

  async findAll() {
    const urls: string[] = [
      this.configService.get('source1'),
      this.configService.get('source2'),
      // Test with a failing request
      this.configService.get('source3'),
    ];

    const promises = urls.map(
      async (source, index) => await this.getFlights(source, index),
    );
    const res = await this.fetchAll(promises);
    return this.filterFlights(res);
  }

  async fetchAll(promises: any) {
    const results = await Promise.allSettled(promises);
    return results;
  }

  async getFlights(source: string, index: number) {
    const cached = await this.cacheManager.get(`source${index}`);
    if (cached) {
      console.log(`Return cached data from source: ${source}`);
      return cached;
    }

    const { data } = await firstValueFrom(
      this.httpService.get(source).pipe(
        catchError(() => {
          throw `Not possible to fetch from source: ${source}`;
        }),
      ),
    );
    if (data) {
      console.log('set cache for', source);
      await this.cacheManager.set(`source${index}`, data);
    }
    return data;
  }

  filterFlights(results: FlightResponse[]) {
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
