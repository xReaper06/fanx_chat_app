import Api from '@/services/Api'
import Auth from '@/services/Auth'

export default{
    login(credentials){
        return Auth().post('/login',credentials);
    },
    userRegistration(credentials){
        return Auth().post('/userRegistration',credentials);
    },
    getRooms(credentials){
        return Api().post('/getRoom',credentials);
    },
    getMyRoom(credentials){
        return Api().post('/getMyRoom',credentials);
    },
    getAllRooms(){
        return Api().get('/getAllRooms');
    },
    getAllUsers(){
        return Api().get('/getAllUsers');
    },
    getRoomConvo(credentials){
        return Api().post('/getRoomConvo',credentials);
    },
    createRoom(credentials){
        return Api().post('create-room',credentials);
    },
    Logout(credentials){
        return Auth().post('/logout',credentials);
    }
    
}