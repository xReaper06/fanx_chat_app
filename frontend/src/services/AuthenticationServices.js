import Api from '@/services/Api'
import Auth from '@/services/Auth'

export default{
    login(credentials){
        return Auth().post('/login',credentials);
    },
    userRegistration(credentials){
        return Auth().post('/userRegistration',credentials);
    },
    logout(id){
        return Auth().post(`/logout/${id}`);
    },
    
}