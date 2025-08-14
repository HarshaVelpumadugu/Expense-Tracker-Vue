<template>
  <div class="expense-overlay" id="expenseOverlay">
    <div class="expense-card" id="expenseCard">
      <button class="close-btn" @click="$emit('close')" aria-label="Close">
        &times;
      </button>
      <h2 class="mb-3">
        <i class="fas fa-plus-circle"></i>
        {{ editing ? "Edit Expense" : "Add Expense" }}
      </h2>

      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label class="form-label">Amount *</label>
          <input
            type="number"
            v-model.number="form.amount"
            class="form-input"
            step="0.01"
            min="0.01"
            max="999999"
          />
          <div v-if="errors.amount" class="error-message show">
            {{ errors.amount }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Category *</label>
          <select v-model="form.category" class="form-input">
            <option value="">Select Category</option>
            <option value="food">🍕 Food</option>
            <option value="transport">🚗 Transport</option>
            <option value="entertainment">🎬 Entertainment</option>
            <option value="shopping">🛍️ Shopping</option>
            <option value="bills">💡 Bills</option>
            <option value="others">📋 Others</option>
          </select>
          <div v-if="errors.category" class="error-message show">
            {{ errors.category }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Date *</label>
          <input type="date" v-model="form.date" class="form-input" />
          <div v-if="errors.date" class="error-message show">
            {{ errors.date }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description *</label>
          <input
            type="text"
            v-model="form.description"
            class="form-input"
            maxlength="100"
          />
          <div v-if="errors.description" class="error-message show">
            {{ errors.description }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Payment Method *</label>
          <div class="radio-group">
            <label class="radio-option"
              ><input type="radio" value="cash" v-model="form.paymentMethod" />
              <span><i class="fas fa-money-bill-wave"></i> Cash</span></label
            >
            <label class="radio-option"
              ><input type="radio" value="card" v-model="form.paymentMethod" />
              <span><i class="fas fa-credit-card"></i> Card</span></label
            >
          </div>
          <div v-if="errors.paymentMethod" class="error-message show">
            {{ errors.paymentMethod }}
          </div>
        </div>

        <button class="btn btn-primary w-full" type="submit">
          <i class="fas fa-plus"></i>
          <span>{{ editing ? "Save changes" : "Add Expense" }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, watch, onMounted } from "vue";
import { useExpenseStore } from "../store/index.js";

export default {
  props: { editing: { type: Object, default: null } },
  setup(props, { emit }) {
    const expenseStore = useExpenseStore();

    const form = reactive({
      id: null,
      amount: null,
      category: "",
      date: "",
      description: "",
      paymentMethod: "",
    });
    const errors = reactive({});

    function setDefaultDate() {
      const today = new Date().toISOString().split("T")[0];
      form.date = today;
    }
    onMounted(() => {
      setDefaultDate();
    });

    // Prefill form when editing
    watch(
      () => props.editing,
      (val) => {
        if (val) {
          form.id = val.id;
          form.amount = Number(val.amount);
          form.category = val.category;
          form.date = val.date;
          form.description = val.description;
          form.paymentMethod = val.paymentMethod;
        } else {
          form.id = null;
          form.amount = null;
          form.category = "";
          setDefaultDate();
          form.description = "";
          form.paymentMethod = "";
        }
      },
      { immediate: true }
    );

    function validate() {
      Object.keys(errors).forEach((k) => delete errors[k]);
      if (!form.amount || form.amount <= 0)
        errors.amount = "Please enter a valid amount";
      else if (form.amount > 999999)
        errors.amount = "Amount cannot exceed ₹999,999";

      if (!form.category) errors.category = "Please select a category";
      if (!form.date) errors.date = "Please select a date";
      else {
        const selected = new Date(form.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selected > today) errors.date = "Date cannot be in the future";
      }
      if (!form.description || form.description.trim().length < 3)
        errors.description = "Description must be at least 3 characters";
      if (!form.paymentMethod)
        errors.paymentMethod = "Please select a payment method";

      return Object.keys(errors).length === 0;
    }

    function onSubmit() {
      if (!validate()) return;
      const payload = {
        id: form.id || Date.now(),
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        description: form.description.trim(),
        paymentMethod: form.paymentMethod,
        timestamp: new Date().toISOString(),
      };
      if (props.editing) {
        expenseStore.finishEditExpense(payload);
      } else {
        expenseStore.addExpense(payload);
      }
      emit("close");
    }

    return { form, errors, onSubmit };
  },
};
</script>

<style scoped>
.expense-overlay {
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
.expense-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  width: 400px;
  max-width: 90%;
  position: relative;
}
.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.radio-group {
  display: flex;
  gap: 1rem;
}
.radio-option {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.error-message {
  color: #f44336;
  font-size: 0.8rem;
}
</style>
