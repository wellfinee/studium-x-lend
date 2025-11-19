gsap.registerPlugin(ScrollTrigger) 
gsap.from(".why-me__card", {
  opacity: 0,
  x: -100,
  duration: 1,
  stagger: 0.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".why-me",
    start: "top center",
    marker: true
  }
})
gsap.from(".why-me__title", {
  opacity: 0,
  y: -100,
  duration: 2,
  stagger: 0.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".why-me",
    start: "top center",
    marker: true
  }
})
tl = gsap.timeline({

})
tl.from(".hero__img", {
    duration: 1.5,
    x: "30vw",
    ease: "power3.out"
}, "1")

tl.from(".hero__book--02", {
    duration: 1,
    x: "-100vw",
    ease: "power3.out",
    opacity: 0
}, "1")

tl.from(".hero__book--03", {
    duration: 1,
    x: "-100vw",
    ease: "power3.out",
    opacity: 0
}, "1.2")

tl.from(".hero__book--04", {
    duration: 1.5,
    x: "-100vw",
    ease: "power3.out",
    opacity: 0
}, "1")

tl.from(".hero__titles", {
    duration: 1.5,
    opacity: 0,
    ease: "power3.out",
    y: "30vh"
}, "1.6")

tl.from(".header", {
    duration: 1.5,
    y: "-10vh",
    opacity: 0,
    ease: "power3.out"
}, "2")


gsap.to([".hero__book--02",".hero__book--03",".hero__book--04"], {
  duration: 2.8,
  y: -24,
  rotate: 2.5,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  stagger: 1
});

if (window.innerWidth < 600) {
    
const menu   = document.querySelector('.header__menu');
const links  = gsap.utils.toArray('.header__menu .header__link');
const burger = document.getElementById('burger-toggle');

gsap.set(menu,  { yPercent: -100, autoAlpha: 0, pointerEvents: 'none' });
gsap.set(links, { autoAlpha: 0, x: 0, y: 0 });

const tlOpen = gsap.timeline({ paused: true })
  .to(menu, {
    yPercent: 0,
    autoAlpha: 1,
    pointerEvents: 'auto',
    duration: 0.5,
    ease: 'power4.out'
  })
  .add('links');

// «Гиперболический» эффект: X и Y анимируем отдельно с разными ease/длительностью.
// Стартовые смещения зависят от индекса.
links.forEach((el, i) => {
  const dx = -220 - i * 40; // старт левее
  const dy = -320 - i * 22; // старт выше

  // стартовые позиции (мгновенно)
  gsap.set(el, { x: dx, y: dy, autoAlpha: 0 });

  // поочерёдный вылет: сначала X (быстрее), затем Y (дольше) — траектория «изогнута»
  tlOpen.to(el, {
      autoAlpha: 1,
      x: 0,
      duration: 0.55,
      ease: 'power2.out'
    },
    'links+=' + (i * 0.06)
  ).to(el, {
      y: 0,
      duration: 0.85,
      ease: 'power4.out'
    },
    'links+=' + (i * 0.06) // начинаем одновременно со сдвигом по X
  );
});

// Закрытие: лёгкая «сборка» вверх и скрытие меню
const tlClose = gsap.timeline({ paused: true })
  .to(links, {
    autoAlpha: 0,
    y: -12,
    duration: 0.18,
    stagger: { each: 0.02, from: 'end' }
  })
  .to(menu, {
    yPercent: -100,
    autoAlpha: 0,
    pointerEvents: 'none',
    duration: 0.4,
    ease: 'power4.in'
  }, '<');



let isOpen = false;
burger.addEventListener('click', () => {
  isOpen = !isOpen;
  isOpen ? tlOpen.play(0) : tlClose.play(0);
       if(burger.getAttribute("src") == "./assets/images/svg/menu.svg"){
        burger.setAttribute("src", "./assets/images/svg/x.svg");
     } 
     else{
        burger.setAttribute("src", "./assets/images/svg/menu.svg");
     }
});

// по клику на ссылку — закрыть меню
links.forEach(a => a.addEventListener('click', () => { 
    isOpen = false;
     tlClose.play(0);
     if(burger.getAttribute("src") == "./assets/images/svg/menu.svg"){
        burger.setAttribute("src", "./assets/images/svg/x.svg");
     } 
     else{
        burger.setAttribute("src", "./assets/images/svg/menu.svg");
     }
    }));
}