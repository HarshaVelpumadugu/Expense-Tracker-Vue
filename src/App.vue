<template>
  <div>
    <AppHeader @open-add="onOpenAdd" />
    <div :class="['container', { blur: showExpenseModal || showBudgetModal }]">
      <StatsGrid />
      <BarChart class="bar-chart" />
      <div class="grid grid-2">
        <div class="card mb-3 expenses-tab-container">
          <!-- Show filters only for Expenses -->
          <div v-if="activeTab === 'expenses'" class="mb-3">
            <FiltersPanel class="filters-panel" />
          </div>

          <!-- Tabs -->
          <div class="flex gap-3 items-center mb-3 tab-header" role="tablist">
            <button
              role="tab"
              :aria-selected="activeTab === 'expenses'"
              class="tab-btn"
              :class="{ active: activeTab === 'expenses' }"
              @click="activeTab = 'expenses'"
            >
              Expenses
            </button>

            <button
              role="tab"
              :aria-selected="activeTab === 'budget'"
              class="tab-btn"
              :class="{ active: activeTab === 'budget' }"
              @click="activeTab = 'budget'"
            >
              Budget Tracker
            </button>
          </div>

          <!-- Tab Panels -->
          <div
            v-show="activeTab === 'expenses'"
            role="tabpanel"
            class="expense-table"
          >
            <ExpenseTable @edit="openEdit" />
          </div>

          <div
            v-show="activeTab === 'budget'"
            role="tabpanel"
            class="budget-tracker"
          >
            <BudgetTracker @open-budget="showBudgetModal = true" />
          </div>
        </div>

        <CategoryChart class="category-chart" />
      </div>
    </div>

    <!-- Modals -->
    <ExpenseModal
      v-if="showExpenseModal"
      :editing="editingExpense"
      @close="closeExpenseModal"
    />
    <BudgetModal v-model="showBudgetModal" />
    <AppToasts />
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useExpenseStore } from "./store/index.js";
import AppHeader from "./components/AppHeader.vue";
import StatsGrid from "./components/StatsGrid.vue";
import FiltersPanel from "./components/FiltersPanel.vue";
import ExpenseTable from "./components/ExpenseTable.vue";
import CategoryChart from "./components/CategoryChart.vue";
import BudgetTracker from "./components/BudgetTracker.vue";
import ExpenseModal from "./components/ExpenseModal.vue";
import BudgetModal from "./components/BudgetModal.vue";
import AppToasts from "./components/AppToasts.vue";
import BarChart from "./components/BarChart.vue";

export default {
  components: {
    AppHeader,
    StatsGrid,
    FiltersPanel,
    ExpenseTable,
    CategoryChart,
    BudgetTracker,
    ExpenseModal,
    BudgetModal,
    AppToasts,
    BarChart,
  },
  setup() {
    const store = useExpenseStore();
    const activeTab = ref("expenses");
    const showExpenseModal = ref(false);
    const showBudgetModal = ref(false);

    const editingExpense = computed(() => store.editingExpense);

    watch(editingExpense, (val) => {
      if (val) showExpenseModal.value = true;
    });

    function onOpenAdd() {
      store.editingExpense = null;
      showExpenseModal.value = true;
    }

    function openEdit(expense) {
      store.startEditExpense(expense);
    }

    function closeExpenseModal() {
      showExpenseModal.value = false;
      store.clearEditing();
    }

    return {
      activeTab,
      showExpenseModal,
      showBudgetModal,
      onOpenAdd,
      editingExpense,
      openEdit,
      closeExpenseModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 1400px;
  padding: 0 24px;
  margin: 100px auto 0;
}

.tab-header {
  margin-top: 10px;
}

.tab-btn {
  background-color: white;
  border: 1px solid #ccc;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    background-color: #f5f5f5;
  }

  &.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
}
</style>
