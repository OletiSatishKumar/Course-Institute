const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const courseRoutes = require('./routes/courseRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const db_url =process.env.MONGO_URI || "mongodb+srv://SatishKumar:Satish%40%401303@cluster0.8h7ix.mongodb.net/courseinstitute"
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.use('/api/courses', courseRoutes);

// Connect MongoDB and Start Server ONLY after DB connection
mongoose.connect(db_url)
.then(() => {
    console.log('✅ MongoDB Connected successfully');
    
    // Start server after successful DB connection
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
});
