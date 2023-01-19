import { defineStore } from "pinia";
import { auth, usersCollection } from "@/includes/firebase";

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),

  actions: {
    async register(values) {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      await usersCollection.doc(userCredentials.user.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        gender: values.gender,
        country: values.country,
      });

      await userCredentials.user.updateProfile({ displayName: values.name });

      this.userLoggedIn = true;
    },
    async authenticate(email, password) {
      await auth.signInWithEmailAndPassword(email, password);

      // if authentication fails, it will throw and error and this will never run
      this.userLoggedIn = true;
    },
    async signOut() {
      auth.signOut();
      this.userLoggedIn = false;
    },
  },
});
