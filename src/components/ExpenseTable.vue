<template>
  <div class="card">
    <h2 class="mb-3"><i class="fas fa-table"></i> Expense History</h2>
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th @click="sort('date')">Date <i class="fas fa-sort"></i></th>
            <th>Description</th>
            <th>Category</th>
            <th @click="sort('amount')">Amount <i class="fas fa-sort"></i></th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginated.length === 0">
            <td colspan="6" class="text-center" style="padding: 2rem">
              <div class="empty-state">
                <i
                  class="fas fa-inbox"
                  style="font-size: 3rem; color: #ccc; margin-bottom: 1rem"
                ></i>
                <p>No expenses found</p>
              </div>
            </td>
          </tr>
          <tr v-for="exp in paginated" :key="exp.id">
            <td>{{ formatDate(exp.date) }}</td>
            <td>{{ exp.description }}</td>
            <td>
              <span :class="['category-badge', 'category-' + exp.category]">
                {{ categoryIcon(exp.category) }}
                {{ categoryName(exp.category) }}
              </span>
            </td>
            <td class="amount">
              ₹{{ Number(exp.amount).toLocaleString("en-IN") }}
            </td>
            <td>
              <span class="payment-badge">
                {{ exp.paymentMethod === "cash" ? "💰" : "💳" }}
                {{ cap(exp.paymentMethod) }}
              </span>
            </td>
            <td class="actions">
              <div class="action-wrapper">
                <button
                  class="btn-icon btn-edit"
                  @click="$emit('edit', exp)"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn-icon btn-delete"
                  @click="deleteExpense(exp.id)"
                  title="Delete"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BasePagination
      :total-pages="totalPages"
      :current-page="currentPage"
      @change-page="changePage"
    />
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import BasePagination from "./BasePagination.vue";

export default {
  components: { BasePagination },
  setup() {
    const store = useStore();
    const paginated = computed(() => store.getters.paginatedExpenses);
    const totalPages = computed(() => store.getters.totalPages);
    const currentPage = computed(() => store.state.currentPage);

    function formatDate(d) {
      try {
        const dt = new Date(d);
        return dt.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } catch (e) {
        return d;
      }
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
    function cap(s) {
      return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
    }

    function deleteExpense(id) {
      if (confirm("Are you sure you want to delete this expense?")) {
        store.dispatch("deleteExpense", id);
      }
    }
    function changePage(p) {
      store.dispatch("changePage", p);
    }
    function sort(field) {
      store.dispatch("sortTable", field);
    }

    return {
      paginated,
      formatDate,
      categoryIcon,
      categoryName,
      cap,
      deleteExpense,
      changePage,
      totalPages,
      currentPage,
      sort,
    };
  },
};
</script>
<style scoped>
:root {
  --primary-color: #667eea;
  --primary-dark: #5a67d8;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  --success-color: #48bb78;
  --warning-color: #ed8936;
  --error-color: #f56565;
  --background-color: #f7fafc;
  --surface-color: #ffffff;
  --text-primary: #2d3748;
  --text-secondary: #718096;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --border-radius: 12px;
  --transition: all 0.3s ease;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}
.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  /* max-height: 600px; */
  max-height: none;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* margin-bottom: var(--spacing-md); */
  height: auto;
  /* overflow: auto; */
}
.tab-btn.active {
  background: var(--primary-color);
}
.table-container {
  overflow-x: auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.table th {
  background: var(--background-color);
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
}

.table th:hover {
  background: var(--primary-color);
  color: white;
}
.table tr {
  height: 100%;
}
.table td {
  color: var(--text-secondary);
  vertical-align: middle;
}

.table tbody tr:hover {
  background: rgba(102, 126, 234, 0.05);
}

.table td.amount,
.table td.actions {
  height: 100%;
  white-space: nowrap;
}

.table td.actions {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  white-space: nowrap;
}

.table td.actions .action-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

/* Filters */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 150px;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Search */
.search-container {
  position: relative;
  flex: 1;
  width: 200px;
}

.actions {
  display: flex;
  align-items: center; /* Vertically center in the cell */
  justify-content: center; /* Optional: center horizontally */
  gap: 0.5rem; /* Space between edit and delete icons */
  padding: var(--spacing-md); /* Match table cell padding */
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem; /* Optional: adjust icon size */
}

.search-input {
  width: 100%;
  padding: var(--spacing-md);
  padding-left: 40px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  padding-bottom: var(--spacing-md);
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}
.category-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.85rem;
}
.category-food {
  background: #ffe0b2;
}
.category-transport {
  background: #c8e6c9;
}
.category-entertainment {
  background: #bbdefb;
}
.category-shopping {
  background: #f8bbd0;
}
.category-bills {
  background: #e1bee7;
}
.category-others {
  background: #d7ccc8;
}
.payment-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.actions {
  display: flex;
  gap: 0.3rem;
}
.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
}
.btn-edit {
  color: #4caf50;
}
.btn-delete {
  color: #f44336;
}
.empty-state {
  text-align: center;
  color: #888;
}
</style>
