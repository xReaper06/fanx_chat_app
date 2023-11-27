<template>
    <div>
        <h1>Registration Form</h1>
    <form @submit.prevent="register" enctype="multipart/form-data">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input v-model="formData.username" type="text" id="username" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input v-model="formData.password" type="password" id="password" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Confirm Password</label>
        <input v-model="formData.confirm" type="password" id="password" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="profilePicture" class="form-label">Profile Picture</label>
        <input type="file" id="profilePicture" @change="handleFileUpload" accept="image/*" class="form-control-file">
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
    <a href="/">login</a>
    </div>
</template>

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
                    }
                } catch (error) {
                    console.log(error)
                }
            }else{
                alert('Password doesnot Match')
            }
        }
</script>
<style scoped>

</style>