<template>
    <div>
        <div class="container">
      <div class="card">
        <div class="card-header">
          Chat Room
        </div>
        <div class="card-body chat-messages">
          <div v-for="message in chatMessages" :key="message.id" class="message">
            <strong>{{ message.sender }}:</strong> {{ message.text }}
          </div>
        </div>
        <div class="input-group">
          <input v-model="newMessage" @keyup.enter="sendMessage" class="form-control" placeholder="Type your message">
          <button @click="sendMessage" class="btn btn-primary">Send</button>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
export default {
    setup () {
        

        return {}
    }
}
</script>

<style lang="scss" scoped>
.chat-messages {
  max-height: 300px;
  overflow-y: scroll;
}

.message {
  margin: 5px 0;
}
</style>