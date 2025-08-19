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

    <!-- ✅ From Date, To Date, Clear Filters -->
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
              v-model="fromDate"
              label="From Date"
              readonly
              v-bind="props"
            >
              <template #append-inner>
                <v-icon>mdi-calendar</v-icon>
              </template>
            </v-text-field>
          </template>

          <v-date-picker
            v-model="fromDate"
            @update:model-value="fromMenu = false"
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
              v-model="toDate"
              label="To Date"
              readonly
              v-bind="props"
            >
              <template #append-inner>
                <v-icon>mdi-calendar</v-icon>
              </template>
            </v-text-field>
          </template>

          <v-date-picker
            v-model="toDate"
            @update:model-value="toMenu = false"
          />
        </v-menu>
      </v-col>

      <!-- Clear Button -->
      <v-col cols="12" md="4">
        <v-btn class="w-100" color="secondary" @click="clearAll">
          <v-icon start>mdi-close</v-icon>
          Clear Filters
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { computed } from "vue";
import { useExpenseStore } from "../store/index.js";

export default {
  setup() {
    const store = useExpenseStore();

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

    function clearAll() {
      store.clearFilters();
    }

    // Dropdown options
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
      clearAll,
      categories,
      paymentMethods,
    };
  },
};
</script>
