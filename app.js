import express from 'express';
import mariadb from 'mariadb';
import { urlencoded } from 'express';
import {validateForm} from './services/validation.js';
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
    database: process.env.DB_NAME,
    connectionLimit: 15
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
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed <> 1 AND deleted <> 1;');
    console.log(submissions);
    
    res.render('home', {submissions});
    conn.release();
});

app.get('/completed', async (req, res) => {
    const conn = await connect();
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed = 1 AND deleted <> 1');
    console.log(submissions);

    res.render('completed', {submissions});
    conn.release();
});

app.get('/deleted', async (req, res) => {
    const conn = await connect();
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed <> 1 AND deleted = 1');

    res.render('deleted', {submissions});
    conn.release();
});

app.get('/add', (req, res) => {
    res.render('add')
});

app.post('/submit-task', async (req, res) => {
    const newTask = {
        title: req.body.title,
        dateStarted: req.body.dateStarted,
        dateDue: req.body.dateDue,
        priority: req.body.priority,
        description: req.body.descriptionnpx 
    };

    // Back-end validation
    const result = validateForm(order);
    if (!result.isValid) {
        console.log(result.errors);
        res.send(result.errors);
        return;
    }

    console.log(newTask);


    const conn = await connect();

    const falseValue = false;

    const insertQuery = await conn.query(`INSERT INTO submissions 
        (dateStarted, dateDue, title, description, priority, completed, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [newTask.dateStarted, newTask.dateDue, newTask.title, newTask.description, newTask.priority, falseValue, falseValue]);

    res.render('confirmation', {newTask});
    conn.release();
});

app.post('/delete', async (req, res) => {
    const deleteId = req.body.deleteId;

    const conn = await connect();
    await conn.query('UPDATE submissions SET deleted = 1 WHERE id = ?;', [deleteId]);
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed <> 1 AND deleted <> 1;');
    console.log(submissions);
    
    console.log(deleteId);
    res.render('home', {submissions});
    conn.release();
});

app.post("/complete", async (req, res) => {
    const completeId = req.body.completeId;

    const conn = await connect();
    await conn.query('UPDATE submissions SET completed = 1 WHERE id = ?;', [completeId]);
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed <> 1 AND deleted <> 1;');
    console.log(submissions);

    console.log(completeId);
    res.render('home', {submissions});
    conn.release();
});

app.post('/restoreDeleted', async (req, res) => {
    const restoreId = req.body.restoreId;

    const conn = await connect();
    await conn.query('UPDATE submissions SET completed = 0, deleted = 0 WHERE id = ?;', [restoreId]);
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed <> 1 AND deleted = 1');
    console.log(submissions);

    console.log(restoreId);
    res.render('deleted', {submissions});
    conn.release();
});

app.post('/restoreCompleted', async (req, res) => {
    const restoreId = req.body.restoreId;

    const conn = await connect();
    await conn.query('UPDATE submissions SET completed = 0, deleted = 0 WHERE id = ?;', [restoreId]);
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed = 1 AND deleted <> 1');
    console.log(submissions);

    console.log(restoreId);
    res.render('completed', {submissions});
    conn.release();
});

app.get('/clearCompleted', async (req, res) => {

    const conn = await connect();
    await conn.query('DELETE FROM submissions WHERE completed = 1 AND deleted <> 1;');
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed = 1 AND deleted <> 1');
    console.log(submissions);

    res.render('completed', {submissions});
    conn.release();
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});

