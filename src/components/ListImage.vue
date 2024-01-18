<template>
  <div>
    <h2>Liste des images téléchargées :</h2>
    <div class="thumbnails-container">
      <router-link
        v-for="image in images"
        :key="image._id"
        :to="{
          name: 'display-image',
          params: { id: image._id, name: image.name },
        }"
      >
        <div class="thumbnail">
          <img :src="image.thumbnailUrl" alt="Thumbnail" class="thumbnail" />
          <p class="image-name">{{ image.name }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const images = ref([]);

    const fetchImages = () => {
      // Récupère la liste des images
      axios
        .get('http://localhost:3000/images')
        .then((response) => {
          images.value = response.data.map((image) => ({
            ...image,
            thumbnailUrl: `${image.url}?thumbnail=true`,
          }));
        })
        .catch((error) => {
          console.error('Error fetching images:', error);
        });
    };

    onMounted(() => {
      fetchImages();
    });

    return {
      images,
      fetchImages,
    };
  },
};
</script>

<style scoped>
.thumbnails-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.thumbnail {
  width: 250px;
  margin: 20px;
  height: auto;
  transition: transform 0.2s;
}

.thumbnail:hover {
  transform: scale(1.1);
}

.image-name {
  background-color: #2b2d31;
  margin-left: 20px;
  margin-top: -10px;
  width: 250px;
  color: white;
}
</style>
