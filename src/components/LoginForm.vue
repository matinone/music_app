<template>
  <div>
    <div
      class="text-white text-center font-bold p-4 rounded mb-4"
      v-if="login_show_alert"
      :class="login_alert_bg"
    >
      {{ login_alert_msg }}
    </div>
    <vee-form :validation-schema="loginSchema" @submit="login">
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field
          name="email"
          type="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email"
        />
        <error-message class="text-red-600" name="email"></error-message>
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field
          name="password"
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
        />
        <error-message class="text-red-600" name="password"></error-message>
      </div>
      <button
        type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
        :disabled="login_in_submission"
      >
        Submit
      </button>
    </vee-form>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      loginSchema: {
        email: "required|min:3|max:100|email",
        password: "required|min:8|max:100",
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_bg: "bg-blue-500",
      login_alert_msg: "Please wait, we are logging you in.",
    };
  },

  methods: {
    login(values) {
      // it will only be executed if the validation rules pass
      this.login_in_submission = true;
      this.login_show_alert = true;
      this.login_alert_bg = "bg-blue-500";
      this.login_alert_msg = "Please wait, we are logging you in.";

      // submit form here

      this.login_alert_bg = "bg-green-500";
      this.login_alert_msg = "Success! You are now logged in.";
      console.log(values);
    },
  },
};
</script>