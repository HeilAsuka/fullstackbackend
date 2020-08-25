const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.1tbes.azure.mongodb.net/persons?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
});

const Person = mongoose.model("Person", personSchema);
if (process.argv.length < 3) {
    console.log(
        "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
} else if (process.argv.length === 3) {
    Person.find({}).then((res) => {
        console.log("phonebook");
        res.forEach((person) => {
            console.log(`${person.name}  ${person.number}`);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];
    const randomId = () => Math.floor(Math.random() * 999);
    const person = new Person({
        name: name,
        number: number,
        id: randomId(),
    });
    person.save().then((res) => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
}
