<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50 example"
    :id="`song-id-${song.docId}`"
    :class="`song-id-${song.docId}`"
  >
    <div>
      <router-link
        :to="{ name: 'song', params: { id: song.docId } }"
        class="font-bold block text-gray-600"
      >
        {{ song.modifiedName }}
      </router-link>
      <span class="text-gray-500 text-sm italic">
        Uploaded by {{ song.userDisplayName }}
      </span>
    </div>

    <div class="text-gray-600 text-lg">
      <span class="comments">
        <i class="fa fa-comments text-gray-600"></i>
        {{ song.commentCount }}
      </span>
    </div>
  </li>
</template>

<script>
export default {
  name: "SongItemHome",
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
};
</script>
