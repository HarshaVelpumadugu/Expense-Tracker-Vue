<template>
  <div class="modal show" style="display: flex">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">&times;</button>
      <h2 class="mb-3"><i class="fas fa-target"></i> Setup Monthly Budget</h2>
      <form @submit.prevent="onSubmit" id="budgetForm">
        <div class="form-group">
          <label class="form-label">Category</label>
          <select v-model="category" class="form-input" required>
            <option value="food">🍕 Food</option>
            <option value="transport">🚗 Transport</option>
            <option value="entertainment">🎬 Entertainment</option>
            <option value="shopping">🛍️ Shopping</option>
            <option value="bills">💡 Bills</option>
            <option value="others">📋 Others</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Budget Amount</label>
          <input
            type="number"
            v-model.number="amount"
            class="form-input"
            min="1"
            step="0.01"
            required
          />
        </div>
        <button class="btn btn-primary w-full" type="submit">
          <i class="fas fa-save"></i> Save Budget
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useExpenseStore } from "../store/index.js";

export default {
  setup(_, { emit }) {
    const expenseStore = useExpenseStore();
    const category = ref("food");
    const amount = ref(null);

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
      emit("close");
    }
    return { category, amount, onSubmit };
  },
};
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  width: 350px;
  max-width: 90%;
  position: relative;
}
.modal-close {
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
