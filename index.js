const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', (request, response) => {
     if (request.method === 'POST') {
       return JSON.stringify(request.body)
    } else { return '' }
})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const generateId = () => String(Math.floor(Math.random()*500))

let phonebook = [
    {
        id:"1",
        name:"Arto Hellas",
        number: "040-123456"
    },
    {
        id:"2",
        name:"Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id:"3",
        name:"Dan Abramov",
        number: "12-43-234345"
    },
    {
        id:"4",
        name:"Mary Poppendieck",
        number: "39-23-6423122"
    }
]

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!(body.name && body.number)) {
        return response.status(400).json({
            error:'content missing'
        })
    }
    if (phonebook.find(person => person.name === body.name)) {
        return response.status(400).json({
            error:'name must be unique'
        })
    }
    const person = {
        id:generateId(),
        name:body.name,
        number:body.number
    }
    phonebook = phonebook.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p><p>${new Date().toString()}</p>`)
})
