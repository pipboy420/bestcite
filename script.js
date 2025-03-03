document.addEventListener("DOMContentLoaded", function () {
  // Первоначальный запуск анимаций и установка обработчиков скролла
  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("scroll", checkScrollTop);

  // Закрытие бургер-меню при клике вне его
  document.addEventListener("click", function(event) {
    const nav = document.getElementById("mainNav");
    const burger = document.getElementById("burgerBtn");
    if (nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        event.target !== burger) {
      nav.classList.remove("open");
    }
  });

  // Закрытие модального окна при клике вне его и при нажатии Escape
  const modalOverlay = document.getElementById("detailsModal");
  const modal = document.querySelector(".modal");
  const closeButton = document.querySelector(".close-modal");
  modalOverlay.addEventListener("click", function(event) {
    if (event.target === modalOverlay) closeDetailsModal();
  });
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") closeDetailsModal();
  });
  if (closeButton) {
    closeButton.addEventListener("click", closeDetailsModal);
  }

  // Обработка свайпа вниз для закрытия модалки (на мобильных)
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

  // Обработка свайпа по горизонтали для карусели
  let carouselTouchStartX = 0, carouselTouchEndX = 0;
  const carouselImageElem = document.getElementById("carouselImage");
  if (carouselImageElem) {
    // Для мобильных свайпов
    carouselImageElem.addEventListener("touchstart", (e) => {
      carouselTouchStartX = e.changedTouches[0].screenX;
    });
    carouselImageElem.addEventListener("touchend", (e) => {
      carouselTouchEndX = e.changedTouches[0].screenX;
      handleCarouselSwipe();
    });
    // Для десктопа: переключение по клику
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

// Плавный скролл вверх
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Анимация появления блоков при прокрутке
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

// Показ кнопки "Вверх" при прокрутке
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

// Прокрутка к указанной секции
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
  }
}

// Переключение бургер-меню
function toggleBurgerMenu() {
  const nav = document.getElementById("mainNav");
  nav.classList.toggle("open");
}

// --- МОДАЛЬНОЕ ОКНО и КАРУСЕЛЬ ---

let currentImages = [];
let currentImageIndex = 0;
let currentTitle = "";
let currentInfo = "";

// Открытие модального окна с данными и каруселью / bottom sheet
function openDetailsModal(title, info, images = []) {
  currentTitle = title;
  currentInfo = info;
  currentImages = images || [];
  currentImageIndex = 0;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalInfo").textContent = info;
  if (currentImages.length > 0) {
    showImage(0);
    document.getElementById("carouselContainer").style.display = "block";
  } else {
    document.getElementById("carouselContainer").style.display = "none";
  }
  resetFormFields();
  document.getElementById("detailsModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

// Закрытие модального окна
function closeDetailsModal() {
  document.getElementById("detailsModal").classList.remove("show");
  document.body.style.overflow = "";
}

// Отображение изображения в карусели и обновление точек
function showImage(index) {
  if (index < 0) index = currentImages.length - 1;
  if (index >= currentImages.length) index = 0;
  currentImageIndex = index;
  document.getElementById("carouselImage").src = currentImages[currentImageIndex];
  updateCarouselDots();
}

// Переход к следующему изображению
function nextImage() {
  showImage(currentImageIndex + 1);
}

// Переход к предыдущему изображению
function prevImage() {
  showImage(currentImageIndex - 1);
}

// Обновление индикаторов (точек) карусели
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

// Обработка формы бронирования
function resetFormFields() {
  document.getElementById("dateField").value = "";
  document.getElementById("timeField").value = "12:00";
  document.getElementById("nameField").value = "";
  document.getElementById("phoneField").value = "";
  document.getElementById("peopleField").value = "1";
  document.querySelectorAll(".people-buttons button").forEach((btn, i) => {
    if (i === 0) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function selectPeople(value) {
  document.getElementById("peopleField").value = value;
  document.querySelectorAll(".people-buttons button").forEach((btn) => {
    if (btn.textContent.trim() === String(value)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function submitForm(e) {
  e.preventDefault();
  alert(
    "Заявка отправлена!\n\n" +
    "Экскурсия: " + currentTitle + "\n" +
    "Дата: " + document.getElementById("dateField").value + "\n" +
    "Время: " + document.getElementById("timeField").value + "\n" +
    "Имя: " + document.getElementById("nameField").value + "\n" +
    "Телефон: " + document.getElementById("phoneField").value + "\n" +
    "Кол-во человек: " + document.getElementById("peopleField").value
  );
  closeDetailsModal();
}

// Привязываем отправку формы
document.querySelector("form").addEventListener("submit", submitForm);

// Функция закрытия модалки при клике по оверлею
function overlayClick(e) {
  const overlay = document.getElementById("detailsModal");
  if (e.target === overlay) {
    closeDetailsModal();
  }
}