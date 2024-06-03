document.addEventListener('DOMContentLoaded', function() {
    const menuBar = document.getElementById('menu-bar');
    const navbar = document.querySelector('nav ul');
    if (menuBar) {
        menuBar.addEventListener('click', function() {
            navbar.classList.toggle('show');
        });
    }

    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.right-button');
        const prevButton = document.querySelector('.left-button');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        if (nextButton) {
            nextButton.addEventListener('click', e => {
                const currentSlide = track.querySelector('.current-slide') || slides[0];
                const nextSlide = currentSlide.nextElementSibling || slides[0];
                moveToSlide(track, currentSlide, nextSlide);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', e => {
                const currentSlide = track.querySelector('.current-slide') || slides[0];
                const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
                moveToSlide(track, currentSlide, prevSlide);
            });
        }

        const startAutoSlide = () => {
            return setInterval(() => {
                const currentSlide = track.querySelector('.current-slide') || slides[0];
                const nextSlide = currentSlide.nextElementSibling || slides[0];
                moveToSlide(track, currentSlide, nextSlide);
            }, 3000);
        };

        let autoSlideInterval = startAutoSlide();
        track.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        track.addEventListener('mouseleave', () => {
            autoSlideInterval = startAutoSlide();
        });
    }

    const LocationContainer = document.getElementById('location-container');
    const uniqStore = new Set();
    transactions.forEach(transaction => {
        uniqStore.add(transaction.store_location);
    });
    
    let displayedLoc = 3;
    const displayLoc = () => {
        let counter = 0;
        uniqStore.forEach(category => {
            if (counter < displayedLoc) {
                const transaction = transactions.find(trans => trans.store_location === category);
                const LocationBox = document.createElement('div');
                LocationBox.classList.add('location-box');
                
                const StoreBox = document.createElement('div');
                StoreBox.classList.add('store-box');
    
                const LocationTitle = document.createElement('h2');
                LocationTitle.textContent = category;
                const LocationImage = document.createElement('img');
                LocationImage.src = './assets/img/loc/' + transaction.store_location + '.jpg';
                LocationImage.alt = category;
                const LocationDescription = document.createElement('p');
                LocationDescription.textContent = transaction.product_detail;
                const LocationButton = document.createElement('a');
                LocationButton.href = '#';
                LocationButton.classList.add('btn');
                LocationButton.textContent = 'Learn More';
    
                LocationBox.appendChild(LocationTitle);
                LocationBox.appendChild(LocationDescription);
                LocationBox.appendChild(LocationButton);
                StoreBox.appendChild(LocationImage);
                StoreBox.appendChild(LocationBox);
                LocationContainer.appendChild(StoreBox);
                
                counter++;
            }
        });
    };
    
    displayLoc();    

    const LearnMoreButton = document.querySelector('.home .btn');
    if (LearnMoreButton) {
        LearnMoreButton.addEventListener('click', function(event) {
            event.preventDefault();
            displayedLoc = uniqStore.size; // Show all products
            LocationContainer.innerHTML = ''; // Clear existing products
            displayLoc();
        });
    }
        // Dynamically load distinct product categories
        const productContainer = document.getElementById('product-container');
        const uniqueCategories = new Set();
        transactions.forEach(transaction => {
            uniqueCategories.add(transaction.product_category);
        });
    
        let displayedProducts = 9;
        const displayProducts = () => {
            let counter = 0;
            uniqueCategories.forEach(category => {
                if (counter < displayedProducts) {
                    const transaction = transactions.find(trans => trans.product_category === category);
                    const productBox = document.createElement('div');
                    productBox.classList.add('product-box');
                    const productTitle = document.createElement('h2');
                    productTitle.textContent = category;
                    const productImage = document.createElement('img');
                    productImage.src = './assets/img/products/' + transaction.product_category + '.jpg'; // Assuming images are named by product_id
                    productImage.alt = category;
                    const productDescription = document.createElement('p');
                    productDescription.textContent = transaction.product_detail;
                    const productButton = document.createElement('a');
                    productButton.href = '#';
                    productButton.classList.add('btn');
                    productButton.textContent = 'Learn More';
                    productBox.appendChild(productTitle);
                    productBox.appendChild(productImage);
                    productBox.appendChild(productDescription);
                    productBox.appendChild(productButton);
                    productContainer.appendChild(productBox);
                    counter++;
                }
            });
        };
    
        displayProducts();
    
        const discoverMoreButton = document.querySelector('.home .btn');
        if (discoverMoreButton) {
            discoverMoreButton.addEventListener('click', function(event) {
                event.preventDefault();
                displayedProducts = uniqueCategories.size; // Show all products
                productContainer.innerHTML = ''; // Clear existing products
                displayProducts();
            });
        }
});