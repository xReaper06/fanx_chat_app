require('dotenv').config();

const db = require('../config/dbConnection')

function generateRoomID() {
    const min = 100000; // Minimum 6-digit number (100000)
    const max = 999999; // Maximum 6-digit number (999999)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRooms = async (req,res)=>{
    let conn;
    try {
        const {users_id} = req.body
        conn = await db.getConnection();
        const [response] = await conn.query('SELECT id,room_id,users_id,room_name FROM myrooms WHERE users_id =?',[
            users_id
        ])
        if(response){
            return res.status(200).json({
                rooms:response
            })
        }
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

}


async function storeRoom(req,res) {
    let conn;
    try {
        let room_id = generateRoomID();
        conn = await db.getConnection();
        const {id} = req.user;
        let resu;
        let response;
        const [result] = await conn.query('SELECT * FROM rooms WHERE room_id =?',[room_id]);
        if(result.length>0){
            room_id = generateRoomID();
            [response] = await conn.query('SELECT room_name FROM rooms WHERE room_name = ?',[req.body.room_name]);
            if(response.length > 0 && response[0].room_name === req.body.room_name){
                console.log(response);
                return res.status(404).json({
                    msg:'RoomName is already Created'
                })
            }
            resu = await conn.query(
                'INSERT INTO rooms(room_id, users_id, room_name, status, created) VALUES(?,?,?,"New",now())',
                [room_id, id, req.body.room_name]
            );
            if (!resu) {
                return res.status(404).json({
                    msg:'Room Failed to Create',
                })
            }
            await conn.query('INSERT INTO myrooms(room_id, users_id, room_name) VALUES(?,?,?)',
            [room_id, id, req.body.room_name])
            return res.status(200).json({
                msg:'Room Created',
                room:{
                    id:resu[0].insertId,
                    room_id:room_id,
                    users_id:id,
                    room_name:req.body.room_name
                }
            })
        }else{
           [response] = await conn.query('SELECT room_name FROM rooms WHERE room_name = ?',[req.body.room_name]);
            if(response.length > 0 && response[0].room_name === req.body.room_name){
                console.log(response[0].room_name === req.body.room_name);
                return res.status(404).json({
                    msg:'RoomName is already Created'
                });  
            }
            resu = await conn.query(
                'INSERT INTO rooms(room_id, users_id, room_name, status, created) VALUES(?,?,?,"New",now())',
                [room_id, id, req.body.room_name]
            );
            if (!resu) {
                return res.status(404).json({
                    msg:'Room Failed to Create',
                })
            }
            await conn.query('INSERT INTO myrooms(room_id, users_id, room_name) VALUES(?,?,?)',
            [room_id, id, req.body.room_name])
            return res.status(200).json({
                msg:'Room Created',
                room:{
                    id:resu[0].insertId,
                    room_id:room_id,
                    users_id:id,
                    room_name:req.body.room_name
                }
            })     
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Internal Server Error'
        })
    } finally {
        if(conn){
            conn.release();
        }
    }
}
const getRoomConvo = async (req,res)=>{
    let conn;
    try {
        const {room_id} = req.body
        conn = await db.getConnection();
        const [response] = await conn.query('SELECT messages.id,messages.users_id,messages.room_id,messages.message,users.profilepic,users.username FROM messages LEFT JOIN users ON messages.users_id = users.id WHERE room_id = ?',[
            room_id
        ])
        if(response){
            return res.status(200).json({
                convo:response
            })
        }
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

}
const getAllRooms = async (req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const [response] = await conn.query('SELECT id,room_id,users_id,room_name FROM rooms')
        if(response){
            return res.status(200).json({
                Allrooms:response
            })
        }
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

}
const getAllUsers = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const [response] = await conn.query('SELECT id,profilepic,users FROM users')
        if(response){
            return res.status(200).json({
                Allusers:response
            })
        }
    } catch (error) {
        
    }
}
const getMyRoom = async(req,res)=>{
    let conn;
    try {
        const {room_id} = req.body
        conn = await db.getConnection();
        const [response] = await conn.query('SELECT id,room_id,users_id,room_name FROM rooms WHERE room_id = ?',[
            room_id
        ])
        if(response){
            return res.status(200).json({
                Myroom:response[0]
            })
        }
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
}

module.exports ={
getAllRooms,getRooms,getAllUsers,getRoomConvo,getMyRoom,storeRoom
}
