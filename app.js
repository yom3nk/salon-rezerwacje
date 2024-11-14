const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');

const app = express();
const db = new sqlite3.Database('./db.sqlite');

const config = require('./config');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.locals.message = req.flash();
    next();
}); 

db.run(`CREATE TABLE IF NOT EXISTS rezerwacje (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imie TEXT,
    telefon TEXT,
    data TEXT,
    godzina TEXT
)`);

function generateTimeSlots(openingHour, closingHour) {
    const slots = [];
    for (let hour = openingHour; hour < closingHour; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
}

app.get('/', (req, res) => {
    const availableTimes = generateTimeSlots(config.openingHour, config.closingHour);
    res.render('index', { availableTimes });
});


app.post('/rezerwuj', (req, res) => {
    const { imie, telefon, data, godzina } = req.body;

    db.get(`SELECT * FROM rezerwacje WHERE data = ? AND godzina = ?`, [data, godzina], (err, row) => {
        if (err) {
            console.log(err.message);
            return res.send("Wystąpił błąd, spróbuj ponownie później.");
        }

        if (row) {
            req.flash('error', 'Rezerwacja na wybrany termin już istnieje. Wybierz inny termin.');
            res.redirect('/');
        } else {
            db.run(
                `INSERT INTO rezerwacje (imie, telefon, data, godzina) VALUES (?, ?, ?, ?)`,
                [imie, telefon, data, godzina],
                function (err) {
                    if (err) {
                        console.log(err.message);
                        return res.send("Wystąpił błąd, spróbuj ponownie później.");
                    }
                    res.redirect('/rezerwacje');
                }
            );
        }
    });
});

app.get('/rezerwacje', (req, res) => {
    db.all(`SELECT * FROM rezerwacje`, (err, rows) => {
        if (err) {
            return console.log(err.message);
        }
        res.render('rezerwacje', { rezerwacje: rows });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});