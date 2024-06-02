const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = (connection) => {
    return [
        {
            method: 'POST',
            path: '/register',
            handler: async (request, h) => {
                const { username, password } = request.payload;

                if (!username || !password) {
                    return h.response().code(400).message('Username and password are required');
                }

                // Secure password hashing with bcrypt
                const saltRounds = 10; // Adjust as needed (higher = more secure, slower)
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
                const values = [username, hashedPassword];

                try {
                    await connection.query(query, values);
                    return h.response().code(201).message('User registered successfully');
                } catch (err) {
                    console.error(err);
                    return h.response().code(500).message('Registration failed');
                }
            },
        },
        {
            method: 'POST',
            path: '/login',
            handler: async (request, h) => {
                const { username, password } = request.payload;

                if (!username || !password) {
                    return h.response().code(400).message('Username and password are required');
                }

                const query = `SELECT * FROM users WHERE username = ?`;
                const values = [username];

                try {
                    const [results] = await connection.query(query, values);

                    if (!results.length) {
                        return h.response().code(401).message('There is no Username');
                    }

                    const user = results[0];
                    const isPasswordValid = await bcrypt.compare(password, user.password);

                    if (isPasswordValid) {
                        return h.response().code(200).message('Login successful');
                    } else {
                        return h.response().code(401).message('Invalid username or password');
                    }
                } catch (error) {
                    console.error('Error logging in user:', error);
                    return h.response().code(500).message('Login failed');
                }
            },
        },
    ];
};
