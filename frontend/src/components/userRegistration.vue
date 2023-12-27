<template>
  <div class="registration-container">
    <h1>Registration Form</h1>
    <form @submit.prevent="register" enctype="multipart/form-data" class="registration-form">
      <div class="form-group">
        <label for="username" class="form-label">Username</label>
        <input v-model="formData.username" type="text" id="username" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input v-model="formData.password" type="password" id="password" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="confirm" class="form-label">Confirm Password</label>
        <input v-model="formData.confirm" type="password" id="confirm" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="profilePicture" class="form-label">Profile Picture</label>
        <input type="file" id="profilePicture" @change="handleFileUpload" accept="image/*" class="form-control-file">
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
    <div class="login-link">
      <span>Already have an account?</span>
      <a href="/">Login</a>
    </div>
  </div>
</template>

<style scoped>
  .registration-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transform: translate(0%,10%);
  }

  .registration-form {
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
    background-color: #28a745;
    color: #fff;
    cursor: pointer;
  }

  .btn-primary:hover {
    background-color: #218838;
  }

  .login-link {
    margin-top: 15px;
    text-align: center;
  }

  .login-link span {
    margin-right: 5px;
  }

  .login-link a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }

  .login-link a:hover {
    text-decoration: underline;
  }
</style>


<script setup>
import AuthenticationServices from '@/services/AuthenticationServices.js'
import { ref } from 'vue'

        const formData = ref({
            username:'',
            password:'',
            confirm:'',
            profilePicture:'',
        })
        const handleFileUpload = async (event)=>{
            formData.value.profilePicture = event.target.files[0];
        }
        const register = async ()=>{
            if(formData.value.password === formData.value.confirm){
                try {
                  const formdata = new FormData();
                  formdata.append('username',formData.value.username)
                  formdata.append('password',formData.value.password)
                  formdata.append('profilePicture',formData.value.profilePicture)
                    const response = await AuthenticationServices.userRegistration(formdata)
                    if(response){
                        alert('Registration Complete')
                        formData.value.username = ''
                        formData.value.password = ''
                        formData.value.confirm = ''
                    }
                } catch (error) {
                    console.log(error)
                }
            }else{
                alert('Password doesnot Match')
            }
        }
</script>
