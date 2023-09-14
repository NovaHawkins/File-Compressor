const fs = require('fs')
const zlib = require('zlib')

// Reads the input file & designates an output file
const inputFile = 'promise.js'
const outputFile = 'compressed.zip'

async function compressFile(inputFile, outputFile) {
  try {
    const inpFileCont = fs.readFileSync(inputFile, 'utf8')
    // the 'gzip' thingy synchronously compresses the input file content
    const compCont = zlib.gzipSync(inpFileCont)
    fs.writeFileSync(outputFile, compCont)
    console.log(`File '${inputFile}' compressed to '${outputFile}' successfully.`)


    fs.unlink(inputFile, (unlinkError) => {
      if (unlinkError) {
        console.error('Error deleting original file:', unlinkError)
      } else {
        console.log(`Original file '${inputFile}' deleted.`)
      }
    })
  } catch (error) {
    console.error('Error compressing file:', error)
  }
}

compressFile(inputFile, outputFile)
