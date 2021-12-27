export class Files {

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

