import { Test } from '@nestjs/testing';
import { FlightsController } from './flights.controller';

it('can create an instance of flight controller', async () => {
  const module = await Test.createTestingModule({
    controllers: [FlightsController],
  }).compile();

  const controller = module.get(FlightsController);
  
  expect(controller).toBeDefined();
});

