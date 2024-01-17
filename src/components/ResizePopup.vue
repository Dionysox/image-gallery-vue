<template>
  <div class="resize-modal" v-if="this.showResizePopup">
    <h2>Nouvelles dimensions:</h2>
    <input v-model="height" placeholder="Hauteur (px)" />
    <input v-model="width" placeholder="Largeur (px)" />
    <button @click="sendSize">Appliquer</button>
    <button @click="closePopup" class="annuler">Annuler</button>
  </div>
</template>

<script>
export default {
  props: {
    showResizePopup: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      height: '',
      width: '',
    };
  },
  methods: {
    sendSize() {
      const height = this.height;
      const width = this.width;
      this.$emit('image-resized', { height, width });
      this.closePopup();
    },
    closePopup() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.resize-modal {
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

.resize-modal h2 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: black;
}

.resize-modal input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
}

.resize-modal button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.annuler {
  margin-left: 20px;
}

.resize-modal button:hover {
  background-color: #0056b3;
}
</style>
