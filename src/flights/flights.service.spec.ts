import { Test } from '@nestjs/testing';
import { FlightsService } from './flights.service';
import { HttpService} from '@nestjs/axios/dist';
import { ConfigService } from '@nestjs/config';
import { duplicatedFlightsMock } from './mocks/duplicated';

describe('FlightsService', () => {
  let service: FlightsService;

  beforeEach(async () => {
    // Create a fake copy of the HttpService service
    const fakeHttpService = {
      get: () => Promise.resolve(duplicatedFlightsMock),
    };

    const fakeConfigService = {
      get: () => "",
    };

    const fakeFlightsService = {
      findAll: () => Promise.resolve(duplicatedFlightsMock),
    };

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: FlightsService,
          useValue: fakeFlightsService,
        },
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
  });

  it('can create an instance of flights service', async () => {
    expect(service).toBeDefined();
  });

  it('findAll returns a list of flights', async () => {
    const result = duplicatedFlightsMock;
    const flights = await service.findAll();
    expect(flights).toBe(result);
  });

});