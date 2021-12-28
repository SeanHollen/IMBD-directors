class MainExecuter {

    titles
    directors
    sortedTitles
    sortedDirectors

    constructor() {
        this.titles = {}
        this.directors = {}
    }

    logTitles(number) {
        const keyArray = Object.keys(this.titles)
        console.log('titles length:', keyArray.length)
        keyArray.slice(0, number).forEach(key => {
            console.log(`${key}: ${JSON.stringify(this.titles[key])}`)
        })
    }

    logDirectors(number) {
        const keyArray = Object.keys(this.directors)
        console.log('directors length:', keyArray.length)
        keyArray.slice(0, number).forEach(key => {
            console.log(`${key}: ${JSON.stringify(this.directors[key])}`)
        })
    }

    logSortedTitles(number) {
        console.log('sorted titles length:', this.sortedTitles.length)
        console.log(this.sortedTitles.slice(0, number))
    }

    logSortedDirectors(number) {
        console.log('sorted directors length:', this.sortedDirectors.length)
        console.log(this.sortedDirectors.slice(0, number))
    }

    readTitleBasics(titleBasics) {
        titleBasics.forEach((nextLine) => {
            const lineContents = nextLine.split('\t')
            if (lineContents[1] === 'movie') {
                this.titles[lineContents[0]] = { title: lineContents[2] }
            }
        })
    }

    readRatingsBasics(ratingsBasics, minReviews) {
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
            this.titles[movie].orderRating = (place / this.sortedTitles.length)
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

    // todo: test
    calculateScores(exponent) {
        Object.keys(this.directors).forEach(key => { 
            const director = this.directors[key]
            director.score = director.movies.reduce((acc, movie) => {
                const score = this.titles[movie].orderRating
                return acc + Math.pow(score, exponent) 
            }, 0)
            director.avgRating = director.movies.reduce((acc, movie) => {
                if (!this.titles[movie].rating) {
                    return 0
                } 
                return acc + this.titles[movie].rating
            }, 0) / director.movies.length
        })
    }

    // todo: test
    createSortedDirectors() {
        this.sortedDirectors = Object.keys(this.directors)
        this.sortedDirectors.sort((first, second) => { // descending
            return this.directors[second].score - this.directors[first].score
        })
    }

    // todo: test
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
        + this.sortedDirectors.reduce((acc, key) => {
            const director = this.directors[key]
            return acc + [
                director.name, 
                director.movies.length, 
                director.avgRating, 
                Math.round(director.score * 100) / 100
            ].join(', ') + '\n'
        }, '')
    }

}

module.exports = MainExecuter 