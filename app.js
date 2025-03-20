// Import statements
import express from 'express';
import mariadb from 'mariadb';
import { urlencoded } from 'express';
import {validateForm} from './services/validation.js';
import dotenv from 'dotenv';

// Basic node variables to run website, use req.body, use ejs, and reliably link css in ejs
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

// The home route, showing current tasks
app.get('/', async (req, res) => {
    const conn = await connect();
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed <> 1 AND deleted <> 1;');
    console.log(submissions);
    
    res.render('home', {submissions});
    conn.release();
});

// The completed route, shows completed tasks
app.get('/completed', async (req, res) => {
    const conn = await connect();
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed = 1 AND deleted <> 1');
    console.log(submissions);

    res.render('completed', {submissions});
    conn.release();
});

// The deleted route, shows deleted tasks
app.get('/deleted', async (req, res) => {
    const conn = await connect();
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed <> 1 AND deleted = 1');

    res.render('deleted', {submissions});
    conn.release();
});

// The add route, user can add tasks here
app.get('/add', (req, res) => {
    res.render('add')
});

// The confirmaiton route. Backend validation, inserting data to SQL
app.post('/submit-task', async (req, res) => {
    const newTask = {
        title: req.body.title,
        dateDue: req.body.dateDue,
        priority: req.body.priority,
        description: req.body.description 
    };

    // Back-end validation
    const result = validateForm(newTask);
    if (!result.isValid) {
        console.log(result.errors);
        res.send(result.errors);
        return;
    }

    console.log(newTask);


    const conn = await connect();

    const falseValue = false;

    const insertQuery = await conn.query(`INSERT INTO submissions 
        (dateDue, title, description, priority, completed, deleted) VALUES (?, ?, ?, ?, ?, ?)`, 
        [newTask.dateDue, newTask.title, newTask.description, newTask.priority, falseValue, falseValue]);

    res.render('confirmation', {newTask});
    conn.release();
});

// The delete route button, will delete a task through updating SQL
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

// The complete route button, will complete a task through updating SQL
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

// The restoreDeleted route, will restore the corresponding task back to current tasks
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

// The clearDeleted route, will delete ALL tasks in deleted route
app.get('/clearDeleted', async (req, res) => {

    const conn = await connect();
    await conn.query('DELETE FROM submissions WHERE deleted = 1 AND completed <> 1;');
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed <> 1 AND deleted = 1');
    console.log(submissions);

    res.render('deleted', {submissions});
    conn.release();
});

// The restoreCompleted route, will restore the corresponding task back to current tasks
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

// The clearCompleted route, will delete ALL tasks in completed route
app.get('/clearCompleted', async (req, res) => {

    const conn = await connect();
    await conn.query('DELETE FROM submissions WHERE completed = 1 AND deleted <> 1;');
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed = 1 AND deleted <> 1');
    console.log(submissions);

    res.render('completed', {submissions});
    conn.release();
});

// The sorted route, will sort the current tasks based on dateDue from the closest date on top to the furthest date on bottom
app.get('/sorted', async (req, res) => {
    const conn = await connect();
    const submissions = await conn.query('SELECT * FROM submissions WHERE completed <> 1 AND deleted <> 1 ORDER BY dateDue ASC;');
    console.log(submissions);
    
    res.render('home', {submissions});
    conn.release();
});

// Able to run our website by clicking on the link
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});