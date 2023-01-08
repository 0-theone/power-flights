import {
    Entity,
    Column,
} from 'typeorm';
import { Flight } from './flight.entity';
  
@Entity()
    export class FlightSlice {
    @Column()
    slices: Flight[];

    @Column()
    price: number;
}
