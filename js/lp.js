document.addEventListener("DOMContentLoaded", function () {
  const menuBar = document.getElementById("menu-bar");
  const navbar = document.querySelector("nav ul");

  if (menuBar) {
    menuBar.addEventListener("click", function () {
      navbar.classList.toggle("show");
    });
  }

  const track = document.querySelector(".carousel-track");

  if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector(".right-button");
    const prevButton = document.querySelector(".left-button");
    const slideWidth = slides[0].getBoundingClientRect().width;

    const setSlidePosition = (slide, index) => {
      slide.style.left = slideWidth * index + "px";
    };
    slides.forEach(setSlidePosition);

    const moveToSlide = (track, currentSlide, targetSlide) => {
      track.style.transform = "translateX(-" + targetSlide.style.left + ")";
      currentSlide.classList.remove("current-slide");
      targetSlide.classList.add("current-slide");
    };

    if (nextButton) {
      nextButton.addEventListener("click", (e) => {
        const currentSlide = track.querySelector(".current-slide") || slides[0];
        const nextSlide = currentSlide.nextElementSibling || slides[0];
        moveToSlide(track, currentSlide, nextSlide);
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", (e) => {
        const currentSlide = track.querySelector(".current-slide") || slides[0];
        const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
        moveToSlide(track, currentSlide, prevSlide);
      });
    }

    const startAutoSlide = () => {
      return setInterval(() => {
        const currentSlide = track.querySelector(".current-slide") || slides[0];
        const nextSlide = currentSlide.nextElementSibling || slides[0];
        moveToSlide(track, currentSlide, nextSlide);
      }, 4000);
    };

    let autoSlideInterval = startAutoSlide();

    track.addEventListener("mouseenter", () => {
      clearInterval(autoSlideInterval);
    });

    track.addEventListener("mouseleave", () => {
      autoSlideInterval = startAutoSlide();
    });
  }

  // Load JSON data
  fetch("./json/data.json") // Adjust the path to your JSON file
    .then((response) => response.json())
    .then((data) => {
      const transactions = data;

      // Unique store locations
      const uniqStore = new Set(transactions.map((transaction) => transaction.store_location));
      let displayedLoc = 3;
      displayLocations(transactions, uniqStore, displayedLoc);

      // Unique product categories
      const uniqueCategories = new Set(transactions.map((transaction) => transaction.product_category));
      let displayedProducts = 9;
      displayProducts(transactions, uniqueCategories, displayedProducts);

      // Event listener for Learn More button
      const learnMoreButton = document.querySelector(".home .btn");
      if (learnMoreButton) {
        learnMoreButton.addEventListener("click", function (event) {
          event.preventDefault();
          displayedLoc = uniqStore.size; // Show all locations
          const LocationContainer = document.getElementById("location-container");
          LocationContainer.innerHTML = ""; // Clear existing locations
          displayLocations(transactions, uniqStore, displayedLoc);
        });
      }

      // Event listener for Discover More button
      const discoverMoreButton = document.querySelector(".home .btn");
      if (discoverMoreButton) {
        discoverMoreButton.addEventListener("click", function (event) {
          event.preventDefault();
          displayedProducts = uniqueCategories.size; // Show all products
          const productContainer = document.getElementById("product-container");
          productContainer.innerHTML = ""; // Clear existing products
          displayProducts(transactions, uniqueCategories, displayedProducts);
        });
      }
    })
    .catch((error) => {
      console.error("Error loading JSON data:", error);
    });

  function displayLocations(transactions, uniqStore, displayedLoc) {
    const LocationContainer = document.getElementById("location-container");
    let counter = 0;
    uniqStore.forEach((category) => {
      if (counter < displayedLoc) {
        const transaction = transactions.find((trans) => trans.store_location === category);
        if (transaction) {
          const LocationBox = document.createElement("div");
          LocationBox.classList.add("location-box");

          const StoreBox = document.createElement("div");
          StoreBox.classList.add("store-box");

          const LocationTitle = document.createElement("h2");
          LocationTitle.textContent = category;
          const LocationImage = document.createElement("img");
          LocationImage.src = "./assets/img/loc/" + transaction.store_location + ".jpg";
          LocationImage.alt = category;
          const LocationDescription = document.createElement("p");
          LocationDescription.textContent = transaction.product_detail;
          const LocationButton = document.createElement("a");
          LocationButton.href = "#";
          LocationButton.classList.add("btn");
          LocationButton.textContent = "Learn More";

          LocationBox.appendChild(LocationTitle);
          LocationBox.appendChild(LocationDescription);
          LocationBox.appendChild(LocationButton);
          StoreBox.appendChild(LocationImage);
          StoreBox.appendChild(LocationBox);
          LocationContainer.appendChild(StoreBox);

          counter++;
        }
      }
    });
  }

  function displayProducts(transactions, uniqueCategories, displayedProducts) {
    const productContainer = document.getElementById("product-container");
    let counter = 0;
    uniqueCategories.forEach((category) => {
      if (counter < displayedProducts) {
        const transaction = transactions.find((trans) => trans.product_category === category);
        if (transaction) {
          const productBox = document.createElement("div");
          productBox.classList.add("product-box");
          const productTitle = document.createElement("h2");
          productTitle.textContent = category;
          const productImage = document.createElement("img");
          productImage.src = "./assets/img/products/" + transaction.product_category + ".jpg";
          productImage.alt = category;
          const productDescription = document.createElement("p");
          productDescription.textContent = transaction.product_detail;
          const productButton = document.createElement("a");
          productButton.href = "#";
          productButton.classList.add("btn");
          productButton.textContent = "Learn More";
          productBox.appendChild(productTitle);
          productBox.appendChild(productImage);
          productBox.appendChild(productDescription);
          productBox.appendChild(productButton);
          productContainer.appendChild(productBox);
          counter++;
        }
      }
    });
  }
});