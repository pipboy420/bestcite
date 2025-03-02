/* Кнопка "Вверх" */
window.addEventListener('scroll', checkScrollTop);
function checkScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  scrollTopBtn.style.display = (window.scrollY > 300) ? 'flex' : 'none';
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (el.getBoundingClientRect().top < windowHeight - 100) {
      el.classList.add('show');
    }
  });
}
revealOnScroll();

/* Прокрутка к блоку */
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
  }
}

/* Закрытие модалки */
function overlayClick(e) {
  if (e.target === document.getElementById('detailsModal')) {
    closeDetailsModal();
  }
}

/* Карусель */
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
  document.getElementById('carouselContainer').style.display = (!images || images.length === 0) ? 'none' : 'block';
  if (images && images.length) showImage(0);
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
  document.getElementById('carouselImage').src = currentImages[currentImageIndex];
}
function nextImage() {
  showImage(currentImageIndex + 1);
}
function prevImage() {
  showImage(currentImageIndex - 1);
}
const carouselImage = document.getElementById('carouselImage');
if (carouselImage) {
  carouselImage.addEventListener('click', nextImage);
}

/* Форма бронирования */
function resetFormFields() {
  document.getElementById('dateField').value = '';
  document.getElementById('timeField').value = '12:00';
  document.getElementById('nameField').value = '';
  document.getElementById('phoneField').value = '';
  document.getElementById('peopleField').value = '1';
  document.querySelectorAll('.people-buttons button').forEach((btn, index) => {
    btn.classList.toggle('active', index === 0);
  });
}
function selectPeople(value) {
  document.getElementById('peopleField').value = value;
  document.querySelectorAll('.people-buttons button').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === String(value));
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

/* Кастомный календарь */
let currentCalendarDate = new Date();
let selectedDate = null;
function initCustomCalendar() {
  const calendarEl = document.getElementById('customCalendar');
  calendarEl.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'custom-calendar-header';
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '<';
  prevBtn.onclick = () => { currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1); initCustomCalendar(); };
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '>';
  nextBtn.onclick = () => { currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1); initCustomCalendar(); };
  const title = document.createElement('div');
  const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  title.textContent = `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;
  header.appendChild(prevBtn);
  header.appendChild(title);
  header.appendChild(nextBtn);
  calendarEl.appendChild(header);
  const daysWrapper = document.createElement('div');
  daysWrapper.className = 'custom-calendar-days';
  ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(wd => {
    const wdEl = document.createElement('div');
    wdEl.className = 'custom-calendar-day weekday';
    wdEl.textContent = wd;
    daysWrapper.appendChild(wdEl);
  });
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const dayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
  const lastDayCurrentMonth = new Date(year, month+1, 0).getDate();
  const lastDayPrevMonth = new Date(year, month, 0).getDate();
  for (let i = 0; i < dayOfWeek; i++) {
    const dEl = document.createElement('div');
    dEl.className = 'custom-calendar-day other-month';
    dEl.textContent = lastDayPrevMonth - dayOfWeek + i + 1;
    daysWrapper.appendChild(dEl);
  }
  for (let day = 1; day <= lastDayCurrentMonth; day++) {
    const dEl = document.createElement('div');
    dEl.className = 'custom-calendar-day';
    dEl.textContent = day;
    const tempDate = new Date(year, month, day);
    const today = new Date();
    if (tempDate.toDateString() === today.toDateString()) dEl.classList.add('today');
    if (selectedDate && tempDate.toDateString() === selectedDate.toDateString()) dEl.classList.add('selected');
    dEl.onclick = () => {
      selectedDate = tempDate;
      document.getElementById('dateField').value = formatDate(selectedDate);
      toggleCalendar(false);
    };
    daysWrapper.appendChild(dEl);
  }
  calendarEl.appendChild(daysWrapper);
}
function formatDate(date) {
  const dd = String(date.getDate()).padStart(2,'0');
  const mm = String(date.getMonth()+1).padStart(2,'0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}
function toggleCalendar(show = true) {
  const cal = document.getElementById('customCalendar');
  if (show) {
    initCustomCalendar();
    cal.style.display = 'block';
    setTimeout(() => {
      cal.style.opacity = 1;
      cal.style.transition = 'opacity 0.3s';
    }, 10);
  } else {
    cal.style.opacity = 0;
    setTimeout(() => { cal.style.display = 'none'; }, 300);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const dateField = document.getElementById('dateField');
  if (dateField) {
    dateField.addEventListener('focus', () => { toggleCalendar(true); });
    dateField.addEventListener('click', () => { toggleCalendar(true); });
  }
});

