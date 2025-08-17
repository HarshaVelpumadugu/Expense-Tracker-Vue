<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="icon"><i class="fas fa-rupee-sign"></i></div>
      <div class="value">₹{{ totalExpensesLocale }}</div>
      <div class="label">Total Expenses</div>
    </div>
    <div class="stat-card">
      <div class="icon"><i class="fas fa-calendar-day"></i></div>
      <div class="value">₹{{ avgDailyLocale }}</div>
      <div class="label">Avg Daily</div>
    </div>
    <div class="stat-card">
      <div class="icon"><i class="fas fa-crown"></i></div>
      <div class="value">{{ topCategory }}</div>
      <div class="label">Top Category</div>
    </div>
    <div class="stat-card">
      <div class="icon"><i class="fas fa-credit-card"></i></div>
      <div class="value">{{ paymentRatio }}</div>
      <div class="label">Cash vs Card</div>
    </div>
    <div class="stat-card">
      <div class="icon"><i class="fas fa-list"></i></div>
      <div class="value">{{ expenseCount }}</div>
      <div class="label">Expenses</div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useExpenseStore } from "../store/index.js";

export default {
  setup() {
    const expenseStore = useExpenseStore();

    const totalExpensesLocale = computed(
      () => `${expenseStore.totalExpenses.toLocaleString("en-IN")}`
    );
    const avgDailyLocale = computed(
      () => `${Math.round(expenseStore.avgDaily).toLocaleString("en-IN")}`
    );

    return {
      totalExpensesLocale,
      avgDailyLocale,
      topCategory: computed(() => expenseStore.topCategory),
      paymentRatio: computed(() => expenseStore.paymentRatio),
      expenseCount: computed(() => expenseStore.expenseCount),
    };
  },
};
</script>

<style lang="scss" scoped>
/* Dashboard Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);

  .stat-card {
    background: linear-gradient(
      135deg,
      var(--primary-color),
      var(--primary-dark)
    );
    color: white;
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);
    text-align: center;
    box-shadow: var(--shadow-md);
    transition: var(--transition);

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .icon {
      font-size: 2rem;
      margin-bottom: var(--spacing-sm);
      opacity: 0.8;
    }

    .value {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: var(--spacing-xs);
      overflow-wrap: break-word;
      hyphens: auto;
    }

    .label {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  }
}
</style>
