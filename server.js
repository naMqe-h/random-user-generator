const express = require('express');
const cors = require('cors')
const PORT = process.env.PORT || 5000
const { getNames, getBirthday, getPesel, countErrorHandle, checkCorrectYears } = require('./functions')

const corsOptions ={
    origin: [
        'https://namqe-user-data-generator.netlify.app/',
        'http://localhost:3000/'
    ], 
    credentials:true,
    optionSuccessStatus:200
}

res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");


const app = express()
app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send(`User data generator for Polish people. <br>  Endpoints: <br> /api/users <br> /api/users/single-year`)
})

app.get("/api/users/single-year", (req, res) => {
    const { count = 5, year } = req.query
    const data = []

    if(countErrorHandle(count)) return res.send(isError)

    if(year < 1800 || year > 2099) return res.send({error: `Enter a valid value of the 'year' parameter in the range 1800-2099`})

    if(year) {
        for(let i = 0; i < count; i++) {
            const { firstName, lastName, gender } = getNames()
            const birthday = getBirthday(year)
            const pesel = getPesel(year) 
            
            const temp = {
                firstName,
                lastName,
                pesel,
                birthday,
                gender,
            }
            data.push(temp)
        }
        return res.json(data)
    }
    
});

app.get("/api/users", (req, res) => {
    const { count = 5, since = 1970, until = 2010 } = req.query
    since == until ? year = since : year = null
    const data = []

    if(countErrorHandle(count)) return res.send(isError)

    checkCorrectYears(since, until)

    for(let i = 0; i < count; i++) {
        let { firstName, lastName, gender } = getNames()
        const birthday = getBirthday(year, since, until)
        const pesel = getPesel(birthday.split('.')[2])
        
        const temp = {
            firstName,
            lastName,
            pesel,
            birthday,
            gender,
        }
        data.push(temp)
    }
    return res.json(data)

})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))