const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const path = require('path');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(cookieParser());

let userData, adminData;
try {
  userData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/user.json'), 'utf-8'));
  adminData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/admin.json'), 'utf-8'));
} catch (error) {
  console.error('Error reading JSON file:', error.message);
  process.exit(1); 
}

const SECRET = process.env.SECRET_KEY;

const authenticateJwt = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized Access' });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token Verification Failed' });
    }

    req.user = user;
    next();
  });
};


const checkUserRole = (req, res, next) => {
  const { email } = req.user;

  const isAdmin = adminData.some(a => a.email === email);
  const isUser = userData.some(a => a.email === email);

  req.user.role = isAdmin ? 'admin' : (isUser ? 'user' : null);

  if (!req.user.role) {
    return res.status(403).json({ message: 'Invalid role' });
  }

  next();
};

app.post('/validate', authenticateJwt, (req, res) => {
  res.json({ message: 'Token is valid' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const isAdmin = adminData.some(a => a.email === email &&a.password===password);
  const isUser = userData.some(a => a.email === email && a.password===password);


  if (isUser) {
    role = 'user';
    const token = jwt.sign({ email, role }, SECRET, { expiresIn: '30s' });
    res.cookie('authToken', token, { httpOnly: true });
    return res.status(200).json({ message: `${role} Logged in successfully`, token });
  }

  if (isAdmin) {
    role = 'admin';
    const token = jwt.sign({ email, role }, SECRET, { expiresIn: '30s' });
    res.cookie('authToken', token, { httpOnly: true });
    return res.status(200).json({ message: `${role} Logged in successfully`, token });
  }

  return res.status(403).json({ message: 'Invalid credentials' });
});



app.post('/signup', (req, res) => {
  const { firstName, lastName, email, mobileNo, password } = req.body;
  if (!firstName || !lastName || !email || !mobileNo || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const user = userData.find(u => u.email === email);

  if (user) {
    res.status(403).json({ message: 'Email id already exists' });
  }

  else{
    const newUser = {
      firstName,
      lastName,
      email,
      mobileNo,
      password,
    };

    userData.push(newUser);


    fs.writeFileSync('./data/user.json', JSON.stringify(userData), 'utf-8');
    const token = jwt.sign({ email, role: 'user' }, SECRET, { expiresIn: '30s' });
    res.json({ message: 'User created successfully', token });
  }
});


app.get('/dashboard', authenticateJwt, checkUserRole, (req, res) => {
  const { role, email } = req.user;

  if (role === 'admin') {
    const response = adminData.concat(userData).map(data => {
      const { password, ...resp } = data;
      return resp;
    });
    res.send(response);
  } else if (role === 'user') {
    const {password, ...response} = userData.find(a=>a.email===email)
    const data = []
    data.push(response);
    res.send(data);
  } else {
    res.status(403).json({ message: 'Invalid role' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  return res.json({ message: 'Logout successful' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});