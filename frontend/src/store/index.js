import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  id:'auth',
  state: () => ({
    token: null,
    user: null,
    isUserLoggedIn: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async setToken(token) {
      this.token = token
      if(token){
        this.isUserLoggedIn = true
      }else{
        this.isUserLoggedIn = false
      }
    },
   async clearToken() {
      this.token = null;
    },
    async setUser(user) {
      this.user = user
    },
    async setIsUserLoggedIn(isUserLoggedIn) {
      this.isUserLoggedIn = isUserLoggedIn
    },
    async logOut(){
      this.clearToken();
    },
    
  },
});
