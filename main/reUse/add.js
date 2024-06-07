var reUse = 
    '<nav class="nav" id="sidebar">'+
        '<div class="logo">'+
            '<span class="logo-icon"><img src="../assets/img/icon/kopi.png"></span>'+
            '<span class="logo-text"><h2>Mehhh</h2></span>'+
        '</div>'+
        '<ul>'

var reuse =
            '<li class="dropdown">'+
                '<a href="#" onclick="toggleDropdown(event)"><span class="icon"><i class="fas fa-palette"></i></span><span class="title">UI Colors</span></a>'+
                '<div class="dropdown-menu">'+
                    '<button onclick="changeTheme(\'default\')" class="theme-button default-theme"></button>'+
                    '<button onclick="changeTheme(\'dark\')" class="theme-button dark-theme"></button>'+
                    '<button onclick="changeTheme(\'blue\')" class="theme-button blue-theme"></button>'+
                    '<button onclick="changeTheme(\'green\')" class="theme-button green-theme"></button>'+
                '</div>'+
            '</li>'+
        '</ul>'+
    '</nav>'+
    '<main class="main">'+
        '<div class="topbar">'+
            '<div class="toggle" onclick="toggleSidebar();"><i class="fas fa-bars"></i></div>'+
            '<div class="user">'+
                '<img src="../assets/img/icon/Revou-alasan.original.png">'+
                '<div class="user-menu" id="userMenu">'+
                    '<a href="#" onclick="confirmLogout(event)">Logout</a>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<section class="filter">'+
            '<form id="filterForm" onsubmit="event.preventDefault();">'+
                '<div class="form-group">'+
                    '<label for="search">Search:</label>'+
                    '<input type="text" id="search" placeholder="Search">'+
                '</div>'+
                '<div class="form-group">'+
                    '<label for="startDate">Start Date:</label>'+
                    '<input type="date" id="startDate">'+
                '</div>'+
                '<div class="form-group">'+
                    '<label for="endDate">End Date:</label>'+
                    '<input type="date" id="endDate">'+
                '</div>'+
                '<div class="form-group" onclick="toggleDropdown(event)">'+
                    '<label>Category:</label>'+
                    '<div class="dropdown-container" id="category-container">'+
                        '<span class="selected-value" id="selected-category">Category</span>'+
                        '<span class="dropdown-arrow">▼</span>'+
                        '<li id="category-checkboxes">'+
                            '<!-- Category options will be populated here -->'+
                        '</li>'+
                    '</div>'+
                '</div>'+
                '<div class="form-group">'+
                    '<label>Location:</label>'+
                    '<div class="dropdown-container" id="location-container">'+
                        '<span class="selected-value" id="selected-location">Location</span>'+
                        '<span class="dropdown-arrow">▼</span>'+
                        '<li id="location-checkboxes">'+
                            '<!-- Location options will be populated here -->'+
                        '</li>'+
                    '</div>'+
                '</div>'+
                '<div class="form-group">'+
                    '<label>Period of Days:</label>'+
                    '<div class="dropdown-container" id="days-container">'+
                        '<span class="selected-value" id="selected-days">Period of Days</span>'+
                        '<span class="dropdown-arrow">▼</span>'+
                        '<li id="days-checkboxes">'+
                            '<!-- Days options will be populated here -->'+
                        '</li>'+
                    '</div>'+
                '</div>'+
                '<div class="form-group">'+
                    '<label>Time Period:</label>'+
                    '<div class="dropdown-container" id="period-container">'+
                        '<span class="selected-value" id="selected-period">Time Period</span>'+
                        '<span class="dropdown-arrow">▼</span>'+
                        '<li id="period-checkboxes">'+
                            '<!-- Period options will be populated here -->'+
                        '</li>'+
                    '</div>'+
                '</div>'+                                       
                '<button type="submit" id="filterButton">Filter</button>'+
            '</form>'+
        '</section>'+
        '<section class="info-boxes">'+
            '<div class="info-box">'+
                '<div class="info-icon"><i class="fa-solid fa-dollar-sign"></i></div>'+
                '<div class="info-content">'+
                    '<div class="info-title">Total Revenue</div>'+
                    '<div class="info-value" id="totalRevenue">$</div>'+
                '</div>'+
            '</div>'+
            '<div class="info-box">'+
                '<div class="info-icon"><i class="fa-solid fa-cart-shopping"></i></div>'+
                '<div class="info-content">'+
                    '<div class="info-title">Total Transactions</div>'+
                    '<div class="info-value" id="totalTransactions"></div>'+
                '</div>'+
            '</div>'+
            '<div class="info-box">'+
                '<div class="info-icon"><i class="fa-solid fa-mug-hot"></i></div>'+
                '<div class="info-content">'+
                    '<div class="info-title">Total Products</div>'+
                    '<div class="info-value" id="totalProducts"></div>'+
                '</div>'+
            '</div>'+
            '<div class="info-box">'+
                '<div class="info-icon"><i class="fa-solid fa-store"></i></div>'+
                '<div class="info-content">'+
                    '<div class="info-title">Stores</div>'+
                    '<div class="info-value" id="totalStores"></div>'+
                '</div>'+
            '</div>'+
        '</section>'