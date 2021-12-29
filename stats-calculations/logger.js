class Logger {

    logNumber

    constructor(logNumber) {
        this.logNumber = logNumber
    }

    logDictionary(dict) {
        const keyArray = Object.keys(dict)
        console.log('length:', keyArray.length)
        keyArray.slice(0, this.logNumber).forEach(key => {
            console.log(`${key}: ${JSON.stringify(dict[key])}`)
        })
    }

    logArray(arr) {
        console.log('length:', arr.length)
        console.log(arr.slice(0, this.logNumber))
    }

}

module.exports = Logger 