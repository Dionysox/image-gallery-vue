<template>
  <div>
    <h2>Uploader une nouvelle image</h2>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <form @submit.prevent="uploadImage">
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="handleFileChange"
      />
      <input type="text" v-model="imageName" placeholder="Nom de l'image" />
      <button @click="sendUploadImage">Upload</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      imageName: '',
      errorMessage: '',
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async sendUploadImage() {
      // On effectue une vérification supplémentaire sur le type de fichier
      if (
        !this.selectedFile ||
        !['image/jpeg', 'image/jpg', 'image/png'].includes(
          this.selectedFile.type,
        )
      ) {
        this.errorMessage =
          'Type de fichier non valide. Veuillez uploader une image de type .jpeg, .jpg ou .png.';
        console.error('Type de fichier non valide.');
        return;
      }

      if (!this.imageName) {
        // Affiche un message d'erreur si le champ du nom est vide
        this.errorMessage = 'Le champ du nom ne peut pas être vide';
        return;
      }

      this.errorMessage = '';

      const formData = new FormData();
      console.log(this.selectedFile);
      formData.append('file', this.selectedFile);
      formData.append('name', this.imageName);

      try {
        const response = await axios.post(
          'http://localhost:3000/images',
          formData,
        );
        console.log('Image uploaded:', response.data);
        this.$emit('image-uploaded');
        this.$refs.fileInput.value = '';
        this.imageName = '';
      } catch (error) {
        this.errorMessage = "Erreur lors de l'upload.";
        console.error('Error uploading image:', error);
      }
    },
  },
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  background-color: #f0f0f0; /* Couleur de fond */
  padding: 20px;
  border-radius: 10px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  padding-top: 10px;
  color: #ffffff; /* Couleur de texte */
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type='file'] {
  padding: 10px;
  margin-bottom: 20px;
  border: 2px solid #ccc;
  background-color: #fff; /* Couleur de fond du champ de fichier */
  border-radius: 5px;
}

input[type='text'] {
  padding: 10px;
  margin-bottom: 20px;
  border: 2px solid #ccc;
  background-color: #fff; /* Couleur de fond du champ de texte */
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
