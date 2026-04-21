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
    
    function handleImageClick(e) {
        e.stopPropagation();
        openModal(this.src);
    }
    
    function initImagePreview() {
        document.querySelectorAll('.clickable-image').forEach(img => {
            img.removeEventListener('click', handleImageClick);
            img.addEventListener('click', handleImageClick);
        });
    }
    
    initImagePreview();
    
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

    // ========== 轮播图 (已修复) ==========
    const carousel = document.getElementById('caseCarousel');
    if (carousel) {
        const slidesContainer = carousel.querySelector('.carousel-slides');
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const dotsContainer = document.getElementById('carouselDots');
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoplayInterval;
        
        // 生成指示点
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
        
        const dots = Array.from(dotsContainer.children);
        
        function updateCarousel() {
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }
        
        function goToSlide(index) {
            currentIndex = Math.min(Math.max(index, 0), totalSlides - 1);
            updateCarousel();
            resetAutoplay();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
            resetAutoplay();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
            resetAutoplay();
        }
        
        function startAutoplay() {
            if (autoplayInterval) clearInterval(autoplayInterval);
            autoplayInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }
        
        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        startAutoplay();
        
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        updateCarousel();
        
        // 确保轮播图内图片的点击放大功能
        setTimeout(initImagePreview, 100);
    }
})();
