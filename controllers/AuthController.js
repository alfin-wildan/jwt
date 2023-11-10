const dbConfig = require('../config/database');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const {
    responseAuthSuccess,
    responseFailValidate
} = require('../traits/ApiResponse');

const pool = mysql.createPool(dbConfig);
const accessTokenSecret = '2023-Wikrama-exp';

pool.on('error', (err) => {
    console.error(err);
});

const register = (req, res) => {
    const data = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    };

    if (!data.email || !data.username || !data.password) {
        responseFailValidate(res, 'Email/Username/Password wajib di isi');
        return;
    }

    const queryCheckUnique = `SELECT * FROM users WHERE email=? OR username=?`;
    const queryInsertUser = `INSERT INTO users SET ?`;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            throw err;
        }

        connection.query(queryCheckUnique, [data.email, data.username], (err, results) => {
            if (err) {
                console.error(err);
                throw err;
            }

            if (results.length > 0) {
                res.status(403).json({
                    message: 'Email/Username sudah digunakan'
                });
            } else {
                connection.query(queryInsertUser, [data], (err, results) => {
                    if (err) {
                        console.error(err);
                        throw err;
                    }

                    if (results.affectedRows >= 1) {
                        const token = jwt.sign({
                            email: data.email,
                            username: data.username
                        }, accessTokenSecret);

                        responseAuthSuccess(res, token, 'Register successfully', {
                            email: data.email,
                            username: data.username
                        });
                    } else {
                        res.status(500).json({
                            message: 'Failed creating user'
                        });
                    }
                });
            }

            connection.release();
        });
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        responseFailValidate(res, 'Email/Password Wajib diisi');
        return;
    }

    const query = `SELECT * FROM users WHERE email=? AND password=?`;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            throw err;
        }

        connection.query(query, [email, password], (err, results) => {
            if (err) {
                console.error(err);
                throw err;
            }

            if (results.length >= 1) {
                const user = results[0];

                const token = jwt.sign({
                    email: user.email,
                    username: user.username
                }, accessTokenSecret);

                responseAuthSuccess(res, token, 'Login success', {
                    email: user.email,
                    username: user.username
                });
            } else {
                res.status(404).json({
                    message: 'Email or password is incorrect'
                });
            }

            connection.release();
        });
    });
};

module.exports = {
    register,
    login
};
