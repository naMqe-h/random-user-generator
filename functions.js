const {male, female, femaleLastName, maleLastName} = require('./data')

// real number - 1
const numberOfNames = 149

let randomFirst, randomLast, gender

const randomDate = (start, end) => {
    const dateTemp = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    const date = dateTemp.toLocaleDateString('pl')
    const dateFirebase =  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString('en-CA')
    return { date, dateFirebase } 
}

const randomNumbers = () => {
    randomFirst = Math.floor(Math.random() * numberOfNames)
    randomLast = Math.floor(Math.random() * numberOfNames)
}

const getNames = () => {
    gender = Math.random() > 0.5 ? 'Mężczyzna' : 'Kobieta'

    randomNumbers()

    if(gender === 'Mężczyzna') {
        firstName = male[randomFirst]
        lastName = maleLastName[randomLast]
    } else {
        firstName = female[randomFirst]
        lastName = femaleLastName[randomLast]
    }

    return { firstName, lastName, gender }
    
}

const getBirthday = (year, since, until) => {
    let returnedFirebase
    if(year) {
        newDate = randomDate(new Date(year, 0, 1), new Date(year, 12, 31))
        dateSplit = newDate.date.split('.')
        if(dateSplit[2] !== year) dateSplit[2] = year
        if(newDate.dateFirebase.split('-')[0] !== year) {
            const temp = newDate.dateFirebase.split('-')
            temp[0] = year
            returnedFirebase = temp.join('-')
        } else {
            returnedFirebase = newDate.dateFirebase
        }
        const returnedBirthday = dateSplit.join('.')
        return { returnedBirthday, dateFirebase: returnedFirebase }
    } else {
        newDate = randomDate(new Date(since, 0, 1), new Date(until, 12, 31))
        dateSplit = newDate.date.split('.')
        if(dateSplit[2] > until) dateSplit[2] = until
        if(newDate.dateFirebase.split('-')[0] > until) newDate.dateFirebase.split('-')[0] = until
        const returnedBirthday = dateSplit.join('.')
        return { returnedBirthday, dateFirebase: newDate.dateFirebase }
    }

}

const getPesel = (year) => {
    let tempPesel = []
    let lastDigits = year % 100

    // digits: [*][*][][][][][][][][][]
    if(lastDigits < 10) tempPesel.push('0' + lastDigits)
    else tempPesel.push(lastDigits.toString())

    // digits: [][][*][*][][][][][][][] 
    if(year >= 1800 && year <= 1899) tempPesel.push((+dateSplit[1] + 80).toString())
    if(year >= 1900 && year <= 1999) tempPesel.push(dateSplit[1])
    if(year >= 2000 && year <= 2099) tempPesel.push((+dateSplit[1] + 20).toString())

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

const generateEmail = (firstName, lastName, domain) => {
    const email = (firstName.slice(0,3) + lastName.slice(0, 3) + Math.floor(Math.random() * 1000)).toLowerCase() + '@' + domain
    return email
}

const generatePassword = () => {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+="
    let password = '', temp

    for(let i = 0; i < 10; i++) {
        temp = Math.floor(Math.random() * characters.length)
        password += characters.charAt(temp)
    }
    
    return password
}

const countErrorHandle = (count) => {
    if(+count > 3000) return {error: 'The maximum number of users to generate is 3000'}
    if(count == 0) return {error: 'The minimum number of users to generate is 1'}

    return null
}

const checkCorrectYears = (since, until) => {
    if(since < 1800 || since > 2099 || until < 1800 || until > 2099) return {error: 'Please enter a valid range of years. Possible dates are 1800-2099'}
    if(since > until) return {error: `The 'since' parameter cannot have a greater value than the 'until' parameter`}

    return null
}

module.exports = { randomNumbers, getNames, getBirthday, getPesel, generateEmail, generatePassword, countErrorHandle, checkCorrectYears }