const fs = require('fs')

class Files {

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

    // some files to large to be read by fs synchronously 
    static readTsvDataBuffer(name) {
        const path = `../data/${name}.tsv`
        const fd = fs.openSync(path, 'r')
        const bufferSize = 1024 * 1024 * 250
        const buffer = Buffer.alloc(bufferSize)
        let dataFileLines = []
        let lastLineOfPrev = ''
        let numRead 
        while ((numRead = fs.readSync(fd, buffer, 0, bufferSize, null)) !== 0) {
            const chunk = buffer.toString('utf8', 0, numRead)
            const currentLines = chunk.split('\n')
            currentLines[0] = lastLineOfPrev + currentLines[0]
            lastLineOfPrev = currentLines.pop()
            dataFileLines = dataFileLines.concat(currentLines)
            console.log(`${dataFileLines.length} lines read`)
        }
        dataFileLines.push(lastLineOfPrev)

        return dataFileLines.slice(1)
    }
}

module.exports = Files

