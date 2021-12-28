const MainExecuter = require("../executer");

describe('executer', () => {

    let executer; 

    beforeAll(() => {
        executer = new MainExecuter()
    })

    it('should exist executer', () => {
        expect(executer).toBeTruthy()
    })

    it('should read title basics', () => {
        const file = [
            'tt2396683	movie	movie 1',
            'tt2396684	movie	movie 2',
            'tt2396685	video	movie 3',
            'tt2396686	movie	movie 4',
            'tt2396687	movie	movie 5'
        ]
        const expectedOutput = {
            tt2396683: { title: 'movie 1' },
            tt2396684: { title: 'movie 2' },
            tt2396686: { title: 'movie 4' },
            tt2396687: { title: 'movie 5' },
        }
        executer.readTitleBasics(file)

        expect(executer.titles).toEqual(expectedOutput)
    })

    it('should read ratings basics', () => {
        const file = [
            'tt2396683	6.0\t3002',
            'tt2396684	6.5\t2998',
            'tt2396686	6.2\t3002',
            'tt2396687	5.1\t3002',

            'tt0000007	5.4 3002'
        ]
        const expectedOutput = {
            tt2396683: { title: 'movie 1', rating: '6.0' },
            tt2396686: { title: 'movie 4', rating: '6.2' },
            tt2396687: { title: 'movie 5', rating: '5.1' },
        }
        executer.readRatingsBasics(file, 3000)

        expect(executer.titles).toEqual(expectedOutput)
    })

    it('should create sorted titles', () => {
        const expectedOutput = [
            'tt2396687', 'tt2396683', 'tt2396686'
        ]
        executer.createSortedTitles()

        expect(executer.sortedTitles).toEqual(expectedOutput)
    })

    it('should assign order ratings', () => {
        const expectedOutput = {
            tt2396683: { title: 'movie 1', rating: '6.0', orderRating: 2/3 },
            tt2396686: { title: 'movie 4', rating: '6.2', orderRating: 3/3 },
            tt2396687: { title: 'movie 5', rating: '5.1', orderRating: 1/3 },
        }
        executer.assignOrderRatings()

        expect(executer.titles).toEqual(expectedOutput)
    })

    it('should read crew basics', () => {
        executer.titles = {
            tt01: { title: 'tt01', rating: '1', orderRating: 1/10 },
            tt02: { title: 'tt02', rating: '2', orderRating: 2/10 },
            tt03: { title: 'tt03', rating: '3', orderRating: 3/10 },
            tt04: { title: 'tt04', rating: '4', orderRating: 4/10 },
            tt05: { title: 'tt05', rating: '5', orderRating: 5/10 },
            tt06: { title: 'tt06', rating: '6', orderRating: 6/10 },
            tt07: { title: 'tt07', rating: '7', orderRating: 7/10 },
            tt08: { title: 'tt08', rating: '8', orderRating: 8/10 },
            tt09: { title: 'tt09', rating: '9', orderRating: 9/10 },
            tt10: { title: 'tt10', rating: '10', orderRating: 10/10 },
        }
        const file = [
            'tt00	\N	\N',
            'tt01	nm0000001,nm0000006	nm0000005',
            'tt11	nm0000001	nm4826235,nm1211274',
            'tt02	nm0000001	nm4826235,nm1211274',
            'tt03	nm0000002	nm4826235,nm1211274',
            'tt04	nm0000002	nm4826235,nm1211274',
            'tt05	nm0000003	nm4826235,nm1211274',
            'tt06	nm0000003	nm4826235,nm1211274',
            'tt07	nm0000004	nm4826235,nm1211274',
            'tt08	nm0000004	nm4826235,nm1211274',
            'tt09	nm0000005	nm4826235,nm1211274',
            'tt10	nm0000005	nm4826235,nm1211274',
            ''
        ]
        const expectedOutput = {
            nm0000006: { movies: [ 'tt01' ] },
            nm0000001: { movies: [ 'tt01', 'tt02' ] },
            nm0000002: { movies: [ 'tt03', 'tt04' ] },
            nm0000003: { movies: [ 'tt05', 'tt06' ] },
            nm0000004: { movies: [ 'tt07', 'tt08' ] },
            nm0000005: { movies: [ 'tt09', 'tt10'] },
        }
        executer.readCrewBasics(file)

        expect(executer.directors).toEqual(expectedOutput)
    })

    it('should calculate scores', () => {
        const expectedOutput = {
            nm0000001: { movies: [ 'tt01', 'tt02' ], score: 0.3, avgRating: 1.5 },
            nm0000002: { movies: [ 'tt03', 'tt04' ], score: 0.7, avgRating: 3.5 },
            nm0000003: { movies: [ 'tt05', 'tt06' ], score: 1.1, avgRating: 5.5 },
            nm0000004: { movies: [ 'tt07', 'tt08' ], score: 1.5, avgRating: 7.5 },
            nm0000005: { movies: [ 'tt09', 'tt10' ], score: 1.9, avgRating: 9.5 },
            nm0000006: { movies: [ 'tt01' ], score: 0.1, avgRating: 1 },
        }
        executer.calculateScores(1)

        expect(executer.directors).toEqual(expectedOutput)
    })

    it('create sorted directors list', () => {
        const expectedOutput = [ 
            'nm0000005', 'nm0000004', 'nm0000003', 'nm0000002', 'nm0000001', 'nm0000006',
        ]
        executer.createSortedDirectors()

        expect(executer.sortedDirectors).toEqual(expectedOutput)
    })

    it('should read name basics and assign names to directors', () => {
        const file = [
            'nm0000005	Lauren Bacall	1924	',
            'nm0000004	Brigitte Bardot	1934	',
            'nm0000003	John Belushi	1949	',
            'nm0000002	Ingmar Bergman	1918	',
            'nm0000001	Dan Batman	1918	',
            'nm0000006	Super Dunce	1918	'
        ]
        executer.readNameBasics(file)
        const expectedOutput = {
            nm0000001: { name: 'Dan Batman', movies: [ 'tt01', 'tt02' ], score: 0.3, avgRating: 1.5 },
            nm0000002: { name: 'Ingmar Bergman', movies: [ 'tt03', 'tt04' ], score: 0.7, avgRating: 3.5 },
            nm0000003: { name: 'John Belushi', movies: [ 'tt05', 'tt06' ], score: 1.1, avgRating: 5.5 },
            nm0000004: { name: 'Brigitte Bardot', movies: [ 'tt07', 'tt08' ], score: 1.5, avgRating: 7.5 },
            nm0000005: { name: 'Lauren Bacall', movies: [ 'tt09', 'tt10' ], score: 1.9, avgRating: 9.5 },
            nm0000006: { name: 'Super Dunce', movies: [ 'tt01' ], score: 0.1, avgRating: 1 },
        }

        expect(executer.directors).toEqual(expectedOutput)
    }) 
})