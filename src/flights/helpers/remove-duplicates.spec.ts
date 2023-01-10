import { removeDuplicates } from './remove-duplicates';
import { duplicatedFlightsMock } from '../mocks/duplicated';
import { duplicatedFlightsMock2 } from '../mocks/duplicated2';
import { flightsMock } from '../mocks/flights';

describe("Remove duplicates helper", () => {
    it('filters an array with one duplicate', async () => {
        const flights = duplicatedFlightsMock;
        expect(flights.length).toEqual(2);
        const filteredArray = removeDuplicates(flights);
        expect(filteredArray.length).toEqual(1);
    });

    it('filters an array with more than one duplicates', async () => {
        const flights = duplicatedFlightsMock2;
        expect(flights.length).toEqual(5);
        const filteredArray = removeDuplicates(flights);
        expect(filteredArray.length).toEqual(3);
    });

    it('has same array lenght from fetch if there are no duplicates', async () => {
        const flights = flightsMock;
        expect(flights.length).toEqual(2);
        const filteredArray = removeDuplicates(flights);
        expect(filteredArray.length).toEqual(2);
    });
});



