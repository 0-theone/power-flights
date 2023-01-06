import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';

@Injectable()
export class FlightsService {
    constructor(private readonly httpService: HttpService) {}
    async findAll() {
        const response = await this.httpService.get('https://coding-challenge.powerus.de/flight/source1').toPromise();
        return response.data;
    }
}
