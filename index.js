const express = require("express");
const morgan = require("morgan");
const Person = require("./models/Person");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
morgan.token("reqBody", function (req, res) {
    return JSON.stringify(req.body);
});
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :reqBody"
    )
);
const PORT = process.env.PORT || 3001;

const randomId = () => Math.floor(Math.random() * 999);
const errorHandler = (error, req, res, next) => {
    if (error.name === "CastError") {
        return res.status(400).send({ error: "Malformatted id" });
    } else if (error.name === "ValidationError") {
        return res.status(400).send({ error: error.message });
    }
    next(error);
};

app.get("/api/persons", (req, res) => {
    Person.find({}).then((people) => {
        res.json(people);
    });
});

app.get("/info", (req, res) => {
    const now = new Date();
    Person.find({})
        .then((people) => {
            const personslength = JSON.parse(JSON.stringify(people)).length;
            console.log(personslength);
            res.send(
                `<p>Phonebook has info for ${personslength} people</p><p>${now.toString()}</p>`
            );
        })
        .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    Person.findOne({ id: id })
        .then((person) => {
            if (person) {
                console.log(person);
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch((err) => next(err));
});
app.put("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = {
        name: req.body.name,
        number: req.body.number,
        id: randomId(),
    };
    Person.findOneAndUpdate({ id: id }, person)
        .then((person) => {
            if (person) {
                console.log(person);
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    Person.findOneAndRemove({ id: id })
        .then((person) => {
            res.status(204).end();
        })
        .catch((err) => next(err));
});

app.post("/api/persons", (req, res) => {
    const newPerson = req.body;
    console.log(newPerson);
    randomId();
    console.log(newPerson);
    const person = new Person({
        name: newPerson.name,
        number: newPerson.number,
        id: randomId(),
    });
    person
        .save()
        .then((savedPerson) => res.status(201).json(person).end())
        .catch((err) => next(err));
});
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
