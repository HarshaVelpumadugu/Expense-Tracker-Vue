<template>
  <header class="header">
    <div class="main-header">
      <h1>
        <i class="fas fa-chart-line header-icon"></i>
        Personal Finance Dashboard
      </h1>

      <v-btn
        class="add-expense-btn"
        @click="$emit('open-add')"
        elevation="2"
        size="large"
      >
        <v-icon start size="small">mdi-plus</v-icon>
        Add Expense
      </v-btn>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  emits: ["open-add"],
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.12);
  }
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  max-width: 100%;
  margin: 0 auto;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    line-height: 1.2;
  }
}

.header-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0.5rem 0 0 0;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
}

.header-icon {
  margin-right: 0.5rem;
  font-size: 1.8rem;
}

.header-right {
  flex-shrink: 0;
}

.add-expense-btn {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%) !important;
  color: white !important;
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  padding: 0 1.5rem !important;
  min-height: 44px !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
  transition: all 0.3s ease !important;
  border: none !important;

  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4) !important;
    background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
  }

  &:active {
    transform: translateY(0) !important;
  }

  .v-icon {
    margin-right: 0.5rem !important;
  }
}
</style>
