const settings = require('./settings')
const Files = require('./files')
const MainExecuter = require('./executer')

const executer = new MainExecuter()

const titleBasics = Files.readTsvDataBuffer('title.basics')
executer.readTitleBasics(titleBasics)
console.log("\n*** read title basics ***")
// executer.logTitles(settings.logNumber)

const ratingsBasics = Files.readTsvDataFs('title.ratings')
executer.readRatingsBasics(ratingsBasics, settings.minReviews);
console.log("\n*** read reatings basics ***")
// executer.logTitles(settings.logNumber)

executer.createSortedTitles()
console.log("\n*** created sorted titles ***")
// executer.logTitles(settings.logNumber)

executer.assignOrderRatings()
console.log("\n*** assigned order rating ***")
executer.logTitles(settings.logNumber)

const crewBasics = Files.readTsvDataFs('title.crew')
executer.readCrewBasics(crewBasics)
console.log("\n*** read crew basics ***")
executer.logDirectors(settings.logNumber)

executer.calculateScores(settings.exponent)
console.log("\n*** calculated scores ***")
executer.logDirectors(settings.logNumber)

executer.createSortedDirectors()
console.log("\n*** created sorted directors list ***")
executer.logSortedDirectors(settings.logNumber)

const namesBasics = Files.readTsvDataBuffer('name.basics')
executer.readNameBasics(namesBasics)
// executer.logDirectors(settings.logNumber)

const output = executer.generateOutput()
console.log(output.slice(0, 1000), settings.toOutput)
Files.writeToFile(output)

