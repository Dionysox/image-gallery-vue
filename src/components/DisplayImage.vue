<template>
  <div class="image-container">
    <div v-if="!showRecadrage && !showResize && !showFilter">
      <h2>Image: {{ imageName }}</h2>
      <div class="action-buttons">
        <button class="button" @click="this.showPopup = true">Renommer</button>
        <button class="button" @click="this.showRecadrage = true">
          Recadrer
        </button>
        <button class="button" @click="this.showResize = true">
          Redimensionner
        </button>
        <button class="button" @click="this.showFilter = true">Filtres</button>
        <button class="button" @click="downloadImage">Télécharger</button>
        <button class="button" @click="backList">Retour</button>
      </div>

      <img :src="imageSrc" alt="Image" class="sizedImage" />
    </div>
    <rename-popup
      :currentName="$route.params.name"
      :imageId="$route.params.id"
      :showPopup="showPopup"
      v-if="showPopup"
      @close="this.showPopup = false"
      @image-renamed="updateImageName($event)"
    />
    <crop-image
      :imageSrc="imageSrc"
      :imageId="$route.params.id"
      :imageName="imageName"
      :showRecadrage="showRecadrage"
      v-if="showRecadrage"
      @close="this.showRecadrage = false"
      @image-cropped="updateImage($event)"
    />
    <resize-image
      :imageSrc="imageSrc"
      :imageId="$route.params.id"
      :imageName="imageName"
      :showResize="showResize"
      v-if="showResize"
      @close="this.showResize = false"
    />
    <filter-image
      :imageSrc="imageSrc"
      :imageId="$route.params.id"
      :imageName="imageName"
      :showFilter="showFilter"
      v-if="showFilter"
      @close="this.showFilter = false"
    />
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import { saveAs } from 'file-saver';
import RenamePopup from './RenamePopup.vue';
import CropImage from './CropImage.vue';
import ResizeImage from './ResizeImage.vue';
import FilterImage from './FilterImage.vue';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const imageSrc = ref('');
    const showPopup = ref(false);
    const showRecadrage = ref(false);
    const showResize = ref(false);
    const showFilter = ref(false);
    const imageName = ref('');

    const route = useRoute();

    const updateImageName = (newName) => {
      imageName.value = newName;
    };

    const updateImage = (newImage) => {
      imageSrc.value = newImage;
      updateImageName(imageName.value);
    };

    const downloadImage = async () => {
      const imageUrl = `http://localhost:3000/images/${route.params.id}`;

      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // On utilise saveAs pour télécharger le fichier
        saveAs(blob, `${route.params.name}.jpg`);
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image :", error);
      }
    };

    const instance = getCurrentInstance();

    const backList = () => {
      instance.appContext.config.globalProperties.$router.push({
        name: 'main',
      });
    };

    const beforeRouteLeave = (to, from, next) => {
      // Appel de la méthode updateImages du parent (App.vue) lorsqu'on quitte la route 'display-image'
      console.log('before route leave');
      this.$parent.updateImages();
      next();
    };

    onMounted(() => {
      imageSrc.value = `http://localhost:3000/images/${route.params.id}`;
      updateImageName(route.params.name);
    });

    return {
      showPopup,
      showRecadrage,
      showResize,
      showFilter,
      imageName,
      imageSrc,
      updateImageName,
      updateImage,
      downloadImage,
      backList,
      beforeRouteLeave,
    };
  },
  components: {
    RenamePopup,
    CropImage,
    ResizeImage,
    FilterImage,
  },
};
</script>

<style scoped>
.image-container {
  margin-top: -60px;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    0deg,
    rgba(0, 0, 15, 1) 55%,
    rgba(0, 3, 47, 1) 100%
  );
  height: 150vh;
  margin-left: -10px;
  margin-right: -10px;
  background-size: cover;
}
.sizedImage {
  max-width: 80%;
  padding-top: 30px;
}

.button {
  margin: 10px;
}
</style>
