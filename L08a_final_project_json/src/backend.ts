import express from 'express'
import path from 'path'
import fs, {PathOrFileDescriptor} from 'fs'
import dotenv from 'dotenv'
import verify, { Encoding } from 'crypto'
import cors from 'cors'

dotenv.config()

// use interface to read data from json
interface Parrot {
    id: number,
    name: string,
    species: string,
    age: number
}

// use function to create new parrots
function createNewParrot(config: Parrot) {
    return {
        id: config.id,
        name: config.name,
        species: config.species,
        age: config.age
    }
}

// function to find out dynamically location of data files
// using ternary operator ? : to shortcut truth sentence
function dynamicPathToData() {
    // console.log(__dirname)
    const isDist = __dirname.includes('dist')
    const datafile = (isDist ? path.join(__dirname, 'data', 'parrots.json') :
        path.join(__dirname, '..', 'dist', 'data', 'parrots.json')
    )
    // console.log(datafile)
    if (!datafile) return ""
    return datafile
}

// initiate cors policy options
let corsOptions = {
    origin: `http://localhost:${process.env.PROXY_PORT}`,
    optionsSuccessStatus: 200
}

// initiate express (backend) application
const app: express.Express = express()
// allow requests only from proxy server with cors policy
app.use(cors(corsOptions))
// allow and validate json data
app.use(express.json({
    verify: (req: express.Request, res: express.Response, buf: Buffer, encoding: Encoding) => {
        try {
            JSON.parse(buf.toString())
        }
        catch (error) {
            res.status(400).send("Json input was invalid: " + buf.toString())
        }
    }
}))
// allow also json data that contains more json data within
app.use(express.urlencoded({extended: true}))


// ----- MAIN ENDPOINT
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Nihao from Backend server!')
})

// ----- FETCH ALL PARROTS
// to return a specific parrot, we first read all json into variable
// then we return this whole variable
// notice that return in middle of promise does not end promise
// but simply immediately moves to next step of promise
app.get('/api/parrots', (req: express.Request, res: express.Response) => {

    // step1: define path to the json file containing data of parrots
    const p = dynamicPathToData()
    if (p === "") {
        res.json({message: "parrots file was not found!"})
        return
    }
    const pd: PathOrFileDescriptor = path.resolve(p)

    // step2: read the file
    fs.readFile(pd, 'utf-8', (err: NodeJS.ErrnoException | null, data: Buffer | string) => {
        if (err) {
            res.status(500).json({message: "error reading parrots file"})
            return
        }
        // initiate variable that contains data of all parrots
        let parrots: Parrot[]
        // modify content into js object
        if(typeof data == 'string') {
            parrots = JSON.parse(data)
        }
        else {
            parrots = JSON.parse(data.toString())
        }
        // return all data of parrots
        res.json(parrots)
        return
    })
})

//----- FETCH PARROT BY ID
// to return a specific parrot, we first read all json into variable
// then we use this variable to find a parrot with id, and return it
app.get('/api/parrots/:id', (req: express.Request, res: express.Response) => {
    // fetch id from params
    const id = Number(req.params.id)

    // check all attributes are within request
    if (!id) {
        res.status(400).json({
            message: `Missing required fields: id:${id}`
        })
        return
    }

    // step1:  define path to the json file containing data of parrots
    const p = dynamicPathToData()
    if (p === "") {
        res.json({message: "No parrots were not found!"})
        return
    }
    const pd: PathOrFileDescriptor = path.resolve(p)

    // read the file
    fs.readFile(pd, 'utf-8', (err: NodeJS.ErrnoException | null, data: Buffer | string) => {
        if (err) {
            res.status(500).json({message: "error reading parrots file"})
            return
        }
        // initiate variable that contains data of all parrots
        let parrots: Parrot[]
        // modify content into js object
        if(typeof data == 'string') {
            parrots = JSON.parse(data)
        }
        else {
            parrots = JSON.parse(data.toString())
        }
        // find parrot by id from data of all parrots
        let parrot: Parrot | undefined = parrots.find(specimen => specimen.id === id)

        // check if parrot is undefined
        if (!parrot) {
            res.status(404).json({message: `Parrot was not found with id: ${id}`})
            return
        }
        // if parrot was found, return it
        res.json(parrot)
        return 
    })
})


// ----- UPDATE PARROT BY ID
// to update a specific parrot, we first read all json into variable
// then we use this variable to update a parrot first within the variable
// after that, we overwrite the original json file with the new, updated, content
app.put('/api/parrots/:id', (req: express.Request, res: express.Response) => {
    // store id from url param and other attributes from body of request
    const id = Number(req.params.id)
    const name = req.body.name
    const species = req.body.species
    const age = Number(req.body.age)

    // check all attributes are within request
    if (!id || !name || !species || !age) {
        res.status(400).json({
            message: `Missing required fields: id:${id}, name: ${name}, species: ${species} and/or age: ${age}`
        })
        return
    }

    // define path to the json file containing data of parrots
    const p = dynamicPathToData()
    if (p === "") {
        res.json({message: "No parrots were not found!"})
        return
    }
    const pd: PathOrFileDescriptor = path.resolve(p)

    // read the file
    fs.readFile(pd, 'utf-8', (err: NodeJS.ErrnoException | null, data: Buffer | string) => {
        if (err) {
            res.status(500).json({message: "error reading parrots file"})
            return
        }
        // modify content into JS-object (resembles json object)
        let parrots: Parrot[]
        if(typeof data == 'string') {
            parrots = JSON.parse(data)
        }
        else {
            parrots = JSON.parse(data.toString())
        }
        // find parrot by id from the data
        let parrot: Parrot | undefined = parrots.find(specimen => specimen.id === id)

        if (!parrot) {
            res.status(404).json({message: `Parrot was not found with id: ${id}`})
            return
        }

        // update new values within the variable parrots (which parrot is part of)
        // idea is that, parrot variable is part of parrots variable
        // so when i update parrot, it will also update parrots
        // and then i will overwrite original file with parrots
        parrot.name = name
        parrot.species = species
        parrot.age = age

        // transform js object back to JSON text, use 4 spaces for indents
        const updatedData = JSON.stringify(parrots, null, 4)

        // overwrite thje original json file with updatedData
        fs.writeFile(pd, updatedData, 'utf-8', (err) => {
            if (err) {
                res.status(500).json({message: `Error updating parrot`})
                console.error(err)
                return
            }
            res.status(200).json({
                message: "Parrot updated successfully.",
                updatedParrot: parrot
            })
        })

    })
})



// ----- ADD A NEW PARROT
// requires also id in body, because is not using db but json
// first finds that same id does not already exist
app.post('/api/parrots', (req: express.Request, res: express.Response) => {
    // store all attributes from the body of request
    const id = Number(req.body.id)
    const name = req.body.name
    const species = req.body.species
    const age = Number(req.body.age)

    // check all attributes are within request
    if (!id || !name || !species || !age) {
        res.status(400).json({
            message: `Missing required fields: id:${id}, name: ${name}, species: ${species} and/or age: ${age}`
        })
        return
    }

    // define path to the json file containing data of parrots
    const p = dynamicPathToData()
    if (p === "") {
        res.json({message: "No parrots were not found!"})
        return
    }
    const pd: PathOrFileDescriptor = path.resolve(p)

    // read the file
    fs.readFile(pd, 'utf-8', (err: NodeJS.ErrnoException | null, data: Buffer | string) => {
        if (err) {
            res.status(500).json({message: "error reading parrots file"})
            return
        }
        // modify content into JS-object (resembles json object)
        let parrots: Parrot[]
        if(typeof data == 'string') {
            parrots = JSON.parse(data)
        }
        else {
            parrots = JSON.parse(data.toString())
        }
        // find parrot by id from the data
        let parrot: Parrot | undefined = parrots.find(specimen => specimen.id === id)

        // if parrot with given id already exists, info user and return
        if (parrot) {
            res.status(409).json({
                message: `Parrot of same id already exists:`,
                existingParrot: parrot})
            return
        }

        // parrot was undefined, create a new parrot based on the request body
        parrot = createNewParrot({id, name, species, age})

        // add new parrot to the parrots js data and sort the data
        parrots.push(parrot)
        parrots.sort((a,b) => {
            return a.id - b.id
        })

        // transform js object data back to JSON data, use 4 spaces for indents
        const updatedData = JSON.stringify(parrots, null, 4)

        // overwrite the original json file with updatedData
        fs.writeFile(pd, updatedData, 'utf-8', (err) => {
            if (err) {
                res.status(500).json({message: `Error adding the new parrot`})
                console.error(err)
                return
            }
            res.status(201).json({
                message: "Parrot added successfully.",
                newParrot: parrot
            })
        })
    })
})

// ----- DELETE A PARROT
// id is given in url param
// finds first if parrot is found with the id,
// if found, load data as js object array, delete the parrot with id
// and then overwrite the remaining data back to json file
app.delete('/api/parrots/:id', (req: express.Request, res: express.Response) => {
    // fetch id from params
    const id = Number(req.params.id)

    // check all attributes are within request
    if (!id) {
        res.status(400).json({
            message: `Missing required fields: id:${id}`
        })
        return
    }

    // define path to the json file containing data of parrots
    const p = dynamicPathToData()
    if (p === "") {
        res.json({message: "No parrots were not found!"})
        return
    }
    const pd: PathOrFileDescriptor = path.resolve(p)

    // read the file
    fs.readFile(pd, 'utf-8', (err: NodeJS.ErrnoException | null, data: Buffer | string) => {
        if (err) {
            res.status(500).json({message: "error reading parrots file"})
            return
        }
        // modify content into JS-object (resembles json object)
        let parrots: Parrot[]
        if(typeof data == 'string') {
            parrots = JSON.parse(data)
        }
        else {
            parrots = JSON.parse(data.toString())
        }
        // find parrot by id from the data
        let parrot: Parrot | undefined = parrots.find(specimen => specimen.id === id)

        // if parrot with given id does not exist, info user and return
        if (!parrot) {
            res.status(404).json({
                message: `Could not find a parrot with id ${id}:`,
                existingParrot: parrot})
            return
        }

        // parrot was found, so we can progress to removing it from the data
        // to do that, we create a new updatedData array, 
        // and store there all parrot objects except the one with given id
        let updatedData: Parrot[] = []
        for (let i = 0; i < parrots.length; i++) {
            if (parrots[i].id != id) {
                updatedData.push(parrots[i])
            }
        }

        // transform js object data back to JSON data, use 4 spaces for indents
        // stringify is needed so file can be written with fs.writeFile
        const updatedDataStringify = JSON.stringify(updatedData, null, 4)

        // overwrite the original json file with updatedData
        fs.writeFile(pd, updatedDataStringify, 'utf-8', (err) => {
            if (err) {
                res.status(500).json({message: `Error adding the new parrot`})
                console.error(err)
                return
            }
            res.status(200).json({
                message: "Parrot deleted successfully.",
                deletedParrot: parrot
            })
        })

    })
})


const port: number = Number(process.env.BACKEND_PORT) || 3101
app.listen(port, ()=> {
    console.log(`Backend server listening on port: ${port}`)
})