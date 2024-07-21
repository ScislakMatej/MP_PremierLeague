const express = require('express');
const path = require('path');
const app = express();

// Nastavenie statického priečinka pre statické súbory (Bootstrap, CSS, JS, atď.)
app.use(express.static(path.join(__dirname, 'public')));

// Definovanie hlavnej trasy
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


//prepojenie
app.get('/sezona2425.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'sezona2425.html'));
  });

app.get('/pravidla.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pravidla.html'));
});  

app.get('/big4.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'big4.html'));
});

app.get('/historia.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'historia.html'));
  });


// Spustenie servera
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
