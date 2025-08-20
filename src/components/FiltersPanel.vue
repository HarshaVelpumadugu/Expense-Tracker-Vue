<template>
  <v-card class="pa-4">
    <v-row dense>
      <!-- Search -->
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchInput"
          label="Search expenses..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>

      <!-- Category -->
      <v-col cols="12" md="4">
        <v-select
          v-model="categoryFilter"
          :items="categories"
          label="Category"
          clearable
        />
      </v-col>

      <!-- Payment Method -->
      <v-col cols="12" md="4">
        <v-select
          v-model="paymentFilter"
          :items="paymentMethods"
          label="Payment Method"
          clearable
        />
      </v-col>
    </v-row>

    <!-- From Date, To Date, Clear Filters -->
    <v-row dense>
      <!-- From Date -->
      <v-col cols="12" md="4">
        <v-menu
          v-model="fromMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="fromDateFormatted"
              label="From Date"
              readonly
              v-bind="props"
              prepend-inner-icon="mdi-calendar"
            />
          </template>

          <v-date-picker
            v-model="fromDate"
            @update:model-value="fromMenu = false"
            show-adjacent-months
          />
        </v-menu>
      </v-col>

      <!-- To Date -->
      <v-col cols="12" md="4">
        <v-menu
          v-model="toMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="toDateFormatted"
              label="To Date"
              readonly
              v-bind="props"
              prepend-inner-icon="mdi-calendar"
            />
          </template>

          <v-date-picker
            v-model="toDate"
            @update:model-value="toMenu = false"
            show-adjacent-months
          />
        </v-menu>
      </v-col>

      <!-- Clear Button -->
      <v-col cols="12" md="4" class="d-flex align-start">
        <v-btn class="w-100" color="secondary" @click="clearAll">
          <v-icon start>mdi-close</v-icon>
          Clear Filters
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { computed, ref } from "vue";
import { useExpenseStore } from "../store/index.js";

export default {
  setup() {
    const store = useExpenseStore();

    // Menu states for date pickers
    const fromMenu = ref(false);
    const toMenu = ref(false);

    // Bind filters to Pinia store
    const searchInput = computed({
      get: () => store.filters.searchInput,
      set: (v) => store.setFilter({ key: "searchInput", value: v }),
    });

    const categoryFilter = computed({
      get: () => store.filters.categoryFilter,
      set: (v) => store.setFilter({ key: "categoryFilter", value: v }),
    });

    const paymentFilter = computed({
      get: () => store.filters.paymentFilter,
      set: (v) => store.setFilter({ key: "paymentFilter", value: v }),
    });

    const fromDate = computed({
      get: () => store.filters.fromDate,
      set: (v) => store.setFilter({ key: "fromDate", value: v }),
    });

    const toDate = computed({
      get: () => store.filters.toDate,
      set: (v) => store.setFilter({ key: "toDate", value: v }),
    });

    // Formatted date displays
    const fromDateFormatted = computed(() => {
      return fromDate.value ? formatDate(fromDate.value) : "";
    });

    const toDateFormatted = computed(() => {
      return toDate.value ? formatDate(toDate.value) : "";
    });

    // Helper function to format dates
    function formatDate(date) {
      if (!date) return "";

      // Handle different date formats
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";

      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    function clearAll() {
      store.clearFilters();
    }

    // Dropdown options - match your actual data format
    const categories = [
      "Food",
      "Transport",
      "Entertainment",
      "Shopping",
      "Bills",
      "Others",
    ];
    const paymentMethods = ["Cash", "Card"];

    return {
      searchInput,
      categoryFilter,
      paymentFilter,
      fromDate,
      toDate,
      fromDateFormatted,
      toDateFormatted,
      fromMenu,
      toMenu,
      clearAll,
      categories,
      paymentMethods,
    };
  },
};
</script>
