<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dense dark class="primary">
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="loginForm" v-model="valid" lazy-validation>
                <v-text-field
                    prepend-icon="mdi-account"
                    name="email"
                    label="Email"
                    type="email"
                    v-model="user.email"
                    :error-messages="messages.email"
                ></v-text-field>
                <v-text-field
                    id="password"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="user.password"
                    :error-messages="messages.password"
                ></v-text-field>
              </v-form>
            </v-card-text>

            <v-layout justify-center>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="primary" @click.stop.prevent="checkUser()">Login</v-btn>
              </v-card-actions>
            </v-layout>

          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "loginRegister",

  data: () => ({
    valid: true,

    user: {
      email: "",
      password: "",
    },

    messages: {
      email: [],
      password: [],
    }
  }),

  methods: {
    checkUser() {
      this.$store.dispatch("authenticateUser", this.user).then(response => {

        if (response){
          this.$router.push("/");
        }
      }).catch(error => {
        let errors = error.data;
        if (error) {
          for (let field in errors) {
            this.messages[field] = errors[field]
          }
        }else {
          this.messages.email = [];
          this.messages.password = [];
        }
      });
    },
  }


}
</script>

<style scoped>

</style>