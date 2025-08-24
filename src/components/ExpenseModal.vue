<template>
  <v-overlay
    :model-value="true"
    class="d-flex align-center justify-center"
    persistent
  >
    <v-card
      class="expense-card"
      width="400"
      max-width="90%"
      elevation="8"
      rounded="lg"
    >
      <!-- Header with close button -->
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-plus-circle</v-icon>
          <span>{{ editing ? "Edit Expense" : "Add Expense" }}</span>
        </div>
        <v-btn
          icon
          variant="text"
          size="small"
          @click="$emit('close')"
          aria-label="Close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <v-form ref="formRef" @submit.prevent="onSubmit">
          <!-- Amount Field -->
          <v-text-field
            v-model.number="form.amount"
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            max="999999"
            :error-messages="errors.amount"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            required
            prepend-inner-icon="mdi-currency-inr"
          />

          <!-- Category Field -->
          <v-select
            v-model="form.category"
            label="Category"
            :items="categoryOptions"
            item-title="text"
            item-value="value"
            :error-messages="errors.category"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            required
          />

          <!-- Date Field -->
          <v-text-field
            v-model="form.date"
            label="Date"
            :error-messages="errors.date"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            required
            readonly
            @click:append-inner="datePickerOpen = true"
          >
            <template v-slot:append-inner>
              <v-icon @click="datePickerOpen = true" style="cursor: pointer">
                mdi-calendar
              </v-icon>
            </template>
          </v-text-field>

          <!-- Date Picker Dialog -->
          <v-dialog v-model="datePickerOpen" max-width="280px">
            <v-date-picker
              v-model="selectedDate"
              @update:model-value="onDateSelected"
              :max="maxDate"
              color="primary"
              elevation="15"
              show-adjacent-months
            >
              <template v-slot:actions>
                <v-btn variant="text" @click="datePickerOpen = false">
                  Cancel
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="confirmDate">
                  OK
                </v-btn>
              </template>
            </v-date-picker>
          </v-dialog>

          <!-- Description Field -->
          <v-text-field
            v-model="form.description"
            label="Description"
            maxlength="100"
            :error-messages="errors.description"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            required
            prepend-inner-icon="mdi-text"
          />

          <!-- Payment Method Field -->
          <div class="mb-4">
            <v-label class="mb-2">Payment Method *</v-label>
            <v-radio-group
              v-model="form.paymentMethod"
              :error-messages="errors.paymentMethod"
              inline
              density="comfortable"
            >
              <v-radio value="cash" class="mr-4">
                <template v-slot:label>
                  <div class="d-flex align-center">
                    <v-icon class="mr-1" size="small">mdi-cash</v-icon>
                    <span>Cash</span>
                  </div>
                </template>
              </v-radio>
              <v-radio value="card">
                <template v-slot:label>
                  <div class="d-flex align-center">
                    <v-icon class="mr-1" size="small">mdi-credit-card</v-icon>
                    <span>Card</span>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </div>

          <!-- Submit Button -->
          <v-btn
            type="submit"
            color="primary"
            size="large"
            variant="flat"
            block
            class="mt-4"
          >
            <v-icon class="mr-2">{{
              editing ? "mdi-content-save" : "mdi-plus"
            }}</v-icon>
            {{ editing ? "Save Changes" : "Add Expense" }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
import { reactive, watch, onMounted, ref } from "vue";
import { useExpenseStore } from "../store/index.js";

export default {
  props: {
    editing: {
      type: Object,
      default: null,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const expenseStore = useExpenseStore();
    const formRef = ref(null);

    const categoryOptions = [
      { text: "🍕 Food", value: "food" },
      { text: "🚗 Transport", value: "transport" },
      { text: "🎬 Entertainment", value: "entertainment" },
      { text: "🛍️ Shopping", value: "shopping" },
      { text: "💡 Bills", value: "bills" },
      { text: "📋 Others", value: "others" },
    ];

    const form = reactive({
      id: null,
      amount: null,
      category: "",
      date: "",
      description: "",
      paymentMethod: "",
    });

    const errors = reactive({});
    const datePickerOpen = ref(false);
    const selectedDate = ref(null);
    const maxDate = new Date().toISOString().split("T")[0]; // Today's date for max limit

    function setDefaultDate() {
      const today = new Date().toISOString().split("T")[0];
      form.date = today;
      selectedDate.value = new Date();
    }

    // function formatDateForDisplay(dateString) {
    //   if (!dateString) return "";
    //   const date = new Date(dateString);
    //   return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
    // }

    function onDateSelected(date) {
      selectedDate.value = date;
    }

    function confirmDate() {
      if (selectedDate.value) {
        // Convert Date object to YYYY-MM-DD format
        const year = selectedDate.value.getFullYear();
        const month = String(selectedDate.value.getMonth() + 1).padStart(
          2,
          "0"
        );
        const day = String(selectedDate.value.getDate()).padStart(2, "0");
        form.date = `${year}-${month}-${day}`;
      }
      datePickerOpen.value = false;
    }

    onMounted(() => {
      if (!props.editing) {
        setDefaultDate();
      }
    });

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
          // Set selected date for picker
          selectedDate.value = val.date ? new Date(val.date) : new Date();
        } else {
          form.id = null;
          form.amount = null;
          form.category = "food";
          setDefaultDate();
          form.description = "";
          form.paymentMethod = "cash";
        }
        // Clear errors when switching between edit/add modes
        Object.keys(errors).forEach((k) => delete errors[k]);
      },
      { immediate: true }
    );

    function validate() {
      Object.keys(errors).forEach((k) => delete errors[k]);

      if (!form.amount || form.amount <= 0) {
        errors.amount = "Please enter a valid amount";
      } else if (form.amount > 999999) {
        errors.amount = "Amount cannot exceed ₹999,999";
      }

      if (!form.category) {
        errors.category = "Please select a category";
      }

      if (!form.date) {
        errors.date = "Please select a date";
      } else {
        const selected = new Date(form.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selected > today) {
          errors.date = "Date cannot be in the future";
        }
      }

      if (!form.description || form.description.trim().length < 3) {
        errors.description = "Description must be at least 3 characters";
      }

      if (!form.paymentMethod) {
        errors.paymentMethod = "Please select a payment method";
      }

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

    return {
      form,
      errors,
      onSubmit,
      categoryOptions,
      formRef,
      datePickerOpen,
      selectedDate,
      maxDate,
      onDateSelected,
      confirmDate,
    };
  },
};
</script>

<style lang="scss" scoped>
.expense-card {
  :deep(.v-field__input) {
    min-height: 40px;
  }

  :deep(.v-radio-group .v-selection-control) {
    min-height: auto;
  }

  :deep(.v-label) {
    font-size: 0.875rem;
    font-weight: 500;
    opacity: 0.87;
  }
}
</style>
