<template>
  <div class="rename-modal" v-if="this.showPopup">
    <h2>Renommer Image</h2>
    <input v-model="newName" placeholder="Entrez le nouveau nom" />
    <button @click="renameImage">Renommer</button>
    <button @click="closePopup" class="annuler">Annuler</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    currentName: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
    showPopup: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      newName: '',
    };
  },
  watch: {
    currentName: function () {
      this.newName = this.currentName;
    },
  },
  methods: {
    renameImage() {
      //On met à jour le nom de l'image
      axios
        .put(`http://localhost:3000/images/${this.imageId}`, {
          name: this.newName,
        })
        .then(() => {
          // Met à jour le nom de l'image sur les autres components
          this.$emit('image-renamed', this.newName);
          this.closePopup();
        })
        .catch((error) => {
          console.error('Erreur lors du renommage:', error);
        });
    },
    closePopup() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.rename-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  padding-right: 40px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.rename-modal h2 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: black;
}

.rename-modal input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
}

.rename-modal button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.annuler {
  margin-left: 20px;
}

.rename-modal button:hover {
  background-color: #0056b3;
}
</style>
