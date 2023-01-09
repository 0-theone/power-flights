import { Test } from '@nestjs/testing';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { HttpService } from '@nestjs/axios/dist';

describe('FlightsController', () => {
  let controller: FlightsController;
  let fakeFlightsService: Partial<FlightsService>;

  beforeEach(async () => {
    const fakeHttpService = {
      get: () => Promise.resolve([]),
    };

    fakeFlightsService = {
      findAll: () => Promise.resolve([]),
    };

    const module = await Test.createTestingModule({
      controllers: [FlightsController],
      providers: [
        {
          provide: HttpService,
          useValue: fakeHttpService,
        },
        {
          provide: FlightsService,
          useValue: fakeFlightsService,
        },
      ],
    }).compile();

    controller = module.get<FlightsController>(FlightsController);
  });

  it('can create an instance of flight controller', async () => {  
    expect(controller).toBeDefined();
  });
  
});


