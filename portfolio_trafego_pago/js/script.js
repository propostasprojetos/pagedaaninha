// Módulos JavaScript para Portfólio Tecnológico

// Classe para Animação de Contadores
class CounterAnimation {
    constructor(element, targetValue, duration = 2000) {
        this.element = element;
        this.targetValue = targetValue;
        this.duration = duration;
        this.startValue = 0;
        this.suffix = element.dataset.suffix || '';
        this.isAnimating = false;
    }

    async start() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Função de easing para suavizar a animação
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = this.startValue + (this.targetValue - this.startValue) * easeOutQuart;
            
            // Formatação do valor baseado no tipo
            let displayValue;
            if (this.suffix === 'M') {
                displayValue = (currentValue).toFixed(1) + this.suffix;
            } else if (this.suffix === '%' || this.suffix === '+') {
                displayValue = Math.floor(currentValue) + this.suffix;
            } else {
                displayValue = Math.floor(currentValue) + this.suffix;
            }
            
            this.element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
            }
        };
        
        requestAnimationFrame(animate);
    }

    stop() {
        this.isAnimating = false;
    }
}

// Classe para Carrossel de Depoimentos
class TestimonialCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = container.querySelectorAll('.carousel-slide');
        this.prevBtn = container.querySelector('.carousel-prev');
        this.nextBtn = container.querySelector('.carousel-next');
        this.indicators = container.querySelectorAll('.carousel-indicator');
        this.currentSlide = 0;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        
        this.init();
    }

    init() {
        // Event listeners para botões
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pausar autoplay ao hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());
        
        // Touch/swipe support para mobile
        this.addTouchSupport();
        
        // Iniciar autoplay
        this.startAutoPlay();
    }

    next() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }

    prev() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        // Atualizar posição do track
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Atualizar indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.isAutoPlaying) {
                this.next();
            }
        }, 5000);
    }

    pauseAutoPlay() {
        this.isAutoPlaying = false;
    }

    resumeAutoPlay() {
        this.isAutoPlaying = true;
    }

    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoPlay();
        });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            const threshold = 50;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }

            isDragging = false;
            this.resumeAutoPlay();
        });
    }
}

// Classe para Efeitos Tecnológicos
class TechEffects {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initHoverEffects();
        this.initParallaxEffects();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Iniciar contadores quando visíveis
                    if (entry.target.classList.contains('case-card')) {
                        const counter = entry.target.querySelector('.counter');
                        if (counter && !counter.dataset.animated) {
                            const targetValue = parseFloat(counter.dataset.target);
                            const animation = new CounterAnimation(counter, targetValue);
                            animation.start();
                            counter.dataset.animated = 'true';
                        }
                    }
                }
            });
        }, observerOptions);

        // Observar elementos para animação
        document.querySelectorAll('.case-card, .service-card').forEach(el => {
            el.classList.add('section-animate');
            observer.observe(el);
        });
    }

    initHoverEffects() {
        // Efeito de glow nos cards de serviço
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow = '0 20px 40px rgba(0, 245, 255, 0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = '';
            });
        });

        // Efeito nos botões tecnológicos
        document.querySelectorAll('.tech-btn, .tech-btn-outline').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    initParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-element');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Classe para Navegação Suave
class SmoothNavigation {
    constructor() {
        this.init();
    }

    init() {
        // Navegação suave para links âncora
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Destacar link ativo na navegação
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Classe para Performance e Otimizações
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy loading para imagens
        this.initLazyLoading();
        
        // Debounce para eventos de scroll
        this.initScrollOptimization();
        
        // Preload de recursos críticos
        this.preloadCriticalResources();
    }

    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    initScrollOptimization() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Executar funções de scroll otimizadas aqui
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    preloadCriticalResources() {
        // Preload de fontes críticas
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ];

        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }
}

// Inicialização da Aplicação
class App {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Aguardar carregamento do DOM
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Inicializar módulos
            this.initModules();
            
            // Configurar tratamento de erros
            this.setupErrorHandling();
            
            console.log('🚀 Portfólio tecnológico inicializado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
        }
    }

    initModules() {
        // Inicializar carrossel de depoimentos
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            new TestimonialCarousel(carouselContainer);
        }

        // Inicializar efeitos tecnológicos
        new TechEffects();

        // Inicializar navegação suave
        new SmoothNavigation();

        // Inicializar otimizações de performance
        new PerformanceOptimizer();

        // Inicializar contadores (caso não sejam ativados pelo scroll)
        this.initCountersOnLoad();
    }

    initCountersOnLoad() {
        // Verificar se algum contador está visível na tela inicial
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !counter.dataset.animated) {
                const targetValue = parseFloat(counter.dataset.target);
                const animation = new CounterAnimation(counter, targetValue);
                animation.start();
                counter.dataset.animated = 'true';
            }
        });
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Erro capturado:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promise rejeitada:', event.reason);
        });
    }
}

// Exportar classes para uso modular
export { CounterAnimation, TestimonialCarousel, TechEffects, SmoothNavigation, PerformanceOptimizer };

// Inicializar aplicação
const app = new App();