// Main Application Controller
class DarazApp {
  constructor() {
    this.cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    this.products = []; // Would be populated from API in real app
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.setupCart();
      this.setupSearch();
      this.setupTimer();
      this.setupCategories();
      this.setupMobileMenu();
      this.setupEventDelegation();
      this.updateCartCount();
    });
  }

  // Cart Management System
  setupCart() {
    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".add-to-cart")) {
        this.addToCart(e.target.closest(".product-card"));
      } else if (e.target.closest(".cart-icon")) {
        this.showCartPreview();
      }
    });
  }

  addToCart(productCard) {
    const productId = productCard.dataset.id || Date.now().toString();
    const productName = productCard.querySelector(".product-title").textContent;
    const productPrice =
      productCard.querySelector(".current-price").textContent;
    const productImage = productCard.querySelector("img").src;

    const existingItem = this.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
      });
    }

    this.updateCartCount();
    this.showToast(`${productName} added to cart`);
    this.saveCart();
  }

  updateCartCount() {
    const totalItems = this.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    document.querySelector(".cart-count").textContent = totalItems;
  }

  saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
  }

  // Search Functionality with Debounce
  setupSearch() {
    const searchInput = document.querySelector(".search-box input");
    const searchButton = document.querySelector(".search-box button");
    const productCards = document.querySelectorAll(".product-card");

    const filterProducts = (query) => {
      query = query.toLowerCase().trim();
      let hasResults = false;

      productCards.forEach((card) => {
        const title = card
          .querySelector(".product-title")
          .textContent.toLowerCase();
        const matches = title.includes(query);
        card.style.display = matches ? "block" : "none";
        if (matches) hasResults = true;
      });

      if (!hasResults && query) {
        this.showToast("No products found matching your search");
      }
    };

    // Debounce search input
    const debounce = (func, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    };

    const debouncedSearch = debounce(filterProducts, 300);

    searchInput.addEventListener("input", () =>
      debouncedSearch(searchInput.value)
    );
    searchButton.addEventListener("click", () =>
      filterProducts(searchInput.value)
    );
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") filterProducts(searchInput.value);
    });
  }

  // Flash Sale Timer with End Callback
  setupTimer() {
    const timerSpans = document.querySelectorAll(".timer span");
    let timeLeft = 12 * 3600 + 34 * 60; // 12 hours, 34 minutes in seconds

    const updateTimer = () => {
      if (timeLeft <= 0) {
        timerSpans[0].textContent = "00";
        timerSpans[1].textContent = "00";
        timerSpans[2].textContent = "00";
        document.querySelector(".section-title").textContent =
          "Flash Sale Ended";
        return;
      }

      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;

      timerSpans[0].textContent = String(hours).padStart(2, "0");
      timerSpans[1].textContent = String(minutes).padStart(2, "0");
      timerSpans[2].textContent = String(seconds).padStart(2, "0");

      timeLeft--;
    };

    setInterval(updateTimer, 1000);
    updateTimer(); // Initial call
  }

  // Category Filtering
  setupCategories() {
    const categoryCards = document.querySelectorAll(".category-card");

    categoryCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const category = card.querySelector("span").textContent;
        this.filterByCategory(category);
      });
    });
  }

  filterByCategory(category) {
    // In a real app, this would make an API call or filter local data
    this.showToast(`Filtering by: ${category}`);
  }

  // Responsive Mobile Menu
  setupMobileMenu() {
    const menuToggle = document.createElement("div");
    menuToggle.className = "menu-toggle";
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector(".nav-container").prepend(menuToggle);

    const toggleMenu = () => {
      document.body.classList.toggle("menu-open");
    };

    menuToggle.addEventListener("click", toggleMenu);

    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        document.body.classList.remove("menu-open");
      }
    });
  }

  // Event Delegation for Dynamic Elements
  setupEventDelegation() {
    document.body.addEventListener("click", (e) => {
      // Handle all click events in one place
      if (e.target.closest(".wishlist-btn")) {
        this.toggleWishlist(e.target.closest(".product-card"));
      }
      // Add more delegated events as needed
    });
  }

  toggleWishlist(productCard) {
    const wishlistIcon = productCard.querySelector(".fa-heart");
    wishlistIcon.classList.toggle("far");
    wishlistIcon.classList.toggle("fas");
    this.showToast(
      wishlistIcon.classList.contains("fas")
        ? "Added to wishlist"
        : "Removed from wishlist"
    );
  }

  // UI Helpers
  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }, 100);
  }

  showCartPreview() {
    // In a real app, this would show a modal with cart items
    if (this.cartItems.length === 0) {
      this.showToast("Your cart is empty");
    } else {
      this.showToast(`${this.cartItems.length} items in your cart`);
    }
  }
}

// Initialize the application
new DarazApp();
