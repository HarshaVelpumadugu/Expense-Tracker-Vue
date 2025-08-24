<template>
  <v-card class="pa-4">
    <v-row dense>
      <!-- Search -->
      <v-col cols="12" sm="4" md="4">
        <v-text-field
          v-model="searchInput"
          variant="outlined"
          label="Search expenses..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>

      <!-- Category -->
      <v-col cols="12" sm="4" md="4">
        <v-select
          v-model="categoryFilter"
          :items="categories"
          label="Category"
          variant="outlined"
          clearable
        />
      </v-col>

      <!-- Payment Method -->
      <v-col cols="12" sm="4" md="4">
        <v-select
          v-model="paymentFilter"
          :items="paymentMethods"
          label="Payment Method"
          variant="outlined"
          clearable
        />
      </v-col>
    </v-row>

    <!-- Date Range and Clear Filters Row -->
    <v-row dense>
      <!-- From Date -->
      <v-col cols="12" sm="4" md="4">
        <v-menu
          v-model="fromMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="fromDateFormatted"
              variant="outlined"
              label="From Date"
              readonly
              v-bind="props"
              prepend-inner-icon="mdi-calendar"
            />
          </template>

          <v-date-picker
            :model-value="fromDateTemp"
            @update:model-value="onFromDateSelected"
            show-adjacent-months
          >
            <template #actions>
              <v-btn text @click="clearFromDate">Clear</v-btn>
              <v-spacer></v-spacer>
              <v-btn text @click="fromMenu = false">OK</v-btn>
            </template>
          </v-date-picker>
        </v-menu>
      </v-col>

      <!-- To Date -->
      <v-col cols="12" sm="4" md="4">
        <v-menu
          v-model="toMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              :model-value="toDateFormatted"
              label="To Date"
              variant="outlined"
              readonly
              v-bind="props"
              prepend-inner-icon="mdi-calendar"
            />
          </template>

          <v-date-picker
            :model-value="toDateTemp"
            @update:model-value="onToDateSelected"
            show-adjacent-months
          >
            <template #actions>
              <v-btn text @click="clearToDate">Clear</v-btn>
              <v-spacer></v-spacer>
              <v-btn text @click="toMenu = false">OK</v-btn>
            </template>
          </v-date-picker>
        </v-menu>
      </v-col>

      <!-- Clear Filters Button -->
      <v-col cols="12" sm="4" md="4">
        <v-btn
          variant="outlined"
          color="error"
          height="56"
          min-width="180"
          class="mx-auto d-block"
          @click="clearAll"
        >
          <v-icon start>mdi-filter-remove</v-icon>
          Clear All Filters
        </v-btn>
      </v-col>
    </v-row>

    <!-- Active Filters Summary -->
    <v-row v-if="hasActiveFilters" dense class="mt-2">
      <v-col cols="12">
        <v-chip-group>
          <v-chip
            v-if="searchInput"
            closable
            color="primary"
            variant="outlined"
            @click:close="searchInput = ''"
          >
            Search: {{ searchInput }}
          </v-chip>
          <v-chip
            v-if="categoryFilter"
            closable
            color="primary"
            variant="outlined"
            @click:close="categoryFilter = null"
          >
            Category: {{ categoryFilter }}
          </v-chip>
          <v-chip
            v-if="paymentFilter"
            closable
            color="primary"
            variant="outlined"
            @click:close="paymentFilter = null"
          >
            Payment: {{ paymentFilter }}
          </v-chip>
          <v-chip
            v-if="fromDate"
            closable
            color="primary"
            variant="outlined"
            @click:close="clearFromDate"
          >
            From: {{ fromDateFormatted }}
          </v-chip>
          <v-chip
            v-if="toDate"
            closable
            color="primary"
            variant="outlined"
            @click:close="clearToDate"
          >
            To: {{ toDateFormatted }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useExpenseStore } from "../store/index.js";

export default {
  setup() {
    const store = useExpenseStore();

    // Menus
    const fromMenu = ref(false);
    const toMenu = ref(false);

    // Temporary Date objects for pickers
    const fromDateTemp = ref(null);
    const toDateTemp = ref(null);

    // Filters from store
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

    // Formatters
    const formatDate = (val) => {
      if (!val) return "";

      // If val is already a string in YYYY-MM-DD format, return as is
      if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        return val;
      }

      const d = new Date(val);
      if (isNaN(d.getTime())) return "";

      // Use local date methods instead of toISOString
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const fromDateFormatted = computed(() =>
      fromDate.value ? formatDate(fromDate.value) : ""
    );
    const toDateFormatted = computed(() =>
      toDate.value ? formatDate(toDate.value) : ""
    );

    // Keep temp Date in sync with store values
    watch(
      () => fromDate.value,
      (val) => {
        fromDateTemp.value = val ? new Date(val) : null;
      },
      { immediate: true }
    );

    watch(
      () => toDate.value,
      (val) => {
        toDateTemp.value = val ? new Date(val) : null;
      },
      { immediate: true }
    );

    // Handlers
    const onFromDateSelected = (date) => {
      if (!date) {
        fromDate.value = null;
        return;
      }

      // Use local date methods to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const iso = `${year}-${month}-${day}`;

      fromDate.value = iso;
      fromDateTemp.value = date;

      // if To Date < From Date → reset To Date
      if (toDate.value && toDate.value < iso) {
        toDate.value = null;
        toDateTemp.value = null;
      }
    };

    const onToDateSelected = (date) => {
      if (!date) {
        toDate.value = null;
        return;
      }

      // Use local date methods to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const iso = `${year}-${month}-${day}`;

      if (fromDate.value && iso < fromDate.value) {
        alert("⚠️ To Date cannot be before From Date");
        return;
      }
      toDate.value = iso;
      toDateTemp.value = date;
    };

    const clearFromDate = () => {
      fromDate.value = null;
      fromDateTemp.value = null;
      fromMenu.value = false;
    };

    const clearToDate = () => {
      toDate.value = null;
      toDateTemp.value = null;
      toMenu.value = false;
    };

    const clearAll = () => {
      store.clearFilters();
      fromDateTemp.value = null;
      toDateTemp.value = null;
      fromMenu.value = false;
      toMenu.value = false;
    };

    const categories = [
      "Food",
      "Transport",
      "Entertainment",
      "Shopping",
      "Bills",
      "Others",
    ];
    const paymentMethods = ["Cash", "Card"];

    const hasActiveFilters = computed(() => {
      return (
        searchInput.value ||
        categoryFilter.value ||
        paymentFilter.value ||
        fromDate.value ||
        toDate.value
      );
    });

    return {
      // store filters
      searchInput,
      categoryFilter,
      paymentFilter,
      fromDate,
      toDate,
      // formatted
      fromDateFormatted,
      toDateFormatted,
      // picker menus
      fromMenu,
      toMenu,
      // temp pickers
      fromDateTemp,
      toDateTemp,
      // actions
      onFromDateSelected,
      onToDateSelected,
      clearFromDate,
      clearToDate,
      clearAll,
      hasActiveFilters,
      // dropdown data
      categories,
      paymentMethods,
    };
  },
};
</script>

<style>
/* same as your original */
:deep(.v-select:first-of-type .v-overlay__content) {
  top: auto !important;
  transform: translateY(8px) !important;
}
:deep(.v-col:nth-child(2) .v-select .v-overlay__content) {
  top: auto !important;
  bottom: auto !important;
  transform: translateY(8px) !important;
}
:deep(.v-select .v-menu .v-overlay__content) {
  position: absolute !important;
  top: 100% !important;
  transform: translateY(4px) !important;
}
.v-overlay-container .v-list-item:hover {
  background-color: #1976d2 !important;
  color: #fff !important;
  border-radius: 6px;
}
.v-overlay-container .v-list-item.v-list-item--active {
  background-color: #1565c0 !important;
  color: #fff !important;
  border-radius: 6px;
}
</style>
