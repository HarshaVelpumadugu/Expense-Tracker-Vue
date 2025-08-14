<template>
  <div class="pagination" v-if="totalPages > 1">
    <button
      :disabled="currentPage === 1"
      @click="$emit('change-page', currentPage - 1)"
    >
      <i class="fas fa-chevron-left"></i>
    </button>
    <template v-for="i in pagesToShow" :key="i.key">
      <button
        v-if="i.type === 'page'"
        :class="{ active: i.page === currentPage }"
        @click="$emit('change-page', i.page)"
      >
        {{ i.page }}
      </button>
      <span v-else class="pagination-dots">...</span>
    </template>
    <button
      :disabled="currentPage === totalPages"
      @click="$emit('change-page', currentPage + 1)"
    >
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</template>

<script>
import { computed } from "vue";
export default {
  props: {
    totalPages: { type: Number, required: true },
    currentPage: { type: Number, required: true },
  },
  setup(props) {
    const pagesToShow = computed(() => {
      const arr = [];
      for (let i = 1; i <= props.totalPages; i++) {
        if (
          i === 1 ||
          i === props.totalPages ||
          (i >= props.currentPage - 1 && i <= props.currentPage + 1)
        ) {
          arr.push({ type: "page", page: i, key: `p${i}` });
        } else if (i === props.currentPage - 2 || i === props.currentPage + 2) {
          arr.push({ type: "dots", key: `d${i}` });
        }
      }
      return arr;
    });
    return { pagesToShow };
  },
};
</script>
<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.3rem;
}
.pagination button {
  padding: 0.3rem 0.6rem;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}
.pagination button.active {
  background: #4caf50;
  color: #fff;
}
.pagination-dots {
  padding: 0.3rem 0.6rem;
}
</style>
