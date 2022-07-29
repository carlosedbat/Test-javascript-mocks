const {readFile} = require('fs/promises');
const {join} = require('path');
const {error} = require('./constants');
const DEFAULT_OPTION = {
    maxlines:3,
    fields: ["id","name","profession","age"]
}

class File {
    static async csvToJson(filePath){
        const content = await File.getFIleContent(filePath)
        const validation = File.isValid(content)
        if(!validation.valid) throw new Error(validation.error)
        return content
    }

    static async getFIleContent(filePath){
        const filename = join(__dirname, filePath)
        return(await readFile(filename)).toString("utf8");
    }

    static isValid(csvSstring, options = DEFAULT_OPTION) {
        const [header, ...fileWithoutHeader] = csvSstring.split('\n')
        const isHeaderValid = header.trim() === options.fields.join(',')
        if(!isHeaderValid){
            return {
                error:error.FILE_FIELDS_ERROR_MESSAGE,
                valid:false
            }
        }
        

        const isContentLengthAccepted = (
            fileWithoutHeader.length > 0 &&
            fileWithoutHeader.length <= options.maxlines
        )
        if(!isContentLengthAccepted){
            return {
                error: error.FILE_LENGTH_ERROR_MESSAGE,
                valid:false
            }
        }

        return {valid:true}
    }
}

(async ()=>{
    const result = await File.csvToJson('./../mocks/threeItems-valid.csv')
    //const result = File.csvToJson('./../mocks/fourItems-invalid.csv')
    //const result = File.csvToJson('./../mocks/invalid-header.csv')
    console.log('result',result)
})();