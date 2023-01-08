import { Test } from '@nestjs/testing';
import { FlightsService } from './flights.service';
import { HttpService } from '@nestjs/axios/dist';

describe('FlightsService', () => {
  let service: FlightsService;
  //let fakeHttpService: Partial<HttpService>;

  beforeEach(async () => {
    // Create a fake copy of the HttpService service
    const fakeHttpService = {
      get: () => Promise.resolve([]),
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

  it('filters an array of duplicates', async () => {
    const flights = [
        {
          "slices": [
              {
                "origin_name": "Schonefeld",
                "destination_name": "Stansted",
                "departure_date_time_utc": "2019-08-08T04:30:00.000Z",
                "arrival_date_time_utc": "2019-08-08T06:25:00.000Z",
                "flight_number": "144",
                "duration": 115
              },
              {
                "origin_name": "Stansted",
                "destination_name": "Schonefeld",
                "departure_date_time_utc": "2019-08-10T05:35:00.000Z",
                "arrival_date_time_utc": "2019-08-10T07:35:00.000Z",
                "flight_number": "8542",
                "duration": 120
              }
          ],
        "price": 129
      },
      {
        "slices": [
            {
                "origin_name": "Schonefeld",
                "destination_name": "Stansted",
                "departure_date_time_utc": "2019-08-08T04:30:00.000Z",
                "arrival_date_time_utc": "2019-08-08T06:25:00.000Z",
                "flight_number": "144",
                "duration": 115
            },
            {
                "origin_name": "Stansted",
                "destination_name": "Schonefeld",
                "departure_date_time_utc": "2019-08-10T05:35:00.000Z",
                "arrival_date_time_utc": "2019-08-10T07:35:00.000Z",
                "flight_number": "8542",
                "duration": 120
            }
        ],
        "price": 129
      },
    ];
    const filteredArray = service.removeDuplicates(flights);
    expect(filteredArray.length).toEqual(1);
  });
 
});