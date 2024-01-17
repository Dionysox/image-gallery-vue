<template>
  <div v-if="this.showRecadrage" class="recadrage">
    <h2>Edition : Recadrer</h2>
    <button @click="closeEdit">Retour</button>
    <cropper class="cropper" :src="imageSrc" @change="change" />
    <button @click="cropImage">Enregistrer</button>
  </div>
</template>

<script>
import axios from 'axios';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

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
    showRecadrage: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      image: null,
    };
  },
  methods: {
    change({ coordinates, canvas }) {
      console.log(coordinates, canvas);
      this.coordinates = coordinates;
      this.image = canvas.toDataURL();
    },

    getCroppedFile() {
      return new Promise((resolve, reject) => {
        if (!this.image) {
          reject(new Error("Pas d'image recadré disponible."));
          return;
        }

        // Convert the base64 image to a Blob
        const base64Image = this.image.split(',')[1];
        const byteCharacters = atob(base64Image);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        resolve(blob);
      });
    },

    cropImage() {
      this.getCroppedFile()
        .then((blob) => {
          const formData = new FormData();
          formData.append('file', blob);
          formData.append('name', this.imageName);
          axios
            .put(`http://localhost:3000/images/${this.imageId}`, formData)
            .then(() => {
              this.$emit('image-cropped', this.image);
              this.closeEdit();
            })
            .catch((error) => {
              console.error('Erreur lors du renommage:', error);
            });
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération de l'image recadrée:",
            error,
          );
        });
    },

    closeEdit() {
      this.$emit('close');
    },
  },
  components: {
    Cropper,
  },
};
</script>

<style scoped>
.recadrage {
  height: 100%;
  width: 100%;
  margin-top: 20px;
}

.button-spacing {
  margin-bottom: 20px;
  margin-right: 20px;
}

.cropper {
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
