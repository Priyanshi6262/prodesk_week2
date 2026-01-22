let salary = 0;
let expenses = [];
let chart;

const currentMonth = new Date().getMonth();
const storedMonth = Number(localStorage.getItem("month"));

window.onload = () => {
  if (!isNaN(storedMonth) && storedMonth !== currentMonth) {
    localStorage.removeItem("expenses");
  }

  salary = Number(localStorage.getItem("salary")) || 0;
  expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  localStorage.setItem("month", currentMonth);
  updateUI();
};

function saveSalary() {
  const value = Number(salaryInput.value);
  if (value <= 0) {
    alert("Enter valid salary");
    return;
  }
  salary = value;
  localStorage.setItem("salary", salary);
  updateUI();
}

function addExpense() {
  const name = expenseName.value;
  const amount = Number(expenseAmount.value);

  if (!name || amount <= 0) {
    alert("Please select expense and enter valid amount");
    return;
  }

  expenses.push({ name, amount });
  localStorage.setItem("expenses", JSON.stringify(expenses));

  expenseAmount.value = "";
  expenseName.value = "";

  updateUI();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateUI();
}

function updateUI() {
  salaryDisplay.textContent = salary;
  expenseList.innerHTML = "";

  expenses.forEach((exp, index) => {
    expenseList.innerHTML += `
      <li>
        ${exp.name} - ₹${exp.amount}
        <span class="delete" onclick="deleteExpense(${index})">🗑</span>
      </li>
    `;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  balanceDisplay.textContent = salary - totalExpenses;

  updateChart(salary - totalExpenses, totalExpenses);
}

function updateChart(balance, spent) {
  if (chart) chart.destroy();

  chart = new Chart(expenseChart, {
    type: "pie",
    data: {
      labels: ["Remaining Balance", "Total Expenses"],
      datasets: [{
        data: [balance, spent],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    }
  });
}
