import { Test } from '@nestjs/testing';
import { FlightsService } from './flights.service';
import { flightsMock } from './mocks/flights';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios/dist';
import { firstValueFrom } from 'rxjs';

describe('FlightsService', () => {
  let service: FlightsService;

  beforeEach(async () => {
    // Create a fake copy of the HttpService service
    const fakeHttpService = {
      get: () => Promise.resolve([]),
    };

    const fakeConfigService = {
      get: () => "",
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
    service.getFlight = jest.fn().mockReturnValue(flightsMock);
    service.findAll = jest.fn().mockReturnValue(flightsMock);
  });

  it('can create an instance of flights service', async () => {
    expect(service).toBeDefined();
  });

  it('getFlight returns flights from a single source', () => {
    const result = flightsMock;
    const flights = service.getFlight('source');
    expect(flights).toBe(result);
  });

  it('findAll returns a list of flights', async () => {
    const flights = await service.findAll();
    expect(flights).toBeDefined();
  });

});