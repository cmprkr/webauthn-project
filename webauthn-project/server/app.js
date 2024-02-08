require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./authRoutes');

app.use(express.json());
app.use(express.static('public')); // Serve static files
app.use(authRoutes); // Use authentication routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
