"use strict";
// delivers all requests to backend server
// if backend is behind firewall, we dont need to config cors
// usually companies have a DMZ behind a firewall
// so, requests come from WAN to DMZ
// then DMZ, delivers requests behind another firewall into backend
// 2nd firewall is configured so that 
// proxy is only one who can make requests to backend
// so only proxy needs usually cors in companies
// but this project does not use firewalls, so...
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
// initiate express (backend) application
const app = (0, express_1.default)();
// allow requests from anywhere with cors policy
app.use((0, cors_1.default)());
// allow and validate json data
app.use(express_1.default.json({
    verify: (req, res, buf, encoding) => {
        try {
            JSON.parse(buf.toString());
        }
        catch (error) {
            res.status(400).send("Json input was invalid: " + buf.toString());
        }
    }
}));
// allow also json data that contains more json data within
app.use(express_1.default.urlencoded({ extended: true }));
// deliver requests from proxy to backend
// fetch works as promise, so when u write .then(x => y)
// x is the response fetch gets, y is how the promise modifies response
// in the next line .then(x2 => y2), 
// x2 is the modified data from previous .then, so it is basically y... etc etc
// ----- GET ALL PARROTS BY PROXY
app.get('/proxy/parrots', (req, res) => {
    // console.log("proxy.ts works fine!")
    // fetch from backend server using GET request
    fetch(`${process.env.BACKEND_URL}/api/parrots`)
        .then(resp => {
        res.status(resp.status);
        return resp.json();
    })
        .then(jsonObject => {
        res.json(jsonObject);
    })
        // handle all errors
        .catch(error => {
        console.error(error);
        res.status(500).send("Error fetching data" + error.message + error.stack);
    });
});
// ----- GET A PARROT BY ID VIA PROXY
app.get('/proxy/parrots/:id', (req, res) => {
    // take id from params
    const id = Number(req.params.id);
    // fetch from backend server using GET request with url id
    fetch(`${process.env.BACKEND_URL}/api/parrots/${id}`)
        .then(resp => {
        res.status(resp.status);
        return resp.json();
    })
        .then(jsonObject => {
        res.json(jsonObject);
    })
        // handle all errors
        .catch(error => {
        console.error(error);
        res.status(500).send("Error fetching data" + error.message + error.stack);
    });
});
// ----- CREATE A NEW PARROT VIA PROXY
app.post('/proxy/parrots', (req, res) => {
    // console.log(req.body)
    // console.log(JSON.stringify(req.body))
    // fetch from backend server using POST request and all data inside body
    fetch(`${process.env.BACKEND_URL}/api/parrots`, {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(resp => {
        res.status(resp.status);
        return resp.json();
    })
        .then(jsonObject => {
        res.json(jsonObject);
    })
        // handle all errors
        .catch(error => {
        console.error(error);
        res.status(500).send("Error fetching data" + error.message + error.stack);
    });
});
// ----- UPDATE PARROT BY ID VIA PROXY
app.put('/proxy/parrots/:id', (req, res) => {
    // take id from params, attributes from body
    const id = Number(req.params.id);
    // console.log(req.body)
    // console.log(JSON.stringify(req.body))
    // fetch from backend server using PUT request, id in url param, other data inside body
    fetch(`${process.env.BACKEND_URL}/api/parrots/${id}`, {
        method: "PUT",
        body: JSON.stringify(req.body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(resp => {
        res.status(resp.status);
        return resp.json();
    })
        .then(jsonObject => {
        res.json(jsonObject);
    })
        // handle all errors
        .catch(error => {
        console.error(error);
        res.status(500).send("Error fetching data " + error.message + error.stack);
    });
});
// ----- DELETE PARROT BY ID VIA PROXY
app.delete('/proxy/parrots/:id', (req, res) => {
    // take id from params, attributes from body
    const id = Number(req.params.id);
    // console.log(id)
    // fetch from backend server using DELETE request, id in url param
    fetch(`${process.env.BACKEND_URL}/api/parrots/${id}`, {
        method: "DELETE",
    })
        .then(resp => {
        res.status(resp.status);
        return resp.json();
    })
        .then(jsonObject => {
        res.json(jsonObject);
    })
        .catch(error => {
        console.error(error);
        res.status(500).send("Error fetching data " + error.message + error.stack);
    });
});
const port = Number(process.env.PROXY_PORT) || 3201;
app.listen(port, () => {
    console.log(`Proxy server listening on port: ${port}`);
});
