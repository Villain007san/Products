const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const bodyParser = require('body-parser'); // Needed to parse form data
const Product = require('./models/product');

const app = express();
const PORT = 3000; // Or any other port

// Middleware to enable CORS and parse incoming request bodies
app.use(cors());
app.use(bodyParser.json()); // For JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // For form data
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Atlas connection string
const dbURI = 'mongodb+srv://sandipkumar9334:uwYcKUwcbUsPSRTw@cluster0.b6kcl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });

// Serve homepage with links to "Add Product" and "Product List"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/add-product', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-product.html'));
});
// Serve the product list HTML file
app.get('/product-list', (req, res) => {
    
    res.sendFile(path.join(__dirname, 'public', 'product-list.html')); 
});

  
  

// POST request to add a new product
app.post('/api/products', async (req, res) => {
  const { product_id, name, description, price, category, quantity_in_stock, image_url } = req.body;

  try {
    const newProduct = new Product({
      product_id,
      name,
      description,
      price,
      category,
      quantity_in_stock,
      image_url,
      created_at: new Date(),
      updated_at: new Date()
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: savedProduct });
  } catch (err) {
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
});

// GET request to fetch all products
app.get('/api/products', async (req, res) => {
  try {
      const products = await Product.find();
      res.setHeader('Content-Type', 'application/json'); // Ensure JSON header
      res.status(200).json(products);
  } catch (err) {
      res.status(500).send('Server Error');
  }
});
