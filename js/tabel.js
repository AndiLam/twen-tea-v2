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
    const transactionTableBody = document.getElementById("transactionTableBody");
    const rowsPerPageSelect = document.getElementById("rowsPerPage");
    const paginationControls = document.getElementById("paginationControls");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");

    let transactions = [];
    let currentPage = 1;
    let rowsPerPage = parseInt(rowsPerPageSelect.value);
    let currentSortColumn = null;
    let currentSortDirection = 'asc';


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

        updateTotals(filteredTransactions)
        loadTransactions();
    }

    function loadTransactions() {
        // Sort by transaction_id ascending when loading transactions
        filteredTransactions.sort((a, b) => {
            const aValue = parseFloat(a.transaction_id);
            const bValue = parseFloat(b.transaction_id);
            return aValue > bValue? 1 : aValue < bValue? -1 : 0;
        });
        updateTable(filteredTransactions);
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

    function sortTable(column) {
        if (currentSortColumn === column) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortColumn = column;
            currentSortDirection = 'asc';
        }

        filteredTransactions.sort((a, b) => {
            let aValue = a[column];
            let bValue = b[column];

            if (!isNaN(aValue) && !isNaN(bValue)) {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            } else {
                aValue = String(aValue).toLowerCase();
                bValue = String(bValue).toLowerCase();
            }

            if (currentSortDirection === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });
        updateTable(filteredTransactions);

        const sortIcons = document.querySelectorAll('.sort-icon');
        sortIcons.forEach(icon => {
            icon.classList.remove('asc', 'desc');
        });

        const activeSortIcon = document.querySelector(`th:nth-child(${Array.from(document.querySelectorAll('th')).findIndex(th => th.textContent.trim().includes(column.replace('_', ' '))) + 1}) .sort-icon`);
        if (activeSortIcon) {
            activeSortIcon.classList.add(currentSortDirection);
        }
    }
    window.sortTable = sortTable;    

    function updateTable(transactionsToShow) {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const transactionsToDisplay = transactionsToShow.slice(startIndex, endIndex);

        transactionTableBody.innerHTML = '';

        transactionsToDisplay.forEach(transaction => {
            const newRow = transactionTableBody.insertRow();
            const displayKeys = [
                "transaction_id", "transaction_date", "transaction_time",
                "transaction_qty", "store_id", "store_location", "product_id",
                "unit_price", "product_category", "product_type", "product_detail",
                "transaction_value"
            ];
            displayKeys.forEach(key => {
                const cell = newRow.insertCell();
                cell.textContent = transaction[key];
            });
        });

        updatePagination(transactionsToShow);
    }

    function updatePagination(transactionsToShow) {
        const totalPages = Math.ceil(transactionsToShow.length / rowsPerPage);

        paginationControls.innerHTML = '';

        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = 'First';
        firstPageButton.disabled = currentPage === 1;
        firstPageButton.addEventListener('click', function() {
            currentPage = 1;
            updateTable(transactionsToShow);
        });
        paginationControls.appendChild(firstPageButton);

        const maxPagesToShow = 5;
        let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
        let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(endPage - maxPagesToShow + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', function() {
                currentPage = i;
                updateTable(transactionsToShow);
            });
            paginationControls.appendChild(button);
        }

        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = 'Last';
        lastPageButton.disabled = currentPage === totalPages;
        lastPageButton.addEventListener('click', function() {
            currentPage = totalPages;
            updateTable(transactionsToShow);
        });
        paginationControls.appendChild(lastPageButton);

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }     

    rowsPerPageSelect.addEventListener('change', function() {
        rowsPerPage = parseInt(rowsPerPageSelect.value);
        currentPage = 1;
        updateTable(filteredTransactions);
    });

    prevPageButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updateTable(filteredTransactions);
        }
    });

    nextPageButton.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateTable(filteredTransactions);
        }
    });        

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