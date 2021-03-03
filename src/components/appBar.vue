<template>
  <div>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <div class="d-flex align-center">
        <h1>Assignment</h1>
      </div>

      <v-spacer></v-spacer>
      <v-btn depressed color="primary" @click.stop.prevent="logout()">Logout</v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "appBar",

  methods: {
    logout() {
      this.$store
          .dispatch("logoutUser")
          .then(() => {
            this.$router.push("/login");
          })
          .catch(() => {
            alert("wrong...logout process");
          });
    }
  }
}
</script>

<style scoped>

</style>