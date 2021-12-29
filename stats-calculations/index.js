const settings = require('./settings')
const Files = require('./files')
const MainExecuter = require('./executer')
const Logger = require('./logger')

const executer = new MainExecuter()
const logger = new Logger(settings.numberToLog)

const titleBasics = Files.readTsvDataBuffer('title.basics')
executer.readTitleBasics(titleBasics)
console.log("\n*** title basics read ***")
if (settings.isVerbose) {
    logger.logDictionary(executer.titles)
}

const ratingsBasics = Files.readTsvDataFs('title.ratings')
executer.readRatingsBasicsIntoTitles(ratingsBasics, settings.minReviews);
console.log("\n*** rating basics read ***")
if (settings.isVerbose) {
    logger.logDictionary(executer.titles)
}

executer.createSortedTitles()
console.log("\n*** created sorted titles ***")
if (settings.isVerbose) {
    logger.logArray(executer.sortedTitles)
}

executer.assignTitleRanks()
console.log("\n*** assigned title ranks ***")
if (settings.isVerbose) {
    logger.logDictionary(executer.titles)
}

const crewBasics = Files.readTsvDataFs('title.crew')
executer.readCrewBasics(crewBasics)
console.log("\n*** crew basics read ***")
if (settings.isVerbose) {
    logger.logDictionary(executer.directors)
}

executer.scoreDirectors(settings.exponent, settings.precision)
console.log("\n*** calculated scores ***")
if (settings.isVerbose) {
    logger.logDictionary(executer.directors)
}

executer.createSortedDirectors()
console.log("\n*** created sorted directors list ***")
if (settings.isVerbose) {
    logger.logArray(executer.sortedDirectors)
}

const namesBasics = Files.readTsvDataBuffer('name.basics')
executer.readNameBasicsIntoDirectors(namesBasics)
if (settings.isVerbose) {
    logger.logDictionary(executer.direcotrs)
}

const output = executer.generateCSVOutput()
if (settings.isVerbose) {
    console.log(output.slice(0, 100), settings.toOutput)
}
Files.writeToFile(output)

