
// express works also on typescript
// module express default export

import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();

const greeting : string = 'hello';
console.log(greeting);

// convert serverport to number and use 4321 from .env primarily, secondarily 4433
const port : number = Number(process.env.SERVERPORT) || 4433;

const app:express.Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send(
        `
        <html>
        <head>
        <h1>${greeting}<h1>
        </head>
        <p>request.method: ${req.method}</p>
        <p>request.path: ${req.path}</p>
        <p>request.hostname: ${req.hostname}</p>
        </html>
        `  
    )
});

app.get('/api/students', (req: Request, res:Response)=> {
    res.json(
    // return an array of json data
    [        
    {
        "name": "Olli Koskimaa",
        "profession": "Teacher"
    }, 
    {
        "name": "Joonas Harjula",
        "profession": "Student"
    }

    ]

)
});

// app listen some port
app.listen(port, () => {
    console.log(`Server running port: ${port}`);
});