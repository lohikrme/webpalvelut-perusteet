import express from 'express'
import dotenv from 'dotenv'
import verify, { Encoding } from 'crypto'
import cors from 'cors'
// note that this 'mysql' library is a callback based library to use mysql db
// if wanted to use promises or async, would be using 'mysql2' libary
import mysql from 'mysql'

dotenv.config()

// use class to process data
class Parrot {
    id: number
    name: string
    species: string
    age: number

    constructor(
        id: number = 1, 
        name: string = "Polly", 
        species: string = "Budgie", 
        age: number = 10) 
        {
        this.id = id
        this.name = name
        this.species = species
        this.age = age
    }

    public toString() :string{
        return `id: ${this.id}   ` +
               `name: ${this.name}   ` +
               `species: ${this.age}   ` +
               `age: ${this.age}`
    }
} // class Parrot ends

// createPool allows multiple connetions/queries simultanously
const pool: mysql.Pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_user,
    password: process.env.DB_PASSWORD
})

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
app.get('/api/parrots', (req: express.Request, res: express.Response) => {

    // define sql query sentence to search all parrots
    // notice ?? for table name, ? for usual values
    let queryStr: string = mysql.format(
        "select * from ??",
        [process.env.DB_TABLE]
    )
    
    // run query sentence using pool
    // notice that rows: Parrot[] is not actually meaning data would be Parrot objects
    pool.query(queryStr, (error: mysql.MysqlError, rows: Parrot[]) => {
        if (error) {
            console.error(error.message)
            res.status(500).json({message: `There was error fetching parrots data: ${error.message}`})
            return
        }
        res.status(200).json(rows)

        /* COMMENT: demo how to access data during pool query if done with callbacks:
        let parrotRow: Parrot = new Parrot()
        rows.forEach(specimen => {
            parrotRow.id = specimen.id || 0
            parrotRow.name = specimen.name || "None"
            parrotRow.species = specimen.species || "None"
            parrotRow.age = specimen.age || 0
            console.log(parrotRow)
        })
        */
    })
})

//----- FETCH PARROT BY ID
// id given in params
app.get('/api/parrots/:id', (req: express.Request, res: express.Response) => {

    // take id from params
    const id = Number(req.params.id)

    // check all attributes are within request
    if (!id) {
        res.status(400).json({
            message: `Missing required fields: id:${id}`
        })
        return
    }

    // define sql query sentence to search a parrot by id
    let queryStr: string = mysql.format(
        "SELECT * FROM ?? WHERE id = ?",
        [process.env.DB_TABLE, id]
    )
    
    // run query sentence searching parrot by id
    pool.query(queryStr, (error: mysql.MysqlError, rows: Parrot[]) => {
        // if error, let user know and return
        if (error) {
            console.error(error.message)
            res.status(500).json({message: `There was error fetching parrots data: ${error.message}`})
            return
        }
        // parrot was not found with id
        if (rows.length < 1) {
            res.status(404).json({message: `Parrot with id: ${id} was not found!`})
        }

        // parrot was found, return data
        res.status(200).json(rows[0])
    })
})


// ----- UPDATE PARROT BY ID
// id given in params, other attributes in body
app.put('/api/parrots/:id', (req: express.Request, res: express.Response) => {


    // ------ step 1: basic procedures

    // take id from params
    const id: number = Number(req.params.id)
    // attributes from body
    const name: string = req.body.name
    const species: string = req.body.species
    const age: number = Number(req.body.age)

    // check all attributes are within request
    if (!id || !name || !species || !age) {
        res.status(400).json({
            message: `Missing required fields: id:${id}, name: ${name}, species: ${species} and/or age: ${age}`
        })
        return
    }


    // ------ step 2: check if parrot exists in database before updating

    // define query searching parrot by id
    let queryStr:string = mysql.format(
        "SELECT * FROM ?? WHERE id = ?",
        [process.env.DB_TABLE, id]
    )

    // run query searching parrot by id but do not return if success
    pool.query(queryStr, (error: mysql.MysqlError, rows: Parrot[]) => {
        // if error, let user know and return
        if (error) {
            console.error(error.message)
            res.status(500).json({message: `There was error fetching parrots data: ${error.message}`})
            return
        }
        // parrot was not found with id
        if (rows.length < 1) {
            res.status(404).json({message: `Parrot with id: ${id} was not found!`})
        }
    })
    // if not returned yet, that means, parrot was found from the database...


    // ------ step 3: update existing parrot

    // define sql query sentence to update a single parrot by id
    queryStr = mysql.format(
        "UPDATE ?? SET name = ?, species = ?, age = ? WHERE id = ?",
        [process.env.DB_TABLE, name, species, age, id]
    )
    
    // run query sentence to update
    pool.query(queryStr, (error: mysql.MysqlError) => {
        // if error, let user know and return
        if (error) {
            console.error(error.message)
            res.status(500).json({message: `There was error updating parrot with id: ${id}: ${error.message}`})
            return
        }

        let parrot = {
            "id": id,
            "name": name,
            "species": species,
            "age": age
        }

        // parrot was found, return data
        res.status(200).json({message: `Updating parrot with id ${id} was successful!`, updatedParrot: parrot})
    })
})



// ----- ADD A NEW PARROT
// all attributes given in body
app.post('/api/parrots', (req: express.Request, res: express.Response) => {

    // take all attributes from body
    const name: string = req.body.name
    const species: string = req.body.species
    const age: number = Number(req.body.age)

    // check all attributes are within request
    if (!name || !species || !age) {
        res.status(400).json({
            message: `Missing required fields: name: ${name}, species: ${species} and/or age: ${age}`
        })
        return
    }

    // define sql query sentence
    const queryStr: string = mysql.format(
        "INSERT INTO ?? (name, species, age) VALUES (?, ?, ?)",
        [process.env.DB_TABLE, name, species, age]
    )
    
    // run query sentence using pool, notice the callback approach
    pool.query(queryStr, (error: mysql.MysqlError, results: any) => {
        
        if (error) {
            console.error(error.message)
            res.status(500).json({message: `There was error creating a new parrot: ${error.message}`})
            return
        }

        // search the added id value:
        const newParrotId = results.insertId;

        let parrot = {
            "id": newParrotId,
            "name": name,
            "species": species,
            "age": age
        }

        // a new parrot was created
        res.status(201).json({message: `A new parrot was created successfully!`, createdParrot: parrot})
    })
    
})

// ----- DELETE A PARROT
// id is given in url param
app.delete('/api/parrots/:id', (req: express.Request, res: express.Response) => {


    // ------ step 1: basic procedures

    // take id from params
    const id: number = Number(req.params.id)

    // check all attributes are within request
    if (!id) {
        res.status(400).json({
            message: `Missing required fields: id:${id}`
        })
        return
    }


    // ------ step 2: check and save if parrot exists in database before deleting

    let parrot = new Parrot()

    // define query searching parrot by id
    let queryStr:string = mysql.format(
        "SELECT * FROM ?? WHERE id = ?",
        [process.env.DB_TABLE, id]
    )

    // run query searching parrot by id but do not return if success
    pool.query(queryStr, (error: mysql.MysqlError, rows: Parrot[]) => {
        // if error, let user know and return
        if (error) {
            console.error(error.message)
            res.status(500).json({message: `There was error fetching parrots data: ${error.message}`})
            return
        }
        // parrot was not found with id
        if (rows.length < 1) {
            res.status(404).json({message: `Parrot with id: ${id} was not found!`})
        }

        // parrot was found, and ids are unique so now use
        // prev made Parrot obj to store data before deleting from database
        parrot.id = rows[0].id
        parrot.name = rows[0].name
        parrot.species = rows[0].species
        parrot.age = rows[0].age
    })


    // ------ step 3: delete existing parrot and return to user which parrot was deleted

    // define sql query sentence to delete a single parrot by id
    queryStr = mysql.format(
        "DELETE from ?? WHERE id = ?",
        [process.env.DB_TABLE, id]
    )
    
    // run query sentence to delete
    pool.query(queryStr, (error: mysql.MysqlError) => {
        // if error, let user know and return
        if (error) {
            console.error(error.message)
            res.status(500).json({message: `There was error updating parrot with id: ${id}: ${error.message}`})
            return
        }

        // now use the Parrot object's data to info user whcih parrot was just deleted
        let parrotJson = {
            "id": parrot.id,
            "name": parrot.name,
            "species": parrot.species,
            "age": parrot.age
        }

        // parrot was found, return data
        res.status(200).json({message: `Deleting parrot with id ${id} was successful!`, deletedParrot: parrotJson})
    })
})


const port: number = Number(process.env.BACKEND_PORT) || 3101
app.listen(port, ()=> {
    console.log(`Backend server listening on port: ${port}`)
})