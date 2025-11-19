const lenis = new Lenis({
    // мягкость/скорость
    duration: 1.5,          // 0.8–1.5 обычно ок
    smoothWheel: true,
    smoothTouch: false,     // можно true, если нужен плавный скролл на тачах
    wheelMultiplier: 1.0,
    touchMultiplier: 1.2
  })

  // 2) Стандартный RAF-цикл
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // 3) Прокрутка к якорям (href="#id") без рывков
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href').slice(1)
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    lenis.scrollTo(el, { offset: -12 }) // сдвиг под фикс-хедер
  })

  // 4) Уважение prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lenis.stop()
  }