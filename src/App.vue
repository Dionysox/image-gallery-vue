<template>
  <div id="app">
    <upload-image
      @image-uploaded="updateImages"
      class="upload"
      v-if="this.$route.name === 'main'"
    />
    <list-image
      :images="images"
      ref="listImage"
      class="listimage"
      v-if="this.$route.name === 'main'"
    />
    <display-image
      @back="updateImages"
      :images="images"
      ref="displayImage"
      class="displayimage"
      v-if="this.$route.name === 'display-image'"
    />
  </div>
</template>

<script>
import UploadImage from './components/UploadImage.vue';
import ListImage from './components/ListImage.vue';
import DisplayImage from './components/DisplayImage.vue';
//import { ref } from 'vue';

export default {
  name: 'App',
  components: {
    UploadImage,
    ListImage,
    DisplayImage,
  },

  data() {
    return {
      images: [],
    };
  },
  methods: {
    updateImages() {
      //appel la méthode fetchImages pour mettre à jour la liste des images.
      this.$refs.listImage.fetchImages();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: #263258;
}

.upload {
  background-image: url('./assets/blue-dark.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: -60px;
  margin-bottom: -20px;
  margin-left: -10px;
  margin-right: -10px;
  padding-bottom: 20px;
}

.listimage {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    0deg,
    rgba(0, 0, 15, 1) 55%,
    rgba(0, 3, 47, 1) 100%
  );
  margin-left: -10px;
  margin-right: -10px;
  padding-bottom: 60px;
  height: 100%;
}
</style>
