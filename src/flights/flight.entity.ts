import {
    Entity,
    Column,
} from 'typeorm';
  
@Entity()
    export class Flight {
    @Column()
    origin_name: string;

    @Column()
    destination_name: string;

    @Column()
    departure_date_time_utc: string;

    @Column()
    arrival_date_time_utc: string;

    @Column()
    flight_number: string;

    @Column()
    duration: number;
}
