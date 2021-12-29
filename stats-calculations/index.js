const settings = require('./settings')
const Files = require('./files')
const MainExecuter = require('./executer')
const Logger = require('./logger')

const executer = new MainExecuter()
// const logger = new Logger(settings.logNumber)

const titleBasics = Files.readTsvDataBuffer('title.basics')
executer.readTitleBasics(titleBasics)
console.log("\n*** read title basics ***")
// logger.logDictionary(executer.titles)

const ratingsBasics = Files.readTsvDataFs('title.ratings')
executer.readRatingsBasics(ratingsBasics, settings.minReviews);
console.log("\n*** read rating basics ***")
// logger.logDictionary(executer.titles)

executer.createSortedTitles()
console.log("\n*** created sorted titles ***")
// logger.logArray(executer.sortedTitles)

executer.assignOrderRatings()
console.log("\n*** assigned order rating ***")
// logger.logDictionary(executer.titles)

const crewBasics = Files.readTsvDataFs('title.crew')
executer.readCrewBasics(crewBasics)
console.log("\n*** read crew basics ***")
// logger.logDictionary(executer.directors)

executer.calculateScores(settings.exponent)
console.log("\n*** calculated scores ***")
// logger.logDictionary(executer.directors)

executer.createSortedDirectors()
console.log("\n*** created sorted directors list ***")
e// logger.logArray(executer.sortedDirectors)

const namesBasics = Files.readTsvDataBuffer('name.basics')
executer.readNameBasics(namesBasics)
// logger.logDictionary(executer.direcotrs)

const output = executer.generateOutput()
// console.log(output.slice(0, 100), settings.toOutput)
Files.writeToFile(output)

