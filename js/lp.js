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

      // Event listener for Discover More button
      const discoverMoreButton = document.querySelector(".home .btn");
      if (discoverMoreButton) {
        discoverMoreButton.addEventListener("click", function (event) {
          event.preventDefault();
          displayedLoc = uniqStore.size; // Show all locations
          const LocationContainer = document.getElementById("location-container");
          LocationContainer.innerHTML = ""; // Clear existing locations
          displayLocations(transactions, uniqStore, displayedLoc);

          // Scroll to the store section
          document.querySelector("#store").scrollIntoView({ behavior: "smooth" });
        });
      }
    });

  function displayLocations(transactions, uniqStore, displayedLoc) {
    const LocationContainer = document.getElementById("location-container");
    let counter = 0;
    uniqStore.forEach((store) => {
      if (counter < displayedLoc) {
        const transaction = transactions.find((transactions) => transactions.store_location === store);
        if (transaction) {

          const StoreBox = document.createElement("div");
          StoreBox.classList.add("store-box");

          const LocationTitle = document.createElement("h2");
          LocationTitle.textContent = store;
          const LocationImage = document.createElement("img");
          LocationImage.src = "./assets/img/loc/" + transaction.store_location + ".jpg";
          LocationImage.alt = store;

          const locationDescriptions = {
            "Hell's Kitchen": "Cozy retreat with chic decor, diverse drinks, snacks, free Wi-Fi.",
            "Lower Manhattan": "Elegant escape with varied seating, specialty coffee, Wi-Fi, meeting rooms.",
            "Astoria": "Charming cafe with artistic decor, diverse menu, Wi-Fi, cozy atmosphere.",
          };

          const LocationDescription = document.createElement("p");
          LocationDescription.textContent = locationDescriptions[store];

          const LocationButton = document.createElement("a");
          LocationButton.href = "#product ";
          LocationButton.classList.add("btn");
          LocationButton.textContent = "Learn More";

          StoreBox.appendChild(LocationTitle);
          StoreBox.appendChild(LocationDescription);
          StoreBox.appendChild(LocationButton);
          StoreBox.appendChild(LocationImage);
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
          productButton.href = "#home";
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

  const savedData = localStorage.getItem('formData');
  if (savedData) {
      const formData = JSON.parse(savedData);
      const imgElement = document.getElementById('img-promo')
      if(imgElement){
        imgElement.src = `./../assets/img/promo/${formData.highCategory}-${formData.lowCategory}.jpg`
      } else{
        console.error('Element with ID "myImage" not found.');
      }
  }
});
