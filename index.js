const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
morgan.token("reqBody", function (req, res) {
    return JSON.stringify(req.body);
});
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :reqBody"
    )
);
const PORT = process.env.PORT || 3001;
let persons = [
    {
        name: "Arto Hellas",
        number: "6737345665",
        id: 1,
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2,
    },
    {
        name: "Dan Abramov",
        number: "23472347923",
        id: 3,
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4,
    },
];

const randomId = () => Math.floor(Math.random() * 999);
const isUnique = (personObject, persons) =>
    persons.some((person) => personObject.name === person.name);
const isLegal = (personObject) =>
    personObject.name.length === 0 || personObject.number.length === 0;

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/info", (req, res) => {
    const now = new Date();
    res.send(
        `<p>Phonebook has info for ${
            persons.length
        } people</p><p>${now.toString()}</p>`
    );
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);
    res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const person = req.body;
    console.log(person);
    switch (true) {
        case isLegal(person):
            res.status(400)
                .send({ error: "Person must have name and number ." })
                .end();
            break;
        case isUnique(person, persons):
            res.status(400).send({ error: "Person must be unique." }).end();
            break;

        default:
            person.id = randomId();
            console.log(person);
            persons = persons.concat(person);
            console.log(persons);
            res.status(201).send(person).end();
            break;
    }
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
