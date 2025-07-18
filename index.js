const express = require('express');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { NotFoundError } = require('./utils/errors');

const app = express();
const PORT = 3000;

// Middleware
app.use(logger);
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/products', productRoutes);

// 404 Handler
app.use((req, res, next) => {
    next(new NotFoundError('Route not found'));
});

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});