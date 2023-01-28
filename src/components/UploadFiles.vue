<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{
          'bg-green-400 hover:border-green-400 hover:border-solid': is_dragover,
        }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="uploadFile($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="uploadFile($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.textColor">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.barColor"
            :style="{ width: upload.currentProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from "@/includes/firebase";

export default {
  name: "UploadFiles",
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  methods: {
    uploadFile($event) {
      this.is_dragover = false;

      // convert object to array
      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files] // drag and drop event
        : [...$event.target.files]; // file input button

      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          return; // end current iteration
        }

        // upload file to Firebase
        const storageRef = storage.ref();
        const songRef = storageRef.child(`songs/${file.name}`); // pointer to file in the cloud
        const task = songRef.put(file);

        // push returns the new length of the array, so length - 1 is the index of the last element
        const uploadIndex =
          this.uploads.push({
            task,
            currentProgress: 0,
            name: file.name,
            barColor: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            textColor: "",
          }) - 1;

        // keep track of the upload status (progress, success, failure)
        task.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].currentProgress = progress;
          },
          (error) => {
            this.uploads[uploadIndex].barColor = "bg-red-400";
            this.uploads[uploadIndex].icon = "fas fa-times";
            this.uploads[uploadIndex].textColor = "text-red-400";
            console.log(error);
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              userDisplayName: auth.currentUser.displayName,
              originalName: task.snapshot.ref.name,
              modifiedName: task.snapshot.ref.name,
              genre: "",
              commentCount: 0,
            };

            song.url = await task.snapshot.ref.getDownloadURL();
            await songsCollection.add(song);

            this.uploads[uploadIndex].barColor = "bg-green-400";
            this.uploads[uploadIndex].icon = "fas fa-check";
            this.uploads[uploadIndex].textColor = "text-green-400";
          }
        );
      });
    },
  },
  beforeUnmount() {
    // cancel file uploads if the user leaves the page
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  },
};
</script>
