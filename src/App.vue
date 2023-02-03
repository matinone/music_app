<template>
  <!-- Header -->
  <app-header></app-header>

  <router-view></router-view>

  <song-player></song-player>

  <!-- Auth Modal -->
  <app-auth></app-auth>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppAuth from "@/components/AppAuth.vue";
import SongPlayer from "@/components/SongPlayer.vue";

import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "@/includes/firebase";

export default {
  name: "App",
  components: {
    AppHeader,
    AppAuth,
    SongPlayer,
  },

  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },

  // lifecycle hook
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  },
};
</script>
