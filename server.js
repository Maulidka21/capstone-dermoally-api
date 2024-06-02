require('dotenv').config();
const Hapi = require('@hapi/hapi');
const mysql = require('mysql2/promise');

const init = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost',
    });

    server.route(require('./routes')(connection));

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();
