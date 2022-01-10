const express = require('express');
const { getNames, getBirthday, getPesel, countErrorHandle } = require('./functions')

const app = express()

app.get("/api/users/single-year", (req, res) => {
    const { count = 5, year } = req.query
    const data = []

    let birthday, pesel

    const isError = countErrorHandle(count)
    if(isError) return res.send(isError)

    if(year < 1800 || year > 2099) return res.send({error: `Podaj poprawną wartość parametru 'year' z przediału 1800-2099`})

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
        return res.send({error: 'Podaj poprawnie wszystkie wymagane parametry (count, year)'})
    }
    
});

app.get("/api/users", (req, res) => {
    const { count = 5, since = 1970, until = 2010 } = req.query
    since == until ? year = since : year = null
    const data = []

    const isError = countErrorHandle(count)
    if(isError) return res.send(isError)

    if(since < 1800 || since > 2099 || until < 1800 || until > 2099) return res.send({error: 'Podaj poprawny zakres lat. Możliwe daty z przedziału 1800-2099'})
    if(since > until) return res.send({error: `Parametr 'since' nie może mieć większej wartości od parametru 'until'`})

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

app.listen(5000)