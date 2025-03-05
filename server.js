const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://eswarsai8074:GxlEfEfJ2Fw9g7nj@cluster0.fpvov.mongodb.net/test?retryWrites=true&w=majority'; // Replace with your MongoDB Atlas connection string
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Order Schema
const orderSchema = new mongoose.Schema({
    name: String,
    address: String,
    fuelType: String,
    litres: Number,
    phoneNumber: String, // Fixed missing comma
    status: String,
});

const Order = mongoose.model('sneha_orders', orderSchema);

// Routes
// Home route to display orders
app.get('/', async (req, res) => {
    try {
        const orders = await Order.find({});
        res.render('index', { orders });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Server Error');
    }
});

// Update status to "Delivered"
app.post('/update-status/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        await Order.findByIdAndUpdate(orderId, { status: 'Delivered' });
        res.redirect('/');
    } catch (err) {
        console.error('Error updating status:', err);
        res.status(500).send('Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
