const express = require('express');
const cors = require('cors')
const PORT = process.env.PORT || 5000
const { getNames, getBirthday, getPesel, countErrorHandle } = require('./functions')

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,
    optionSuccessStatus:200
}

const app = express()
app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send('Hello')
})

app.get("/api/users/single-year", (req, res) => {
    const { count = 5, year } = req.query
    const data = []

    let birthday, pesel

    const isError = countErrorHandle(count)
    if(isError) return res.send(isError)

    if(year < 1800 || year > 2099) return res.send({error: `Enter a valid value of the 'year' parameter in the range 1800-2099`})

    if(year) {
        for(let i = 0; i < count; i++) {
            let { firstName, lastName } = getNames()
            birthday = getBirthday(year)
            pesel = getPesel(year) 
            
            temp = {
                firstName,
                lastName,
                pesel,
                birthday,
            }
            data.push(temp)
        }
        return res.json(data)
    } else {
        return res.send({error: 'Enter correctly all required parameters (count, year)'})
    }
    
});

app.get("/api/users", (req, res) => {
    const { count = 5, since = 1970, until = 2010 } = req.query
    since == until ? year = since : year = null
    const data = []

    const isError = countErrorHandle(count)
    if(isError) return res.send(isError)

    if(since < 1800 || since > 2099 || until < 1800 || until > 2099) return res.send({error: 'Please enter a valid range of years. Possible dates are 1800-2099'})
    if(since > until) return res.send({error: `The 'since' parameter cannot have a greater value than the 'until' parameter`})

    for(let i = 0; i < count; i++) {
        let { firstName, lastName } = getNames()
        birthday = getBirthday(year, since, until)
        pesel = getPesel(birthday.split('.')[2])
        
        temp = {
            firstName,
            lastName,
            pesel,
            birthday,
        }
        data.push(temp)
    }
    return res.json(data)

})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))