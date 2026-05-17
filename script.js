(function() {
  // 导航栏滚动效果
  function handleNavScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const banner = document.querySelector('.hero-slider') || document.querySelector('.page-banner');
    if (!banner) {
      navbar.classList.add('scrolled');
      return;
    }
    const bannerHeight = banner.offsetHeight;
    if (window.scrollY > bannerHeight - 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll);
  window.addEventListener('load', handleNavScroll);
  window.addEventListener('resize', handleNavScroll);

  // 主轮播图
  function initMainSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;
    const slides = slider.querySelectorAll('.slider-item');
    const dots = slider.querySelectorAll('.slider-dot');
    if (slides.length === 0) return;
    let current = 0;
    function showSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
    }
    setInterval(() => {
      current = (current + 1) % slides.length;
      showSlide(current);
    }, 4000);
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        current = parseInt(e.target.dataset.index);
        showSlide(current);
      });
    });
  }

  // ===== 图片灯箱 =====
  let currentGroup = [];
  let currentIndex = -1;

  function collectGroup(imgElement) {
    const section = imgElement.closest('section') || imgElement.closest('.container');
    if (!section) return [];
    const imgs = section.querySelectorAll('img[onclick*="openLightbox"]');
    return Array.from(imgs);
  }

  window.openLightbox = function(element) {
    const imgs = collectGroup(element);
    if (imgs.length === 0) return;
    currentGroup = imgs;
    currentIndex = imgs.indexOf(element);
    if (currentIndex === -1) currentIndex = 0;
    showCurrentImage();
    document.getElementById('lightbox').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  function showCurrentImage() {
    const img = document.getElementById('lightboxImg');
    if (currentGroup.length > 0 && currentIndex >= 0 && currentIndex < currentGroup.length) {
      img.src = currentGroup[currentIndex].src;
    }
  }

  window.navigateLightbox = function(direction) {
    if (currentGroup.length === 0) return;
    currentIndex = (currentIndex + direction + currentGroup.length) % currentGroup.length;
    showCurrentImage();
  };

  window.closeLightbox = function() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = '';
    currentGroup = [];
    currentIndex = -1;
  };

  document.addEventListener('keydown', function(e) {
    if (document.getElementById('lightbox').style.display === 'flex') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateLightbox(1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      }
    }
  });

  // ===== 移动端菜单 =====
  function setupMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    // 移除可能存在的旧菜单
    const existingOverlay = document.querySelector('.mobile-menu-overlay');
    if (existingOverlay) existingOverlay.remove();
    const existingPanel = document.querySelector('.mobile-menu-panel');
    if (existingPanel) existingPanel.remove();

    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    const panel = document.createElement('div');
    panel.className = 'mobile-menu-panel';

    // 复制 logo
    const logoArea = document.querySelector('.navbar .logo-area');
    const logoHTML = logoArea ? logoArea.outerHTML : '';

    // 获取所有桌面导航链接并构建移动版链接
    const navLinks = document.querySelectorAll('.navbar .nav-links a');
    let linksHTML = '';
    navLinks.forEach(link => {
      linksHTML += `<a href="${link.getAttribute('href')}">${link.textContent}</a>`;
    });

    panel.innerHTML = `
      <div class="mobile-menu-header">
        ${logoHTML}
        <button class="mobile-menu-close">&times;</button>
      </div>
      <div class="mobile-menu-links">
        ${linksHTML}
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    function closeMenu() {
      overlay.style.display = 'none';
      panel.style.display = 'none';
      document.body.style.overflow = '';
    }

    function openMenu() {
      overlay.style.display = 'block';
      panel.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    // 绑定关闭按钮
    panel.querySelector('.mobile-menu-close').addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    // 绑定菜单链接：点击时只关闭菜单，不阻止跳转
    panel.querySelectorAll('.mobile-menu-links a').forEach(link => {
      link.addEventListener('click', function() {
        closeMenu();
      });
    });

    // 汉堡按钮
    let menuToggle = document.querySelector('.menu-toggle');
    if (!menuToggle) {
      menuToggle = document.createElement('button');
      menuToggle.className = 'menu-toggle';
      menuToggle.innerHTML = '<span></span><span></span><span></span>';
      navContainer.appendChild(menuToggle);
    }

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panel.style.display === 'flex') {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // 窗口变大时关闭菜单
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  // ===== 创建右侧悬浮“联系我们”按钮（点击切换） =====
  function createFloatingContact() {
    if (document.getElementById('floatingContact')) return;

    const container = document.createElement('div');
    container.id = 'floatingContact';
    container.className = 'floating-contact';

    const button = document.createElement('div');
    button.className = 'contact-btn';
    button.innerHTML = '<span>联系</span><span>我们</span>';

    const popup = document.createElement('div');
    popup.className = 'contact-popup';

    popup.innerHTML = `
      <div class="popup-item">
        <div class="popup-icon"><img src="images/phone-icon.png" alt="电话" style="width:20px; height:20px;"></div>
        <div class="popup-text">
          <span class="label">咨询电话</span>
          <span class="value">13337156989</span>
        </div>
      </div>
      <div class="popup-item">
        <div class="popup-icon"><img src="images/service-icon.png" alt="客服" style="width:20px; height:20px;"></div>
        <div class="popup-text">
          <span class="label">服务热线</span>
          <span class="value">17504866624</span>
        </div>
      </div>
      <div class="popup-item">
        <div class="popup-icon"><img src="images/clock-icon.png" alt="时间" style="width:20px; height:20px;"></div>
        <div class="popup-text">
          <span class="label">工作时间</span>
          <span class="value">8:00 - 22:00</span>
        </div>
      </div>
    `;

    container.appendChild(button);
    container.appendChild(popup);
    document.body.appendChild(container);

    // 点击按钮切换显示/隐藏
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      popup.classList.toggle('show');
    });

    // 点击页面其他地方关闭卡片
    document.addEventListener('click', function(e) {
      if (!container.contains(e.target)) {
        popup.classList.remove('show');
      }
    });

    // 点击卡片内部不关闭
    popup.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // 页面初始化
  window.addEventListener('DOMContentLoaded', () => {
    handleNavScroll();
    initMainSlider();
    setupMobileMenu();
    createFloatingContact();

    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
      });
    }
  });
})();