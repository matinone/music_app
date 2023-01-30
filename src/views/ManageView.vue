<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload-files :addSong="addSong"></upload-files>
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <song-item
              v-for="(song, index) in songs"
              :key="song.docId"
              :song="song"
              :index="index"
              :updateSong="updateSong"
              :removeSong="removeSong"
            ></song-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import UploadFiles from "@/components/UploadFiles.vue";
import SongItem from "@/components/SongItem.vue";
import { auth, songsCollection } from "@/includes/firebase";

export default {
  name: "ManageView",
  components: {
    UploadFiles,
    SongItem,
  },
  data() {
    return {
      songs: [],
    };
  },
  async created() {
    // query songs uploaded by current user
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();

    snapshot.forEach(this.addSong);
  },
  methods: {
    updateSong(index, values) {
      this.songs[index].modifiedName = values.modifiedName;
      this.songs[index].genre = values.genre;
    },
    removeSong(index) {
      this.songs.splice(index, 1);
    },
    addSong(document) {
      const song = {
        ...document.data(),
        docId: document.id,
      };
      this.songs.push(song);
    },
  },
};
</script>
