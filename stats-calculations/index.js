const fs = require('fs')
const settings = require('./settings')
const Files = require('./files')

class MainExecuter {

    titles
    sortedTitles
    directors
    sortedDirectors

    constructor() {
        this.titles = {}
        this.directors = {}
    }

    logTitles(number) {
        console.log('titles length:', this.titles.length)
        console.log(this.titles.slice(0, number))
    }

    logDirectors(number) {
        console.log('directors length:', this.directors.length)
        console.log(this.directors.slice(0, number))
    }

    logSortedTitles(number) {
        console.log('sorted titles length:', this.directors.length)
        console.log(this.sortedTitles.slice(0, number))
    }

    logSortedDirectors(number) {
        console.log('sorted directors length:', this.directors.length)
        console.log(this.sortedDirectors.slice(0, number))
    }

    readTitleBasics(titleBasics) {
        titleBasics.forEach((nextLine) => {
            const lineContents = nextLine.split('\t')
            if (lineContents[1] === 'movie') {
                this.titles[0] = { title: lineContents[2] }
            }
        })
    }

    readRatingsBasics(ratingsBasics, minReviews) {
        const tooFewReviewsList = []
        ratingsBasics.forEach((nextLine) => {
            const lineContents = nextLine.split('\t')
            if (this.titles[lineContents[0]]) {
                this.titles[lineContents[0]].rating = lineContents[1]
                if (lineContents[3] < minReviews) {
                    tooFewReviewsList.push(lineContents[0])
                }
            }
        })
        tooFewReviewsList.forEach(movieId => {
            delete this.titles[movieId];
        })
    }

    createSortedTitles() {
        this.sortedTitles = Object.keys(this.titles)
        this.sortedTitles.sort((first, second) => { 
            return this.titles[first].rating - this.titles[second].rating 
        })
    }

    assignOrderRatings() {
        for (let place = 1; place <= this.sortedTitles.length; place++) {
            const movie = this.sortedTitles[place - 1]
            this.titles[movie].orderRating = place / titles.length
        }
    }

    readCrewBasics(crewBasics) {
        crewBasics.forEach((nextLine) => {
            const lineContents = nextLine.split('\t')
            if (lineContents[1] === '\N') {
                return 
            }
            const directorsRaw = lineContents[1].split(',')
            directorsRaw.forEach(director => {
                if (this.directors[director]) {
                    this.directors[director] = { movies: [] }
                }
                this.directors[director].movies.push(lineContents[0])
            })
        })
    }

    createSortedDirectors() {
        this.sortedDirectors = Object.keys(this.titles)
        this.sortedDirectors.sort((first, second) => { // descending
            return this.directors[second].score - this.directors[first].score 
        })
    }

    calculateScores(exponent) {
        this.sortedDirectors(this.directors).forEach(key => { 
            const director = this.directors[key]
            director.score = director.movies.reduce((acc, movie) => {
                const score = this.titles[movie].orderRating
                acc += Math.pow(score, exponent)
            }, 0)
            director.avgRating = director.movies.reduce((acc, movie) => {
                acc += this.titles[movie].rating
            }, 0) / director.movies.length
        })
    }

    readNameBasics(namesBasics) {
        namesBasics.forEach(person => {
            const personDetails = person.split('\t')
            if (this.directors[personDetails[0]]) {
                this.directors[personDetails[0]].name = personDetails[1]
            }
        })
    }

    generateOutput() {
        return [
            'name',
            '# of movies',
            'avg rating',
            'score'
        ].join(', ') + '\n'
        + Object.keys(this.directors).reduce((acc, key) => {
            const director = this.directors[key]
            return acc + [
                director.name, 
                director.movies.length, 
                director.avgRating, 
                director.score
            ].join(', ') + '\n'
        }, '')
    }

}

const executer = new MainExecuter()

const titleBasics = Files.readTsvDataBuffer('title.basics')
executer.readTitleBasics(titleBasics)
executer.logTitles(settings[logNumber])

const ratingsBasics = Files.readTsvDataFs('title.ratings')
executer.readRatingsBasics(ratingsBasics, settings[minReviews]);
executer.logTitles(settings[logNumber])

executer.createSortedTitles()
executer.logTitles(settings[logNumber])

executer.assignOrderRatings()
executer.logTitles(settings[logNumber])

const crewBasics = Files.readTsvDataFs('title.crew')
executer.readCrewBasics(crewBasics)
executer.logDirectors(settings[logNumber])

executer.createSortedDirectors()
executer.logSortedDirectors()

executer.calculateScores(settings[exponent])
executer.logDirectors(settings[logNumber])

const namesBasics = Files.readTsvDataBuffer('name.basics')
executer.readNameBasics(namesBasics)
executer.logDirectors(settings[logNumber])

const output = generateOutput()
console.log(output, settings[toOutput])
// Files.writeToFile(output)

