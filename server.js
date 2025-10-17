const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const moment = require('moment-timezone');

//kontrola prihlasenia pre specificke stranky
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) { // Overuje existenciu aktívnej relácie používateľa
        next(); // Používateľ je prihlásený, pokračuj
    } else {
        res.status(403).send('Prístup zamietnutý. Musíte byť prihlásený.'); // Chyba, ak nie je prihlásený
    }
};

// Inicializácia Express
const app = express();
app.use(express.json()); // Načítanie JSON údajov
app.use(bodyParser.json()); // Načítanie JSON údajov

// Nastavenie statického priečinka pre statické súbory (Bootstrap, CSS, JS, atď.)
app.use(express.static(path.join(__dirname, 'public')));

// Nastavenie statického priečinka pre vypis uz tipnutych zapasov
app.use('/data', express.static(path.join(__dirname, 'data')));

// Definovanie trasy na zobrazenie obsahu súboru
app.get('/file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'data', filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        res.send(data);
    });
});

// Nastavenie express-session
app.use(session({
    secret: 'your-secret-key', // Zmeňte na svoj vlastný tajný kľúč
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Nastavte na false pre HTTP
}));


// Používateľské údaje
const users = [
    { username: 'Patres', password: 'patoruzito', name: 'Patres', profilePic: '/images/buni_karticka.jpg' },
    { username: 'Matelko', password: 'limonada', name: 'Matelko', profilePic: src="https://ichef.bbci.co.uk/ace/standard/480/cpsprodpb/a267/live/f0685d30-eedc-11ec-8935-4f1eb8b88d37.png" },
    { username: 'Kiko', password: 'viktordraslik', name: 'Kiko', profilePic: '/images/kiko.jpeg' }
    
];

app.get('/api/users', (req, res) => {
    res.json(users);
});


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

app.get('/big4.html', requireLogin, (req, res) => {
    console.log('Access granted to /big4.html for user:', req.session.user);
    res.sendFile(path.join(__dirname, 'public', 'big4.html'));
});

app.get('/historia.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'historia.html'));
});

app.get('/sezona2425.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sezona2425.html'));
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
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Chyba pri odhlasovaní.' });
      }
      res.clearCookie('connect.sid'); // Vyzerať, že používate express-session, takto vymažte cookie
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

// Funkcia na formátovanie dátumu
const formatDate = (date) => {
    const formattedDate = moment(date).tz('Europe/Bratislava').format('DD.MM.YYYY, HH:mm:ss');
    return formattedDate;
};

// Endpoint na zápis údajov do súboru
    app.post('/submit', (req, res) => {
        const data = req.body;
        const sourceFile = data[0]?.sourceFile;
        const filePath = path.join(__dirname, 'data', `${sourceFile}.txt`);

        if (!data || !data[0] || !data[0].user) {
            return res.status(400).json({ success: false, message: 'MUSIS SA PRIHLASIT' });
        }

        const timestamp = formatDate(new Date());
        const content = data.map(item =>
            `🦸🏻‍♂️: ${item.user}, ⚽️: ${item.id}, 📊: ${item.text}, ⏱️: ${timestamp}`
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

// Spustenie servera
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
