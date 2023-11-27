<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between">
    <div class="card">
      <div class="user-disconnected-message" id="user-disconnected">
    </div>
      <div class="card-header bg-primary text-white">
        {{ room.room_name }}
        <button class="btn btn-secondary" @click="Exit">exit</button>
        <div id="user-joined">
        </div>
      </div>
      <div class="card-body chat-messages" id="chat-message">
       
      </div>
      <div class="input-group">
        <input v-model="newMessage" @keydown.enter.prevent="sendMessage" class="form-control" placeholder="Type your message" />
        <button @click="sendMessage" class="btn btn-primary">Send</button>
      </div>
    </div>
    <div class="joined-users-list" style="width: 200px;">
        <h5>Users Joined</h5>
        <ul>
          <li v-for="user in joinedUsers" :key="user.id">
            {{ user.username }}
          </li>
        </ul>
      </div>
  </div>
</div>
</template>


<script setup>
import AuthenticationServices from '@/services/AuthenticationServices';
import { ref, onMounted, watchEffect } from 'vue';
import { io } from 'socket.io-client';
import { useRoute,useRouter } from 'vue-router';

const routes = useRouter()

let socket;

socket = io('http://localhost:3001');

const chatMessages = ref([]);
const joinedUsers = ref([]);

const router = useRoute()

const room_id = ref()
room_id.value = router.params.room_id

const room = ref('')


const users = ref('')
const username = ref('')
const newMessage =ref('')



users.value = localStorage.getItem('user')
username.value = JSON.parse(users.value);
const getRoomConvo = async () => {
  try {
    const response = await AuthenticationServices.getRoomConvo({
      room_id: room_id.value
    });

    if (response) {
      const conversation = response.data.convo;
      console.log(conversation);

      const chatMessageBox = document.querySelector('#chat-message');
      const div = document.createElement('div')
      div.classList.add('message')
      const ul = document.createElement('ul')
      ul.classList.add('list-unstyled')
      const li = document.createElement('li')
      li.classList.add('messages')

      conversation.forEach(data => {
        if (data.users_id == username.value.id) {
          // Append the message for the current user
          li.innerHTML += `
                  <p class="text-end me-3 custom-text-box p-3 border">${data.message}</p>
                `;
        } else {
          // Append the message for other users
          li.innerHTML += `
                  <div class="d-flex align-items-left">
                    <img
                      src="http://localhost:3002/api/images/${data.profilepic}"
                      alt=""
                      srcset=""
                      class="rounded-circle me-2"
                      style="height: 25px; width: 25px;"
                    />
                    <strong>${data.username}</strong>
                  </div>
                  <p class="text-start mt-2 ms-3 custom-text-box p-3 border">${data.message}</p>
              `;
        }
      
      ul.appendChild(li)
      div.appendChild(ul)
      chatMessageBox.appendChild(div)
      // Set the innerHTML after the loop is complete
      if (chatMessageBox) {
      chatMessageBox.scrollTop = chatMessageBox.scrollHeight;
    }
      })
    }
  } catch (error) {
    console.log(error);
  }
};
const appendMessage = (data)=>{
      const chatMessageBox = document.querySelector('#chat-message');
      const div = document.createElement('div')
      div.classList.add('message')
      const ul = document.createElement('ul')
      ul.classList.add('list-unstyled')
      const li = document.createElement('li')
      li.classList.add('messages')

        if (data.users_id == username.value.id) {
          // Append the message for the current user
          li.innerHTML = `
                  <p class="text-end me-3 custom-text-box p-3 border">${data.message}</p>
                `;
        } else {
          // Append the message for other users
          li.innerHTML = `
                  <div class="d-flex align-items-left">
                    <img
                      src="http://localhost:3002/api/images/${data.profilepic}"
                      alt=""
                      srcset=""
                      class="rounded-circle me-2"
                      style="height: 25px; width: 25px;"
                    />
                    <strong>${data.username}</strong>
                    </div>
                    <p class="text-start mt-2 ms-3 custom-text-box p-3 border">${data.message}</p>
              `;
        }
      ul.appendChild(li)
      div.appendChild(ul)
      chatMessageBox.appendChild(div)
      // Set the innerHTML after the loop is complete
      if (chatMessageBox) {
      chatMessageBox.scrollTop = chatMessageBox.scrollHeight;
}
}

const handleUserDisconnected = (data) => {
  const userDisconnected = document.querySelector('#user-disconnected');
  userDisconnected.innerHTML = `
    <p class="text-center">${data.username} has left the room</p>
  `;
};


const getMyRoom = async()=>{
  try {
    const response = await AuthenticationServices.getMyRoom({
      room_id:room_id.value
    })
    if(response){
      room.value = response.data.Myroom
    }
    console.log(room.value)
  } catch (error) {
    console.log(error)
  }
}

const handleUserJoined = (data) => {
  joinedUsers.value = data.userJoined;
};
onMounted(async () => {
  try {
    await getRoomConvo();
    await getMyRoom();
    
    
  } catch (error) {
    console.error('Socket.IO connection error:', error);
  }
});
watchEffect(()=>{

  socket.on('connect', () => {
      console.log('Socket.IO connected successfully!');

      const data = {
        room_id: room_id.value,
        users_id: parseInt(username.value.id)
      };
      
      socket.emit('join-room', data);
      console.log('Joined room:', room_id.value);
    });
    
    socket.on('user-joined', (data) => {
      console.log('User joined:', data);
      const userJoined = document.querySelector('#user-joined')
      handleUserJoined(data);
        if(data.users_id == username.value.id){
          userJoined.innerHTML =`
                <p class="text-center">You Join the Room</p>
           `
        }else{
          userJoined.innerHTML = `
                <p class="text-center">${data.username} has Joined the Room</p>
            `
        }
    });

  socket.on('chat-message', (data) => {
      console.log('Received chat message:', data);
      appendMessage(data)
    });

    

    socket.on('user-disconnected', (data) => {
      console.log(`User disconnected: ${data.username}`);
      handleUserDisconnected(data)
      handleUserJoined(data)
    });
})

console.log(chatMessages.value)

const sendMessage = async()=>{
  const data = {
    room_id:room_id.value,
    users_id:parseInt(username.value.id),
    message:newMessage.value
  }
  socket.emit('send-message',data)
  newMessage.value = ''
}
const Exit = ()=>{
  const formData = {
    room_id:room_id.value,
    users_id:username.value.id,
    username:username.value.username
  }
  socket.emit('disconnection',formData)
  routes.push('/user/dashboard')
}

</script>

<style scoped>
/* Add any additional styling here */
.joined-users-list {
  background-color: #f8f9fa;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
}
.card {
  max-width: 600px;
  margin: auto;
}

.chat-messages {
  max-height: 300px;
  overflow-y: scroll;
}

.message {
  margin: 5px 0;
}
.messages{
  text-align: start;
}

.input-group {
  margin-top: 10px;
}
.user-disconnected-message {
  text-align: center;
  color: red;
  margin-top: 10px;
}
</style>
