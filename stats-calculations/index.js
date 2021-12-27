const fs = require('fs');

class MainExecuter {

    titles
    directors

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

    sortTitles() {
        this.titles.sort((first, second) => {  // fix
            return first.rating - second.rating 
        })
    }

    assignOrderRatings() {
        for (let place = 1; place <= this.titles.length; place++) {
            const movie = this.titles[place - 1]
            movie['orderRating'] = place / titles.length
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

    static writeToFile(output) {
        fs.writeFileSync(`../output-data.csv`, output)
    }

    static readTsvDataFs(name) {
        try {
            const data = fs.readFileSync(`../data/${name}.tsv`, 'utf8')
            return data.split('\n').slice(1)
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static readTsvDataBuffer(name) {
        // todo 
    }

}

const executer = new MainExecuter()
const logNumber = process.argv[3] || 5;

const titleBasics = MainExecuter.readTsvDataBuffer('title.basics')
executer.readTitleBasics(titleBasics)
logTitles(logNumber)

const ratingsBasics = MainExecuter.readTsvDataFs('title.ratings')
const minReviews = process.argv[2] || 3000
executer.readRatingsBasics(ratingsBasics, minReviews);
logTitles(logNumber)

executer.sortTitles()
logTitles(logNumber)

executer.assignOrderRatings()
logTitles(logNumber)

const crewBasics = MainExecuter.readTsvDataFs('title.crew')
readCrewBasics(crewBasics)
logDirectors(logNumber)

const exponent = process.argv[1] || 5
calculateScores(exponent)
logDirectors(logNumber)

const namesBasics = MainExecuter.readTsvDataBuffer('name.basics')
readNameBasics(namesBasics)
logDirectors(logNumber)

const output = generateOutput()
console.log(output); 
MainExecuter.writeToFile(output)

