const settings = require('./settings')
const Files = require('./files')
const MainExecuter = require('./executer')
const Logger = require('./logger')

const executer = new MainExecuter()
const logger = new Logger(settings.logNumber)

const titleBasics = Files.readTsvDataBuffer('title.basics')
executer.readTitleBasics(titleBasics)
console.log("\n*** read title basics ***")
if (settings.toLog) {
    logger.logDictionary(executer.titles)
}

const ratingsBasics = Files.readTsvDataFs('title.ratings')
executer.readRatingsBasics(ratingsBasics, settings.minReviews);
console.log("\n*** read rating basics ***")
if (settings.toLog) {
    logger.logDictionary(executer.titles)
}

executer.createSortedTitles()
console.log("\n*** created sorted titles ***")
if (settings.toLog) {
    logger.logArray(executer.sortedTitles)
}

executer.assignOrderRatings()
console.log("\n*** assigned order rating ***")
if (settings.toLog) {
    logger.logDictionary(executer.titles)
}

const crewBasics = Files.readTsvDataFs('title.crew')
executer.readCrewBasics(crewBasics)
console.log("\n*** read crew basics ***")
if (settings.toLog) {
    logger.logDictionary(executer.directors)
}

executer.calculateScores(settings.exponent)
console.log("\n*** calculated scores ***")
if (settings.toLog) {
    logger.logDictionary(executer.directors)
}

executer.createSortedDirectors()
console.log("\n*** created sorted directors list ***")
if (settings.toLog) {
    logger.logArray(executer.sortedDirectors)
}

const namesBasics = Files.readTsvDataBuffer('name.basics')
executer.readNameBasics(namesBasics)
if (settings.toLog) {
    logger.logDictionary(executer.direcotrs)
}

const output = executer.generateOutput()
if (settings.toLog) {
    console.log(output.slice(0, 100), settings.toOutput)
}
Files.writeToFile(output)

