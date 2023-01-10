import { Test } from '@nestjs/testing';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { HttpService } from '@nestjs/axios/dist';
import { duplicatedFlightsMock } from './mocks/duplicated';

describe('FlightsController', () => {
  let controller: FlightsController;
  let fakeFlightsService: Partial<FlightsService>;

  beforeEach(async () => {
    const fakeHttpService = {
      get: () => Promise.resolve([]),
    };

    fakeFlightsService = {
      findAll: () => Promise.resolve(duplicatedFlightsMock),
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

  it('listFlights returns a list of flights', async () => {
    const result = duplicatedFlightsMock;
    const flights = await controller.findAll();
    expect(flights).toBe(result);
  });

  afterAll((done) => {
    done();
  });
  
});


