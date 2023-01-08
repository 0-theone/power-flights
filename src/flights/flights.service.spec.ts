import { Test } from '@nestjs/testing';
import { FlightsService } from './flights.service';
import { HttpService } from '@nestjs/axios/dist';
import { AxiosRequestConfig} from 'axios';

describe('FlightsService', () => {
  let service: FlightsService;
  //let fakeHttpService: Partial<HttpService>;

  beforeEach(async () => {
    // Create a fake copy of the HttpService service
    const fakeHttpService = {
      get: (url: string, config?: AxiosRequestConfig<any>) => Promise.resolve([]),
    };

    const module = await Test.createTestingModule({
      providers: [
        FlightsService,
        {
          provide: HttpService,
          useValue: fakeHttpService,
        },
      ],
    }).compile();

    service = module.get(FlightsService);
  });

  it('can create an instance of flights service', async () => {
    expect(service).toBeDefined();
  });
 
});

