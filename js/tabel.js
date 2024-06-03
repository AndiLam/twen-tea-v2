document.addEventListener("DOMContentLoaded", function() {
    const userElement = document.querySelector(".user");
    const filterButton = document.getElementById("filterButton");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const categorySelect = document.getElementById("category");
    const locationSelect = document.getElementById("location");
    const searchInput = document.getElementById("search");
    const transactionTableBody = document.getElementById("transactionTableBody");
    const rowsPerPageSelect = document.getElementById("rowsPerPage");
    const paginationControls = document.getElementById("paginationControls");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");

    let currentPage = 1;
    let rowsPerPage = parseInt(rowsPerPageSelect.value);
    let currentSortColumn = null;
    let currentSortDirection = 'asc';
    if (typeof transactions === 'undefined') {
        console.error("Data transactions tidak tersedia.");
        return;
    }
    let filteredTransactions = transactions;

    function populateOptions() {
        const categories = new Set();
        const locations = new Set();

        transactions.forEach(transaction => {
            categories.add(transaction.product_category);
            locations.add(transaction.store_location);
        });

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationSelect.appendChild(option);
        });
    }

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

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Prev';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                updateTable(transactionsToShow);
            }
        });
        paginationControls.appendChild(prevButton);

        const maxPagesToShow = 10;
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

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                updateTable(transactionsToShow);
            }
        });
        paginationControls.appendChild(nextButton);

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

    function filterTransactions() {
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
        const category = categorySelect.value;
        const location = locationSelect.value;

        filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            const isDateValid = (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
            const isCategoryValid = category === 'all' || transaction.product_category === category;
            const isLocationValid = location === 'all' || transaction.store_location === location;
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

        currentPage = 1;
        updateTable(filteredTransactions);
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

    filterButton.addEventListener("click", filterTransactions);
    searchInput.addEventListener("input", filterTransactions);

    window.sortTable = sortTable;

    function loadTransactions() {
        populateOptions();
        // Sort by transaction_id ascending when loading transactions
        filteredTransactions.sort((a, b) => {
            const aValue = parseFloat(a.transaction_id);
            const bValue = parseFloat(b.transaction_id);
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        });
        updateTable(filteredTransactions);
    }

    loadTransactions();

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
});
