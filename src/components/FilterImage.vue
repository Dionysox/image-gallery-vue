<template>
  <div v-if="this.showFilter">
    <h2>Edition: Filtres</h2>
    <button @click="closeEdit">Retour</button>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <img
            ref="img"
            :src="imageSrc"
            class="img img-responsive"
            crossOrigin="Anonymous"
            :style="{ filter: filters().filter }"
          />
        </div>
        <div class="col-md-6 input-filters">
          <div class="row">
            <div class="col-md-12">
              <strong>Grayscale ({{ grayscale }})</strong>
              <input
                type="range"
                v-model="grayscale"
                max="1"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <strong>Sepia ({{ sepia }})</strong>
              <input type="range" v-model="sepia" max="1" min="0" step="0.01" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <strong>Saturate ({{ saturate }})</strong>
              <input
                type="range"
                v-model="saturate"
                max="1"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <strong>Hue Rotate ({{ hueRotate }} deg)</strong>
              <input
                type="range"
                v-model="hueRotate"
                max="360"
                min="0"
                step="1"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <strong>Invert ({{ invert }})</strong>
              <input
                type="range"
                v-model="invert"
                max="1"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <strong>Brightness ({{ brightness }})</strong>
              <input
                type="range"
                v-model="brightness"
                max="3"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <strong>Contrast ({{ contrast }})</strong>
              <input
                type="range"
                v-model="contrast"
                max="1"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <strong>Blur ({{ blur }}px)</strong>
              <input type="range" v-model="blur" max="50" min="0" step="0.1" />
            </div>
          </div>
        </div>
        <div class="col-sm-6 style">
          img: {<br />
          &nbsp;&nbsp;filter: {{ filters().filter }}; <br />
          }
        </div>
      </div>
    </div>
    <button class="buttonSave" @click="FilterImage(imageId, imageName)">
      Enregistrer
    </button>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

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
    showFilter: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const grayscale = ref(0);
    const sepia = ref(0);
    const saturate = ref(1);
    const hueRotate = ref(0);
    const invert = ref(0);
    const brightness = ref(1);
    const contrast = ref(1);
    const blur = ref(0);
    const suffix = {
      hueRotate: 'deg',
      blur: 'px',
    };

    const imageSrc = ref('');
    const instance = getCurrentInstance();

    const toDash = (str) =>
      str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    const filters = () => {
      const data = {
        grayscale: grayscale.value,
        sepia: sepia.value,
        saturate: saturate.value,
        hueRotate: hueRotate.value,
        invert: invert.value,
        brightness: brightness.value,
        contrast: contrast.value,
        blur: blur.value,
      };
      return {
        // On créer le style de l'image basé sur les filtres séléctionnés
        filter: Object.entries(data)
          .filter((item) => typeof item[1] !== 'object')
          .map(
            (item) => `${toDash(item[0])}(${item[1]}${suffix[item[0]] || ''})`,
          )
          .join(' '),
      };
    };

    const FilterImage = async (imageId, imageName) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Appliquez les filtres CSS à l'image
      const image = new Image();
      image.src = imageSrc.value;
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.filter = filters().filter; // Applique les filtres CSS
        ctx.drawImage(image, 0, 0);

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

    const route = useRoute();

    const closeEdit = () => {
      instance.emit('close');
    };

    onMounted(() => {
      imageSrc.value = `http://localhost:3000/images/${route.params.id}`;
    });

    return {
      grayscale,
      sepia,
      saturate,
      hueRotate,
      invert,
      brightness,
      contrast,
      blur,
      suffix,
      filters,
      FilterImage,
      closeEdit,
    };
  },
};
</script>

<style scoped>
.style {
  border: 1px solid gray;
  color: white;
  font-family: calibri;
  margin-top: 20px;
}

.buttonSave {
  margin-top: 20px;
}

.container {
  background-color: black;
}
</style>
