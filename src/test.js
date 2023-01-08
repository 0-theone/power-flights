const flights = [
    {
      "slices": [
          {
            "origin_name": "Schonefeld",
            "destination_name": "Stansted",
            "departure_date_time_utc": "2019-08-08T04:30:00.000Z",
            "arrival_date_time_utc": "2019-08-08T06:25:00.000Z",
            "flight_number": "144",
            "duration": 115
          },
          {
            "origin_name": "Stansted",
            "destination_name": "Schonefeld",
            "departure_date_time_utc": "2019-08-10T05:35:00.000Z",
            "arrival_date_time_utc": "2019-08-10T07:35:00.000Z",
            "flight_number": "8542",
            "duration": 120
          }
      ],
    "price": 129
  },
  {
    "slices": [
        {
            "origin_name": "Schonefeld",
            "destination_name": "Stansted",
            "departure_date_time_utc": "2019-08-08T04:30:00.000Z",
            "arrival_date_time_utc": "2019-08-08T06:25:00.000Z",
            "flight_number": "144",
            "duration": 115
        },
        {
            "origin_name": "Stansted",
            "destination_name": "Schonefeld",
            "departure_date_time_utc": "2019-08-10T05:35:00.000Z",
            "arrival_date_time_utc": "2019-08-10T07:35:00.000Z",
            "flight_number": "8542",
            "duration": 120
        }
    ],
    "price": 129
  },
  {
    "slices": [
        {
            "origin_name": "Schonefeld",
            "destination_name": "Stansted",
            "departure_date_time_utc": "2019-08-08T04:30:00.000Z",
            "arrival_date_time_utc": "2019-08-08T06:25:00.000Z",
            "flight_number": "144",
            "duration": 115
        },
        {
            "origin_name": "Stansted",
            "destination_name": "Schonefeld",
            "departure_date_time_utc": "2019-08-10T05:35:00.000Z",
            "arrival_date_time_utc": "2019-08-10T07:35:00.000Z",
            "flight_number": "8542",
            "duration": 120
        }
    ],
    "price": 129
  },
];

function removeDuplicates(array){
    const filtered = array.filter((flights) => flights.slices.some((flight) => {
        const {flight_number,  departure_date_time_utc, arrival_date_time_utc } = flight;
        let key = `${flight_number}-${departure_date_time_utc}-${arrival_date_time_utc}`;
        let seen = {};

        if (!seen.hasOwnProperty(key)) {
            seen[key] = true
            return flight;
        }
    }));

    return filtered;
}
const res = removeDuplicates(flights);

console.log(res)