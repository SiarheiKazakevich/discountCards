const photos = {
  "biedronka": 6,
  "lidl": 24,
  "maxima": 5,
  "kaufland": 1,
  "billa": 1,
  "auchan": 1
};

// элементы
const dateSelect = document.getElementById("dateSelect");
const track = document.getElementById("track");

// заполняем селект
Object.keys(photos).forEach(date => {
  const option = document.createElement("option");
  option.value = date;
  option.textContent = date;
  dateSelect.appendChild(option);
});

// текущее состояние
let currentIndex = 0;

// загрузка картинок для даты
function loadImages(date) {
  track.innerHTML = ""; // очистить
  const count = photos[date] || 0;
  for (let i = 1; i <= count; i++) {
    const img = document.createElement("img");
    img.loading = "lazy";

    // Формируем путь. Важное: проверь, что в проекте файлы действительно называются так.
    // Попробуй сначала .jpg, если нет — .webp или .png
    img.src = `./photos/${date}/${i}.webp`;
    img.alt = `${date} - ${i}`;
    // 🟢 Если WebP не найден — грузим JPG
    img.onerror = () => {                   // 🟢 ДОБАВЛЕНО
      img.onerror = null;                   // чтобы не уйти в цикл
      img.src = `./photos/${date}/${i}.jpg`;
    };
    // если хочешь — добавить обработчик ошибки подмены расширения:
    /*img.addEventListener('error', () => {
     // попробуем webp, если jpg не найден
    if (!img.src.endsWith('.webp')) {
       img.src = `./photos/${date}/${i}.webp`;
     }
   });*/

    track.appendChild(img);
  }

  // сбросить индекс и обновить положение
  currentIndex = 0;
  updateSlide();
}

// обновляем позицию слайда
function updateSlide() {
  const slides = track.children.length;
  if (slides === 0) {
    track.style.transform = `translateX(0%)`;
    return;
  }
  // ограничиваем currentIndex
  currentIndex = Math.max(0, Math.min(currentIndex, slides - 1));
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// кнопки
document.querySelector(".prev").onclick = () => {
  currentIndex = Math.max(0, currentIndex - 1);
  updateSlide();
};
document.querySelector(".next").onclick = () => {
  currentIndex = Math.min(track.children.length - 1, currentIndex + 1);
  updateSlide();
};

// свайп (touch + mouse drag)
let startX = null;

track.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

track.addEventListener("touchend", e => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  startX = null;
  if (dx > 50) document.querySelector(".prev").click();
  if (dx < -50) document.querySelector(".next").click();
});

// (опционально) поддержка мышиного перетаскивания
let isDown = false, mouseStartX = 0;
track.addEventListener('mousedown', (e) => {
  isDown = true; mouseStartX = e.clientX;
});
window.addEventListener('mouseup', (e) => {
  if (!isDown) return;
  isDown = false;
  const dx = e.clientX - mouseStartX;
  if (dx > 50) document.querySelector(".prev").click();
  if (dx < -50) document.querySelector(".next").click();
});

// при смене даты
dateSelect.addEventListener('change', () => {
  loadImages(dateSelect.value);
});

// загрузить первую дату по умолчанию (если есть)
const first = Object.keys(photos)[0];
if (first) {
  dateSelect.value = first;
  loadImages(first);
}