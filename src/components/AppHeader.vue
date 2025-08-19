<template>
  <header class="header">
    <div class="main-header">
      <h1><i class="fas fa-chart-line"></i> Personal Finance Dashboard</h1>
      <v-btn class="add-expense-btn" @click="$emit('open-add')" rounded>
        Add Expense
      </v-btn>
    </div>
    <p>
      Track your expenses, manage your budget, and achieve your financial goals
    </p>
  </header>
</template>

<script>
export default { name: "AppHeader" };
</script>

<style lang="scss" scoped>
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  text-align: center;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(
      135deg,
      var(--primary-color),
      var(--secondary-color)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--spacing-sm);
  }

  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm);
  flex-wrap: wrap;
}

.add-expense-btn {
  background-color: var(--primary-color) !important;
  border-radius: 50px !important;
  font-size: 1rem !important;
  padding: var(--spacing-md) !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: none !important;
  color: black !important;
}
</style>
