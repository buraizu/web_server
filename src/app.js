const path = require('path')   // core module, no need for installation
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath) 
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: 'Bryce Eadie'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Bryce Eadie'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'this is the help message',
        title: 'Help',
        name: 'Bryce Eadie'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'Must provide address'
        })
    }

    geocode(req.query.address, (error, { longitude, latitude, location } = {}) => {
        if(error) {
           return res.send({ error }) // function execution ceases after logging to console 
        }
    
        forecast(longitude, latitude, (error, forecastData) => {
            if(error) {
                return res.send({ error })
            }
        
            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            })
        })
    })

    
})

// app.get('/products', (req, res) => {
//     if(!req.query.search) {
//         return res.send({
//             error: 'Must provide a search term'
//         })
//     }

//     console.log(req.query.search)
//     res.send({
//         products: []
//     })
// })

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Bryce Eadie',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Bryce Eadie',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log(`server up on port ${port}`)
})