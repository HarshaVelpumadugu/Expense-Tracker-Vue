<template>
  <div>
    <div :class="['container', { blur: showExpenseModal || showBudgetModal }]">
      <AppHeader @open-add="onOpenAdd" />
      <StatsGrid />
      <div class="grid grid-2">
        <div>
          <div class="card mb-3 expenses-tab-container">
            <FiltersPanel v-if="activeTab === 'expenses'" />
            <div class="flex gap-3 items-center mb-3 tab-header">
              <button
                :class="[
                  'btn btn-secondary tab-btn',
                  { active: activeTab === 'expenses' },
                ]"
                @click="activeTab = 'expenses'"
              >
                Expenses
              </button>
              <button
                :class="[
                  'btn btn-secondary tab-btn',
                  { active: activeTab === 'budget' },
                ]"
                @click="activeTab = 'budget'"
              >
                Budget Tracker
              </button>
            </div>

            <div v-show="activeTab === 'expenses'">
              <ExpenseTable @edit="openEdit" />
            </div>

            <div v-show="activeTab === 'budget'">
              <BudgetTracker @open-budget="showBudgetModal = true" />
            </div>
          </div>
        </div>

        <CategoryChart />
      </div>
    </div>

    <ExpenseModal
      v-if="showExpenseModal"
      :editing="editingExpense"
      @close="closeExpenseModal"
    />
    <BudgetModal v-if="showBudgetModal" @close="closeBudgetModal" />
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

    function closeBudgetModal() {
      showBudgetModal.value = false;
    }

    return {
      activeTab,
      showExpenseModal,
      showBudgetModal,
      onOpenAdd,
      editingExpense,
      openEdit,
      closeExpenseModal,
      closeBudgetModal,
    };
  },
};
</script>
<style lang="scss" scoped>
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }

  .header {
    h1 {
      font-size: 2rem;
    }
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .grid-2 {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    grid-template-rows: auto auto;
    align-items: start;
  }

  .filters {
    padding: var(--spacing-md);
    gap: var(--spacing-sm);

    .filter-group {
      min-width: 100%;
    }
  }

  .search-container {
    width: 100%;
  }

  .table-container {
    font-size: 0.75rem;

    th,
    td {
      padding: var(--spacing-xs) var(--spacing-sm);
    }
  }

  .card,
  .budget-card,
  .category-card {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
  }

  .modal-content {
    margin: var(--spacing-md);
    padding: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .container {
    padding: var(--spacing-sm);
  }

  .header {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);

    h1 {
      font-size: 1.25rem;
      line-height: 1.3;
      margin-bottom: var(--spacing-xs);
    }

    p {
      font-size: 0.875rem;
      line-height: 1.4;
    }
  }

  .main-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: stretch;
    padding: var(--spacing-xs);
  }

  .add-expense-btn {
    font-size: 0.875rem;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: 25px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .stat-card {
    padding: var(--spacing-md);

    .icon {
      font-size: 1.5rem;
      margin-bottom: var(--spacing-xs);
    }

    .value {
      font-size: 1.5rem;
      line-height: 1.2;
    }

    .label {
      font-size: 0.8rem;
    }
  }

  .grid-2 {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--spacing-md);
  }

  .card,
  .budget-card,
  .category-card {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
  }

  .budget-card {
    height: 500px;

    .budget-header {
      padding: var(--spacing-md);
      flex-direction: column;
      gap: var(--spacing-sm);
      align-items: stretch;
    }

    .budget-content {
      padding: var(--spacing-md);
    }
  }

  .filters {
    padding: var(--spacing-md);
    gap: var(--spacing-sm);

    .filter-group {
      min-width: 100%;
    }
  }

  .search-container {
    width: 100%;
  }

  .form-input {
    padding: var(--spacing-sm);
    font-size: 0.875rem;
  }

  .form-label {
    font-size: 0.875rem;
    margin-bottom: var(--spacing-xs);
  }

  .form-group {
    margin-bottom: var(--spacing-md);
  }

  .btn {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.875rem;
    min-height: 40px;
    gap: var(--spacing-xs);
  }

  .tab-header {
    flex-direction: column;
    gap: var(--spacing-xs);

    .tab-btn {
      width: 100%;
      justify-content: center;
    }
  }

  .table-container {
    font-size: 0.75rem;

    th,
    td {
      padding: var(--spacing-xs) var(--spacing-sm);
    }
  }

  .category-badge {
    font-size: 0.75rem;
    padding: 2px var(--spacing-xs);
  }

  .pagination {
    gap: var(--spacing-xs);

    button {
      padding: var(--spacing-xs) var(--spacing-sm);
      min-width: 36px;
      min-height: 36px;
      font-size: 0.875rem;
    }
  }

  .radio-group {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}

@media (max-width: 320px) {
  .container {
    padding: var(--spacing-sm);
  }

  .header {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);

    h1 {
      font-size: 1.25rem;
      line-height: 1.3;
      margin-bottom: var(--spacing-xs);
    }

    p {
      font-size: 0.875rem;
      line-height: 1.4;
    }
  }

  .main-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: stretch;
    padding: var(--spacing-xs);
  }

  .add-expense-btn {
    font-size: 0.875rem;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: 25px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .stat-card {
    padding: var(--spacing-md);

    .icon {
      font-size: 1.5rem;
      margin-bottom: var(--spacing-xs);
    }

    .value {
      font-size: 1.5rem;
      line-height: 1.2;
    }

    .label {
      font-size: 0.8rem;
    }
  }

  .grid-2 {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--spacing-md);
  }

  .card,
  .budget-card,
  .category-card {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
  }

  .budget-card {
    height: 500px;

    .budget-header {
      padding: var(--spacing-md);
      flex-direction: column;
      gap: var(--spacing-sm);
      align-items: stretch;
    }

    .budget-content {
      padding: var(--spacing-md);
    }
  }

  .filters {
    padding: var(--spacing-md);
    gap: var(--spacing-sm);

    .filter-group {
      min-width: 100%;
    }
  }

  .search-container {
    width: 100%;
  }

  .form-input {
    padding: var(--spacing-sm);
    font-size: 0.875rem;
  }

  .form-label {
    font-size: 0.875rem;
    margin-bottom: var(--spacing-xs);
  }

  .form-group {
    margin-bottom: var(--spacing-md);
  }

  .btn {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.875rem;
    min-height: 40px;
    gap: var(--spacing-xs);
  }

  .tab-header {
    flex-direction: column;
    gap: var(--spacing-xs);

    .tab-btn {
      width: 100%;
      justify-content: center;
    }
  }

  .table-container {
    font-size: 0.75rem;

    th,
    td {
      padding: var(--spacing-xs) var(--spacing-sm);
    }
  }

  .category-badge {
    font-size: 0.75rem;
    padding: 2px var(--spacing-xs);
  }

  .pagination {
    gap: var(--spacing-xs);

    button {
      padding: var(--spacing-xs) var(--spacing-sm);
      min-width: 36px;
      min-height: 36px;
      font-size: 0.875rem;
    }
  }

  .radio-group {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>
