<template>
  <v-card class="expense-history-card" elevation="3">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-3">mdi-table</v-icon>
      Expense History
    </v-card-title>

    <v-card-text>
      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="paginated"
        :items-per-page="itemsPerPage"
        :page="currentPage"
        :server-items-length="totalItems"
        class="elevation-1"
        hide-default-footer
      >
        <!-- Date Column -->
        <template v-slot:[`item.date`]="{ item }">
          {{ formatDate(item.date) }}
        </template>

        <!-- Category Column -->
        <template v-slot:[`item.category`]="{ item }">
          <v-chip :color="getCategoryColor(item.category)" small label>
            <v-icon small left>{{ getCategoryIcon(item.category) }}</v-icon>
            {{ categoryName(item.category) }}
          </v-chip>
        </template>

        <!-- Amount Column -->
        <template v-slot:[`item.amount`]="{ item }">
          <span class="font-weight-bold">
            ₹{{ Number(item.amount).toLocaleString("en-IN") }}
          </span>
        </template>

        <!-- Payment Method Column -->
        <template v-slot:[`item.paymentMethod`]="{ item }">
          <v-chip
            :color="item.paymentMethod === 'cash' ? 'green' : 'blue'"
            small
            outlined
          >
            <v-icon small left>
              {{
                item.paymentMethod === "cash" ? "mdi-cash" : "mdi-credit-card"
              }}
            </v-icon>
            {{ cap(item.paymentMethod) }}
          </v-chip>
        </template>

        <!-- Actions Column -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex align-center">
            <!-- Edit -->
            <v-btn
              variant="text"
              density="comfortable"
              icon
              @click="$emit('edit', item)"
            >
              <v-icon size="20" color="green">mdi-pencil</v-icon>
            </v-btn>

            <!-- Delete -->
            <v-btn
              variant="text"
              density="comfortable"
              icon
              @click="deleteExpense(item.id)"
            >
              <v-icon size="20" color="red">mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>

        <!-- Empty State -->
        <template v-slot:no-data>
          <div class="text-center pa-8">
            <v-icon size="80" color="grey lighten-2" class="mb-4">
              mdi-inbox
            </v-icon>
            <p class="text-h6 grey--text">No expenses found</p>
          </div>
        </template>
      </v-data-table>

      <!-- Custom Pagination -->
      <div class="d-flex justify-center mt-4">
        <BasePagination
          :total-pages="totalPages"
          :current-page="currentPage"
          @change-page="changePage"
        />
      </div>
    </v-card-text>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon color="warning" class="mr-3">mdi-alert</v-icon>
          Confirm Delete
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this expense?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" text @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { computed, ref } from "vue";
import { useExpenseStore } from "../store/index.js";
import BasePagination from "./BasePagination.vue";

export default {
  name: "ExpenseHistory",
  components: { BasePagination },
  emits: ["edit"],
  setup() {
    const expenseStore = useExpenseStore();
    const deleteDialog = ref(false);
    const expenseToDelete = ref(null);

    // Data table headers
    const headers = [
      {
        title: "Date",
        align: "start",
        sortable: true,
        key: "date",
      },
      {
        title: "Description",
        sortable: false,
        key: "description",
      },
      {
        title: "Category",
        sortable: false,
        key: "category",
      },
      {
        title: "Amount",
        sortable: true,
        key: "amount",
        align: "center",
      },
      {
        title: "Payment",
        sortable: false,
        key: "paymentMethod",
      },
      {
        title: "Actions",
        sortable: false,
        key: "actions",
        align: "center",
      },
    ];

    const paginated = computed(() => expenseStore.paginatedExpenses);
    const totalPages = computed(() => expenseStore.totalPages);
    const currentPage = computed(() => expenseStore.currentPage);
    const totalItems = computed(() => expenseStore.expenses.length);
    const itemsPerPage = ref(10); // Adjust based on your store's items per page

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

    function getCategoryIcon(c) {
      const icons = {
        food: "mdi-food",
        transport: "mdi-car",
        entertainment: "mdi-movie",
        shopping: "mdi-shopping",
        bills: "mdi-lightbulb",
        others: "mdi-clipboard-list",
      };
      return icons[c] || "mdi-clipboard-list";
    }

    function getCategoryColor(c) {
      const colors = {
        food: "orange",
        transport: "green",
        entertainment: "blue",
        shopping: "pink",
        bills: "purple",
        others: "grey",
      };
      return colors[c] || "grey";
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
      expenseToDelete.value = id;
      deleteDialog.value = true;
    }

    function confirmDelete() {
      if (expenseToDelete.value) {
        expenseStore.deleteExpense(expenseToDelete.value);
        expenseToDelete.value = null;
      }
      deleteDialog.value = false;
    }

    function changePage(p) {
      expenseStore.changePage(p);
    }

    function sort(field) {
      expenseStore.sortTable(field);
    }

    return {
      headers,
      paginated,
      totalPages,
      currentPage,
      totalItems,
      itemsPerPage,
      deleteDialog,
      formatDate,
      getCategoryIcon,
      getCategoryColor,
      categoryName,
      cap,
      deleteExpense,
      confirmDelete,
      changePage,
      sort,
    };
  },
};
</script>

<style lang="scss" scoped>
.expense-history-card {
  .v-data-table {
    ::v-deep .v-data-table__wrapper {
      border-radius: 8px;
    }
  }
  ::v-deep .v-chip {
    font-weight: 500;
  }

  ::v-deep .v-data-table th {
    font-weight: 600 !important;
    background-color: #f5f5f5;
  }

  ::v-deep .v-data-table tbody tr:hover {
    background-color: rgba(25, 118, 210, 0.04) !important;
  }

  .v-btn {
    transition: all 0.2s ease-in-out;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .expense-history-card {
    ::v-deep .v-data-table {
      font-size: 0.875rem;
    }
  }
}
</style>
