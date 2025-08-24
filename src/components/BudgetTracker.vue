<template>
  <div class="budget-card">
    <div class="budget-header">
      <h2><i class="fas fa-target"></i> Budget Tracker</h2>
      <v-btn
        color="secondary"
        variant="outlined"
        density="comfortable"
        @click="$emit('open-budget')"
      >
        <i class="fas fa-cog"></i> Setup Budget
      </v-btn>
    </div>

    <div class="budget-content">
      <div id="budgetContainer">
        <div v-if="noBudgets" class="empty-state">
          <div class="icon"><i class="fas fa-bullseye"></i></div>
          <h3>No Budgets Set</h3>
          <p>Set up your monthly budget to track your spending goals</p>
        </div>

        <div v-else class="budget-list">
          <div
            v-for="(amount, category) in budgets"
            :key="category"
            class="budget-item"
          >
            <div class="budget-item-header">
              <div class="budget-info">
                <span class="budget-category">
                  {{ categoryIcon(category) }} {{ categoryName(category) }}
                </span>
                <span class="budget-amount">
                  ₹{{
                    (spentByCategory[category] || 0).toLocaleString("en-IN")
                  }}
                  / ₹{{ amount.toLocaleString("en-IN") }}
                </span>
              </div>
              <v-btn
                icon
                color="error"
                variant="text"
                @click="deleteBudget(category)"
              >
                <i class="fas fa-trash"></i>
              </v-btn>
            </div>

            <!-- Vuetify Progress -->
            <v-progress-linear
              :model-value="progressPercent(category)"
              height="10"
              rounded
              :color="progressColor(category)"
            ></v-progress-linear>

            <div class="budget-details">
              <span
                :class="spentByCategory[category] > amount ? 'text-error' : ''"
              >
                {{
                  spentByCategory[category] > amount
                    ? "Over budget by"
                    : "Remaining"
                }}: ₹{{
                  Math.abs(
                    amount - (spentByCategory[category] || 0)
                  ).toLocaleString("en-IN")
                }}
              </span>
              <span class="budget-percentage">
                {{ " " + progressPercent(category).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useExpenseStore } from "../store/index.js";

export default {
  setup() {
    const expenseStore = useExpenseStore();

    const budgets = computed(() => expenseStore.budgets);
    const noBudgets = computed(() => Object.keys(budgets.value).length === 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = computed(() =>
      expenseStore.expenses.filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
    );

    const spentByCategory = computed(() => {
      const map = {};
      monthlyExpenses.value.forEach((e) => {
        map[e.category] = (map[e.category] || 0) + Number(e.amount);
      });
      return map;
    });

    function progressPercent(category) {
      const spent = spentByCategory.value[category] || 0;
      const budget = budgets.value[category] || 1;
      return (spent / budget) * 100;
    }

    function progressColor(category) {
      const p = progressPercent(category);
      if (p < 70) return "success";
      if (p >= 70 && p <= 90) return "warning";
      return "error";
    }

    function categoryIcon(c) {
      const icons = {
        food: "🍕",
        transport: "🚗",
        entertainment: "🎬",
        shopping: "🛍️",
        bills: "💡",
        others: "📋",
      };
      return icons[c] || "📋";
    }

    function categoryName(c) {
      const names = {
        food: "Food",
        transport: "Transport",
        entertainment: "Entertainment",
        shopping: "Shopping",
        bills: "Bills",
        others: "Others",
      };
      return names[c] || c;
    }

    function deleteBudget(category) {
      if (confirm("Are you sure you want to delete this budget?")) {
        expenseStore.deleteBudget(category);
      }
    }

    return {
      budgets,
      noBudgets,
      spentByCategory,
      progressPercent,
      progressColor,
      categoryIcon,
      categoryName,
      deleteBudget,
    };
  },
};
</script>

<style lang="scss" scoped>
.budget-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;

  .budget-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .budget-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .budget-item {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 0.8rem;

      .budget-item-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .budget-details {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;

        .text-error {
          color: #f44336;
        }
      }
    }
  }
}
</style>
