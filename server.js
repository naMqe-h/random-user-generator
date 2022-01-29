const express = require('express');
const cors = require('cors')
const PORT = process.env.PORT || 5000
const { getNames, getBirthday, getPesel, generateEmail, generatePassword, countErrorHandle, checkCorrectYears } = require('./functions')

const corsOptions ={
    origin: [
        'https://namqe-user-data-generator.netlify.app/',
        'http://localhost:3000/'
    ], 
    credentials:true,
    optionSuccessStatus:200
}

const app = express()
app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send(`User data generator for Polish people. <br>  Endpoints: <br> /api/users <br> /api/users/single-year`)
})

app.get("/api/users/single-year", (req, res) => {
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Origin", "*");
    const { count = 5, year = 2003,  domain = 'oursite.com' } = req.query
    const data = []

    const isError = countErrorHandle(count)
    if(isError) return res.send(isError)

    if(year < 1800 || year > 2099) return res.send({error: `Enter a valid value of the 'year' parameter in the range 1800-2099`})

    if(year) {
        for(let i = 0; i < count; i++) {
            const { firstName, lastName, gender } = getNames()
            const { returnedBirthday: birthday, dateFirebase } = getBirthday(year)
            const pesel = getPesel(year)
            const email = generateEmail(firstName, lastName, domain)
            const password = generatePassword()
            
            const temp = {
                firstName,
                lastName,
                pesel,
                birthday,
                gender,
                email,
                password,
                dateFirebase
            }
            data.push(temp)
        }
        return res.json(data)
    }
    
});

app.get("/api/users", (req, res) => {
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Origin", "*");
    const { count = 5, since = 1970, until = 2010, domain = 'oursite.com' } = req.query
    since == until ? year = since : year = null
    const data = []

    const isError = countErrorHandle(count)
    if(isError) return res.send(isError)

    const isYearsError = checkCorrectYears(since, until)
    if(isYearsError) return res.send(isYearsError)

    for(let i = 0; i < count; i++) {
        let { firstName, lastName, gender } = getNames()
        const { returnedBirthday: birthday, dateFirebase } = getBirthday(year, since, until)
        const pesel = getPesel(birthday.split('.')[2])
        const email = generateEmail(firstName, lastName, domain)
        const password = generatePassword()
        
        const temp = {
            firstName,
            lastName,
            pesel,
            birthday,
            gender,
            email,
            password,
            dateFirebase
        }
        data.push(temp)
    }
    return res.json(data)

})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))