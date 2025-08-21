<template>
  <v-card class="pa-4">
    <v-row dense>
      <!-- Search -->
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchInput"
          variant="outlined"
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
          variant="outlined"
          clearable
        />
      </v-col>

      <!-- Payment Method -->
      <v-col cols="12" md="4">
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
              variant="outlined"
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
              variant="outlined"
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

      <!-- Clear Filters Button - Properly Aligned -->
      <v-col cols="12" md="4">
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

    <!-- Optional: Active Filters Summary -->
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
            @click:close="fromDate = null"
          >
            From: {{ fromDateFormatted }}
          </v-chip>
          <v-chip
            v-if="toDate"
            closable
            color="primary"
            variant="outlined"
            @click:close="toDate = null"
          >
            To: {{ toDateFormatted }}
          </v-chip>
        </v-chip-group>
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

    const fromMenu = ref(false);
    const toMenu = ref(false);

    const categoryMenu = ref(false);

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

    const fromDateFormatted = computed(() => {
      return fromDate.value ? formatDate(fromDate.value) : "";
    });

    const toDateFormatted = computed(() => {
      return toDate.value ? formatDate(toDate.value) : "";
    });

    function formatDate(date) {
      if (!date) return "";

      const d = new Date(date);
      if (isNaN(d.getTime())) return "";

      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    function selectCategory(category) {
      categoryFilter.value = category;
      categoryMenu.value = false;
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
      categoryMenu,
      paymentFilter,
      fromDate,
      toDate,
      fromDateFormatted,
      toDateFormatted,
      fromMenu,
      toMenu,
      clearAll,
      selectCategory,
      categories,
      paymentMethods,
    };
  },
};
</script>

<style>
/* Force category dropdown to open downward specifically */
:deep(.v-select:first-of-type .v-overlay__content) {
  top: auto !important;
  transform: translateY(8px) !important;
}

/* Alternative approach - target by column position */
:deep(.v-col:nth-child(2) .v-select .v-overlay__content) {
  top: auto !important;
  bottom: auto !important;
  transform: translateY(8px) !important;
}

/* Ensure all select menus have proper positioning */
:deep(.v-select .v-menu .v-overlay__content) {
  position: absolute !important;
  top: 100% !important;
  transform: translateY(4px) !important;
}

.v-overlay-container .v-list-item:hover {
  background-color: #1976d2 !important; /* Blue on hover */
  color: #fff !important;
  border-radius: 6px;
}

/* Active/selected item */
.v-overlay-container .v-list-item.v-list-item--active {
  background-color: #1565c0 !important;
  color: #fff !important;
  border-radius: 6px;
}
</style>
