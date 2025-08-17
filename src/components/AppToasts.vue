<template>
  <div id="toastContainer">
    <div
      v-for="t in toasts"
      :key="t.id"
      :class="['toast', 'toast-' + t.type, { show: true }]"
    >
      <i
        :class="[
          'fas',
          t.type === 'success'
            ? 'fa-check-circle'
            : t.type === 'error'
            ? 'fa-exclamation-circle'
            : 'fa-info-circle',
        ]"
      ></i>
      <span style="margin-left: 8px">{{ t.message }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useExpenseStore } from "../store/index.js";

export default {
  setup() {
    const expenseStore = useExpenseStore();
    const toasts = computed(() => expenseStore.toasts);
    return { toasts };
  },
};
</script>
<style lang="scss" scoped>
#toastContainer {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .toast {
    background: #333;
    color: #fff;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: fadeIn 0.3s ease-out;

    &-success {
      background: #4caf50;
    }

    &-error {
      background: #f44336;
    }

    &-info {
      background: #2196f3;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
