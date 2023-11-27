import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  id:'auth',
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    user: localStorage.getItem('user') || '',
    isConnected: false,
    socketMessage: '',
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
  actions: {
    setTokens( accessToken, refreshToken ) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    clearTokens() {
      this.accessToken = '';
      this.refreshToken = '';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    updateAccessToken(accessToken){
      this.accessToken = accessToken
      localStorage.setItem('accessToken');
    },
    setUser(user) {
      this.user = user
      localStorage.setItem('user',JSON.stringify(user))
    },
    updateLocalUser(user){
      this.user = user
      localStorage.setItem('user',JSON.stringify(user));
    },
    async logOut(){
      this.clearTokens();
      this.user = ''
      localStorage.removeItem('user');
    },
    setConnected() {
      this.isConnected = true;
    },
    setDisconnected() {
      this.isConnected = false;
    },
    setMessage(message) {
      this.socketMessage = message;
    }
  }
});
