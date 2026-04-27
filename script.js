const userNamePlaceholder = document.getElementById('user-name-placeholder');
const userPhoto = document.getElementById('user-photo');
const coordinates = document.getElementById('coordinates');
const photosLink = document.getElementById('photos-link');
const vipNumberElement = document.getElementById('vip-number');
const locationItem = document.getElementById('location-item');

// Чтение query параметров из URL
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('name');
const guestPhoto = urlParams.get('photo');
const guestFragment = urlParams.get('fragment');

// Если есть параметры из URL, используем их
if (guestName) {
    userNamePlaceholder.textContent = guestName;
} else {
    userNamePlaceholder.textContent = 'гостя';
}

// Отображение фрагмента рядом с именем
if (guestFragment) {
    const fragmentSpan = document.createElement('span');
    fragmentSpan.className = 'name-fragment';
    fragmentSpan.textContent = ', ' + guestFragment;
    userNamePlaceholder.appendChild(fragmentSpan);
}

if (guestPhoto) {
    userPhoto.src = `photos/${guestPhoto}`;
}

// === Тултипы ===
function createTooltip(el, text) {
    const tip = document.createElement('div');
    tip.className = 'tooltip';
    tip.textContent = text;
    el.style.position = 'relative';
    el.appendChild(tip);

    const show = () => tip.classList.add('visible');
    const hide = () => tip.classList.remove('visible');

    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('touchstart', () => { show(); setTimeout(hide, 2000); });
    el.addEventListener('click', () => { show(); setTimeout(hide, 2000); });
}

// === Проверка доступности ===
function checkAvailability() {
    const now = new Date();
    const year = now.getFullYear();
    const unlockDate = new Date(year, 3, 21); // 21 апреля
    const eventEnd = new Date(year, 3, 24); // После события (24 апреля)

    // Координаты
    if (now >= unlockDate) {
        coordinates.classList.remove('blurred');
        coordinates.style.userSelect = 'auto';
        coordinates.style.pointerEvents = 'auto';
        locationItem.onclick = () => {
            const coords = '54.0443584, 25.6312400';
            navigator.clipboard.writeText(coords).then(() => {
                alert('Координаты скопированы в буфер обмена!');
            }).catch(() => {
                alert('Координаты: ' + coords);
            });
        };
        // Убрать тултип если был
        const oldTip = locationItem.querySelector('.tooltip');
        if (oldTip) oldTip.remove();
    } else {
        createTooltip(locationItem, 'Доступно 21 апреля');
        locationItem.onclick = () => {
            alert('Координаты станут доступны 21 апреля!');
        };
    }

    // Фото
    if (now >= eventEnd) {
        photosLink.onclick = () => {
            window.location.href = `memories.html${window.location.search}`;
        };
        const oldTip = photosLink.querySelector('.tooltip');
        if (oldTip) oldTip.remove();
    } else {
        createTooltip(photosLink, 'Доступно после прохождения события');
        photosLink.onclick = () => {
            alert('Фотографии появятся после завершения праздника!');
        };
    }
}

// === Аккордеон чеклиста ===
const checklistToggle = document.getElementById('checklist-toggle');
const checklistContent = document.getElementById('checklist-content');
const toggleIcon = checklistToggle.querySelector('.toggle-icon');

checklistToggle.addEventListener('click', () => {
    checklistContent.classList.toggle('collapsed');
    toggleIcon.classList.toggle('rotated');
});

// === VIP номер ===
function getVipNumber() {
    let vipNum = localStorage.getItem('vip_invite_code');
    if (!vipNum) {
        vipNum = Math.floor(1000000 + Math.random() * 9000000).toString();
        localStorage.setItem('vip_invite_code', vipNum);
    }
    return vipNum;
}

const vipNum = getVipNumber();
vipNumberElement.textContent = vipNum;

JsBarcode('#barcode', vipNum, {
    format: 'CODE128',
    lineColor: '#ffffff',
    width: 2,
    height: 50,
    background: 'transparent',
    displayValue: false
});

// === Частицы ===
const container = document.getElementById('particles-container');

function spawnDarkBalloon() {
    const el = document.createElement('div');
    el.className = 'particle dark-balloon';
    el.style.left = Math.random() * 100 + '%';
    el.style.width = (100 + Math.random() * 40) + 'px';
    el.style.height = (140 + Math.random() * 40) + 'px';
    el.style.animationDuration = (10 + Math.random() * 6) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 16000);
}

function spawnGoldStarBalloon() {
    const el = document.createElement('div');
    el.className = 'particle gold-star-balloon';
    el.style.left = Math.random() * 100 + '%';
    el.style.width = (60 + Math.random() * 40) + 'px';
    el.style.height = el.style.width;
    el.style.animationDuration = (8 + Math.random() * 5) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 13000);
}

// Запуск частиц
setInterval(spawnDarkBalloon, 4000);
setInterval(spawnGoldStarBalloon, 3000);

// Первоначальные частицы
for (let i = 0; i < 2; i++) { spawnDarkBalloon(); }
for (let i = 0; i < 2; i++) { spawnGoldStarBalloon(); }

// === Иконки при наведении ===
document.querySelectorAll('.detail-item i').forEach(icon => {
    icon.addEventListener('mouseover', () => {
        icon.style.transform = 'scale(1.3) rotate(10deg)';
        icon.style.transition = 'transform 0.3s';
        icon.style.filter = 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))';
    });
    icon.addEventListener('mouseout', () => {
        icon.style.transform = 'scale(1) rotate(0deg)';
        icon.style.filter = 'none';
    });
});

// Запуск
checkAvailability();
setInterval(checkAvailability, 60000);
