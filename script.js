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
  // Ищем все элементы с классами fade-up, fade-in, slide-up, scale-in
  const revealElems = document.querySelectorAll('.fade-up, .fade-in, .slide-up, .scale-in');
  const windowHeight = window.innerHeight;

  revealElems.forEach(el => {
    const rect = el.getBoundingClientRect();
    // Если верх элемента выше нижней границы окна на 100px => показываем
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
  document.getElementById('detailsModal').style.display = 'flex';
}

function closeDetailsModal() {
  document.getElementById('detailsModal').style.display = 'none';
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

// Клик по изображению => следующее фото
const carouselImage = document.getElementById('carouselImage');
if (carouselImage) {
  carouselImage.addEventListener('click', () => {
    nextImage();
  });
}

/* ФОРМА БРОНИРОВАНИЯ */
function resetFormFields() {
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

/* КАСТОМНЫЙ КАЛЕНДАРЬ */
let currentCalendarDate = new Date();
let selectedDate = null;

function initCustomCalendar() {
  const calendarEl = document.getElementById('customCalendar');
  calendarEl.innerHTML = ''; 

  // Шапка
  const header = document.createElement('div');
  header.className = 'custom-calendar-header';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '<';
  prevBtn.onclick = () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    initCustomCalendar();
  };

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '>';
  nextBtn.onclick = () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    initCustomCalendar();
  };

  const title = document.createElement('div');
  const monthNames = [
    'Январь','Февраль','Март','Апрель','Май','Июнь',
    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
  ];
  title.textContent = `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;

  header.appendChild(prevBtn);
  header.appendChild(title);
  header.appendChild(nextBtn);
  calendarEl.appendChild(header);

  // Дни недели
  const daysWrapper = document.createElement('div');
  daysWrapper.className = 'custom-calendar-days';
  
  const weekdays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  weekdays.forEach(wd => {
    const wdEl = document.createElement('div');
    wdEl.className = 'custom-calendar-day weekday';
    wdEl.textContent = wd;
    daysWrapper.appendChild(wdEl);
  });

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const dayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Пн=0
  const lastDayCurrentMonth = new Date(year, month+1, 0).getDate();
  const lastDayPrevMonth = new Date(year, month, 0).getDate();

  // Пустые дни предыдущего месяца
  for (let i = 0; i < dayOfWeek; i++) {
    const dEl = document.createElement('div');
    dEl.className = 'custom-calendar-day other-month';
    const dayNum = lastDayPrevMonth - dayOfWeek + i + 1;
    dEl.textContent = dayNum;
    daysWrapper.appendChild(dEl);
  }

  // Дни текущего месяца
  for (let day = 1; day <= lastDayCurrentMonth; day++) {
    const dEl = document.createElement('div');
    dEl.className = 'custom-calendar-day';
    dEl.textContent = day;

    const tempDate = new Date(year, month, day);

    // сегодня
    const today = new Date();
    if (tempDate.toDateString() === today.toDateString()) {
      dEl.classList.add('today');
    }
    // выбранная
    if (selectedDate && tempDate.toDateString() === selectedDate.toDateString()) {
      dEl.classList.add('selected');
    }

    dEl.onclick = () => {
      selectedDate = tempDate;
      document.getElementById('dateField').value = formatDate(selectedDate);
      toggleCalendar(false);
    };

    daysWrapper.appendChild(dEl);
  }

  calendarEl.appendChild(daysWrapper);
}

// Формат: DD.MM.YYYY
function formatDate(date) {
  const dd = String(date.getDate()).padStart(2,'0');
  const mm = String(date.getMonth()+1).padStart(2,'0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function toggleCalendar(show = true) {
  const cal = document.getElementById('customCalendar');
  const isMobile = window.innerWidth <= 768;

  if (show) {
    initCustomCalendar();
    if (!isMobile) {
      // Десктоп: плавная анимация появления
      cal.style.display = 'block';
      cal.style.opacity = 0;
      setTimeout(() => {
        cal.style.opacity = 1;
        cal.style.transition = 'opacity 0.3s';
      }, 10);
    } else {
      // Мобильный: просто показываем
      cal.style.display = 'block';
      cal.style.opacity = 1;
      cal.style.transition = 'none';
    }
  } else {
    if (!isMobile) {
      // Десктоп: плавное исчезновение
      cal.style.opacity = 0;
      setTimeout(() => {
        cal.style.display = 'none';
      }, 300);
    } else {
      // Мобильный: убираем сразу
      cal.style.display = 'none';
      cal.style.opacity = 1;
    }
  }
}
function toggleCalendar(show = true) {
  const cal = document.getElementById('customCalendar');

  if (show) {
    initCustomCalendar();
    cal.style.display = 'block';
    // Плавное появление
    setTimeout(() => {
      cal.style.opacity = 1;
      cal.style.transition = 'opacity 0.3s';
    }, 10);
  } else {
    // Плавное скрытие
    cal.style.opacity = 0;
    setTimeout(() => {
      cal.style.display = 'none';
    }, 300);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // При клике/фокусе на поле даты – показываем календарь
  const dateField = document.getElementById('dateField');
  if (dateField) {
    dateField.addEventListener('focus', () => {
      toggleCalendar(true);
    });
    dateField.addEventListener('click', () => {
      toggleCalendar(true);
    });
  }
});

