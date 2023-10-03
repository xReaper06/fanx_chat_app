import Api from '@/services/Api'

export default{
    login(credentials){
        return Api().post('/login',credentials);
    },
    userRegistration(credentials){
        return Api().post('/userRegistration',credentials);
    }
}