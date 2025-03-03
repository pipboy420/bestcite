/* Кнопка "Вверх" */
window.addEventListener('scroll', checkScrollTop);
function checkScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = 'flex';
  } else {
    scrollTopBtn.style.display = 'none';
  }
}
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* Бургер-меню */
function toggleBurgerMenu() {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('open');
}

/* Анимации при прокрутке */
window.addEventListener('scroll', revealOnScroll);
function revealOnScroll() {
  const revealElems = document.querySelectorAll('.fade-up, .fade-in, .slide-up, .scale-in');
  const windowHeight = window.innerHeight;
  revealElems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight - 100) {
      el.classList.add('show');
    }
  });
}
revealOnScroll();

/* Прокрутка к блоку */
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    window.scrollTo({
      top: el.offsetTop - 60,
      behavior: "smooth"
    });
  }
}

/* Закрытие модалки при клике вне неё */
function overlayClick(e) {
  const overlay = document.getElementById('detailsModal');
  if (e.target === overlay) {
    closeDetailsModal();
  }
}

/* КАРУСЕЛЬ */
let currentImages = [];
let currentImageIndex = 0;
let currentTitle = '';
let currentInfo = '';

function openDetailsModal(title, info, images) {
  currentTitle = title;
  currentInfo = info;
  currentImages = images || [];
  currentImageIndex = 0;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalInfo').textContent = info;
  if (!images || images.length === 0) {
    document.getElementById('carouselContainer').style.display = 'none';
  } else {
    document.getElementById('carouselContainer').style.display = 'block';
    showImage(0);
  }
  resetFormFields();
  document.getElementById('detailsModal').classList.add('show');
}

function closeDetailsModal() {
  document.getElementById('detailsModal').classList.remove('show');
}

function showImage(index) {
  if (index < 0) index = currentImages.length - 1;
  if (index >= currentImages.length) index = 0;
  currentImageIndex = index;
  const imageElem = document.getElementById('carouselImage');
  imageElem.src = currentImages[currentImageIndex];
}

function nextImage() {
  showImage(currentImageIndex + 1);
}
function prevImage() {
  showImage(currentImageIndex - 1);
}

const carouselImage = document.getElementById('carouselImage');
if (carouselImage) {
  carouselImage.addEventListener('click', () => {
    nextImage();
  });
}

/* ФОРМА БРОНИРОВАНИЯ */
function resetFormFields() {
  // Для нативного date input достаточно сбросить значение
  document.getElementById('dateField').value = '';
  document.getElementById('timeField').value = '12:00';
  document.getElementById('nameField').value = '';
  document.getElementById('phoneField').value = '';
  document.getElementById('peopleField').value = '1';
  const buttons = document.querySelectorAll('.people-buttons button');
  buttons.forEach((btn, index) => {
    btn.classList.remove('active');
    if (index === 0) {
      btn.classList.add('active');
    }
  });
}

function selectPeople(value) {
  document.getElementById('peopleField').value = value;
  const buttons = document.querySelectorAll('.people-buttons button');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === String(value)) {
      btn.classList.add('active');
    }
  });
}

function submitForm(e) {
  e.preventDefault();
  alert(
    'Заявка отправлена!\n\n' + 
    'Экскурсия: ' + currentTitle + '\n' +
    'Дата: ' + document.getElementById('dateField').value + '\n' +
    'Время: ' + document.getElementById('timeField').value + '\n' +
    'Имя: ' + document.getElementById('nameField').value + '\n' +
    'Телефон: ' + document.getElementById('phoneField').value + '\n' +
    'Кол-во человек: ' + document.getElementById('peopleField').value
  );
  closeDetailsModal();
}

document.addEventListener("DOMContentLoaded", function () {
  const modalOverlay = document.getElementById("detailsModal");
  const modal = document.querySelector(".modal");
  const closeButton = document.querySelector(".close-modal");
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) closeDetailsModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDetailsModal();
  });
  if (closeButton) {
    closeButton.addEventListener("click", closeDetailsModal);
  }
  let touchStartY = 0;
  let touchEndY = 0;
  if (modal) {
    modal.addEventListener("touchstart", (e) => {
      touchStartY = e.changedTouches[0].screenY;
    });
    modal.addEventListener("touchend", (e) => {
      touchEndY = e.changedTouches[0].screenY;
      if (touchEndY > touchStartY + 50) closeDetailsModal();
    });
  }
});