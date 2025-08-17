const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'bodyface-secret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

const bookingsFile = path.join(__dirname, 'bookings.json');

function readBookings() {
  if (!fs.existsSync(bookingsFile)) {
    fs.writeFileSync(bookingsFile, JSON.stringify([]));
  }
  const data = fs.readFileSync(bookingsFile);
  return JSON.parse(data);
}

function writeBookings(bookings) {
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
}

app.post('/book', (req, res) => {
  const { name, email, service, date, time, message } = req.body;
  const bookings = readBookings();
  bookings.push({ name, email, service, date, time, message });
  writeBookings(bookings);
  res.redirect('/?booked=1');
});

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'password';

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.loggedIn = true;
    res.redirect('/admin');
  } else {
    res.redirect('/login?error=1');
  }
});

app.get('/admin', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  } else {
    res.redirect('/login');
  }
});

app.get('/api/bookings', (req, res) => {
  if (req.session.loggedIn) {
    const bookings = readBookings();
    res.json(bookings);
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

