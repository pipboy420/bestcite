// Функция переключения бургер-меню
function toggleBurgerMenu(event) {
  event.preventDefault();
  event.stopPropagation();
  const nav = document.getElementById("mainNav");
  nav.classList.toggle("open");
}

// Прокрутка наверх
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Прокрутка к секции
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
  }
}

// Фокус в модальном окне (перехват Tab)
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}

/* ===== ЦЕНЫ ДЛЯ ЭКСКУРСИЙ ===== */
const tourPrices = {
  "Речная прогулка по каналам": { group: 1500, individual: 2000 },
  "Ночной развод мостов": { group: 2000, individual: 2500 },
  "Дворцовый Петербург": { group: 1800, individual: 2300 }
};

// Функция обновления итоговой цены в форме бронирования
function updateTotalPrice() {
  const tourSelect = document.getElementById('bookingTourSelect');
  const typeSelect = document.getElementById('bookingTypeSelect');
  const adultCount = parseInt(document.getElementById('adultCount').innerText);
  const childCount = parseInt(document.getElementById('childCount').innerText);
  let priceAdult = 0;
  let priceChild = 0;
  const selectedTour = tourSelect.value;
  const selectedType = typeSelect.value;
  if (selectedTour && tourPrices[selectedTour]) {
    const prices = tourPrices[selectedTour];
    if (selectedType === "Групповая") {
      priceAdult = prices.group;
      priceChild = Math.round(prices.group * 0.67);
    } else if (selectedType === "Индивидуальная") {
      priceAdult = prices.individual;
      priceChild = Math.round(prices.individual * 0.67);
    }
  }
  const totalPrice = (adultCount * priceAdult) + (childCount * priceChild);
  document.getElementById('totalPrice').innerText = totalPrice;
}

// Функции для изменения количества участников
function increaseCount(id) {
  let countElement = document.getElementById(id);
  let count = parseInt(countElement.innerText);
  countElement.innerText = count + 1;
  updateTotalPrice();
}

function decreaseCount(id) {
  let countElement = document.getElementById(id);
  let count = parseInt(countElement.innerText);
  if (count > 0) {
    countElement.innerText = count - 1;
    updateTotalPrice();
  }
}

// Функции для боковой панели бронирования
function openBookingSidebar(preselectedTour = "") {
  const sidebar = document.getElementById("bookingSidebar");
  let backdrop = document.querySelector(".sidebar-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.classList.add("sidebar-backdrop");
    document.body.appendChild(backdrop);
    backdrop.addEventListener("click", closeBookingSidebar);
  }
  if (sidebar) {
    sidebar.classList.add("open");
  }
  backdrop.classList.add("show");
  document.body.style.overflow = "hidden";
  const tourSelect = document.getElementById("bookingTourSelect");
  if (tourSelect && preselectedTour) {
    tourSelect.value = preselectedTour;
  }
  updateTotalPrice();
}

function closeBookingSidebar() {
  const sidebar = document.getElementById("bookingSidebar");
  const backdrop = document.querySelector(".sidebar-backdrop");
  if (sidebar) {
    sidebar.classList.remove("open");
  }
  if (backdrop) {
    backdrop.classList.remove("show");
  }
  document.body.style.overflow = "";
}

/* ===== МОДАЛЬНОЕ ОКНО С ДЕТАЛЯМИ ЭКСКУРСИИ ===== */
let lastFocusedElementModal;
let currentImages = [];
let currentImageIndex = 0;
let currentTitle = "";
let currentInfo = "";

function openDetailsModal(title, info, images = []) {
  lastFocusedElementModal = document.activeElement;
  currentTitle = title;
  currentInfo = info;
  currentImages = images || [];
  currentImageIndex = 0;
  
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalInfo").textContent = info;
  
  if (currentImages.length > 0) {
    showImage(0);
  }
  
  const modalBookingBtn = document.getElementById("modalBookingActionBtn");
  if (modalBookingBtn) {
    modalBookingBtn.textContent = "Забронировать";
    modalBookingBtn.onclick = function() {
      closeDetailsModal();
      openBookingSidebar(title);
    };
  }
  
  const detailsModal = document.getElementById("detailsModal");
  detailsModal.classList.add("show");
  document.body.style.overflow = "hidden";
  
  document.getElementById("modalTitle").focus();
  trapFocus(detailsModal);
  
  // Если мобильная версия, показываем внешнюю кнопку "Забронировать"
  if (window.innerWidth < 768) {
    const mobileBtn = document.getElementById("mobileBookingBtnContainer");
    if (mobileBtn) mobileBtn.style.display = "block";
  }
  
  // Сброс трансформаций для корректной работы свайпа
  const modalElement = document.getElementById("modalContent");
  modalElement.style.transform = 'translateY(0)';
  modalElement.style.transition = '';
}

function closeDetailsModal() {
  const detailsModal = document.getElementById("detailsModal");
  detailsModal.classList.remove("show");
  document.body.style.overflow = "";
  // Сброс трансформаций
  const modalElement = document.getElementById("modalContent");
  modalElement.style.transform = '';
  modalElement.style.transition = '';
  
  if (lastFocusedElementModal) {
    lastFocusedElementModal.focus();
  }
  // Если мобильная версия, скрываем внешнюю кнопку "Забронировать"
  if (window.innerWidth < 768) {
    const mobileBtn = document.getElementById("mobileBookingBtnContainer");
    if (mobileBtn) mobileBtn.style.display = "none";
  }
}

// Закрытие модального окна при клике вне содержимого
document.getElementById("detailsModal").addEventListener("click", function(e) {
  if (!e.target.closest(".modal-content-wrapper")) {
    closeDetailsModal();
  }
});

/* ===== Свайп для закрытия модального окна в мобильной версии ===== */
let touchStartY = 0;
const modalElement = document.getElementById("modalContent");

modalElement.addEventListener('touchstart', function(e) {
  touchStartY = e.changedTouches[0].screenY;
  modalElement.style.transition = ''; // отключаем анимацию для реального перемещения
});

modalElement.addEventListener('touchmove', function(e) {
  let currentY = e.changedTouches[0].screenY;
  let deltaY = currentY - touchStartY;
  if (deltaY > 0) {
    modalElement.style.transform = `translateY(${deltaY}px)`;
  }
});

modalElement.addEventListener('touchend', function(e) {
  let finalDelta = e.changedTouches[0].screenY - touchStartY;
  if (finalDelta > 100) { // если свайп достаточно длинный, закрываем окно
    modalElement.style.transition = 'transform 0.3s ease';
    modalElement.style.transform = `translateY(100%)`;
    setTimeout(() => {
      closeDetailsModal();
    }, 300);
  } else {
    modalElement.style.transition = 'transform 0.3s ease';
    modalElement.style.transform = 'translateY(0)';
    setTimeout(() => {
      modalElement.style.transition = '';
    }, 300);
  }
});

/* ===== КАРУСЕЛЬ ИЗОБРАЖЕНИЙ ===== */
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

/* ===== ОТПРАВКА ФОРМЫ ===== */
function submitBookingForm(event) {
  event.preventDefault();
  
  let tour = document.getElementById('bookingTourSelect').value;
  let type = document.getElementById('bookingTypeSelect').value;
  let time = document.getElementById('bookingTimeSelect').value;
  let date = document.getElementById('bookingDateField').value;
  let adultCount = document.getElementById('adultCount').innerText;
  let childCount = document.getElementById('childCount').innerText;
  let name = document.getElementById('bookingNameField').value;
  let phone = document.getElementById('bookingPhoneField').value;
  let comment = document.getElementById('bookingComment').value;

  let bookingData = {
    tour,
    type,
    time,
    date,
    adultCount,
    childCount,
    name,
    phone,
    comment
  };

  console.log("Отправка данных на сервер:", bookingData);
  alert("Спасибо! Ваша заявка отправлена.");
}

/* ===== ИНИЦИАЛИЗАЦИЯ ===== */
document.addEventListener("DOMContentLoaded", function () {
  // Intersection observer для анимаций
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll(".fade-up, .slide-up, .scale-in, .fade-in").forEach(el => {
    observer.observe(el);
  });

  window.addEventListener("scroll", function() {
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
  });

  document.getElementById('bookingTourSelect').addEventListener('change', updateTotalPrice);
  document.getElementById('bookingTypeSelect').addEventListener('change', updateTotalPrice);

  // Инициализация FAQ-аккордеона
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      answer.classList.toggle("open", !expanded);
    });
  });

  // Предотвращаем закрытие модального окна при клике внутрь контента
  document.querySelectorAll(".modal .modal-content-wrapper").forEach(el => {
    el.addEventListener("click", function(e) {
      e.stopPropagation();
    });
  });

  // Настройка размеров модального окна при изменении размера окна
  const modal = document.getElementById("detailsModal");
  window.addEventListener("resize", function () {
    if (window.innerWidth < 768) {
      modal.style.width = "100vw";
      modal.style.height = "calc(100vh - 70px)";
      modal.style.maxHeight = "calc(100vh - 70px)";
    } else {
      modal.style.width = "50vw";
      modal.style.height = "auto";
    }
  });

  // Глобальный обработчик клика для закрытия бургер-меню,
  // если клик вне области меню и кнопки
  const burgerBtn = document.getElementById("burgerBtn");
  const mainNav = document.getElementById("mainNav");
  document.addEventListener("click", function(event) {
    // Если клик вне nav и бургер-кнопки – закрываем меню
    if (!event.target.closest("#mainNav") && !event.target.closest("#burgerBtn")) {
      if (mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
      }
    }
  });
});