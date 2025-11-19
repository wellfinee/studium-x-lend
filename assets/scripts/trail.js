document.addEventListener('DOMContentLoaded', () => {
    const c = document.getElementById('cursor-trail');
    const ctx = c.getContext('2d');
    const MAX_POINTS = 12;   // длина хвоста (меньше = короче)
    const FADE_MS = 260;  // быстрее исчезает
    const BASE_W = 3.5;  // толщина
    const SAMPLE_MIN_DIST = 6; // добавлять точку только если курсор ушёл > N px

    // -----------------------------------------------
    function resize() {
        const dpr = Math.max(1, devicePixelRatio || 1);
        c.width = innerWidth * dpr; c.height = innerHeight * dpr;
        c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    }
    addEventListener('resize', resize); resize();

    const pts = [];
    let last = null;

    function addPoint(x, y) {
        if (last) {
            const dx = x - last.x, dy = y - last.y;
            if (dx * dx + dy * dy < SAMPLE_MIN_DIST * SAMPLE_MIN_DIST) return; // пропускаем «мусор»
        }
        const now = performance.now();
        pts.push({ x, y, t: now });
        while (pts.length > MAX_POINTS) pts.shift();
        last = { x, y };
    }

    addEventListener('mousemove', e => addPoint(e.clientX, e.clientY), { passive: true });
    addEventListener('touchmove', e => {
        const t = e.touches[0]; if (t) addPoint(t.clientX, t.clientY);
    }, { passive: true });

    // сглаживание: Catmull-Rom -> bezier
    function smoothPath(p) {
        if (p.length < 2) return;
        ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y);
        for (let i = 0; i < p.length - 1; i++) {
            const p0 = p[i === 0 ? i : i - 1], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
    }

    function render() {
        // быстрое затухание всей сцены (мягче, чем clearRect)
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.32)'; // больше альфы — быстрее исчезает
        ctx.fillRect(0, 0, innerWidth, innerHeight);
        ctx.globalCompositeOperation = 'source-over';

        const now = performance.now();
        if (pts.length) {
            // рисуем только «свежую» часть
            const fresh = pts.filter(p => (now - p.t) < FADE_MS);
            if (fresh.length > 1) {
                // толщина и альфа от возраста последней точки
                const age = now - fresh[fresh.length - 1].t;
                const k = Math.max(0.2, 1 - age / FADE_MS); // 0..1
                ctx.lineWidth = BASE_W * (0.7 + 0.6 * k);
                ctx.strokeStyle = `rgba(60, 110, 113,${0.45 + 0.45 * k})`;
                ctx.shadowColor = 'rgba(60, 110, 113,0.7)';
                ctx.shadowBlur = 8 * k;

                smoothPath(fresh);
                ctx.stroke();
            }
        }
        requestAnimationFrame(render);
    }
    render();
})