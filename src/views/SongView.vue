<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        @click.prevent="newSong(song)"
      >
        <i class="fas" :class="iconClass"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
        <div>{{ song.genre }}</div>
        <div class="song-price">{{ $n(2, "currency") }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">{{
          $tc("song.comment_count", song.commentCount, {
            count: song.commentCount,
          })
        }}</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          class="text-white text-center font-bold p-4 mb-4"
          v-if="commentShowAlert"
          :class="commentAlertColor"
        >
          {{ commentAlertMessage }}
        </div>
        <vee-form
          :validation-schema="validationSchema"
          @submit="addComment"
          v-if="userLoggedIn"
        >
          <vee-field
            as="textarea"
            name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
          ></vee-field>
          <error-message class="text-red-600" name="comment"></error-message>
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
            :disabled="commentInSubmission"
          >
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select
          v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li
      class="p-6 bg-gray-50 border border-gray-200"
      v-for="comment in sortedComments"
      :key="comment.docId"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.username }}</div>
        <time>{{ comment.datePosted }}</time>
      </div>

      <p>
        {{ comment.content }}
      </p>
    </li>
  </ul>
</template>

<script>
import { auth, songsCollection, commentsCollection } from "@/includes/firebase";
import { mapState, mapActions } from "pinia";
import useUserStore from "@/stores/user";
import usePlayerStore from "@/stores/player";

export default {
  name: "SongView",
  data() {
    return {
      song: {},
      comments: [],
      sort: "latest",
      validationSchema: {
        comment: "required|min:3",
      },
      commentInSubmission: false,
      commentShowAlert: false,
      commentAlertColor: "bg-blue-500",
      commentAlertMessage: "Please wait, your comment is being submitted.",
    };
  },

  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),
    ...mapState(usePlayerStore, ["playing", "currentSong"]),
    sortedComments() {
      // create a copy before sorting the array
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "latest") {
          // from latest to oldest (descending date order)
          return new Date(b.datePosted) - new Date(a.datePosted);
        }

        // from oldest to latest (ascending date order)
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
    iconClass() {
      return {
        "fa-play":
          !this.playing ||
          (this.playing &&
            this.currentSong.modifiedName !== this.song.modifiedName),
        "fa-pause":
          this.playing &&
          this.currentSong.modifiedName === this.song.modifiedName,
      };
    },
  },

  async created() {
    const snapshot = await songsCollection.doc(this.$route.params.id).get();

    // redirect to home page if song doesn't exist
    if (!snapshot.exists) {
      this.$router.push({ name: "home" });
      return;
    }

    const { sort } = this.$route.query;
    if (sort === "latest" || sort === "oldest") {
      this.sort = sort; // use default value otherwise
    }

    this.song = snapshot.data();
    this.getComments();
  },

  methods: {
    ...mapActions(usePlayerStore, ["newSong"]),
    async addComment(values, { resetForm }) {
      this.commentInSubmission = true;
      this.commentShowAlert = true;
      this.commentAlertColor = "bg-blue-500";
      this.commentAlertMessage =
        "Please wait, your comment is being submitted.";

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        songId: this.$route.params.id,
        username: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };

      await commentsCollection.add(comment);

      this.song.commentCount += 1;
      await songsCollection.doc(this.$route.params.id).update({
        commentCount: this.song.commentCount,
      });

      this.getComments();

      this.commentInSubmission = false;
      this.commentAlertColor = "bg-green-500";
      this.commentAlertMessage = "Comment added.";

      resetForm(); // available in VeeValidate
    },
    async getComments() {
      const snapshots = await commentsCollection
        .where("songId", "==", this.$route.params.id)
        .get();

      this.comments = [];
      snapshots.forEach((document) => {
        this.comments.push({
          docId: document.id,
          ...document.data(),
        });
      });
    },
  },

  watch: {
    sort(newVal) {
      if (newVal !== this.$route.query.sort) {
        this.$router.push({
          query: {
            sort: newVal,
          },
        });
      }
    },
  },
};
</script>
