document.addEventListener("DOMContentLoaded", function () {
  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("scroll", checkScrollTop);

  document.addEventListener("click", function(event) {
    const nav = document.getElementById("mainNav");
    const burger = document.getElementById("burgerBtn");
    if (nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        event.target !== burger) {
      nav.classList.remove("open");
    }
  });

  const modalOverlay = document.getElementById("detailsModal");
  const modal = document.querySelector(".modal");
  const closeButton = document.querySelector(".close-modal");
  modalOverlay.addEventListener("click", function(event) {
    if (event.target === modalOverlay) closeDetailsModal();
  });
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      closeDetailsModal();
      closeBookingModal();
    }
  });
  if (closeButton) {
    closeButton.addEventListener("click", closeDetailsModal);
  }

  let touchStartY = 0, touchEndY = 0;
  if (modal) {
    modal.addEventListener("touchstart", (e) => {
      touchStartY = e.changedTouches[0].screenY;
    });
    modal.addEventListener("touchend", (e) => {
      touchEndY = e.changedTouches[0].screenY;
      if (touchEndY > touchStartY + 50) closeDetailsModal();
    });
  }

  let carouselTouchStartX = 0, carouselTouchEndX = 0;
  const carouselImageElem = document.getElementById("carouselImage");
  if (carouselImageElem) {
    carouselImageElem.addEventListener("touchstart", (e) => {
      carouselTouchStartX = e.changedTouches[0].screenX;
    });
    carouselImageElem.addEventListener("touchend", (e) => {
      carouselTouchEndX = e.changedTouches[0].screenX;
      handleCarouselSwipe();
    });
    carouselImageElem.addEventListener("click", nextImage);
  }
  function handleCarouselSwipe() {
    const diff = carouselTouchStartX - carouselTouchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function revealOnScroll() {
  const revealElems = document.querySelectorAll(".fade-up, .slide-up, .scale-in, .fade-in");
  const windowHeight = window.innerHeight;
  revealElems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight - 100) {
      el.classList.add("show");
    }
  });
}

function checkScrollTop() {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    if (window.scrollY > 300) {
      scrollTopBtn.style.opacity = "1";
      scrollTopBtn.style.pointerEvents = "auto";
    } else {
      scrollTopBtn.style.opacity = "0";
      scrollTopBtn.style.pointerEvents = "none";
    }
  }
}

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
  }
}
const menuLinks = document.querySelectorAll("#mainNav ul li a");
menuLinks.forEach(link => {
  link.addEventListener("click", function () {
    document.getElementById("mainNav").classList.remove("open");
  });
});
function toggleBurgerMenu() {
  const nav = document.getElementById("mainNav");
  nav.classList.toggle("open");
}

let currentImages = [];
let currentImageIndex = 0;
let currentTitle = "";
let currentInfo = "";

function openDetailsModal(title, info, images = []) {
  currentTitle = title;
  currentInfo = info;
  currentImages = images || [];
  currentImageIndex = 0;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalInfo").textContent = info;
  
  // Если изображения переданы, отображаем первое
  if (currentImages.length > 0) {
    showImage(0);
  }
  
  const modalBookingBtn = document.getElementById("modalBookingActionBtn");
  if (modalBookingBtn) {
    modalBookingBtn.textContent = "Забронировать";
    modalBookingBtn.onclick = function() {
      closeDetailsModal();
      openBookingModal(currentTitle);
    };
  }
  document.getElementById("detailsModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeDetailsModal() {
  document.getElementById("detailsModal").classList.remove("show");
  document.body.style.overflow = "";
}

function showImage(index) {
  if (index < 0) index = currentImages.length - 1;
  if (index >= currentImages.length) index = 0;
  currentImageIndex = index;
  const modalImageElem = document.getElementById("modalImage");
  if (modalImageElem) {
    modalImageElem.src = currentImages[currentImageIndex];
  }
  updateCarouselDots();
}

function nextImage() {
  showImage(currentImageIndex + 1);
}

function prevImage() {
  showImage(currentImageIndex - 1);
}

function updateCarouselDots() {
  const dotsContainer = document.getElementById("carouselDots");
  if (!dotsContainer) return;
  dotsContainer.innerHTML = "";
  for (let i = 0; i < currentImages.length; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === currentImageIndex) {
      dot.classList.add("active");
    }
    dot.addEventListener("click", function() {
      showImage(i);
    });
    dotsContainer.appendChild(dot);
  }
}

function openBookingModal(preselectedTour) {
  if (preselectedTour) {
    document.getElementById("tourSelect").value = preselectedTour;
  } else {
    document.getElementById("tourSelect").value = "";
  }
  document.getElementById("bookingModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeBookingModal() {
  document.getElementById("bookingModal").classList.remove("show");
  document.body.style.overflow = "";
}

function bookingOverlayClick(e) {
  const overlay = document.getElementById("bookingModal");
  if (e.target === overlay) {
    closeBookingModal();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const minusBtn = document.querySelector(".people-minus");
  const plusBtn = document.querySelector(".people-plus");
  const inputField = document.getElementById("peopleCount");

  minusBtn.addEventListener("click", function () {
    let currentValue = parseInt(inputField.value);
    if (currentValue > 1) {
      inputField.value = currentValue - 1;
    }
  });

  plusBtn.addEventListener("click", function () {
    let currentValue = parseInt(inputField.value);
    if (currentValue < 10) {
      inputField.value = currentValue + 1;
    }
  });

  inputField.addEventListener("input", function () {
    let value = parseInt(inputField.value);
    if (isNaN(value) || value < 1) {
      inputField.value = 1;
    } else if (value > 10) {
      inputField.value = 10;
    }
  });
});

function submitBookingForm(e) {
  e.preventDefault();
  const tour = document.getElementById("tourSelect").value;
  const date = document.getElementById("bookingDateField").value;
  const time = document.getElementById("bookingTimeField").value;
  const name = document.getElementById("bookingNameField").value;
  const phone = document.getElementById("bookingPhoneField").value;
  const people = document.getElementById("peopleCount").value;
  
  alert(
    "Заявка отправлена!\n\n" +
    "Экскурсия: " + tour + "\n" +
    "Дата: " + date + "\n" +
    "Время: " + time + "\n" +
    "Имя: " + name + "\n" +
    "Телефон: " + phone + "\n" +
    "Кол-во человек: " + people
  );
  closeBookingModal();
}

const bookingForm = document.querySelector("#bookingModal form");
if (bookingForm) {
  bookingForm.addEventListener("submit", submitBookingForm);
}

function openBookingModalFromTour(tourName) {
  const modal = document.getElementById("bookingModal");
  const tourSelect = document.getElementById("tourSelect");
  if (modal && tourSelect) {
    modal.classList.add("show");
    tourSelect.value = tourName;
  }
}