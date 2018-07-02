const { expect } = require('chai')
const NeonJSON = require('../native')
const fs = require('fs')
const util = require('util')

const MAX_TIME = 5000

const confirmP = async (neonParsed, input, reviver) =>
{
    if(typeof reviver === "undefined")
    {
        const jsonParsed = JSON.parse(input);
        expect(neonParsed).to.deep.equal(jsonParsed);
    }

    else
    {
        const jsonParsed = JSON.parse(input, reviver);
        expect(neonParsed).to.deep.equal(jsonParsed);
    }
}

const confirmS = async (neonStringified, input) =>
{
    const jsonStringified = JSON.stringify(input);
    expect(jsonStringified === neonStringified);
}

const dataTransfomer = function(key, value)
{
    if(key === "_id")
    {
        var newId = "001";
        return newId; 
    }

    return value;
}

const readFile = util.promisify(fs.readFile)

const getString = async function() 
{
    await readFile("test/example.json", "utf8")
        .then(function(data){
            input = data.slice(0);
        }.bind(this))
}

const getJson = async function() 
{
    await readFile("test/example.json", "utf8")
        .then(function(data){
            input = JSON.parse(data);
        }.bind(this),
        function(){
            console.error("Failed to read file"); 
        })
}

describe("Neon-JSON tests", function()
{
    this.timeout(MAX_TIME);

    it("Parse String to JSON object", async()=>
    {
       await getString();
       const neonParsed = NeonJSON.parse(input);
       await confirmP(neonParsed, input);
    })

    it("Apply Parse Reviver on JSON object", async()=>
    {
        await getString();
        const neonParsed = NeonJSON.parse(input, dataTransfomer);
        await confirmP(neonParsed, input, dataTransfomer);
    })

    it("Stringify JSON Object", async()=>
    {
        await getJson();
        const neonStringified = NeonJSON.stringify(input);
        await confirmS(neonStringified, input);
    })

    //TODO
    it("Apply Stringify Replacer on String")
})