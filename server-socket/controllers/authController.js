require('dotenv').config();

const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const db = require('../config/dbConnection')
const jwt = require('jsonwebtoken');



const userRegistration = async (req, res) => {
    let conn; // Declare the connection variable outside the try-catch block.

    try {
        conn = await db.getConnection();
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if the username is already in use
        const existingUser = await conn.query(
            `SELECT * FROM users WHERE LOWER(username) = LOWER(?);`,
            [req.body.username]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                msg: 'This Username is already in Use!'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Insert the new user into the database
        const newUserResult = await conn.query(
            `INSERT INTO users (profilepic,username, password, user_role, createdAt) VALUES (?,?, ?, 'user', NOW());`,
            [`images/${req.files.profilePicture[0].originalname}`,req.body.username, hashedPassword]
        );

        // Insert the user's password into the savepasswords table
        await conn.query(
            `INSERT INTO savepasswords (user_id, last_password, date_created) VALUES (?, ?, NOW());`,
            [newUserResult.insertId, req.body.password]
        );

        return res.status(200).json({
            msg: 'The user has been registered with us!'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Internal Server Error'
        });
    } finally {
        if (conn) {
            conn.release();
        }
    }
};
const login = async (req, res) => {
    let conn;

    try {
        conn = await db.getConnection();
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const [user] = await conn.query(
            `SELECT id,profilepic, username, password, user_role FROM users WHERE username = ?`,
            [req.body.username]
        );

        if (!user) {
            return res.status(401).json({
                msg: 'Email or Password is incorrect'
            });
        }

        const hashedPassword = user[0].password; // Retrieve hashed password from the database

        if (!hashedPassword) {
            return res.status(500).json({
                msg: 'Internal Server Error: User password not found'
            });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, hashedPassword);

        if (!passwordMatch) {
            return res.status(401).json({
                msg: 'Email or Password is incorrect'
            });
        }

        const accessToken = generateAccessToken(user);

        // Generate a refresh token with a longer expiration time
        const refreshToken = jwt.sign(
            { id: user[0].id, user_role: user[0].user_role },
            process.env.REFRESH_TOKEN,
            { expiresIn: '7d' }
        );

        // Store the refresh token in your database
        await conn.query(
            `INSERT INTO tokens (user_id, refresh_token, flag) VALUES (?, ?, '1');`,
            [user[0].id, refreshToken]
        );

        // Update last logged in time
        await conn.query(
            `UPDATE users SET lastloggedin = NOW() WHERE id = ?;`,
            [user[0].id]
        );

        return res.status(200).json({
            msg: 'Logged in',
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user[0].id,
                profilepic:user[0].profilepic,
                username: user[0].username,
                user_role: user[0].user_role
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Internal Server Error'
        });
    } finally {
        if (conn) {
            conn.release();
        }
    }
};

const generateAccessToken = (user)=>{
    return jwt.sign({ id: user[0].id, user_role: user[0].user_role },process.env.ACCESS_TOKEN,{
        expiresIn:'30m'
    })
}
const Token = async (req, res) => {
    let conn;

    try {
        conn = await db.getConnection();
        const refreshTokenResult = await conn.query(
            `SELECT * FROM tokens WHERE refresh_token = ?;`,
            [req.body.token]
        );

        if (!refreshTokenResult || refreshTokenResult.length === 0) {
            return res.status(401).json({
                msg: 'Invalid token'
            });
        }

        const refreshToken = refreshTokenResult[0][0].refresh_token;
        console.log(refreshToken);
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        const [user] = await conn.query(`SELECT * FROM users WHERE id = ?;`, [decoded.id]);

        if (!user) {
            return res.status(403).json({
                msg: 'User Not Found'
            });
        }

        // Generate a new access token
        const accessToken = generateAccessToken(user);

        return res.status(200).json({
            accessToken: accessToken,
            user:{
                id:user[0].id,
                profilepic:user[0].profilepic,
                username:user[0].username,
                user_role:user[0].user_role,
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Internal Server Error'
        });
    } finally {
        if (conn) {
            conn.release();
        }
    }
};

const logout = async (req, res) => {
    let conn;

    try {
        conn = await db.getConnection();
        const removeTokenResult = await conn.query(`DELETE FROM tokens WHERE user_id = ?;`, [req.body.id]);

        if (!removeTokenResult) {
            return res.status(400).json({
                msg: 'Error Logout'
            });
        }

        return res.status(200).json({
            msg: 'Logout Successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Internal Server Error'
        });
    } finally {
        if (conn) {
            conn.release();
        }
    }
};


module.exports ={
    userRegistration,
    login,
    Token,
    logout
}
