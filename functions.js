const {male, female, femaleLastName, maleLastName} = require('./data')

let randomFirst, randomLast, gender

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

    randomNumbers()

    if(gender === 'male') {
        firstName = male[randomFirst]
        lastName = maleLastName[randomLast]
    } else {
        firstName = female[randomFirst]
        lastName = femaleLastName[randomLast]
    }

    return { firstName, lastName }
    
}

const getBirthday = (year, since, until) => {
    if (year) {
        birthday = randomDate(new Date(year, 0, 1), new Date(year, 12, 31))
        dateSplit = birthday.split('.')
        if(dateSplit[2] !== year) dateSplit[2] = year
        return dateSplit.join('.')
    } else {
        birthday = randomDate(new Date(since, 0, 1), new Date(until, 12, 31))
        dateSplit = birthday.split('.')
        if(dateSplit[2] > until) dateSplit[2] = until
        return dateSplit.join('.')
    }
    
}

const getPesel = (year) => {
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
    
    return tempPesel.join('')
}

const countErrorHandle = (count) => {
    if(parseInt(count) > 3000) return {error: 'Maksymalna ilość użytkowników na jednym zapytaniu to 3000'}
    if(count == 0) return {error: 'Minimalna ilość użytkowników do wygenerowania to 1'}

    return null
}

module.exports = { randomNumbers, getNames, getBirthday, getPesel, countErrorHandle}