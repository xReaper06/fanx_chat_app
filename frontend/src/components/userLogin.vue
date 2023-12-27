<template>
  <div class="login-container">
    <h1>Login Form</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="username" class="form-label">Username</label>
        <input v-model="formData.username" type="text" id="username" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input v-model="formData.password" type="password" id="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <div class="additional-options">
      <a href="/forgot-password">Forgot Password?</a>
      <span class="separator">|</span>
      <a href="/registration">Register</a>
    </div>
  </div>
</template>

<style scoped>
  .login-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transform: translate(0%,40%);
  }

  .login-form {
    display: flex;
    flex-direction: column;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
  }

  .form-control {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .btn-primary {
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }

  .additional-options {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .separator {
    margin: 0 10px;
  }
</style>

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