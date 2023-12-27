<template>
  <div class="container">
    <div class="d-flex justify-content-between">
    <div class="card custom-card">
      <div class="card-header bg-light text-black">
        {{ room.room_name }}
        <button class="btn btn-secondary" @click="Exit">exit</button>
        <div id="user-joined">
        </div>
      </div>
      <div class="card-body chat-messages" id="chat-message">
       
      </div>
      <div class="input-group">
        <input v-model="newMessage" @keydown.enter.prevent="sendMessage" class="form-control bg-light text-dark" placeholder="Type your message" />
        <button @click="sendMessage" type="button" class="btn btn-dark">Send</button>
      </div>
    </div>
    <div class="joined-users-list bg-secondary" style="width: 200px;">
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
          li.innerHTML += `<div class="">
  <div class="ms-auto p-3 d-flex flex-row-reverse align-items-end mt-2 p-auto w-50 border bg-primary text-light text-end h-auto">
    <p class="w-100 overflow-wrap-break-word">${data.message}</p>
  </div>
</div>
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
                  <p class="text-start mt-2 ms-3 w-50 custom-text-box h-auto p-auto other-message bg-light p-3 border">${data.message}</p>
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
      if(data!=null){
        if (data.users_id == username.value.id) {
          // Append the message for the current user
          li.innerHTML = `<div class="">
  <div class="ms-auto p-3 d-flex flex-row-reverse align-items-end mt-2 p-auto w-50 bg-primary border text-light text-end h-auto">
    <p class="w-100 overflow-wrap-break-word">${data.message}</p>
  </div>
</div>

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
                    <p class="text-start mt-2 ms-3 w-50 me-auto h-auto p-auto custom-text-box bg-light other-message p-3 border">${data.message}</p>
              `;
        }
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
  alert('You leave the Room');
  const chatMessageBox = document.querySelector('#chat-message');
  const div = document.createElement('div')
      div.classList.add('message')
      const ul = document.createElement('ul')
      ul.classList.add('list-unstyled')
      const li = document.createElement('li')
      li.classList.add('messages')

  if (li) {
      li.innerHTML = `
        <p class="text-center">${data.username} has left the room</p>
      `;
  } else {
    console.error("Element with ID 'user-disconnected' not found in the document.");
  }

      ul.appendChild(li)
      div.appendChild(ul)
      chatMessageBox.appendChild(div)
      // Set the innerHTML after the loop is complete
      if (chatMessageBox) {
      chatMessageBox.scrollTop = chatMessageBox.scrollHeight;
      }
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
    
    // Attach a handler to the beforeunload event
    window.addEventListener('beforeunload', handleBeforeUnload);
  } catch (error) {
    console.error('Socket.IO connection error:', error);
  }

});

const handleBeforeUnload = () => {
  const formData = {
    room_id: room_id.value,
    users_id: username.value.id,
    username: username.value.username,
  };

  // Emit disconnection event when the user is leaving the page
  socket.emit('disconnection', formData);
};

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
      const chatMessageBox = document.querySelector('#chat-message');
      const div = document.createElement('div')
      div.classList.add('message')
      const ul = document.createElement('ul')
      ul.classList.add('list-unstyled')
      const li = document.createElement('li')
      li.classList.add('messages')
      handleUserJoined(data);
        if(data.users_id == username.value.id){
          li.innerHTML =`
                <p class="text-center">You Join the Room</p>
           `
        }else{
          li.innerHTML = `
                <p class="text-center">${data.username} has Joined the Room</p>
            `
        }
        ul.appendChild(li)
      div.appendChild(ul)
      chatMessageBox.appendChild(div)
      // Set the innerHTML after the loop is complete
      if (chatMessageBox) {
      chatMessageBox.scrollTop = chatMessageBox.scrollHeight;
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
  if(newMessage.value === ''){
    alert('do not send empty message')
  }else{
    const data = {
      room_id:room_id.value,
      users_id:parseInt(username.value.id),
      message:newMessage.value
    }
    socket.emit('send-message',data)
    newMessage.value = ''
  }
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

.my-message {
  background-color: #007bff;
  color: #fff;
  border-radius: 10px;
  padding: 10px;
  width: 50%;
  margin-left: auto; /* Move the message to the end of the container */
  margin-right: 0;
  margin-bottom: 10px;
  text-align: end; /* Align text to the end */
}
.custom-card {
  width: 700px;
}
.overflow-wrap-break-word {
  overflow-wrap: break-word;
  hyphens: auto;
}
.container{
  transform: translate(0%,10%);
}

.card {
  max-width: 1000px;
  margin: auto;
}

.chat-messages {
  max-height: 300px;
  overflow-y: scroll;
  background-color: rgba(00, 00, 00, 0.7);
}

.message {
  margin: 5px 0;
}

.messages {
  text-align: start;
  text-shadow: 1px #007bff;
}

.input-group {
  background-color: rgba(00, 00, 00, 0.7);
}

.user-disconnected-message {
  text-align: center;
  color: red;
  margin-top: 10px;
}
</style>

