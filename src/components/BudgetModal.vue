<template>
  <v-overlay
    v-model="isOpen"
    class="d-flex align-center justify-center"
    scrim="rgba(0,0,0,0.4)"
    persistent
  >
    <v-card class="pa-6 rounded-xl" width="420">
      <!-- Header with close button -->
      <div class="d-flex justify-space-between align-center mb-4">
        <h2 class="text-h6 font-weight-medium d-flex align-center">
          <v-icon icon="mdi-target" class="mr-2" />
          Setup Monthly Budget
        </h2>

        <v-btn icon variant="text" class="modal-close" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" id="budgetForm">
        <v-select
          v-model="category"
          :items="categories"
          item-title="label"
          item-value="value"
          label="Category"
          variant="outlined"
          density="comfortable"
          required
        />

        <v-text-field
          v-model.number="amount"
          type="number"
          min="1"
          step="0.01"
          label="Budget Amount"
          variant="outlined"
          density="comfortable"
          class="mt-3"
          required
        />

        <v-btn
          type="submit"
          color="primary"
          class="w-100 mt-4"
          prepend-icon="mdi-content-save"
        >
          Save Budget
        </v-btn>
      </form>
    </v-card>
  </v-overlay>
</template>

<script>
import { ref, computed } from "vue";
import { useExpenseStore } from "../store/index.js";

export default {
  props: {
    modelValue: { type: Boolean, required: true },
  },
  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const expenseStore = useExpenseStore();

    const isOpen = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const category = ref("food");
    const amount = ref(null);

    const categories = [
      { label: "🍕 Food", value: "food" },
      { label: "🚗 Transport", value: "transport" },
      { label: "🎬 Entertainment", value: "entertainment" },
      { label: "🛍️ Shopping", value: "shopping" },
      { label: "💡 Bills", value: "bills" },
      { label: "📋 Others", value: "others" },
    ];

    function onSubmit() {
      if (!category.value || !amount.value || amount.value <= 0) {
        expenseStore.pushToast({
          message: "Please fill all fields correctly",
          type: "error",
        });
        return;
      }
      expenseStore.setBudget({
        category: category.value,
        amount: Number(amount.value),
      });
      isOpen.value = false;
    }

    function closeModal() {
      isOpen.value = false;
    }

    return {
      isOpen,
      category,
      amount,
      categories,
      onSubmit,
      closeModal,
    };
  },
};
</script>
<style lang="scss" scoped>
.modal-close {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  color: #777;
  transition: 0.2s ease;
  z-index: 10;

  &:hover {
    color: #000;
    background: rgba(0, 0, 0, 0.05);
  }
}

.v-btn.w-100 {
  font-weight: 600;
  border-radius: 0.8rem;
  padding: 0.9rem;
  text-transform: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-overlay {
  backdrop-filter: blur(3px);
}
</style>
