document.addEventListener("DOMContentLoaded", function() {
    const filterButton = document.getElementById("filterButton");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const searchInput = document.getElementById("search");
    const userElement = document.querySelector(".user");
    const sidebar = document.getElementById("sidebar");
    const topRevenueTableBody = document.getElementById("topRevenueTableBody");
    const topQuantityTableBody = document.getElementById("topQuantityTableBody");

    const locationContainer = document.getElementById('location-checkboxes');
    const categoryContainer = document.getElementById('category-checkboxes');

    // Validate the availability of transaction data
    if (typeof transactions === 'undefined') {
        console.error("Data transactions tidak tersedia.");
        return;
    }
    let filteredTransactions = transactions;

    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = '../login/login.html';
    }

    // Populate category and location checkboxes
    function populateOptions() {
        const categories = new Set();
        const locations = new Set();

        transactions.forEach(transaction => {
            categories.add(transaction.product_category);
            locations.add(transaction.store_location);
        });

        categories.forEach(category => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category;
            checkbox.checked = true; // Default to checked, adjust as needed

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(category));
            categoryContainer.appendChild(label);
        });

        locations.forEach(location => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = location;
            checkbox.checked = true; // Default to checked, adjust as needed

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(location));
            locationContainer.appendChild(label);
        });
    }

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

    // Get selected locations
    function getSelectedLocations() {
        const checkboxes = locationContainer.querySelectorAll('input[type="checkbox"]');
        const selectedLocations = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'all') {
                selectedLocations.push(checkbox.value);
            }
        });
        return selectedLocations.length ? selectedLocations : ['all'];
    }

    // Get selected categories
    function getSelectedCategories() {
        const checkboxes = categoryContainer.querySelectorAll('input[type="checkbox"]');
        const selectedCategories = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'all') {
                selectedCategories.push(checkbox.value);
            }
        });
        return selectedCategories.length ? selectedCategories : ['all'];
    }

    // Filter transactions based on user input
    function filterTransactions() {
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
        const selectedLocations = getSelectedLocations();
        const selectedCategories = getSelectedCategories();

        filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            const isDateValid = (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
            const isCategoryValid = selectedCategories.includes('all') || selectedCategories.includes(transaction.product_category);
            const isLocationValid = selectedLocations.includes('all') || selectedLocations.includes(transaction.store_location);
            return isDateValid && isCategoryValid && isLocationValid;
        });

        const searchTerm = searchInput.value.toLowerCase();
        filteredTransactions = filteredTransactions.filter(transaction => {
            const searchableFields = [
                'transaction_id', 'transaction_date', 'transaction_time',
                'transaction_qty', 'store_id', 'store_location', 'product_id',
                'unit_price', 'product_category', 'product_type', 'product_detail',
                'transaction_value'
            ];
            return searchableFields.some(field => {
                const value = transaction[field].toString().toLowerCase();
                return value.includes(searchTerm);
            });
        });

        updateTopRevenueTable(filteredTransactions);
        updateTopQuantityTable(filteredTransactions);
        updateTotals(filteredTransactions);
        updateChart(filteredTransactions);
    }

    // Event listeners for filtering
    filterButton.addEventListener("click", filterTransactions);
    searchInput.addEventListener("input", filterTransactions);

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

    // Function to update the top revenue table
    function updateTopRevenueTable(transactions) {
        topRevenueTableBody.innerHTML = '';

        // Sort transactions by transaction_value in descending order
        transactions.sort((a, b) => b.transaction_value - a.transaction_value);

        // Limit to the top 10 transactions
        const topTransactions = transactions.slice(0, 10);

        const fields = [
            'transaction_id','transaction_date', 'transaction_time',
            'transaction_qty', 'store_location',
            'unit_price', 'product_category',
            'transaction_value'
        ];

        topTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = transaction[field];
                row.appendChild(cell);
            });
            topRevenueTableBody.appendChild(row);
        });
    }

    // Function to update the top quantity table
    function updateTopQuantityTable(transactions) {
        topQuantityTableBody.innerHTML = '';

        // Sort transactions by transaction_qty in descending order
        transactions.sort((a, b) => b.transaction_qty - a.transaction_qty);

        // Limit to the top 10 transactions
        const topTransactions = transactions.slice(0, 10);

        const fields = [
            'transaction_id', 'transaction_date', 'transaction_time',
            'transaction_qty', 'store_location',
            'unit_price', 'product_category',
            'transaction_value'
        ];

        topTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = transaction[field];
                row.appendChild(cell);
            });
            topQuantityTableBody.appendChild(row);
        });
    }

    // Initialize chart
    const ctx = document.getElementById('salesChart').getContext('2d');
    let salesChart;

    function updateChart(transactions) {
        const months = ["January", "February", "March", "April", "May", "June"];
        const monthlySales = new Array(6).fill(0);
        const monthlyTransactions = new Array(6).fill(0);

        transactions.forEach(transaction => {
            const monthIndex = new Date(transaction.transaction_date).getMonth();
            monthlySales[monthIndex] += parseFloat(transaction.transaction_value);
            monthlyTransactions[monthIndex] += 1;
        });

        if (salesChart) {
            salesChart.data.datasets[0].data = monthlySales;
            salesChart.data.datasets[1].data = monthlyTransactions;
            salesChart.update();
        } else {
            salesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Monthly Sales ($)',
                        data: monthlySales,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Number of Transactions',
                        data: monthlyTransactions,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    window.confirmLogout = function(event) {
        event.preventDefault();
        if (confirm("Are you sure you want to logout?")) {
            window.location.href = '../index.html';
        }
    };

    populateOptions();
    filterTransactions();
});