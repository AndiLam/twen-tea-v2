document.addEventListener("DOMContentLoaded", function () {
// Fungsi untuk mengelompokkan transaksi per bulan dan mengakumulasi nilai transaksi
function groupTransactionsByMonth(transactions) {
    const monthlyData = {};

    transactions.forEach(transaction => {
        const date = new Date(transaction.transaction_date);
        const month = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0'); // Format: YYYY-MM

        if (!monthlyData[month]) {
            monthlyData[month] = 0;
        }

        monthlyData[month] += transaction.transaction_value;
    });

    const labels = Object.keys(monthlyData);
    const data = Object.values(monthlyData);

    return { labels, data };
}

// Dapatkan data yang telah dikelompokkan dan diakumulasikan
const groupedData = groupTransactionsByMonth(transactions);

// Buat chart menggunakan data yang telah dikelompokkan
const salesChartCtx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(salesChartCtx, {
    type: 'line',
    data: {
        labels: groupedData.labels,
        datasets: [{
            label: 'Sales Over Time',
            data: groupedData.data,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Sales Value'
                }
            }
        }
    }
});


    // Product Category Chart
    const categoryCounts = {};
    transactions.forEach(t => {
        categoryCounts[t.product_category] = (categoryCounts[t.product_category] || 0) + t.transaction_qty;
    });

    const categoryChartCtx = document.getElementById('categoryChart').getContext('2d');
    const categoryChart = new Chart(categoryChartCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryCounts),
            datasets: [{
                label: 'Product Category',
                data: Object.values(categoryCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
    });

    // Store Location Chart
    const locationCounts = {};
    transactions.forEach(t => {
        locationCounts[t.store_location] = (locationCounts[t.store_location] || 0) + t.transaction_qty;
    });

    const locationChartCtx = document.getElementById('locationChart').getContext('2d');
    const locationChart = new Chart(locationChartCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(locationCounts),
            datasets: [{
                label: 'Store Location',
                data: Object.values(locationCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Location'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Transaction Quantity'
                    }
                }
            }
        }
    });
});