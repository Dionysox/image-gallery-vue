<template>
  <div v-if="this.showResize" class="redimentionnement">
    <h2>Edition: Redimentionner</h2>
    <button class="button-resize" @click="this.showResizePopup = true">
      Séléctionner dimensions
    </button>
    <button @click="closeEdit">Retour</button><br />
    <img
      :src="imageSrc"
      alt="Image"
      class="sizedImage"
      crossOrigin="Anonymous"
      :style="{ height: height + 'px', width: width + 'px' }"
    />
    <div>
      dimensions: <br />
      hauteur: {{ height }}, largeur: {{ width }}
    </div>
    <br />
    <button @click="resizeImage(imageId, imageName, width, height)">
      Enregistrer</button
    ><br />

    <resize-popup
      :showResizePopup="showResizePopup"
      v-if="showResizePopup"
      @close="this.showResizePopup = false"
      @image-resized="updatePreview"
    />
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import ResizePopup from './ResizePopup.vue';

export default {
  props: {
    imageId: {
      type: String,
      Required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },
    showResize: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const imageSrc = ref('');
    const showResizePopup = ref(false);
    const instance = getCurrentInstance();
    const height = ref(0);
    const width = ref(0);

    const route = useRoute();

    const updatePreview = (data) => {
      height.value = data.height;
      width.value = data.width;
      console.log(`Hauteur : ${height.value}, Largeur : ${width.value}`);
    };

    const resizeImage = async (imageId, imageName, newWidth, newHeight) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Applique les dimensions à l'image
      const image = new Image();
      image.src = imageSrc.value;
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(image, 0, 0, newWidth, newHeight);

        // Convertis le contenu du canvas en une image de données
        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append('file', blob);
          formData.append('name', imageName);

          await axios
            .put(`http://localhost:3000/images/${imageId}`, formData)
            .then(() => {
              instance.emit('close');
            })
            .catch((error) => {
              console.error("Erreur lors de la mise à jour de l'image:", error);
            });
        });
      };
    };

    const closeEdit = () => {
      instance.emit('close');
    };

    onMounted(() => {
      imageSrc.value = `http://localhost:3000/images/${route.params.id}`;

      // On charge l'image et récupére ses dimensions d'origine
      const img = new Image();
      img.src = imageSrc.value;
      img.onload = () => {
        width.value = img.width;
        height.value = img.height;
      };
    });

    return {
      height,
      width,
      showResizePopup,
      updatePreview,
      resizeImage,
      closeEdit,
    };
  },

  components: {
    ResizePopup,
  },
};
</script>

<style scoped>
.redimentionnement {
  height: 100%;
  width: 100%;
  margin-top: 20px;
}

.button-resize {
  margin-bottom: 20px;
  margin-right: 20px;
}

.sizedImage {
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
