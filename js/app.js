// This is to make sure the DOM is fully loaded before we run any scripts
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
    }

    let links = document.querySelectorAll(".nav-link");
    let currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});


//showToast function for better user feedback
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    let icon = {
        success: "✔️",
        error: "❌",
        warning: "⚠️"
    }[type];

    toast.className = `toast show ${type}`;
    toast.innerHTML = `<span>${icon}</span> ${message}`;

    setTimeout(() => toast.classList.remove("show"), 3000);
}


//logout function in all pages to ensure user can logout from anywhere in the app
function logout() {
    firebase.auth().signOut().then(() => {
        showToast("Logged out successfully", "success");
        window.location.href = "login.html";
    }).catch((error) => {
        showToast("Logout failed: " + error.message, "error");
    });
}

// Check auth state on page load to redirect unauthenticated users to login page
auth.onAuthStateChanged(user => {
    let page = window.location.pathname;

    if (!user && !page.includes("login") && !page.includes("signup")) {
        window.location.href = "login.html";
        return;
    }

    if (user) {
        currentUser = user; // ✅ STORE GLOBALLY

        loadIncome();
        loadExpenses();
        loadGoals();
        monthlyAnalytics();
        updateDashboard();
    }
});

// All functions related to budget
function setBudget() {
    let value = Number(prompt("Enter your monthly budget:"));

    if (!value || value <= 0) {
        showToast("Enter valid budget", "error");
        return;
    }

    localStorage.setItem("budget", value);
    showToast("Budget set successfully 💰");
    updateDashboard(); 
}

//functions related to income load income from firestore and display in income page and dashboard
async function addIncome() {
    try {
        let user = currentUser;
        if (!user) return;

        let source = document.getElementById("source").value.trim();
        let amount = Number(document.getElementById("amount").value);

        if (!source || amount <= 0) {
            return showToast("Enter valid income", "warning");
        }

        await db.collection("users").doc(user.uid).collection("income").add({
            source,
            amount,
            created: firebase.firestore.FieldValue.serverTimestamp()
        });

        showToast("Income Added ✅", "success");
        document.getElementById("source").value = "";
        document.getElementById("amount").value = "";
        updateDashboard();

    } catch (err) {
        showToast(err.message, "error");
    }
}

function loadIncome() {
    let user = currentUser;
    if (!user) return;

    let list = document.getElementById("incomeList");
    if (!list) return;

    list.innerHTML = "⏳ Loading...";

    db.collection("users")
    .doc(user.uid)
    .collection("income")
    .orderBy("created", "desc")
    .onSnapshot(snapshot => {
        list.innerHTML = "";

        if (snapshot.empty) {
            list.innerHTML = "<p class='empty-state'>No income yet 💸</p>";
            return;
        }

        snapshot.forEach(doc => {
            let d = doc.data();
            let li = document.createElement("li");
            li.innerHTML = `
                <span>${d.source} - ₹${d.amount.toLocaleString()}</span>
                <button onclick="deleteIncome('${doc.id}')">Delete</button>
            `;
            list.appendChild(li);
        });
    });
}


//functional for deleting income from firestore and update dashboard accordingly
async function deleteIncome(id) {
    if (!confirm("Delete this income?")) return;

    let user = currentUser;
    try {
        await db.collection("users")
        .doc(user.uid)
        .collection("income")
        .doc(id)
        .delete();
        showToast("Income deleted", "success");
        updateDashboard();
    } catch (err) {
        showToast("Delete failed", "error");
    }
}

//function to add expense to firestore and update dashboard accordingly
async function addExpense() {
    try {
        let user = currentUser;
        if (!user) return;

        let category = document.getElementById("category").value.trim();
        let amount = Number(document.getElementById("amount").value);

        if (!category || amount <= 0) {
            return showToast("Enter valid expense", "warning");
        }

        await db.collection("users").doc(user.uid).collection("expenses").add({
            category,
            amount,
            created: firebase.firestore.FieldValue.serverTimestamp()
        });

        showToast("Expense Added ✅", "success");
        document.getElementById("category").value = "";
        document.getElementById("amount").value = "";
        updateDashboard();

    } catch (err) {
        showToast(err.message, "error");
    }
}

//function to load expenses from firestore and display in expense page and dashboard
function loadExpenses() {
    let user = currentUser;
    if (!user) return;

    let list = document.getElementById("expenseList");
    if (!list) return;

    list.innerHTML = "⏳ Loading...";

    db.collection("users")
    .doc(user.uid)
    .collection("expenses")
    .orderBy("created", "desc")
    .onSnapshot(snapshot => {
        list.innerHTML = "";

        if (snapshot.empty) {
            list.innerHTML = "<p class='empty-state'>No expenses yet 💳</p>";
            return;
        }

        snapshot.forEach(doc => {
            let d = doc.data();
            let li = document.createElement("li");
            li.innerHTML = `
                <span>${d.category} - ₹${d.amount.toLocaleString()}</span>
                <button onclick="deleteExpense('${doc.id}')">Delete</button>
            `;
            list.appendChild(li);
        });
    });
}


//function to delete expense from firestore and update dashboard accordingly
async function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return;

    let user = currentUser;
    try {
        await db.collection("users")
        .doc(user.uid)
        .collection("expenses")
        .doc(id)
        .delete();
        showToast("Expense deleted", "success");
        updateDashboard();
    } catch (err) {
        showToast("Delete failed", "error");
    }
}


// Functions related to goals - add goal, load goals, contribute to goal, delete goal, and update dashboard accordingly
async function addGoal() {
    let user = currentUser;
    if (!user) return;

    let name = document.getElementById("goal").value.trim();
    let amount = Number(document.getElementById("amount").value);

    if (!name || amount <= 0) {
        return showToast("Enter valid goal", "warning");
    }

    try {
        await db.collection("users").doc(user.uid).collection("goals").add({
            name,
            amount,
            saved: 0
        });
        showToast("Goal Added 🎯", "success");
        document.getElementById("goal").value = "";
        document.getElementById("amount").value = "";
    } catch (err) {
        showToast(err.message, "error");
    }
}

function loadGoals() {
    let user = currentUser;
    if (!user) return;

    let list = document.getElementById("goalList");
    let goalSelect = document.getElementById("goalSelect");
    if (!list || !goalSelect) return;

    list.innerHTML = "⏳ Loading...";
    
    db.collection("users")
    .doc(user.uid)
    .collection("goals")
    .onSnapshot(snapshot => {
        // Clear list and dropdown FIRST
        list.innerHTML = "";
        goalSelect.innerHTML = '<option value="">Select a Goal</option>';

        if (snapshot.empty) {
            list.innerHTML = "<p class='empty-state'>No goals yet 🎯</p>";
            return;
        }

        snapshot.forEach(doc => {
            let d = doc.data();
            
            
            let li = document.createElement("li");
            li.className = "goal-item";
            let progressPercent = (d.saved / d.amount) * 100;
            let status = progressPercent >= 100 ? "✅ ACHIEVED!" : `Progress: ${progressPercent.toFixed(1)}%`;
            
            li.innerHTML = `
                <div style="flex: 1;">
                    <strong style="font-size: 1.2rem;">${d.name}</strong>
                    <div>₹${d.saved.toLocaleString()} / ₹${d.amount.toLocaleString()}</div>
                    <progress value="${d.saved}" max="${d.amount}"></progress>
                    <small style="color: ${progressPercent >= 100 ? '#10b981' : '#00c6ff'}">${status}</small>
                </div>
                <div>
                    <!-- ONLY Delete button now -->
                    <button onclick="deleteGoal('${doc.id}')" style="background: linear-gradient(135deg, #ff4d4d, #e74c3c); margin-top: 8px;">🗑️ Delete</button>
                </div>
            `;
            list.appendChild(li);

            //Dropdown menu for all the goals added in the add goal form
            let existingOption = Array.from(goalSelect.options).find(opt => opt.value === doc.id);
            if (!existingOption) {
                let option = document.createElement("option");
                option.value = doc.id;
                option.textContent = `${d.name} (₹${d.saved.toLocaleString()}/${d.amount.toLocaleString()})`;
                goalSelect.appendChild(option);
            }
        });
    });
}

//function to contribute to goal from the contribute form in goal page and update dashboard accordingly
async function contributeToGoal(goalId = null) {
    let user = currentUser;
    if (!user) {
        showToast("Please login first", "error");
        return;
    }

    // Get goal ID
    let id = goalId;
    if (!goalId) {
        id = document.getElementById("goalSelect")?.value;
    }

    if (!id) {
        showToast("Please select a goal", "warning");
        return;
    }

    // Get amount from inline button or input field
    let amountInput = document.getElementById("contributeAmount");
    let amount = amountInput ? Number(amountInput.value) : 
                 Number(prompt("Enter contribution amount (₹):"));

    if (!amount || amount <= 0) {
        showToast("Enter valid amount > 0", "error");
        return;
    }

    try {
        // 1. Get current goal
        let goalDoc = await db.collection("users").doc(user.uid).collection("goals").doc(id).get();
        if (!goalDoc.exists) {
            showToast("Goal not found", "error");
            return;
        }
        
        let goal = goalDoc.data();
        
        // 2. Check total income balance
        let incomeSnap = await db.collection("users").doc(user.uid).collection("income").get();
        let totalIncome = 0;
        incomeSnap.forEach(doc => totalIncome += doc.data().amount);

        let availableBalance = totalIncome - goal.saved;
        if (amount > availableBalance) {
            showToast(`❌ Insufficient funds!\nAvailable: ₹${availableBalance.toLocaleString()}\nNeeded: ₹${amount.toLocaleString()}`, "error");
            return;
        }

        // 3. Update goal
        await db.collection("users").doc(user.uid).collection("goals").doc(id).update({
            saved: firebase.firestore.FieldValue.increment(amount)
        });

        // 4. Record as expense (deducts from balance)
        await db.collection("users").doc(user.uid).collection("expenses").add({
            category: `Goal: ${goal.name}`,
            amount: amount,
            created: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 5. Success
        showToast(`✅ Added ₹${amount.toLocaleString()} to "${goal.name}"\nNew balance: ₹${(goal.saved + amount).toLocaleString()}/${goal.amount.toLocaleString()}`, "success");
        
        // Clear form
        if (amountInput) amountInput.value = "";
        document.getElementById("goalSelect").value = "";
        
        // Refresh dashboard
        updateDashboard();

    } catch (err) {
        console.error("Contribute error:", err);
        showToast("Failed to contribute: " + err.message, "error");
    }
}

async function deleteGoal(id) {
    if (!confirm("Delete this goal?")) return;

    let user = currentUser;
    try {
        await db.collection("users")
        .doc(user.uid)
        .collection("goals")
        .doc(id)
        .delete();
        showToast("Goal deleted", "success");
    } catch (err) {
        showToast("Delete failed", "error");
    }
}

function updateDashboard() {
    let user = currentUser;
    if (!user) return;

    let income = 0;
    let expense = 0;

    db.collection("users").doc(user.uid).collection("income").get()
    .then(snap => {
        snap.forEach(doc => income += doc.data().amount);

        db.collection("users").doc(user.uid).collection("expenses").get()
        .then(snap => {
            snap.forEach(doc => expense += doc.data().amount);

            let incomeEl = document.getElementById("income");
            let expenseEl = document.getElementById("expense");
            let balanceEl = document.getElementById("balance");

            if (incomeEl) incomeEl.innerText = "₹" + income.toLocaleString();
            if (expenseEl) expenseEl.innerText = "₹" + expense.toLocaleString();
            if (balanceEl) balanceEl.innerText = "₹" + (income - expense).toLocaleString();

            let budget = Number(localStorage.getItem("budget")) || 0;
            let remaining = budget - expense;

            let budgetEl = document.getElementById("budget");
            let remainingEl = document.getElementById("remaining");
            let budgetBar = document.getElementById("budgetBar");

            if (budgetEl) budgetEl.innerText = "₹" + budget.toLocaleString();
            if (remainingEl) remainingEl.innerText = "Remaining: ₹" + remaining.toLocaleString();

            if (budgetBar && budget > 0) {
                let percent = (expense / budget) * 100;
                budgetBar.value = percent;

                if (percent > 100) {
                    showToast("🚨 Budget exceeded!", "error");
                } else if (percent > 80) {
                    showToast("⚠️ Near budget limit!", "warning");
                }
            }

            showSmartInsights(income, expense);
        });
    });
}

function showSmartInsights(income, expense) {
    let msg = document.getElementById("insights");
    if (!msg) return;

    msg.innerText = expense > income * 0.7
        ? "⚠️ High spending detected! Consider cutting back."
        : "✅ Great financial health! Keep it up! 💪";
}

//Global chart instance to manage and update the analytics chart efficiently without memory leaks or multiple instances
let chartInstance = null; 

function monthlyAnalytics() {
   let user = currentUser;
    if (!user) return;

    let expenseMonthly = Array(12).fill(0);
    let incomeMonthly = Array(12).fill(0);

    db.collection("users").doc(user.uid).collection("expenses").get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            let d = doc.data();
            let date = d.created ? d.created.toDate() : new Date();
            let month = date.getMonth();
            expenseMonthly[month] += d.amount;
        });

        db.collection("users").doc(user.uid).collection("income").get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let d = doc.data();
                let date = d.created ? d.created.toDate() : new Date();
                let month = date.getMonth();
                incomeMonthly[month] += d.amount;
            });

            renderChart(expenseMonthly, incomeMonthly);
        });
    });
}

function renderChart(expenseData, incomeData = []) {
    let canvas = document.getElementById("chart");
    if (!canvas) return;

    let ctx = canvas.getContext("2d");

    if (chartInstance) {
        chartInstance.destroy();
    }

    let isLight = document.body.classList.contains("light");
    let textColor = isLight ? "#2c3e50" : "#ffffff";
    let gridColor = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)";

    let gradExpense = ctx.createLinearGradient(0, 0, 0, 400);
    gradExpense.addColorStop(0, "rgba(255, 99, 132, 0.8)");
    gradExpense.addColorStop(1, "rgba(255, 99, 132, 0.1)");

    let gradIncome = ctx.createLinearGradient(0, 0, 0, 400);
    gradIncome.addColorStop(0, "rgba(0, 198, 255, 0.8)");
    gradIncome.addColorStop(1, "rgba(0, 198, 255, 0.1)");

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            datasets: [
                {
                    label: "Expenses 💳",
                    data: expenseData,
                    backgroundColor: gradExpense,
                    borderRadius: 8,
                    barThickness: 20
                },
                {
                    label: "Income 💰",
                    data: incomeData,
                    backgroundColor: gradIncome,
                    borderRadius: 8,
                    barThickness: 20
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500,
                easing: "easeOutQuart"
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: { size: 14, weight: "600" },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: isLight ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)",
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: "#00c6ff",
                    borderWidth: 2,
                    cornerRadius: 12,
                    padding: 16,
                    displayColors: true,
                    callbacks: {
                        label: (ctx) => `₹ ${ctx.raw.toLocaleString()}`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: textColor, font: { size: 12 } },
                    grid: { display: false }
                },
                y: {
                    ticks: { 
                        color: textColor,
                        callback: (value) => `₹ ${value.toLocaleString()}` 
                    },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
    showToast("Theme changed ✨");
    // Re-render chart to apply new theme colors
    setTimeout(monthlyAnalytics, 100);
}

function toggleSidebar() {
    document.body.classList.toggle("collapsed");
}