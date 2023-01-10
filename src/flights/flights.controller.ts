import { Controller, Get, NotFoundException } from '@nestjs/common';
import { interval } from 'rxjs';
import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
    flightsSubscription: any;
    constructor(public flightsService: FlightsService) {
        const hour = 1000 * 60 * 60;
        this.flightsSubscription = interval(hour).subscribe((() => {
            this.findAll();
        }))
    }
    @Get()
    async findAll() {
        const flights = await this.flightsService.findAll();

        if (!flights) {
         throw new NotFoundException('Flights not found');
        }

        return flights;
    }
}