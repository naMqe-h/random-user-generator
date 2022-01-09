const express = require('express')
const {male, female, femaleLastName, maleLastName} = require('./data')

const app = express()

app.get("/api/user-data", (req, res) => {
    const { count, year } = req.query
    const data = []
    let randomFirst, randomLast, gender, firstName, lastName, birthday, pesel

    const randomDate = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString()
    }

    const randomNumbers = () => {
        randomFirst = Math.floor(Math.random() * 149)
        randomLast = Math.floor(Math.random() * 149)
    }

    const getNames = () => {
        let tempGender = Math.floor(Math.random() * 11)
        gender = tempGender > 5 ? 'male' : 'female'

        if(gender === 'male') {
            firstName = male[randomFirst]
            lastName = maleLastName[randomLast]
        } else {
            firstName = female[randomFirst]
            lastName = femaleLastName[randomLast]
        }
        
    }

    const getBirthday = () => {
        birthday = randomDate(new Date(year, 0, 1), new Date(year, 12, 31))
        dateSplit = birthday.split('.')
        if(dateSplit[2] !== year) dateSplit[2] = year
        birthday = dateSplit.join('.')
    }

    const getPesel = () => {
        pesel = Math.floor(Math.random() * 89999999999 + 10000000000)
    }

    if(count && parseInt(count) > 3000) res.send({error: 'Maksymalna ilość użytkowników na jednym zapytaniu to 3000'})

    if(count == 0) res.send({error: 'Minimalna ilość użytkowników na jednym zapytaniu to 1'})

    if(count && year) {
        for(let i = 0; i < count; i++) {
            randomNumbers()
            getNames()
            getBirthday()
            getPesel()          
            
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