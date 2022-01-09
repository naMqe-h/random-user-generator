const express = require('express');
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
        let tempPesel = []
        let lastDigits = year % 100

        // digits: [*][*][][][][][][][][][]
        if(lastDigits < 10) tempPesel.push('0' + lastDigits)
        else tempPesel.push(lastDigits.toString())

        // digits: [][][*][*][][][][][][][] 
        if(year >= 1800 && year <= 1899) tempPesel.push((parseInt(dateSplit[1]) + 80).toString())
        if(year >= 1900 && year <= 1999) tempPesel.push(dateSplit[1])
        if(year >= 2000 && year <= 2099) tempPesel.push((parseInt(dateSplit[1]) + 20).toString())

        // digits: [][][][][*][*][][][][][]
        if(parseInt(dateSplit[0]) < 10) tempPesel.push('0' + dateSplit[0])
        else tempPesel.push(dateSplit[0])

        // digits: [][][][][][][*][*][*][*][]
        let fourDigits
        if( gender == 'male') fourDigits = (Math.floor(Math.random() * 4999) * 2) + 1
        else fourDigits = Math.floor(Math.random() * 4999) * 2

        if(fourDigits < 10) fourDigits = '000' + fourDigits
        else if(fourDigits < 100) fourDigits = '00' + fourDigits
        else if(fourDigits < 1000) fourDigits = '0' + fourDigits
        
        tempPesel.push(fourDigits.toString())

        // digits: [][][][][][][][][][][*]
        let controlSum = (
                9 * tempPesel[0][0] + 
                7 * tempPesel[0][1] +  
                3 * tempPesel[1][0] + 
                1 * tempPesel[1][1] + 
                9 * tempPesel[2][0] + 
                7 * tempPesel[2][1] + 
                3 * tempPesel[3][0] + 
                1 * tempPesel[3][1] + 
                9 * tempPesel[3][2] + 
                7 * tempPesel[3][3]
            ) % 10
        tempPesel.push(controlSum)
        
        pesel = tempPesel.join('')
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
// 03 21 17 0629 3