<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">{{ $t("home.listen") }}</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
          suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
          pulvinar, fringilla lorem eget, ullamcorper urna.
        </p>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="/assets/img/introduction-music.png"
    />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div
        class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
        v-icon-secondary="{ icon: 'headphones-alt', right: true }"
      >
        <span class="card-title">Songs</span>
        <!-- Icon -->
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <song-item-home
          v-for="song in songs"
          :key="song.docId"
          :song="song"
        ></song-item-home>
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>

<script setup>
import { reactive, onBeforeUnmount } from "vue";

import { songsCollection } from "@/includes/firebase";
import SongItemHome from "@/components/SongItemHome.vue";
import IconSecondary from "@/directives/icon-secondary";

// custom directive
const vIconSecondary = IconSecondary;

const songs = reactive([]);
const maxPerPage = 25;
let pendingRequest = false;

async function getSongs() {
  if (pendingRequest) {
    return;
  }

  pendingRequest = true;
  let snapshots;
  if (songs.length > 0) {
    const lastDoc = await songsCollection
      .doc(songs[songs.length - 1].docId)
      .get();
    snapshots = await songsCollection
      .orderBy("modifiedName")
      .startAfter(lastDoc)
      .limit(maxPerPage)
      .get();
  } else {
    snapshots = await songsCollection
      .orderBy("modifiedName")
      .limit(maxPerPage)
      .get();
  }

  snapshots.forEach((document) => {
    songs.push({
      docId: document.id,
      ...document.data(),
    });
  });

  pendingRequest = false;
}

// query initial songs when the home component is created
getSongs();

// then query more songs as the user scrolls down
function handleScroll() {
  const { scrollTop, offsetHeight } = document.documentElement;
  const { innerHeight } = window;
  const bottomWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

  if (bottomWindow) {
    getSongs();
  }
}
window.addEventListener("scroll", handleScroll);

// remove the event listener if the user leaves the page
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
