import { Injectable } from '@nestjs/common';
import { request } from 'undici'

@Injectable()
export class FlightsRepository {
     async findAll() {
        const flights = await request('https://coding-challenge.powerus.de/flight/source1');
        console.log(flights);
        return flights;
    }
}