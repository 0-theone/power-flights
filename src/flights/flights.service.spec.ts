import { Test } from '@nestjs/testing';
import { FlightsService } from './flights.service';
import { HttpService } from '@nestjs/axios/dist';
import { ConfigService } from '@nestjs/config';
import { duplicatedFlightsMock } from './flightsMock';

describe('FlightsService', () => {
  let service: FlightsService;
  //let fakeHttpService: Partial<HttpService>;

  beforeEach(async () => {
    // Create a fake copy of the HttpService service
    const fakeHttpService = {
      get: () => Promise.resolve([]),
    };

    const fakeConfigService = {
      get: () => "",
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
      ],
    }).compile();

    service = module.get(FlightsService);
  });

  it('can create an instance of flights service', async () => {
    expect(service).toBeDefined();
  });

  it('filters an array of duplicates', async () => {
    const filteredArray = service.removeDuplicates(duplicatedFlightsMock);
    expect(filteredArray.length).toEqual(1);
  });
 
});