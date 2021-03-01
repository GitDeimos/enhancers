const weatherAndShopsConstant = {
    openWeather: {
        BASE_URL:"https://api.openweathermap.org/data/2.5/weather?q=",
        SECRET_KEY: "INSERT OPEN W KEY HERE"
    },
    yelp: {
        SECRET_KEY:"INSERT YELP KEY HERE",
        ENDPOINT: "/businesses/search"
    }
}

module.exports = weatherAndShopsConstant;