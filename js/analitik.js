document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const categoryCheck = document.getElementById('category-checkboxes');
    const locationCheck = document.getElementById('location-checkboxes');
    const daysCheck = document.getElementById('days-checkboxes');
    const periodCheck = document.getElementById('period-checkboxes');
    const filterButton = document.getElementById("filterButton");
    const userElement = document.querySelector(".user");
    const sidebar = document.getElementById("sidebar");

    let transactions = [];

    fetch('../json/data.json')
        .then(response => response.json())
        .then(data => {
            transactions = data;
            initializePage();
            populateOptions();
            filterTransactions();
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });

    function initializePage() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = '../login/login.html';
        }

        // Event listeners for filtering
        filterButton.addEventListener("click", filterTransactions);
        searchInput.addEventListener("input", filterTransactions);    

        // Event listeners for user element and logo
        if (userElement) {
            userElement.addEventListener("click", function() {
                userElement.classList.toggle("active");
            });

            window.addEventListener("click", function(event) {
                if (!userElement.contains(event.target)) {
                    userElement.classList.remove("active");
                }
            });
        }

        // Toggle sidebar function
        window.toggleSidebar = function() {
            sidebar.classList.toggle("minimized");
        };

        // Change theme function
        window.changeTheme = function(theme) {
            document.body.className = '';
            if (theme !== 'default') {
                document.body.classList.add(theme + '-theme');
            }
        };

        // Event listener for theme change
        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', function() {
                const theme = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                changeTheme(theme);
            });
        });

        // Toggle dropdown menu
        window.toggleDropdown = function(event) {
            event.preventDefault();
            const dropdownMenu = event.currentTarget.nextElementSibling;
            dropdownMenu.classList.toggle('show');
        };

        // Logout
        window.confirmLogout = function(event) {
            event.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
                window.location.href = '../index.html';
            }
        };
    }

    // Populate category and location checkboxes
    function populateOptions() {
        const categories = new Set();
        const locations = new Set();
        const days = new Set();
        const period = new Set();

        transactions.forEach(transaction => {
            categories.add(transaction.product_category);
            locations.add(transaction.store_location);
            days.add(transaction.periode_hari);
            period.add(transaction.periode_waktu);
        });

        // Sort categories and locations in alphabetical order
        const sortedCategories = Array.from(categories).sort((a, b) => a.localeCompare(b));
        const sortedLocations = Array.from(locations).sort((a, b) => a.localeCompare(b));

        // Sort days in a specific order
        const sortedDays = Array.from(days).sort((a, b) => {
            const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            return dayOrder.indexOf(a) - dayOrder.indexOf(b);
        });

        // Sort periods in a specific order
        const sortedPeriod = Array.from(period).sort((a, b) => {
            const periodOrder = ['Pagi', 'Siang', 'Sore'];
            return periodOrder.indexOf(a) - periodOrder.indexOf(b);
        });

        sortedCategories.forEach(category => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category;
            checkbox.checked = true; // Default to checked, adjust as needed

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(category));
            categoryCheck.appendChild(label);
        });

        sortedLocations.forEach(location => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = location;
            checkbox.checked = true; // Default to checked, adjust as needed

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(location));
            locationCheck.appendChild(label);
        });

        sortedDays.forEach(days => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = days;
            checkbox.checked = true; // Default to checked, adjust as needed

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(days));
            daysCheck.appendChild(label);
        });

        sortedPeriod.forEach(period => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = period;
            checkbox.checked = true; // Default to checked, adjust as needed

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(period));
            periodCheck.appendChild(label);
        });

        document.getElementById('category-container').addEventListener('click', function(event) {
            if (event.target.tagName === 'INPUT') return;
            this.classList.toggle('active');
            const checkboxes = document.getElementById('category-checkboxes');
            checkboxes.style.display = checkboxes.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('location-container').addEventListener('click', function(event) {
            if (event.target.tagName === 'INPUT') return;
            this.classList.toggle('active');
            const checkboxes = document.getElementById('location-checkboxes');
            checkboxes.style.display = checkboxes.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('days-container').addEventListener('click', function(event) {
            if (event.target.tagName === 'INPUT') return;
            this.classList.toggle('active');
            const checkboxes = document.getElementById('days-checkboxes');
            checkboxes.style.display = checkboxes.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('period-container').addEventListener('click', function(event) {
            if (event.target.tagName === 'INPUT') return;
            this.classList.toggle('active');
            const checkboxes = document.getElementById('period-checkboxes');
            checkboxes.style.display = checkboxes.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Get selected categories
    function getSelectedCategories() {
        const checkboxes = document.querySelectorAll('#category-checkboxes input[type="checkbox"]');
        const selectedCategories = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'all') {
                selectedCategories.push(checkbox.value);
            }
        });
        return selectedCategories;
    }

    // Get selected locations
    function getSelectedLocations() {
        const checkboxes = document.querySelectorAll('#location-checkboxes input[type="checkbox"]');
        const selectedLocations = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'all') {
                selectedLocations.push(checkbox.value);
            }
        });
        return selectedLocations;
    }

    // Get selected days
    function getSelectedDays() {
        const checkboxes = document.querySelectorAll('#days-checkboxes input[type="checkbox"]');
        const selectedDays = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'all') {
                selectedDays.push(checkbox.value);
            }
        });
        return selectedDays;
    }

    // Get selected period
    function getSelectedPeriod() {
        const checkboxes = document.querySelectorAll('#period-checkboxes input[type="checkbox"]');
        const selectedPeriod = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'all') {
                selectedPeriod.push(checkbox.value);
            }
        });
        return selectedPeriod;
    }

    // Filter transactions based on user input
    function filterTransactions() {
        let filteredTransactions = transactions;
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
        const selectedCategories = getSelectedCategories();
        const selectedLocations = getSelectedLocations();
        const selectedDays = getSelectedDays();
        const selectedPeriod = getSelectedPeriod();

        if (selectedCategories.length === 0 || selectedLocations.length === 0 || selectedDays.length === 0 || selectedPeriod.length === 0) {
            filteredTransactions = [];
        } else {
            filteredTransactions = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.transaction_date);
                const isDateValid = (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
                const isCategoryValid = selectedCategories.includes('all') || selectedCategories.includes(transaction.product_category);
                const isLocationValid = selectedLocations.includes('all') || selectedLocations.includes(transaction.store_location);
                const isDaysValid = selectedDays.includes('all') || selectedDays.includes(transaction.periode_hari);
                const isPeriodValid = selectedPeriod.includes('all') || selectedPeriod.includes(transaction.periode_waktu);
                return isDateValid && isCategoryValid && isLocationValid && isDaysValid && isPeriodValid;
            });
        }

        const searchTerm = searchInput.value.toLowerCase();
        filteredTransactions = filteredTransactions.filter(transaction => {
            const searchableFields = [
                'transaction_id', 'transaction_date', 'transaction_time',
                'transaction_qty', 'store_id', 'store_location', 'product_id',
                'unit_price', 'product_category', 'product_type', 'product_detail',
                'periode_waktu', 'periode_hari', 'transaction_value'
            ];
            return searchableFields.some(field => {
                const value = transaction[field].toString().toLowerCase();
                return value.includes(searchTerm);
            });
        });

        updateTotals(filteredTransactions);
        SalesChart(filteredTransactions);
        SalesTrendChart(filteredTransactions);
        MapChart(filteredTransactions);
        ProductChart(filteredTransactions);
        SalesTimeChart(filteredTransactions);
        SalesPriceChart(filteredTransactions);
        AnalysisChart(filteredTransactions);
    }

    // Function to update total values
    function updateTotals(transactions) {
        const totalRevenue = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.transaction_value), 0);
        const totalTransactions = transactions.reduce((sum, transaction) => sum + parseInt(transaction.transaction_qty), 0);
        const totalProducts = new Set(transactions.map(transaction => transaction.product_detail)).size;
        const totalStores = new Set(transactions.map(transaction => transaction.store_location)).size;

        // Format numbers
        function formatCurrency(value) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }

        function formatNumber(value) {
            return value.toLocaleString();
        }

        document.getElementById("totalRevenue").textContent = formatCurrency(totalRevenue);
        document.getElementById("totalTransactions").textContent = formatNumber(totalTransactions);
        document.getElementById("totalProducts").textContent = formatNumber(totalProducts);
        document.getElementById("totalStores").textContent = formatNumber(totalStores);
    }

    // Sales Month chart
    const ctx = document.getElementById('salesChart').getContext('2d');
    let salesChart;

    function SalesChart(transactions) {
        const months = ["January", "February", "March", "April", "May", "June"];
        const transactionValuesByMonth = new Array(6).fill(0);
        const transactionQuantitiesByMonth = new Array(6).fill(0);

        transactions.forEach(transaction => {
            const monthIndex = new Date(transaction.transaction_date).getMonth();
            transactionValuesByMonth[monthIndex] += parseFloat(transaction.transaction_value);
            transactionQuantitiesByMonth[monthIndex] += parseFloat(transaction.transaction_qty);
        });

        if (salesChart) {
            salesChart.data.datasets[0].data = transactionValuesByMonth;
            salesChart.data.datasets[1].data = transactionQuantitiesByMonth;
            salesChart.update();
        } else {
            salesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Transaction Value ($)',
                        type: 'line',
                        data: transactionValuesByMonth,
                        borderColor: '#388e3c',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        yAxisID: 'value-axis'
                    },
                    {
                        label: 'Transaction Quantity',
                        type: 'bar',
                        data: transactionQuantitiesByMonth,
                        backgroundColor: '#8a5ae8',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                        yAxisID: 'value-axis'
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            id: "value-axis",
                            type: "linear",
                            position: "left",
                            ticks: {
                                beginAtZero: true,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Transaction Value"
                            }                            
                        }, {
                            id: "value-axis",
                            type: "linear",
                            position: "right",
                            ticks: {
                                beginAtZero: true,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Transaction Quantity",
                            },
                        }]
                    }
                }
            });
        }
    }

    // Trend location
    const ctxx = document.getElementById("salesTrend").getContext("2d");
    let salesTrendChart;

    function SalesTrendChart(transactions) {
        const processedData = {};
        transactions.forEach((item) => {
            const date = item.transaction_date;
            const location = item.store_location;
            const value = parseFloat(item.transaction_value);

            if (!processedData[date]) {
                processedData[date] = {};
            }
            if (!processedData[date][location]) {
                processedData[date][location] = 0;
            }

            processedData[date][location] += value;
        });

        const labels = [];
        const hellsKitchenData = [];
        const astoriaData = [];
        const lowerManhattanData = [];

        // Generate labels for the X-axis and data for the Y-axis
        for (let d = new Date("2023-01-01"); d <= new Date("2023-06-30"); d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split("T")[0];
            labels.push(dateStr);
            hellsKitchenData.push(processedData[dateStr] ? processedData[dateStr]["Hell's Kitchen"] || 0 : 0);
            astoriaData.push(processedData[dateStr] ? processedData[dateStr]["Astoria"] || 0 : 0);
            lowerManhattanData.push(processedData[dateStr] ? processedData[dateStr]["Lower Manhattan"] || 0 : 0);
        }

        const datasets = [
            {
                label: "Hell's Kitchen",
                data: hellsKitchenData,
                borderColor: "#0072F0",
                backgroundColor: "rgba(0, 0, 255, 0.1)",
                fill: false,
            },
            {
                label: "Astoria",
                data: astoriaData,
                borderColor: "#00B6CB",
                backgroundColor: "rgba(0, 255, 255, 0.1)",
                fill: false,
            },
            {
                label: "Lower Manhattan",
                data: lowerManhattanData,
                borderColor: "#F10096",
                backgroundColor: "rgba(255, 0, 255, 0.1)",
                fill: false,
            },
        ];

        if (salesTrendChart) {
            salesTrendChart.data.labels = labels;
            salesTrendChart.data.datasets = datasets;
            salesTrendChart.update();
        } else {
            salesTrendChart = new Chart(ctxx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Date",
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Transaction Value",
                            },
                            beginAtZero: true,
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.dataset.label + ": $" + context.raw.toFixed(2);
                                },
                            },
                        },
                    },
                },
            });
        }
    }

    // Sales percentage
    const ctx1 = document.getElementById("salesPercentage").getContext("2d");
    let mapChart;

    function MapChart(transactions) {
        const locationGroups = transactions.reduce((acc, item) => {
            acc[item.store_location] = acc[item.store_location] || 0;
            acc[item.store_location] += parseFloat(item.transaction_value);
            return acc;
        }, {});

        const labels = Object.keys(locationGroups);
        const values = Object.values(locationGroups);

        const total = values.reduce((acc, value) => acc + value, 0);
        const percentages = values.map((value) => (value / total) * 100);

        const colors = ["#0072F0", "#F10096", "#00B6CB"];

        if (mapChart) {
            mapChart.data.labels = labels;
            mapChart.data.datasets[0].data = percentages;
            mapChart.update();
        } else {
            mapChart = new Chart(ctx1, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: percentages,
                            backgroundColor: colors,
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "right",
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(1)}%`;
                                },
                            },
                        },
                    },
                },
            });
        }
    }

    // Product
    const ctx2 = document.getElementById("product").getContext("2d");
    let productChart;

    function ProductChart(transactions) {
        const categories = ["Coffee", "Tea", "Bakery", "Drinking Chocolate", "Flavours", "Coffee beans", "Loose Tea", "Branded", "Packaged Chocolate"];

        const transactionCounts = {};
        categories.forEach((category) => (transactionCounts[category] = 0));

        transactions.forEach((transaction) => {
            const category = transaction.product_category;
            const qty = parseInt(transaction.transaction_qty);

            if (categories.includes(category)) {
                transactionCounts[category] += qty;
            }
        });

        const totalTransactions = Object.values(transactionCounts).reduce((a, b) => a + b, 0);

        const labels = categories;
        const transactionData = labels.map((label) => (transactionCounts[label] / totalTransactions) * 100);

        if (productChart) {
            productChart.data.labels = labels;
            productChart.data.datasets[0].data = transactionData;
            productChart.update();
        } else {
            productChart = new Chart(ctx2, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Transaction Quantity (%)",
                            data: transactionData,
                            backgroundColor: "#388e3c",
                            borderColor: "#388e3c",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    indexAxis: "y",
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value) {
                                    return value + "%";
                                },
                            },
                            title: {
                                display: true,
                                text: "Percentage",
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Product Category",
                            },
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const percentage = context.raw.toFixed(2);
                                    return `${percentage}%`;
                                },
                            },
                        },
                    },
                },
            });
        }
    }

    // Sales time
    const ctx3 = document.getElementById("salesTime").getContext("2d");
    let salesTimeChart;

    function SalesTimeChart(transactions) {
        // Mapping object to translate 'periode_harian' values
        const timeTranslation = {
            "Pagi": "Morning",
            "Siang": "Afternoon",
            "Sore": "Night"
        };

        // Translate 'periode_harian' values
        const translatedTransactions = transactions.map(transaction => ({
            ...transaction,
            periode_waktu: timeTranslation[transaction.periode_waktu]
        }));

        const timeCategories = ["Morning", "Afternoon", "Night"];
        const monthValues = ["January", "February", "March", "April", "May", "June"];

        const salesByCategory = timeCategories.map((category) => {
            return monthValues.map((month) => {
                return translatedTransactions
                    .filter((item) => item.periode_waktu === category && item.periode_bulanan === month)
                    .reduce((total, item) => total + parseFloat(item.unit_price), 0);
            });
        });

        const datasets = salesByCategory.map((categoryData, index) => {
            return {
                label: timeCategories[index],
                data: categoryData,
                borderColor: ["#00b6cb", "#0072f0", "#f10096"][index],
                backgroundColor: "transparent",
                fill: false,
                tension: 0.1,
            };
        });

        if (salesTimeChart) {
            salesTimeChart.data.labels = monthValues;
            salesTimeChart.data.datasets = datasets;
            salesTimeChart.update();
        } else {
            salesTimeChart = new Chart(ctx3, {
                type: "line",
                data: {
                    labels: monthValues,
                    datasets: datasets,
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Month",
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Unit Price",
                            },
                        },
                    },
                },
            });
        }   
    }

    // Sales price
    const ctx4 = document.getElementById("salesPrice").getContext("2d");
    let salesPriceChart;

    function SalesPriceChart(transactions) {
        const categories = {
            "$0 - $5": { color: "#7CB342", values: [] },
            "$5 - $10": { color: "#EC407A", values: [] },
            "$10 - $20": { color: "#03A9F4", values: [] },
            ">$20": { color: "#5E35B1", values: [] },
        };
        const monthlyData = {};

        transactions.forEach((item) => {
            const month = item.transaction_date.split("-").slice(0, 2).join("-");
            const price = parseFloat(item.unit_price);
            let category;

            if (price <= 5) {
                category = "$0 - $5";
            } else if (price <= 10) {
                category = "$5 - $10";
            } else if (price <= 20) {
                category = "$10 - $20";
            } else {
                category = ">$20";
            }

            if (!monthlyData[month]) {
                monthlyData[month] = { "$0 - $5": 0, "$5 - $10": 0, "$10 - $20": 0, ">$20": 0 };
            }

            monthlyData[month][category] += parseFloat(item.unit_price);
        });

        const labels = Object.keys(monthlyData).sort();
        const datasets = Object.keys(categories).map((cat) => ({
            label: cat,
            backgroundColor: categories[cat].color,
            data: labels.map((month) => monthlyData[month][cat]),
        }));

        if (salesPriceChart) {
            salesPriceChart.data.labels = labels;
            salesPriceChart.data.datasets = datasets;
            salesPriceChart.update();
        } else {
            salesPriceChart = new Chart(ctx4, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { stacked: true },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: "Unit Price",
                            },
                        },
                    },
                    plugins: {
                        legend: { position: "top" },
                    },
                },
            });
        }
    }

    // Analysis
    const ctx5 = document.getElementById("analysis").getContext("2d");
    let analysisChart;

    function AnalysisChart(transactions) {
        const categories = ["Coffee", "Tea", "Bakery", "Drinking Chocolate", "Flavours", "Coffee beans", "Loose Tea", "Branded", "Packaged Chocolate"];
        const totalSales = {};
        const soldItems = {};
        const totalTransactions = {};

        categories.forEach((category) => {
            totalSales[category] = 0;
            soldItems[category] = 0;
            totalTransactions[category] = 0;
        });

        transactions.forEach((transaction) => {
            const category = transaction.product_category;
            const value = parseFloat(transaction.unit_price);
            const qty = parseInt(transaction.transaction_qty);

            if (categories.includes(category)) {
                totalSales[category] += value;
                soldItems[category] += qty;
                totalTransactions[category] += 1;
            }
        });

        const labels = categories;
        const totalSalesData = labels.map((label) => totalSales[label]);
        const soldItemsData = labels.map((label) => soldItems[label]);
        const totalTransactionsData = labels.map((label) => totalTransactions[label]);

        const datasets = [
            {
                label: "Total Sales",
                data: totalSalesData,
                backgroundColor: "#0072f0",
                borderColor: "#0072f0",
                borderWidth: 1,
            },
            {
                label: "Sold Items",
                data: soldItemsData,
                backgroundColor: "#00b6cb",
                borderColor: "#00b6cb",
                borderWidth: 1,
            },
            {
                label: "Total Transactions",
                data: totalTransactionsData,
                backgroundColor: "#f10096",
                borderColor: "#f10096",
                borderWidth: 1,
            },
        ];

        if (analysisChart) {
            analysisChart.data.labels = labels;
            analysisChart.data.datasets = datasets;
            analysisChart.update();
        } else {
            analysisChart = new Chart(ctx5, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: datasets,
                },
                options: {
                    indexAxis: "y",
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Total Count",
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Product Category",
                            },
                        },
                    },
                },
            });
        }
    }

    // menampilkan data sales growth
    function displaySalesGrowthChart(transactions) {
        const groupedData = {};

        transactions.forEach((item) => {
            const date = new Date(item.transaction_date);
            const year = date.getFullYear();
            const month = date.getMonth(); // Mendapatkan indeks bulan (dimulai dari 0 untuk Januari)
            const category = item.product_category;
            const transactionValue = parseFloat(item.transaction_value);
            const transactionValueLm = parseFloat(item.transaction_value_lm);

            const monthYear = `${year}-${month}`;

            if (!groupedData[monthYear]) {
                groupedData[monthYear] = {};
            }

            if (!groupedData[monthYear][category]) {
                groupedData[monthYear][category] = {
                    totalTransactionValue: 0,
                    totalTransactionValueLm: 0,
                };
            }

            groupedData[monthYear][category].totalTransactionValue += transactionValue;
            groupedData[monthYear][category].totalTransactionValueLm += transactionValueLm;
        });

        // Mengurutkan kunci bulan
        const sortedMonths = Object.keys(groupedData).sort((a, b) => {
            const [yearA, monthA] = a.split('-');
            const [yearB, monthB] = b.split('-');
            return new Date(yearA, monthA).getTime() - new Date(yearB, monthB).getTime();
        });

        const tableBody = document.querySelector("#data-table tbody");
        tableBody.innerHTML = ''; // Clear the table before adding new rows

        // Membuat baris tabel berdasarkan bulan yang diurutkan
        sortedMonths.forEach((monthYear) => {
            for (const category in groupedData[monthYear]) {
                const row = document.createElement("tr");

                const [year, month] = monthYear.split("-");
                const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

                const yearCell = document.createElement("td");
                yearCell.textContent = year;
                row.appendChild(yearCell);

                const monthCell = document.createElement("td");
                monthCell.textContent = monthName;
                row.appendChild(monthCell);

                const categoryCell = document.createElement("td");
                categoryCell.textContent = category;
                row.appendChild(categoryCell);

                const totalValueCell = document.createElement("td");
                totalValueCell.textContent = groupedData[monthYear][category].totalTransactionValue.toFixed(2);
                row.appendChild(totalValueCell);

                const totalValueLmCell = document.createElement("td");
                totalValueLmCell.textContent = groupedData[monthYear][category].totalTransactionValueLm.toFixed(2);
                row.appendChild(totalValueLmCell);

                const averageSalesGrowthCell = document.createElement("td");
                const totalTransactionValueLm = groupedData[monthYear][category].totalTransactionValueLm;
                const salesGrowth = totalTransactionValueLm !== 0 ? (groupedData[monthYear][category].totalTransactionValue - totalTransactionValueLm) / totalTransactionValueLm : 0;
                averageSalesGrowthCell.textContent = (salesGrowth * 100).toFixed(2) + "%";
                row.appendChild(averageSalesGrowthCell);

                tableBody.appendChild(row);
            }
        });
    }

    let growth = [];
    fetch("../json/sales-growth.json")
        .then((response) => response.json())
        .then((data) => {
            growth = data;
            filterData();
        })
        .catch((error) => console.error("Error fetching data:", error));

    function filterData() {
        const year = document.getElementById("yearFilter").value;
        const month = document.getElementById("monthFilter").value;
        const filteredData = growth.filter(transaction => {
            const date = new Date(transaction.transaction_date);
            return date.getFullYear() == year && (date.getMonth() + 1) == month;
        });
        displaySalesGrowthChart(filteredData);
    }

    document.getElementById("filterGrowthButton").addEventListener("click", filterData);
});