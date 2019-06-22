const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = `https://api.darksky.net/forecast/257646fd3e0487456a14328da57dab97/${longitude},${latitude}?units=si`  //&lang=ko

    request({ url, json: true}, (error, { body }) => {
        if(error) {
            callback('Unable to connect', undefined)
        } else if(body.error) {
            callback('Unable to find location', undefined)
        } else {
            let weather = body.currently
            callback(undefined, `${body.daily.data[0].summary}. It is currently ${weather.temperature} degrees out. There is a ${weather.precipProbability}% chance of rain.`)
        }
    })
}

module.exports = forecast

