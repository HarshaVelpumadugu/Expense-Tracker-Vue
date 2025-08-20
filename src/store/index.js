import { defineStore } from "pinia";

function saveToLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadFromLocal(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v === null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

export const useExpenseStore = defineStore("expenses", {
  state: () => ({
    expenses: loadFromLocal("expenses", []),
    budgets: loadFromLocal("budgets", {}),
    editingExpense: null,
    filters: {
      searchInput: "",
      categoryFilter: null, // Changed from "" to null
      paymentFilter: null, // Changed from "" to null
      fromDate: null, // Changed from "" to null
      toDate: null, // Changed from "" to null
    },
    currentPage: 1,
    itemsPerPage: 5,
    sortField: "date",
    sortDirection: "desc",
    toasts: [],
  }),

  getters: {
    totalExpenses: (state) =>
      state.expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0),

    getUniqueDays: (state) => {
      const set = new Set(state.expenses.map((e) => e.date));
      return Math.max(set.size, 1);
    },

    avgDaily: (state) =>
      state.expenses.length
        ? state.expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0) /
          Math.max(new Set(state.expenses.map((e) => e.date)).size, 1)
        : 0,

    topCategory: (state) => {
      if (state.expenses.length === 0) return "-";
      const totals = {};
      state.expenses.forEach(
        (e) =>
          (totals[e.category] = (totals[e.category] || 0) + Number(e.amount))
      );
      const top = Object.keys(totals).reduce((a, b) =>
        totals[a] > totals[b] ? a : b
      );
      const names = {
        food: "Food",
        transport: "Transport",
        entertainment: "Entertainment",
        shopping: "Shopping",
        bills: "Bills",
        others: "Others",
      };
      return names[top] || top;
    },

    paymentRatio: (state) => {
      if (state.expenses.length === 0) return "-";
      const cashCount = state.expenses.filter(
        (e) => e.paymentMethod === "cash"
      ).length;
      const cardCount = state.expenses.length - cashCount;
      if (cashCount === 0) return "0% : 100%";
      if (cardCount === 0) return "100% : 0%";
      const cashPercent = Math.round((cashCount / state.expenses.length) * 100);
      return `${cashPercent}% : ${100 - cashPercent}%`;
    },

    expenseCount: (state) => state.expenses.length,

    filteredExpenses: (state) => {
      let filtered = [...state.expenses];

      // Search filter
      const searchTerm = state.filters.searchInput?.trim().toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(
          (exp) =>
            exp.description?.toLowerCase().includes(searchTerm) ||
            exp.category?.toLowerCase().includes(searchTerm)
        );
      }

      // Category filter - handle both cases
      if (state.filters.categoryFilter) {
        filtered = filtered.filter((exp) => {
          const expCategory = exp.category?.toLowerCase();
          const filterCategory = state.filters.categoryFilter.toLowerCase();
          return expCategory === filterCategory;
        });
      }

      // Payment method filter - handle both cases
      if (state.filters.paymentFilter) {
        filtered = filtered.filter((exp) => {
          const expPayment = exp.paymentMethod?.toLowerCase();
          const filterPayment = state.filters.paymentFilter.toLowerCase();
          return expPayment === filterPayment;
        });
      }

      // Date filters with proper date handling
      if (state.filters.fromDate) {
        filtered = filtered.filter((exp) => {
          const expDate = new Date(exp.date);
          const fromDate = new Date(state.filters.fromDate);
          return expDate >= fromDate;
        });
      }

      if (state.filters.toDate) {
        filtered = filtered.filter((exp) => {
          const expDate = new Date(exp.date);
          const toDate = new Date(state.filters.toDate);
          // Set toDate to end of day for inclusive comparison
          toDate.setHours(23, 59, 59, 999);
          return expDate <= toDate;
        });
      }

      // Sorting
      filtered.sort((a, b) => {
        let aValue = a[state.sortField];
        let bValue = b[state.sortField];

        if (state.sortField === "amount") {
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
        } else if (state.sortField === "date") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else {
          aValue = (aValue + "").toLowerCase();
          bValue = (bValue + "").toLowerCase();
        }

        if (aValue < bValue) return state.sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return state.sortDirection === "asc" ? 1 : -1;
        return 0;
      });

      return filtered;
    },

    paginatedExpenses: (state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return state.filteredExpenses.slice(start, end);
    },

    totalPages: (state) =>
      Math.max(
        1,
        Math.ceil(state.filteredExpenses.length / state.itemsPerPage)
      ),
  },

  actions: {
    saveExpenses() {
      saveToLocal("expenses", this.expenses);
    },
    saveBudgets() {
      saveToLocal("budgets", this.budgets);
    },
    addExpense(expense) {
      this.expenses.unshift(expense);
      this.saveExpenses();
      this.pushToast({
        message: "Expense added successfully!",
        type: "success",
      });
    },
    deleteExpense(id) {
      this.expenses = this.expenses.filter((e) => e.id !== id);
      this.saveExpenses();
      this.pushToast({
        message: "Expense deleted successfully!",
        type: "success",
      });
    },
    startEditExpense(expense) {
      this.editingExpense = expense;
    },
    finishEditExpense(expense) {
      const idx = this.expenses.findIndex((e) => e.id === expense.id);
      if (idx !== -1) this.expenses.splice(idx, 1, expense);
      this.saveExpenses();
      this.editingExpense = null;
      this.pushToast({ message: "Expense updated", type: "success" });
    },
    clearEditing() {
      this.editingExpense = null;
    },
    setBudget({ category, amount }) {
      this.budgets = { ...this.budgets, [category]: Number(amount) };
      this.saveBudgets();
      this.pushToast({
        message: "Budget saved successfully!",
        type: "success",
      });
    },
    deleteBudget(category) {
      const budgets = { ...this.budgets };
      delete budgets[category];
      this.budgets = budgets;
      this.saveBudgets();
      this.pushToast({
        message: "Budget deleted successfully!",
        type: "success",
      });
    },
    setFilter({ key, value }) {
      this.filters[key] = value;
      this.currentPage = 1; // Reset to first page when filtering
    },
    clearFilters() {
      this.filters = {
        searchInput: "",
        categoryFilter: null,
        paymentFilter: null,
        fromDate: null,
        toDate: null,
      };
      this.currentPage = 1; // Reset to first page
    },
    changePage(page) {
      this.currentPage = page;
    },
    sortTable(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortField = field;
        this.sortDirection = "asc";
      }
    },
    pushToast({ message, type = "info" }) {
      const id = Date.now() + Math.random();
      this.toasts.push({ id, message, type });
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t.id !== id);
      }, 3000);
    },
  },
});
