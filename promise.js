const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const fs = require('fs').promises

const app = express()
const port = 5000

app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended:true}))


async function readContacts() {
    const data = await fs.readFile('./data/contacts.json', 'utf8')
    return JSON.parse(data)
}
async function writeContacts(contacts) {
    await fs.writeFile('./data/contacts.json', JSON.stringify(contacts))
}

// Holds the route handler functions
async function main() {
    //variables used specifically for the route handlers
    let contacts = await readContacts();
    app.param('id', (req, res, next, value) => { id = value; next() })


    app.get('/', async (req, res) => {
        try {
            res.render('index', {contacts})
        } catch (error) {
            console.error(error)
            res.status(500).send('Internal server error')
        }
    })
    
    app.get('/add', (req, res) => {res.render('add')})
    app.post('/add', async (req, res) => {
        try {
            const newContact = req.body
            contacts.push(newContact)
            await writeContacts(contacts)
            res.redirect('/')
        } catch (error) {
            console.error(error)
            res.status(500).send('Internal server error')
        }
    })
    
    app.get('/view/:id', async (req, res) => {
        try {
            const contact = contacts[id]
            res.render('view', {contact})
        } catch (error) {
            console.error(error)
            res.status(500).send('Internal server error')
        }
    })

    app.get('/edit/:id', async (req, res) => {
        try {
            const contact = contacts[id]
            res.render('edit', {id, contact})
        } catch (error) {
            console.error(error)
            res.status(500).send('Internal server error')
        }
    })
    
    app.post('/edit/:id', async (req, res) => {
        try {
            const updatedContact = req.body
            contacts[id] = updatedContact
            await writeContacts(contacts)
            res.redirect('/')
        } catch (error) {
            console.error(error)
            res.status(500).send('Internal server error')
        }
    })
    
    app.get('/delete/:id', async (req, res) => {
        try {
            contacts.splice(id, 1)
            await writeContacts(contacts)
            res.redirect('/')
        } catch (error) {
            console.error(error)
            res.status(500).send('Internal server error')
        }
    })
}

main()

app.listen(port, () => {console.log(`server is running at port ${port}`)})