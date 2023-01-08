import { Test } from '@nestjs/testing';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { HttpService } from '@nestjs/axios/dist';
import { FlightSlice } from './interfaces';
import { Observable } from 'rxjs';


describe('FlightsController', () => {
  let controller: FlightsController;
  let fakeFlightsService; //Implement type
  const flightsA: FlightSlice[] = [];

  beforeEach(async () => {
    const fakeHttpService = {
      get: () => Promise.resolve([]),
    };

    fakeFlightsService = {
      findAll: () => Promise.resolve({flights: flightsA}),
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

    controller = module.get<FlightsController>(FlightsController);
  });

  it('can create an instance of flight controller', async () => {  
    expect(controller).toBeDefined();
  });
  
});


