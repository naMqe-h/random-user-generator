const express = require('express');
const { getNames, getBirthday, getPesel } = require('./functions')

const app = express()

app.get("/api/user-data", (req, res) => {
    const { count, year } = req.query
    const data = []

    let birthday, pesel

    if(count && parseInt(count) > 3000) res.send({error: 'Maksymalna ilość użytkowników na jednym zapytaniu to 3000'})

    if(count == 0) res.send({error: 'Minimalna ilość użytkowników na jednym zapytaniu to 1'})

    if(year < 1800 || year > 2099) res.send({error: 'Podaj wartość parametru year z przediału 1800-2099'})

    if(count && year) {
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

app.listen(5000)