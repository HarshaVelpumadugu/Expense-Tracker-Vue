<template>
  <div class="category-card">
    <h2 class="mb-3"><i class="fas fa-chart-pie"></i> Category Distribution</h2>
    <div class="chart-container">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import Chart from "chart.js/auto";

export default {
  setup() {
    const store = useStore();
    const canvas = ref(null);
    let chart = null;

    function buildData() {
      const totals = {};
      store.state.expenses.forEach((exp) => {
        const name =
          {
            food: "Food",
            transport: "Transport",
            entertainment: "Entertainment",
            shopping: "Shopping",
            bills: "Bills",
            others: "Others",
          }[exp.category] || exp.category;
        totals[name] = (totals[name] || 0) + Number(exp.amount);
      });
      return { labels: Object.keys(totals), data: Object.values(totals) };
    }

    function initChart() {
      const ctx = canvas.value.getContext("2d");
      const { labels, data } = buildData();
      chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { padding: 20, usePointStyle: true },
            },
          },
        },
      });
    }

    function updateChart() {
      if (!chart) return;
      const { labels, data } = buildData();
      chart.data.labels = labels;
      chart.data.datasets[0].data = data;
      chart.update();
    }

    onMounted(() => {
      initChart();
    });

    watch(() => store.state.expenses, updateChart, { deep: true });

    return { canvas };
  },
};
</script>
<style scoped>
.category-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.chart-container {
  height: 300px;
}
</style>
