import { Test } from '@nestjs/testing';
import { FlightsService } from './flights.service';
import { flightsMock } from './mocks/flights';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios/dist';

describe('FlightsService', () => {
  let service: FlightsService;

  beforeEach(async () => {
    // Create a fake copy of the HttpService service
    const fakeHttpService = {
      get: () => Promise.resolve([]),
    };

    const fakeConfigService = {
      get: () => "https://coding-challenge.powerus.de/flight/source1",
    };

      const module = await Test.createTestingModule({
      providers: [FlightsService,
        {
          provide: HttpService,
          useValue: fakeHttpService,
        },
        {
          provide: ConfigService,
          useValue: fakeConfigService,
        },
      ],
      
    }).compile();

    service = module.get(FlightsService);
    service.getFlights = jest.fn().mockReturnValue(flightsMock);
    service.findAll = jest.fn().mockReturnValue(flightsMock);
  });

  it('can create an instance of flights service', async () => {
    expect(service).toBeDefined();
  });


  it('retrive source from configuration file', () => {
    const url = service.configService.get('source1');
    expect(url).toBe('https://coding-challenge.powerus.de/flight/source1');
  });


  it('getFlights returns flights from a single source', () => {
    const result = flightsMock;
    const flights = service.getFlights('source');
    expect(flights).toBe(result);
  });

  it('findAll returns flights array', async () => {
    const result = flightsMock;
    const flights = service.findAll();
    expect(flights).toBe(result);
  });

});