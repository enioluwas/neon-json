const NeonJSON = require('../native')
const request = require('request-promise')

const url = `http://www.json-generator.com/api/json/get/cpWOZVTftu?indent=2`

const getUrl = async function() 
{
    await request(url)    
        .then(function(str){
            largeStr = str.slice(0)
        }.bind(this))
}

const runBenchmarks = async function() 
{
    await getUrl()

    console.time("JSON Parse")
    largeObj = JSON.parse(largeStr)
    console.timeEnd("JSON Parse")

    console.time("JSON Stringify")
    largeStr2 = JSON.stringify(largeObj)
    console.timeEnd("JSON Stringify")

    console.time("NEON Parse")
    largeObj2 = NeonJSON.parse(largeStr)
    console.timeEnd("NEON Parse")

    console.time("NEON Stringify")
    largeStr2 = NeonJSON.stringify(largeObj)
    console.timeEnd("NEON Stringify")
}

runBenchmarks()
