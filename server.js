const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

const app = express();

// Nastavenie statického priečinka pre statické súbory (Bootstrap, CSS, JS, atď.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Nastavenie express-session
app.use(session({
    secret: 'your-secret-key', // Zmeňte na svoj vlastný tajný kľúč
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Zmeňte na true, ak používate HTTPS
}));

const users = [
    { username: 'Patres', password: 'olekolegunar', name: 'Patres', profilePic: '/images/patres.jpg' },
    { username: 'Matelko', password: 'limonada', name: 'Matelko', profilePic: '/images/matelko.jpg' },
    { username: 'Kiko', password: 'viktordraslik', name: 'Kiko', profilePic: '/images/kiko.jpg' }
];

// Definovanie hlavných trás pre HTML stránky
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/pravidla.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pravidla.html'));
});

app.get('/big4.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'big4.html'));
});

app.get('/historia.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'historia.html'));
});

// Endpoint na prihlásenie
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        res.json({ success: true, user });
    } else {
        res.json({ success: false });
    }
});

// Endpoint na odhlásenie
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

// Middleware na kontrolu prihlásenia
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});


// Endpoint na kontrolu prihlásenia
app.get('/login/status', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.json({ success: false });
    }
});

///////////////////////zapis udajov do suboru///////////////////////////

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mesiace sú od 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
};


// Endpoint na zápis údajov do súboru
app.post('/submit', (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, 'data.txt');
    const timestamp = formatDate(new Date());
    const content = data.map(item => 
        `User: ${item.user}, ID: ${item.id}, Text: ${item.text}, Timestamp: ${timestamp}`
    ).join('\n');

    fs.appendFile(filePath, content + '\n', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'Data saved successfully' });
        }
    });
});
//////////////////////////////////////////////////








// Spustenie servera
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
