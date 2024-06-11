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
    const topRevenueTableBody = document.getElementById("topRevenueTableBody");
    const topQuantityTableBody = document.getElementById("topQuantityTableBody");

    let transactions = [];

    fetch('../json/data.json')
        .then(response => response.json())
        .then(data => {
            transactions = data;
            initializePage();
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });

    function initializePage() {
        let filteredTransactions = transactions;

        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = '../login/login.html';
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
                checkbox.checked = true;
        
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(category));
                categoryCheck.appendChild(label);
            });
        
            sortedLocations.forEach(location => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = location;
                checkbox.checked = true;
        
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(location));
                locationCheck.appendChild(label);
            });
        
            sortedDays.forEach(days => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = days;
                checkbox.checked = true;
        
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(days));
                daysCheck.appendChild(label);
            });
        
            sortedPeriod.forEach(period => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = period;
                checkbox.checked = true;
        
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
            const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
            const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
            const selectedCategories = getSelectedCategories();
            const selectedLocations = getSelectedLocations();
            const selectedDays = getSelectedDays();
            const selectedPeriod = getSelectedPeriod();

            // Ensure that no data is read if all checkboxes in any category are unchecked
            if (selectedCategories.length === 0 || selectedLocations.length === 0 || selectedDays.length === 0 || selectedPeriod.length === 0) {
                filteredTransactions = [];
            } else {
                filteredTransactions = transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.transaction_date);
                    const isDateValid = (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
                    const isCategoryValid = selectedCategories.includes(transaction.product_category);
                    const isLocationValid = selectedLocations.includes(transaction.store_location);
                    const isDaysValid = selectedDays.includes(transaction.periode_hari);
                    const isPeriodValid = selectedPeriod.includes(transaction.periode_waktu);
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

            updateTopRevenueTable(filteredTransactions);
            updateTopQuantityTable(filteredTransactions);
            updateTotals(filteredTransactions);
            updateChart(filteredTransactions);
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
    }
});