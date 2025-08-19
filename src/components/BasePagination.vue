<template>
  <div class="d-flex justify-center mt-4" v-if="totalPages > 1">
    <!-- Previous Button -->
    <v-btn
      icon
      variant="text"
      :disabled="currentPage === 1"
      @click="$emit('change-page', currentPage - 1)"
    >
    </v-btn>

    <!-- Vuetify Pagination -->
    <v-pagination
      v-model="internalPage"
      :length="totalPages"
      total-visible="5"
      @update:model-value="$emit('change-page', $event)"
      rounded="circle"
      color="primary"
    />

    <!-- Next Button -->
    <v-btn
      icon
      variant="text"
      :disabled="currentPage === totalPages"
      @click="$emit('change-page', currentPage + 1)"
    >
    </v-btn>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    totalPages: { type: Number, required: true },
    currentPage: { type: Number, required: true },
  },
  emits: ["change-page"],
  setup(props) {
    const internalPage = ref(props.currentPage);

    // keep in sync with parent
    watch(
      () => props.currentPage,
      (val) => {
        internalPage.value = val;
      }
    );

    return { internalPage };
  },
};
</script>

<style scoped>
/* optional tweaks */
.v-pagination {
  margin: 0 0.5rem;
}
</style>
