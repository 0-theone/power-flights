import { Injectable } from '@nestjs/common';
import got from 'got';

@Injectable()
export class FlightsRepository {
     async findAll() {
        const flights = await got.get('https://coding-challenge.powerus.de/flight/source1').json();
        console.log(flights);
        return flights;
    }
}