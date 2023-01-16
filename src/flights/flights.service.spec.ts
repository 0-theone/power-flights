import { CACHE_MANAGER } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios/dist';

import { FlightsService } from './flights.service';
import { flightsMock } from './mocks/flights';
import { responseMock } from './mocks/response';

describe('FlightsService', () => {
  let service: FlightsService;

  beforeEach(async () => {
    // Create a fake copy of the HttpService service
    const fakeHttpService = {
      get: () => Promise.resolve([]),
    };

    const fakeConfigService = {
      get: () => 'https://coding-challenge.powerus.de/flight/source1',
    };

    const fakeCacheManager = {
      get: () => '',
      set: () => '',
    };

    const module = await Test.createTestingModule({
      providers: [
        FlightsService,
        {
          provide: HttpService,
          useValue: fakeHttpService,
        },
        {
          provide: ConfigService,
          useValue: fakeConfigService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: fakeCacheManager,
        },
      ],
    }).compile();

    service = module.get(FlightsService);
    service.getFlights = jest.fn().mockReturnValue(flightsMock);
  });

  it('can create an instance of flights service', async () => {
    expect(service).toBeDefined();
  });

  it('retrive source from configuration file', () => {
    const url = service.configService.get('source1');
    expect(url).toBe('https://coding-challenge.powerus.de/flight/source1');
  });

  it('has a findAll method', async () => {
    const flights = await service.findAll();
    expect(flights).toBeDefined();
  });

  it('has a transform incoming data method', async () => {
    const transform = service.transformIncomingData(responseMock);
    console.log(transform);
  });

  it('has a getFlights method', async () => {
    const url = service.configService.get('source1');
    const flights = service.getFlights(url);
    expect(flights).toBeDefined();
  });
});
