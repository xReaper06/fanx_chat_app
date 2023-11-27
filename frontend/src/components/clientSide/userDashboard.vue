<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <!-- User profile section -->
          <div class="card bg-primary text-white">
            <div class="card-header">
              User Profile
            </div>
            <div class="card-body">
              <!-- Display user information here -->
              <div>
                <img :src="'http://localhost:3002/api/images/'+username.profilepic" alt="" srcset="" style="height: 100px; width: 100px;">
                <strong>Username:</strong> {{ username.username }}
              </div>
              <button type="button" @click="logout" class="btn btn-light">Logout</button>
              <!-- Add more user information fields as needed -->
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <!-- User interaction section -->
          <div class="card bg-info text-white">
            <div class="card-header">
              User Interaction
            </div>
            <div class="card-body">
              <input type="text" placeholder="Search Room name" v-model="search" @input="SearchRooms" class="form-control mb-3">
              <div v-if="search !== ''" class="text-decoration-none">
                <ul v-for="room in filteredRooms" :key="room.id">
                  <li>
                    {{ room.room_name }}
                    <button @click="Join(room)" class="btn btn-light">Join</button>
                  </li>
                </ul>
              </div>
              <!-- Add user interaction components here -->
              <input type="text" v-model="createroom.room_name" class="form-control mb-3">
              <button @click="CreateRoom" class="btn btn-light">Create Room</button>
              <!-- Add more interaction options as needed -->
            </div>
          </div>
        </div>
        <div class="col-md-8 mt-3">
          <!-- User interaction section -->
          <div class="card bg-success text-white">
            <div class="card-header">
              Rooms
            </div>
            <div class="card-body room-body">
              <div v-for="room in myRooms" :key="room.id">
                <h6>{{ room.room_name }}</h6>
                <button @click="Join(room)" class="btn btn-light">Join</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
/* eslist-disable */
import AuthenticationServices from '@/services/AuthenticationServices';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store';
import { useRouter } from 'vue-router';

const users = ref('');
const username = ref('')
const authStore = useAuthStore();
const router = useRouter();



users.value = localStorage.getItem('user')
username.value = JSON.parse(users.value);
const search = ref('');

const createroom = ref({
  room_name:'',user_id:parseInt(username.value.id)
})
const myRooms = ref([])
const allRooms = ref([])

const filteredRooms = ref([]);
const getAllRooms = async()=>{
  try {
    const response = await AuthenticationServices.getAllRooms()
    if(response){
      allRooms.value = response.data.Allrooms
    }
  } catch (error) {
    console.log(error)
  }
}
const getRooms = onMounted(async()=>{
  try {
    username.value = JSON.parse(users.value)
    const response = await AuthenticationServices.getRooms({
      users_id:parseInt(username.value.id)
    })
    if(response){
      myRooms.value = response.data.rooms
    }
  } catch (error) {
    console.log(error)
  }
})
const CreateRoom =async()=>{
  try {
    const response = await AuthenticationServices.createRoom({
      user_id:createroom.value.user_id,
      room_name:createroom.value.room_name
    })
    if(response){
      createroom.value.room_name = ''
      getRooms();
      getAllRooms()
    }
  } catch (error) {
    console.log(error)
  }
}
onMounted(async()=>{
  await getAllRooms();
  await getRooms();

})
const SearchRooms = async () => {

  filteredRooms.value = allRooms.value.filter(room => {
    return room.room_name && room.room_name.toLowerCase().includes(search.value.toLowerCase());
  });

};

const logout = async()=>{
  try {
    const response = await AuthenticationServices.Logout({
      id:createroom.value.user_id
    })
    if(response){
      authStore.logOut()
      router.push('/');
    }
  } catch (error) {
    console.log(error)
  }
}
const Join = async (room) => {
  router.push(`/user/chatRooms/${room.room_id}`);
};


</script>

<style scoped>
.room-body{
  max-height: 250px;
  overflow-y: scroll;
}

</style>