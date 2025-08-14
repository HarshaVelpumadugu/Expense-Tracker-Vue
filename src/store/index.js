import { createStore } from "vuex";

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

export default createStore({
  state: {
    expenses: loadFromLocal("expenses", []),
    budgets: loadFromLocal("budgets", {}),
    editingExpense: null,
    filters: {
      searchInput: "",
      categoryFilter: "",
      paymentFilter: "",
      fromDate: "",
      toDate: "",
    },
    currentPage: 1,
    itemsPerPage: 5,
    sortField: "date",
    sortDirection: "desc",
    toasts: [],
  },
  getters: {
    totalExpenses(state) {
      return state.expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    },
    getUniqueDays(state) {
      const set = new Set(state.expenses.map((e) => e.date));
      return Math.max(set.size, 1);
    },
    avgDaily(state, getters) {
      return getters.totalExpenses / getters.getUniqueDays;
    },
    topCategory(state) {
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
    paymentRatio(state) {
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
    expenseCount(state) {
      return state.expenses.length;
    },
    filteredExpenses(state) {
      let filtered = [...state.expenses];
      const s = state.filters.searchInput.trim().toLowerCase();
      if (s) {
        filtered = filtered.filter(
          (exp) =>
            exp.description.toLowerCase().includes(s) ||
            exp.category.toLowerCase().includes(s)
        );
      }
      if (state.filters.categoryFilter) {
        filtered = filtered.filter(
          (exp) => exp.category === state.filters.categoryFilter
        );
      }
      if (state.filters.paymentFilter) {
        filtered = filtered.filter(
          (exp) => exp.paymentMethod === state.filters.paymentFilter
        );
      }
      if (state.filters.fromDate) {
        filtered = filtered.filter((exp) => exp.date >= state.filters.fromDate);
      }
      if (state.filters.toDate) {
        filtered = filtered.filter((exp) => exp.date <= state.filters.toDate);
      }

      // sort
      filtered.sort((a, b) => {
        let aValue = a[state.sortField];
        let bValue = b[state.sortField];
        if (state.sortField === "amount") {
          aValue = Number(aValue);
          bValue = Number(bValue);
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
    paginatedExpenses(state, getters) {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      return getters.filteredExpenses.slice(start, start + state.itemsPerPage);
    },
    totalPages(state, getters) {
      return Math.max(
        1,
        Math.ceil(getters.filteredExpenses.length / state.itemsPerPage)
      );
    },
  },
  mutations: {
    SET_EXPENSES(state, expenses) {
      state.expenses = expenses;
    },
    ADD_EXPENSE(state, expense) {
      state.expenses.unshift(expense);
    },
    UPDATE_EXPENSE(state, expense) {
      const idx = state.expenses.findIndex((e) => e.id === expense.id);
      if (idx !== -1) state.expenses.splice(idx, 1, expense);
    },
    DELETE_EXPENSE(state, id) {
      state.expenses = state.expenses.filter((e) => e.id !== id);
    },
    SET_BUDGETS(state, budgets) {
      state.budgets = budgets;
    },
    SET_FILTER(state, { key, value }) {
      state.filters[key] = value;
    },
    CLEAR_FILTERS(state) {
      state.filters = {
        searchInput: "",
        categoryFilter: "",
        paymentFilter: "",
        fromDate: "",
        toDate: "",
      };
    },
    SET_PAGE(state, page) {
      state.currentPage = page;
    },
    SET_SORT(state, { field, direction }) {
      state.sortField = field;
      state.sortDirection = direction;
    },
    SET_EDITING(state, expense) {
      state.editingExpense = expense;
    },
    ADD_TOAST(state, toast) {
      state.toasts.push(toast);
    },
    REMOVE_TOAST(state, id) {
      state.toasts = state.toasts.filter((t) => t.id !== id);
    },
  },
  actions: {
    init() {},
    saveExpenses({ state }) {
      saveToLocal("expenses", state.expenses);
    },
    saveBudgets({ state }) {
      saveToLocal("budgets", state.budgets);
    },
    addExpense({ commit, dispatch }, expense) {
      commit("ADD_EXPENSE", expense);
      dispatch("saveExpenses");
      dispatch("pushToast", {
        message: "Expense added successfully!",
        type: "success",
      });
    },
    deleteExpense({ commit, dispatch }, id) {
      commit("DELETE_EXPENSE", id);
      dispatch("saveExpenses");
      dispatch("pushToast", {
        message: "Expense deleted successfully!",
        type: "success",
      });
    },
    startEditExpense({ commit }, expense) {
      commit("SET_EDITING", expense);
    },
    finishEditExpense({ commit, dispatch }, expense) {
      commit("UPDATE_EXPENSE", expense);
      dispatch("saveExpenses");
      commit("SET_EDITING", null);
      dispatch("pushToast", { message: "Expense updated", type: "success" });
    },
    clearEditing({ commit }) {
      commit("SET_EDITING", null);
    },
    setBudget({ commit, dispatch, state }, { category, amount }) {
      const budgets = { ...state.budgets, [category]: Number(amount) };
      commit("SET_BUDGETS", budgets);
      dispatch("saveBudgets");
      dispatch("pushToast", {
        message: "Budget saved successfully!",
        type: "success",
      });
    },
    deleteBudget({ commit, dispatch, state }, category) {
      const budgets = { ...state.budgets };
      delete budgets[category];
      commit("SET_BUDGETS", budgets);
      dispatch("saveBudgets");
      dispatch("pushToast", {
        message: "Budget deleted successfully!",
        type: "success",
      });
    },
    setFilter({ commit }, payload) {
      commit("SET_FILTER", payload);
      commit("SET_PAGE", 1);
    },
    clearFilters({ commit }) {
      commit("CLEAR_FILTERS");
    },
    changePage({ commit }, page) {
      commit("SET_PAGE", page);
    },
    sortTable({ state, commit }, field) {
      if (state.sortField === field) {
        const dir = state.sortDirection === "asc" ? "desc" : "asc";
        commit("SET_SORT", { field, direction: dir });
      } else {
        commit("SET_SORT", { field, direction: "asc" });
      }
    },
    pushToast({ commit }, { message, type = "info" }) {
      const id = Date.now() + Math.random();
      commit("ADD_TOAST", { id, message, type });
      setTimeout(() => commit("REMOVE_TOAST", id), 3000);
    },
  },
});
