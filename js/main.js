document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));
    
    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed navbar
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── Project Image Gallery / Carousel ───────────────────────────────────
    // Each gallery is identified by a string ID (e.g. 'ag4')
    // State is kept in a plain object so multiple galleries work independently
    const galleryState = {};

    function initGallery(id) {
        const track = document.getElementById(`gallery-track-${id}`);
        if (!track) return;
        const total = track.querySelectorAll('.gallery-img').length;
        galleryState[id] = { current: 0, total };

        // Auto-play every 4 s; pause on hover
        const wrapper = document.getElementById(`gallery-${id}`);
        let timer = setInterval(() => galleryNext(id), 4000);
        wrapper.addEventListener('mouseenter', () => clearInterval(timer));
        wrapper.addEventListener('mouseleave', () => {
            timer = setInterval(() => galleryNext(id), 4000);
        });
    }

    // Expose globally so inline onclick works
    window.galleryGoTo = function(id, index) {
        if (!galleryState[id]) return;
        galleryState[id].current = index;
        _galleryRender(id);
    };

    window.galleryPrev = function(id) {
        if (!galleryState[id]) return;
        const s = galleryState[id];
        s.current = (s.current - 1 + s.total) % s.total;
        _galleryRender(id);
    };

    window.galleryNext = function(id) {
        if (!galleryState[id]) return;
        const s = galleryState[id];
        s.current = (s.current + 1) % s.total;
        _galleryRender(id);
    };

    function _galleryRender(id) {
        const s = galleryState[id];
        const track = document.getElementById(`gallery-track-${id}`);
        if (track) track.style.transform = `translateX(-${s.current * 100}%)`;

        const dots = document.querySelectorAll(`#gallery-dots-${id} .gallery-dot`);
        dots.forEach((d, i) => d.classList.toggle('active', i === s.current));
    }

    // Initialize all galleries present on the page
    document.querySelectorAll('.project-gallery').forEach(el => {
        const id = el.id.replace('gallery-', '');
        initGallery(id);
    });
});

