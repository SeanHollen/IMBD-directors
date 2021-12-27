const fs = require('fs')
const settings = require('./settings')
const Files = require('./files')

class MainExecuter {

    titles
    directors
    sortedTitles

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
                this.titles[lineContents[0]]['rating'] = lineContents[1]
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
        const titlesArray = Object.keys(this.titles)
        titlesArray.sort((first, second) => { 
            return first.rating - second.rating 
        })
    }

    assignOrderRatings() {
        for (let place = 1; place <= this.sortedTitles.length; place++) {
            const movie = this.sortedTitles[place - 1]
            this.titles[movie]['orderRating'] = place / titles.length
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
                this.directors[director]['movies'].push(lineContents[0])
            })
        })
    }

    calculateScores(exponent) {
        Object.keys(this.directors).forEach(key => { 
            const director = this.directors[key]
            director['score'] = director.movies.reduce((acc, movie) => {
                const score = this.titles[movie]['orderRating']
                acc += Math.pow(score, exponent)
            }, 0)
            director['avgRating'] = director.movies.reduce((acc, movie) => {
                acc += this.titles[movie]['rating']
            }, 0) / director.movies.length
        })
    }

    readNameBasics(namesBasics) {
        namesBasics.forEach(person => {
            const personDetails = person.split('\t')
            if (this.directors[personDetails[0]]) {
                this.directors[personDetails[0]]['name'] = personDetails[1]
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
logTitles(settings[logNumber])

const ratingsBasics = Files.readTsvDataFs('title.ratings')
executer.readRatingsBasics(ratingsBasics, settings[minReviews]);
logTitles(settings[logNumber])

executer.createSortedTitles()
logTitles(settings[logNumber])

executer.assignOrderRatings()
logTitles(settings[logNumber])

const crewBasics = Files.readTsvDataFs('title.crew')
readCrewBasics(crewBasics)
logDirectors(settings[logNumber])

calculateScores(settings[exponent])
logDirectors(settings[logNumber])

const namesBasics = Files.readTsvDataBuffer('name.basics')
readNameBasics(namesBasics)
logDirectors(settings[logNumber])

const output = generateOutput()
console.log(output, settings[toOutput]); 
Files.writeToFile(output)

