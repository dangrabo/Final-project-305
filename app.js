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


app.get('/', (req, res) => {
    
    
    res.render('home');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})