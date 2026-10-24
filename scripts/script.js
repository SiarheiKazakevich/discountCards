const photos = {
  "biedronka": 17,
  "lidl": 47,
  "maxima": 9,
  "iki": 1,
  "kaufland": 3,
  "netto": 1,
  "billa": 1,
  "auchan": 1,
  "promo": 2,
  "dm": 1,
  "E.Leclerc": 1,
  "kik": 1,
  "tigros": 1
};
const translations = {
  ru: {
    language: "Язык:",
    chooseStore: "Выбери торговую сеть:",
    siteQR: "QR-code сайта",
    truckParking: "Паркинги для грузовиков",
    addCard: "Добавьте свою скидочную карту:",
    photo: "Фото",
    of: "из",
    photoLabel: "Фото"
  },
  en: {
    language: "Language:",
    chooseStore: "Choose a store:",
    siteQR: "Website QR code",
    truckParking: "Truck parking",
    addCard: "Add your loyalty card:",
    photo: "Photo",
    of: "of",
    photoLabel: "Photo"
  },
  be: {
    language: "Мова:",
    chooseStore: "Выберыце гандлёвую сетку:",
    siteQR: "QR-код сайта",
    truckParking: "Паркоўкі для грузавікоў",
    addCard: "Дадайце сваю дысконтную картку:",
    photo: "Фота",
    of: "з",
    photoLabel: "Фота"
  },
  uk: {
    language: "Мова:",
    chooseStore: "Оберіть торговельну мережу:",
    siteQR: "QR-код сайту",
    truckParking: "Паркінги для вантажівок",
    addCard: "Додайте свою дисконтну картку:",
    photo: "Фото",
    of: "із",
    photoLabel: "Фото"
  }
};
let currentLanguage =
  localStorage.getItem("discountCardsLanguage") || "ru";
if (!translations[currentLanguage]) {
  currentLanguage = "ru";
}

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

  //добавляем переменные
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const indicator = document.getElementById("carouselIndicator");


  // если фотографий нет
  if (slides === 0) {
    track.style.transform = `translateX(0%)`;
    // Нет фотографий — скрываем обе стрелки
    prevButton.hidden = true;
    nextButton.hidden = true;
    indicator.hidden = true;
    return;
  }
  // ограничиваем currentIndex
  // Не выходим за пределы слайдов
  currentIndex = Math.max(0, Math.min(currentIndex, slides - 1));
  // Перемещаем слайдер
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Показываем стрелки только при наличии соседнего слайда
  prevButton.hidden = currentIndex === 0;
  nextButton.hidden = currentIndex === slides - 1;

  //для одной фотографии индикатор не нужен
  indicator.innerHTML = "";

  if (slides <= 1) {
    indicator.hidden = true;
    return;
  }
  indicator.hidden = false;

  //номер фотографии
  const label = document.createElement("span");
  const t = translations[currentLanguage];
  label.textContent = `${t.photo} ${currentIndex + 1} ${t.of} ${slides}`;
  indicator.appendChild(label);

  //контейнер точек
  const dots = document.createElement("div");
  dots.className = "carousel-dots";

  //Показываем максимум 7 точек,
  //чтобы слайдер оставался компактным даже при 47 фото

  const maxDots = 7;
  const start = Math.max(
    0,
    Math.min(currentIndex - 3, slides - maxDots)
  );
  const end = Math.min(slides, start + maxDots);

  for (let i = start; i < end; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label",
      `${translations[currentLanguage].photoLabel} ${i + 1}`
    );

    if (i === currentIndex) {
      dot.classList.add("active");
      dot.setAttribute("aria-current", "true");
    }
    dot.onclick = () => {
      currentIndex = i;
      updateSlide();
    };
    dots.appendChild(dot);
  }
  indicator.appendChild(dots);
}

//добавляем переключатель языка
function applyLanguage(language) {
  if (!translations[language]) return;

  currentLanguage = language;
  const languageBadge = document.getElementById("burgerLanguageBadge");
  if (languageBadge) {
    languageBadge.textContent = language.toUpperCase()
  }

  localStorage.setItem("discountCardsLanguage", language);
  // язык документа и заголовок вкладки
  document.documentElement.lang = language;
  document.title = "discountCards";
  //переводим все статические элементы
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    if (translations[language][key] !== undefined) {
      element.textContent = translations[language][key];
    }
  });
  //подсвечиваем выбранный язык
  document.querySelectorAll(".language-btn").forEach(button => {
    const active = button.dataset.lang === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  //обновляем счетчик и подписи точек
  updateSlide();
}

//обработчики переключателя языка
document.querySelectorAll(".language-btn").forEach(button => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang);
    //Закрываем меню после выбора языка
    const menu = document.getElementById("menu");
    if (
      menu &&
      menu.classList.contains("active") &&
      typeof toggleMenu === "function"
    ) {
      toggleMenu();
    }
  });
});
// восстанавливаем сохраненный язык
applyLanguage(currentLanguage);



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