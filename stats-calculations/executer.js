class MainExecuter {

    titles
    directors
    sortedTitles
    sortedDirectors

    constructor() {
        this.titles = {}
        this.directors = {}
    }

    readTitleBasics(titleBasics) {
        titleBasics.forEach((nextLine) => {
            const lineContents = nextLine.split('\t')
            if (lineContents[1] === 'movie') {
                this.titles[lineContents[0]] = { title: lineContents[2] }
            }
        })
    }

    readRatingsBasicsIntoTitles(ratingsBasics, minReviews) {
        const tooFewReviewsList = []
        ratingsBasics.forEach((nextLine) => {
            const lineContents = nextLine.split('\t')
            if (!this.titles[lineContents[0]]) {
                return; 
            }
            this.titles[lineContents[0]].rating = lineContents[1]
            if (lineContents[2] < minReviews) {
                tooFewReviewsList.push(lineContents[0])
            }
        })
        tooFewReviewsList.forEach(movieId => {
            delete this.titles[movieId]
        })
        Object.keys(this.titles).forEach(key => {
            if (!this.titles[key].rating) {
                delete this.titles[key]
            }
        })
    }

    createSortedTitles() {
        this.sortedTitles = Object.keys(this.titles)
        this.sortedTitles.sort((first, second) => { 
            return this.titles[first].rating - this.titles[second].rating 
        })
    }

    assignTitleRanks() {
        for (let place = 1; place <= this.sortedTitles.length; place++) {
            const movie = this.sortedTitles[place - 1]
            this.titles[movie].rank = (place / this.sortedTitles.length)
        }
    }

    readCrewBasics(crewBasics) {
        crewBasics.forEach((nextLine) => {
            if (nextLine === '') {
                return 
            }
            const lineContents = nextLine.split('\t')
            if (lineContents[1] === '\N') {
                return 
            }
            if (!this.titles[lineContents[0]]) {
                return
            }
            const directorsRaw = lineContents[1].split(',')
            directorsRaw.forEach(director => {
                if (!this.directors[director]) {
                    this.directors[director] = { movies: [] }
                }
                this.directors[director].movies.push(lineContents[0])
            })
        })
    }

    scoreDirectors(exponent, precision) {
        const precisionX = Math.pow(10, precision)
        Object.keys(this.directors).forEach(key => { 
            const director = this.directors[key]
            this.calculateSumRanksExpScore(director, exponent, precisionX)
            this.calculateAverageRating(director, precisionX)
        })
    }

    calculateSumRanksExpScore(director, exponent, precisionX) {
        const calculatedScore = director.movies.reduce((acc, movie) => {
            const score = this.titles[movie].rank
            return acc + Math.pow(+score, exponent) 
        }, 0)
        director.score = Math.round(calculatedScore * precisionX) / precisionX
    }

    calculateAverageRating(director, precisionX) {
        const avgRating = director.movies.reduce((acc, movie) => {
            return acc + +this.titles[movie].rating
        }, 0) / director.movies.length
        director.avgRating = Math.round(avgRating * precisionX) / precisionX
    }

    createSortedDirectors() {
        this.sortedDirectors = Object.keys(this.directors)
        this.sortedDirectors.sort((first, second) => { // descending
            return this.directors[second].score - this.directors[first].score
        })
    }

    readNameBasicsIntoDirectors(namesBasics) {
        namesBasics.forEach(person => {
            const personDetails = person.split('\t')
            if (this.directors[personDetails[0]]) {
                this.directors[personDetails[0]].name = personDetails[1]
            }
        })
    }

    generateCSVOutput() {
        return [
            'name',
            '# of movies',
            'avg rating',
            'score'
        ].join(', ') + '\n'
        + this.sortedDirectors.reduce((acc, key) => {
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

module.exports = MainExecuter 