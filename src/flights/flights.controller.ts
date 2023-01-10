import { Controller, Get, NotFoundException } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
    constructor(public flightsService: FlightsService) {}
    @Get()
    async findAll() {
        const flights = await this.flightsService.findAll();

        if (!flights) {
         throw new NotFoundException('Flights not found');
        }

        return flights;
    }
}