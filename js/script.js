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
            // 避免重复绑定
            img.removeEventListener('click', handleImageClick);
            img.addEventListener('click', handleImageClick);
        });
    }
    
    function handleImageClick(e) {
        e.stopPropagation();
        openModal(this.src);
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

    // ========== 修复版轮播图 ==========
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
        
        // 清除旧指示点
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
            // 确保 currentIndex 在有效范围内
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex >= totalSlides) currentIndex = totalSlides - 1;
            
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        function goToSlide(index) {
            currentIndex = index;
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
        
        // 绑定事件
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // 自动轮播
        startAutoplay();
        
        // 悬停控制
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        // 初始化显示
        updateCarousel();
        
        // 确保轮播图内图片也可点击放大（已经通过 initImagePreview 绑定，但若轮播图是后生成的也无妨）
        // 重新扫描一次点击图片（以防万一）
        setTimeout(initImagePreview, 100);
    }
})();
