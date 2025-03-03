import express from 'express';
import mariadb from 'mariadb';
import { urlencoded } from 'express';
import dotenv from 'dotenv';

const app = express();
const PORT = 3000;
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));



// Config env 
dotenv.config();
// Define our database credentials
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to our database
async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the databse!');
        return conn;
    } catch (err) {
        console.log(`Error connecting to the database ${err}`);
    }
}


app.get('/', async (req, res) => {
    const conn = await connect();
    const submissions = await conn.query('SELECT * FROM submissions;');
    console.log(submissions);
    
    res.render('home', {submissions});
});

app.get('/add', (req, res) => {
    res.render('add')
});

app.post('/submit-task', async (req, res) => {
    const newTask = {
        title: req.body.title,
        dateStart: req.body.dateStart,
        dateDue: req.body.dateDue,
        priority: req.body.priority,
        description: req.body.description
    };

    console.log(newTask);

    const conn = await connect();

    const insertQuery = await conn.query(`INSERT INTO submissions 
        (dateStarted, dateDue, title, description, priority) VALUES (?, ?, ?, ?, ?)`, 
        [newTask.dateStart, newTask.dateDue, newTask.title, newTask.description, newTask.priority])

    res.render('confirmation', newTask);
})
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});

