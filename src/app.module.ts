import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightsModule } from './flights/flights.module';
import { ConfigModule } from '@nestjs/config';
import config from './configuration';

@Module({
  imports: [FlightsModule, ConfigModule.forRoot({
    isGlobal: true,
    load: [config] 
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
