const { expect } = require('chai')
const NeonJSON = require('../native')
const fs = require('fs')
const util = require('util')

const MAX_TIME = 5000

const confirmP = async (neonParsed, input) =>
{
    const jsonParsed = JSON.parse(input)
    expect(neonParsed).to.deep.equal(jsonParsed)
}

const confirmS = async (neonStringified, input) =>
{
    const jsonStringified = JSON.stringify(input)
    expect(jsonStringified === neonStringified)
}

const readFile = util.promisify(fs.readFile)

const getString = async function() 
{
    await readFile("test/example.json", "utf8")
        .then(function(data){
            input = data.slice(0)
        }.bind(this))
}

const getJson = async function() 
{
    await readFile("test/example.json", "utf8")
        .then(function(data){
            input = JSON.parse(data)
        }.bind(this),
        function(){
            console.error("Failed to read file"); 
        })
}

describe("Neon-JSON tests", function()
{
    this.timeout(MAX_TIME)

    it("Parse String to JSON object", async()=>
    {
       await getString()
       const neonParsed = NeonJSON.parse(input)
       await confirmP(neonParsed, input)
    })

    it("Stringify JSON Object", async()=>
    {
        await getJson()
        const neonStringified = NeonJSON.stringify(input)
        await confirmS(neonStringified, input)
    })
})