<template>
  <div>
    <h1>Login Form</h1>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input v-model="formData.username" type="username" id="username" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input v-model="formData.password" type="password" id="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <a href="/registration">Register</a>
  </div>
</template>

<script>
import AuthenticationServices from '@/services/AuthenticationServices.js';
import {useAuthStore} from '@/store/index'
import router from '../router/index'
import {ref} from 'vue'
export default {
  setup () {
    const routes = router;
    const formData = ref({
      username:'',
      password:''
    })
    const login = async()=>{
      if(formData.value.username !== ''||formData.value.password !=='')
      try {
        const response = await AuthenticationServices.login({
        username: formData.value.username,
        password: formData.value.password
      });
      const authStore = useAuthStore()
      // Set the user and token
      authStore.setUser(response.data.user); // Assuming the user data is in response.data.user
      console.log(response.data.user)
      authStore.setTokens(response.data.accessToken, response.data.refreshToken)
      if(response){
        routes.push('/user/dashboard');
      }else{
        alert('This User Is not Registered');
      }
      } catch (error) {
        alert(error);
      }
    }

    return {formData,login}
  }
}
</script>

<style lang="scss" scoped>

</style>