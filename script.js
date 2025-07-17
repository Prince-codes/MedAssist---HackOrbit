const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const iconImg = document.getElementById('theme-icon');
const slides = document.querySelectorAll(".slide");
let current = 0;

function nextSlide() {
  slides[current].classList.remove("active");
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");
}

setInterval(nextSlide, 5000);
toggleBtn.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark-theme');

  if (isDark) {
    body.classList.remove('light-theme');
    iconImg.src = 'Assets/ellipse.png';
  } else {
    body.classList.add('light-theme');
    iconImg.src = 'Assets/moon.svg';
  }
});
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('mobile-sidebar');
const closeSidebar = document.getElementById('close-sidebar');

hamburger.onclick = () => {
  sidebar.classList.add('open');
};

closeSidebar.onclick = () => {
  sidebar.classList.remove('open');
};

const sidebarToggleBtn = document.getElementById('sidebar-theme-toggle');
const sidebarIcon = sidebarToggleBtn.querySelector('img');

sidebarToggleBtn.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark-theme');
  if (isDark) {
    body.classList.remove('light-theme');
    iconImg.src = sidebarIcon.src = 'Assets/ellipse.png';
  } else {
    body.classList.add('light-theme');
    iconImg.src = sidebarIcon.src = 'Assets/moon.png';
  }
});

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotFrameContainer = document.getElementById('chatbot-frame-container');
  const closeChatbot = document.getElementById('close-chatbot');

  chatbotToggle.addEventListener('click', () => {
    chatbotFrameContainer.style.display = 'flex';
    chatbotToggle.style.display = 'none';
  });

  closeChatbot.addEventListener('click', () => {
    chatbotFrameContainer.style.display = 'none';
    chatbotToggle.style.display = 'block';
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const mapToggle = document.getElementById('map-toggle');
  const mapFrameContainer = document.getElementById('map-frame-container');
  const closemap = document.getElementById('close-map');

  mapToggle.addEventListener('click', () => {
    mapFrameContainer.style.display = 'flex';
    mapToggle.style.display = 'none';
  });

  closemap.addEventListener('click', () => {
    mapFrameContainer.style.display = 'none';
    mapToggle.style.display = 'block';
  });
});
