const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const db = require('../config/dbConnection')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

const userRegistration = (req,res)=>{
    db.query(
        `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(req.body.username)});`,
        (err,result)=>{
            if(result&&result.length){
                return result.status(409).json({
                    msg:'This Username is already in Use!'
                })
            }else{
                bcrypt.hash(req.body.password,10,(err,hash)=>{
                    if(err){
                        return res.status(500).json({
                            msg:err
                        })
                    }else{
                        db.query(`INSERT INTO users (username,password,user_role)VALUES(${db.escape(
                            req.body.username
                            )},${db.escape(
                                hash
                                )},'user');`,
                                (err,insertionResult)=>{
                                    if(err){
                                        return insertionResult.status(400).json({
                                            msg:err
                                        })
                                    }
                                    return res.status(200).json({
                                        msg:'The user has been registered with us!'
                                    })
                                }
                                )
                    }
                })
            }
        }
    )
}
//login function
const login = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    db.query(
        `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    msg: err
                });
            }
            if (!result.length) {
                return res.status(401).json({
                    msg: 'Email or Password is incorrect'
                });
            }
            bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr, bResult) => {
                    if (bErr) {
                        return res.status(400).json({
                            msg: bErr
                        });
                    }
                    if (bResult) {
                        const token = jwt.sign(
                            { id: result[0]['id'], user_role: result[0]['user_role'] },
                            jwtSecret,
                            { expiresIn: '1h' }
                        );
                        db.query(
                            `UPDATE users SET lastloggedin = NOW() WHERE id = ${result[0]['id']};`,
                            (updateErr, updateResult) => {
                                if (updateErr) {
                                    return res.status(400).json({
                                        msg: updateErr
                                    });
                                }
                                return res.status(200).json({
                                    msg: 'Logged in',
                                    token: token,
                                    user: result[0]
                                });
                            }
                        );
                    } else {
                        return res.status(401).json({
                            msg: 'Email or Password is incorrect!'
                        });
                    }
                }
            );
        }
    );
};
module.exports=[
    userRegistration,
    login
]
