<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div>
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="showAlert"
        :class="alertColor"
      >
        {{ alertMessage }}
      </div>
      <vee-form
        :validation-schema="validationSchema"
        :initial-values="song"
        @submit="editSong"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modifiedName"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedSongFlag(true)"
          />
          <error-message
            class="text-red-600"
            name="modifiedName"
          ></error-message>
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedSongFlag(true)"
          />
          <error-message class="text-red-600" name="genre"></error-message>
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="inSubmission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="inSubmission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from "@/includes/firebase";

export default {
  name: "SongItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedSongFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      validationSchema: {
        modifiedName: "required",
        genre: "alpha_spaces",
      },
      inSubmission: false,
      showAlert: false,
      alertColor: "bg-blue-500",
      alertMessage: "Please wait, updating song information.",
    };
  },
  methods: {
    async editSong(values) {
      this.inSubmission = true;
      this.showAlert = true;
      this.alertColor = "bg-blue-500";
      this.alertMessage = "Please wait, updating song information.";

      try {
        await songsCollection.doc(this.song.docId).update(values);
      } catch (error) {
        this.inSubmission = false;
        this.alertColor = "bg-red-500";
        this.alertMessage = "Something went wrong, please try again later.";
        return;
      }

      this.updateSong(this.index, values);
      this.updateUnsavedSongFlag(false);

      this.inSubmission = false;
      this.alertColor = "bg-green-500";
      this.alertMessage = "Success!";
    },
    async deleteSong() {
      // remove from Firebase storage
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.originalName}`);
      await songRef.delete();

      // remove from Firebase database
      await songsCollection.doc(this.song.docId).delete();

      // remove from songs array
      this.removeSong(this.index);
    },
  },
};
</script>
