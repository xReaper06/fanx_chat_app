<template>
    <div>
        <div class="container">
      <div class="row">
        <div class="col-md-4">
          <!-- User profile section -->
          <div class="card">
            <div class="card-header">
              User Profile
            </div>
            <div class="card-body">
              <!-- Display user information here -->
              <div>
                <strong>Username:</strong> {{ user.username }}
              </div>
              <div>
                <strong>Email:</strong> {{ user.email }}
              </div>
              <!-- Add more user information fields as needed -->
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <!-- User interaction section -->
          <div class="card">
            <div class="card-header">
              User Interaction
            </div>
            <div class="card-body">
              <!-- Add user interaction components here -->
              <button @click="openChat">Open Chat</button>
              <button @click="viewNotifications">View Notifications</button>
              <!-- Add more interaction options as needed -->
            </div>
          </div>
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

</style>