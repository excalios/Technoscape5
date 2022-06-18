import app from './app';

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`API is listening at port: ${PORT}`);
});

// Graceful stop
process.once('SIGINT', () => {
    server.close(() => {
        console.log('Server is closing');
    });
});
process.once('SIGTERM', () => {
    server.close(() => {
        console.log('Server is closing');
    });
});
