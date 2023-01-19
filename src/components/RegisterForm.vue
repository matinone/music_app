<template>
  <div>
    <div
      class="text-white text-center font-bold p-4 rounded mb-4"
      v-if="reg_show_alert"
      :class="reg_alert_bg"
    >
      {{ reg_alert_msg }}
    </div>
    <vee-form
      :validation-schema="schema"
      :initial-values="initialData"
      @submit="register"
    >
      <!-- Name -->
      <div class="mb-3">
        <label class="inline-block mb-2">Name</label>
        <vee-field
          type="text"
          name="name"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Name"
        />
        <error-message class="text-red-600" name="name"></error-message>
      </div>
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field
          type="email"
          name="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email"
        />
        <error-message class="text-red-600" name="email"></error-message>
      </div>
      <!-- Age -->
      <div class="mb-3">
        <label class="inline-block mb-2">Age</label>
        <vee-field
          type="number"
          name="age"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        />
        <error-message class="text-red-600" name="age"></error-message>
      </div>
      <!-- Gender -->
      <div class="mb-3">
        <label class="inline-block mb-2">Age</label>
        <vee-field
          as="select"
          name="gender"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </vee-field>
        <error-message class="text-red-600" name="gender"></error-message>
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field name="password" :bails="false" v-slot="{ field, errors }">
          <input
            type="password"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Password"
            v-bind="field"
          />
          <div class="text-red-600" v-for="error in errors" :key="error">
            {{ error }}
          </div>
        </vee-field>
      </div>
      <!-- Confirm Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Confirm Password</label>
        <vee-field
          type="password"
          name="confirm_password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Confirm Password"
        />
        <error-message
          class="text-red-600"
          name="confirm_password"
        ></error-message>
      </div>
      <!-- Country -->
      <div class="mb-3">
        <label class="inline-block mb-2">Country</label>
        <vee-field
          as="select"
          name="country"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="USA">USA</option>
          <option value="Mexico">Mexico</option>
          <option value="Germany">Germany</option>
        </vee-field>
        <error-message
          class="text-red-600 block"
          name="country"
        ></error-message>
      </div>
      <!-- TOS -->
      <div class="mb-3 pl-6">
        <vee-field
          type="checkbox"
          name="tos"
          class="w-4 h-4 float-left -ml-6 mt-1 rounded"
          value="1"
        />
        <label class="inline-block">Accept terms of service</label>
        <error-message class="text-red-600 block" name="tos"></error-message>
      </div>
      <button
        type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
        :disabled="reg_in_submission"
      >
        Submit
      </button>
    </vee-form>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user.js";

export default {
  name: "RegisterForm",
  data() {
    return {
      schema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|min:3|max:100|email",
        age: "required|min_value:18|max_value:120",
        gender: "required",
        password: "required|min:8|max:100|not_one_of:password,12345",
        confirm_password: "password_match:@password",
        country: "required",
        tos: "tos_required",
      },
      initialData: {
        country: "USA",
        gender: "female",
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_bg: "bg-blue-500",
      reg_alert_msg: "Please wait, your account is being created.",
    };
  },

  methods: {
    ...mapActions(useUserStore, {
      createUser: "register",
    }),

    async register(values) {
      // it will only be executed if the validation rules pass
      this.reg_in_submission = true;
      this.reg_show_alert = true;
      this.reg_alert_bg = "bg-blue-500";
      this.reg_alert_msg = "Please wait, your account is being created.";

      // create new user in Firebase Auth service and add user data to Firestore
      try {
        await this.createUser(values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_bg = "bg-red-500";
        this.reg_alert_msg =
          "An unexpected error occured, please try again later.";
        return;
      }

      this.reg_alert_bg = "bg-green-500";
      this.reg_alert_msg = "Success! Your account has been created.";
    },
  },
};
</script>
