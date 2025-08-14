<template>
  <div class="filters">
    <div class="filter-row">
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input
          v-model="searchInput"
          @input="updateFilter('searchInput', searchInput)"
          class="search-input"
          placeholder="Search expenses..."
        />
      </div>

      <div class="filter-group">
        <label>Category</label>
        <select
          v-model="categoryFilter"
          @change="updateFilter('categoryFilter', categoryFilter)"
          class="form-input"
        >
          <option value="">All Categories</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="entertainment">Entertainment</option>
          <option value="shopping">Shopping</option>
          <option value="bills">Bills</option>
          <option value="others">Others</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Payment Method</label>
        <select
          v-model="paymentFilter"
          @change="updateFilter('paymentFilter', paymentFilter)"
          class="form-input"
        >
          <option value="">All Methods</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
      </div>
    </div>

    <div class="filter-row">
      <div class="filter-group">
        <label>From Date</label>
        <input
          type="date"
          v-model="fromDate"
          @change="updateFilter('fromDate', fromDate)"
          class="form-input"
        />
      </div>

      <div class="filter-group">
        <label>To Date</label>
        <input
          type="date"
          v-model="toDate"
          @change="updateFilter('toDate', toDate)"
          class="form-input"
        />
      </div>

      <div class="filter-group">
        <label>&nbsp;</label>
        <button class="btn btn-secondary" @click="clearAll">
          <i class="fas fa-times"></i> Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const filters = computed(() => store.state.filters);
    function updateFilter(key, value) {
      store.dispatch("setFilter", { key, value });
    }
    function clearAll() {
      store.dispatch("clearFilters");
    }

    return {
      searchInput: computed({
        get: () => filters.value.searchInput,
        set: (v) => updateFilter("searchInput", v),
      }),
      categoryFilter: computed({
        get: () => filters.value.categoryFilter,
        set: (v) => updateFilter("categoryFilter", v),
      }),
      paymentFilter: computed({
        get: () => filters.value.paymentFilter,
        set: (v) => updateFilter("paymentFilter", v),
      }),
      fromDate: computed({
        get: () => filters.value.fromDate,
        set: (v) => updateFilter("fromDate", v),
      }),
      toDate: computed({
        get: () => filters.value.toDate,
        set: (v) => updateFilter("toDate", v),
      }),
      updateFilter,
      clearAll,
    };
  },
};
</script>
<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

/* Create rows */
.filter-row {
  display: flex;
  gap: var(--spacing-md);
  flex: 1 1 100%;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 150px;
  flex: 1;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: var(--spacing-md);
  padding-left: 40px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}
</style>
