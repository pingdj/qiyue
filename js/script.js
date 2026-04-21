(function() {
    // 移动端菜单切换
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // 平滑滚动
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === "#") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });

    // 图片点击放大功能
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('#imageModal .close-modal');
    
    function openModal(src) {
        modal.style.display = 'block';
        modalImg.src = src;
    }
    
    function initImagePreview() {
        const clickableImages = document.querySelectorAll('.clickable-image');
        clickableImages.forEach(img => {
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                openModal(this.src);
            });
        });
    }
    initImagePreview(); // 初始绑定
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            modalImg.src = '';
        });
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            modalImg.src = '';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            modalImg.src = '';
        }
    });

    // ========== 轮播图功能 ==========
    const carousel = document.getElementById('caseCarousel');
    if (carousel) {
        const slidesContainer = carousel.querySelector('.carousel-slides');
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const dotsContainer = document.getElementById('carouselDots');
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        // 生成指示点
        function createDots() {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.dataset.index = i;
                dot.addEventListener('click', function() {
                    goToSlide(parseInt(this.dataset.index));
                });
                dotsContainer.appendChild(dot);
            }
        }
        createDots();
        
        const dots = Array.from(dotsContainer.children);
        
        function updateCarousel() {
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }
        
        function goToSlide(index) {
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            currentIndex = index;
            updateCarousel();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // 自动轮播（可选）
        let autoplayInterval = setInterval(nextSlide, 5000);
        
        // 鼠标悬停暂停自动轮播
        carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        carousel.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        });
        
        // 初始化显示
        updateCarousel();
        
        // 轮播图内的图片也绑定点击放大（动态内容已在initImagePreview中通过类绑定，但为确保）
        // 无需额外操作
    }
    
    // 如果后续动态添加了图片，可调用 initImagePreview 重新绑定（本例无动态添加）
})();
