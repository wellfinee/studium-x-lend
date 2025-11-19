(() => {
    const MAGE_SELECTOR = '[data-mage]';   // можно поменять, если нужно
    const STAR_COUNT = 55;   // было 42
    const MAX_DRIFT = 36;   // было 26
    const MIN_SIZE = 5;    // было 3
    const MAX_SIZE = 10;   // было 7
    const PADDING = 40;

    const mage = document.querySelector(MAGE_SELECTOR);
    if (!mage) return;

    // ждём, пока картинка будет готова (decode есть у <img>)
    const whenReady = mage.decode ? mage.decode().catch(() => { }) : Promise.resolve();

    whenReady.then(() => {
        // создаём оверлей поверх мага (один раз)
        const overlay = document.createElement('div');
        overlay.className = 'mage-stars-overlay';
        document.body.appendChild(overlay);

        // функция, которая подгоняет оверлей к реальному положению мага
        const positionOverlay = () => {
            const r = mage.getBoundingClientRect();
            Object.assign(overlay.style, {
                left: (window.scrollX + r.left - PADDING) + 'px',
                top: (window.scrollY + r.top - PADDING) + 'px',
                width: (r.width + PADDING * 2) + 'px',
                height: (r.height + PADDING * 2) + 'px',
            });
        };

        // создаём звёзды и их анимации
        const stars = [];
        const tl = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });

        for (let i = 0; i < STAR_COUNT; i++) {
            const s = document.createElement('div');
            s.className = 'mage-star';
            overlay.appendChild(s);

            // случайный старт внутри контейнера (проценты, чтобы не зависеть от размеров)
            const leftP = gsap.utils.random(5, 95, 1);
            const topP = gsap.utils.random(5, 95, 1);
            s.style.left = leftP + '%';
            s.style.top = topP + '%';

            // размер и начальная прозрачность
            const size = gsap.utils.random(MIN_SIZE, MAX_SIZE, 1);
            s.style.width = size + 'px';
            s.style.height = size + 'px';

            // «мигание» звезды
            tl.to(s, {
                opacity: gsap.utils.random(0.35, 0.95),
                duration: gsap.utils.random(0.8, 1.8),
                yoyo: true,
                repeat: -1,
                repeatDelay: gsap.utils.random(0.6, 1.8),
            }, i * 0.03); // лёгкая рассинхронизация

            // «дрейф» (медленное плавание)
            gsap.to(s, {
                x: () => gsap.utils.random(-MAX_DRIFT, MAX_DRIFT),
                y: () => gsap.utils.random(-MAX_DRIFT, MAX_DRIFT),
                duration: gsap.utils.random(3, 6),
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
            });

            stars.push(s);
        }

        // анимация запускается, когда маг попадает в вьюпорт
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => e.isIntersecting ? tl.play() : tl.pause());
        }, { threshold: 0.15 });
        io.observe(mage);

        // пересчёт позиции при ресайзе/скролле/изменении layout
        const update = () => positionOverlay();
        positionOverlay();

        window.addEventListener('resize', update, { passive: true });
        window.addEventListener('scroll', update, { passive: true });

        // если маг внутри флекс/грид контейнера, который может меняться — следим
        const ro = new ResizeObserver(update);
        ro.observe(mage);

        // лёгкий параллакс от движения мыши (необязательный, но вкусный)
        const parallax = (e) => {
            const r = overlay.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const kx = (e.clientX - cx) / (r.width / 2);
            const ky = (e.clientY - cy) / (r.height / 2);
            const amp = 8; // сила параллакса
            gsap.to(overlay, { x: kx * amp, y: ky * amp, duration: 0.4, ease: "sine.out" });
        };
        document.addEventListener('mousemove', parallax);

    });

})();