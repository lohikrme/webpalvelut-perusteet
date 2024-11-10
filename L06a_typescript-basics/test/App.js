"use strict";
// express works also on typescript
// module express default export
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const greeting = 'hello';
console.log(greeting);
// convert serverport to number and use 4321 from .env primarily, secondarily 4433
const port = Number(process.env.SERVERPORT) || 4433;
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
        <h1>${greeting}<h1>
        </head>
        <p>request.method: ${req.method}</p>
        <p>request.path: ${req.path}</p>
        <p>request.hostname: ${req.hostname}</p>
        </html>
        `);
});
app.get('/api/students', (req, res) => {
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
    ]);
});
// app listen some port
app.listen(port, () => {
    console.log(`Server running port: ${port}`);
});
