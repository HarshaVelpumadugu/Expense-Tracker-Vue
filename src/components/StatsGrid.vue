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
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const totalExpensesLocale = computed(
      () => ` ${store.getters.totalExpenses.toLocaleString("en-IN")}`
    );
    const avgDailyLocale = computed(
      () => `${Math.round(store.getters.avgDaily).toLocaleString("en-IN")}`
    );
    return {
      totalExpensesLocale,
      avgDailyLocale,
      topCategory: computed(() => store.getters.topCategory),
      paymentRatio: computed(() => store.getters.paymentRatio),
      expenseCount: computed(() => store.getters.expenseCount),
    };
  },
};
</script>
<style scoped>
/* Dashboard Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

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
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-card .icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
  opacity: 0.8;
}

.stat-card .value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  overflow-wrap: break-word;
  hyphens: auto;
}

.stat-card .label {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
