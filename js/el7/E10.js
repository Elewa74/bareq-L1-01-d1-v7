/* E10 · اِلْعَبْ — GAME · v7 · draft_unapproved · SPEC_v7 §E10 · الناتج ٩ · S1 S5 S6
   بعده: يوظّف الصوت والحرف والمفردات في موقف جديد: يجد ما يبدأ بصوت الميم بين أشياء كثيرة، ويكمل كلمات من صورها.
   امتداد «العب» (EL14) في الأصل: لعبة Godot هي التجربة الأساسية (games/g7 · محطّة E10، لوحة أفقية ١٦:٩)، وهذه النسخة HTML بديل آليّ
   (بلا WebGL2/WASM، أو فشل التحميل/الذاكرة، أو ?godot=0) — اللعبة نفسها: الجولتان والتغذية والتسجيل.
   الافتتاح: بارق (سلّته بين قفّازيه) «ساعِدْني!…» ثم يلعب أوّل لقطة: يلمس المَوْز فيطير إلى سلّته.
   الجولة ١ «غرفة ماجد»: الأهداف مَكْتَبْ · مُشْطْ · مِفْتاحْ · مانْجو؛ المشتّتات كُرَةْ · بَطَّةْ · كِتابْ · قَلَمْ · قَميصْ.
     كلّ لمس يُسمِع الاسم أوّلاً ← ✓ يطير إلى السلّة + «وَجَدْناهُ!» · ✗ «اِسْمَعْ أَوَّلَ الكَلِمَةِ.» (يهتزّ ويبقى) · قَلَم/قَميص «فيها مِيمٌ، لَكِنْ لَيْسَتْ في أَوَّلِها.»
     ٣ لمسات خاطئة متتالية ← الأهداف الباقية تتوهّج + «اُنْظُرْ إِلى الضَّوْءِ.» · record('S1', ok) لكلّ هدف (ok = بلا خطأ منذ الهدف السابق).
   الجولة ٢ «أَكْمِلِ الكَلِمَةَ»: صورة + كلمة بخانة ناقصة + ٣ قطع مكتوبة صامتة (لمس أو سحب) · ✗١ شكل الميم · ✗٢ الضوء · ③ النموذج بهدوء.
     record('S5') لـ مَوْزْ مُشْطْ و record('S6') لـ قَمَرْ فَمْ (ok = من المحاولة الأولى). الفوز: g7_win + «شُكْرًا يا صَديقي!…». لا مؤقّت ولا خسارة. */
(function () {
  'use strict';
  const ID = 'E10';
  const GAME_SRC = 'games/g7/index.html';
  const L = {
    intro: 'bq7_E10_intro', demo: 'bq7_E10_demo', r1: 'bq7_E10_r1', found: 'bq7_E10_found', notfirst: 'bq7_E10_notfirst',
    start: 'bq7_G_hint_start', light: 'bq7_G_look_light', shape: 'bq7_G_look_shape', model: 'bq7_G_model', next: 'bq7_G_next',
    r2i: 'bq7_E10_r2_intro', r2t: 'bq7_E10_r2_task', win: 'bq7_E10_win',
  };
  const PRAISE = ['bq7_G_yes1', 'bq7_G_yes2', 'bq7_G_yes3', 'bq7_G_yes4'];
  // board 1920×1080 (the Godot game's coordinates): [x, y, w, h]
  const ITEMS = [
    { s: 'maktab', t: true, r: [310, 526, 440, 379] },
    { s: 'kura', r: [1540, 840, 150, 150] },
    { s: 'batta', r: [775, 836, 140, 170] },
    { s: 'qamis', m: true, r: [1090, 489, 170, 165] },
    { s: 'qalam', m: true, r: [935, 521, 130, 94] },
    { s: 'kitab', r: [1210, 342, 140, 79] },
    { s: 'mawz', t: true, demo: true, r: [1305, 459, 130, 111] },
    { s: 'miftah', t: true, r: [451, 398, 130, 77] },
    { s: 'musht', t: true, r: [380, 609, 150, 46] },
    { s: 'manju', t: true, r: [585, 561, 100, 94] },
  ];
  const BQ_HOME = [1470, 140, 230, 312];
  const WORDS = [
    { s: 'mawz', word: 'مَوْزْ', m: 0, parts: ['#', 'ـوْزْ'], right: 'مَـ', wrong: ['بَـ', 'فَـ'], skill: 'S5' },
    { s: 'musht', word: 'مُشْطْ', m: 0, parts: ['#', 'ـشْطْ'], right: 'مُـ', wrong: ['بُـ', 'فُـ'], skill: 'S5' },
    { s: 'qamar', word: 'قَمَرْ', m: 1, parts: ['قَـ', '#', 'ـرْ'], right: 'ـمَـ', wrong: ['ـبَـ', 'ـفَـ'], skill: 'S6' },
    { s: 'fam', word: 'فَمْ', m: 1, parts: ['فَـ', '#'], right: 'ـمْ', wrong: ['ـبْ', 'ـفْ'], skill: 'S6' },
  ];

  const CSS = `
.e10 { justify-content: center; align-items: center; }
.e10-box { position: relative; width: var(--e10-w, 100%); max-width: 100%; aspect-ratio: 16 / 9; flex: none; border-radius: 22px; overflow: hidden;
  background: #F3D6A6 center / cover no-repeat; box-shadow: 0 14px 34px var(--shade), 0 0 0 4px #fff; container-type: inline-size; user-select: none; -webkit-user-select: none; touch-action: manipulation; }
.e10-box img { -webkit-user-drag: none; pointer-events: none; }
.e10-it { position: absolute; border: 0; padding: 0; background: none; cursor: pointer; touch-action: manipulation; overflow: visible; }
.e10-it img { position: absolute; left: var(--ix); top: var(--iy); width: var(--iw); height: var(--ih); object-fit: contain; filter: drop-shadow(0 4px 4px rgba(60,30,10,.25)); transition: transform .2s, filter .3s; }
.e10-it.is-say img { transform: translateY(-4%) scale(1.08); }
.e10-it.is-glow img { filter: drop-shadow(0 0 6px #FFD34E) drop-shadow(0 0 16px #FFC107); animation: e10Glow 1.1s ease-in-out infinite; }
.e10-it.is-shake img { animation: e10Shake .45s ease-in-out; }
.e10-it.is-gone { visibility: hidden; pointer-events: none; }
.e10-it:focus-visible { outline: 4px solid var(--sun, #FEBA02); outline-offset: 2px; border-radius: 14px; }
.e10-bq { position: absolute; transition: left .6s ease-in-out, top .6s ease-in-out; pointer-events: none; z-index: 3; }
.e10-bq > div { position: absolute; inset: 0; animation: e10Float 2.4s ease-in-out infinite; }
.e10-bq img.b { width: 100%; height: 100%; object-fit: contain; }
.e10-bq .in { position: absolute; left: 54.5%; top: 77%; width: 0; height: 0; }
.e10-bq .in img { position: absolute; bottom: 0; width: 3.6cqw; height: 3.6cqw; object-fit: contain; transform: translateX(-50%); animation: e10Pop .3s ease-out; }
.e10-bq.is-hop > div { animation: e10Hop .5s ease-out; }
.e10-bq.is-think img.b { animation: e10Tilt .9s ease-in-out; }
.e10-fly { position: absolute; z-index: 5; pointer-events: none; object-fit: contain; }
.e10-spark { position: absolute; z-index: 6; width: 2cqw; height: 2cqw; margin: -1cqw; border-radius: 50%; background: #FFD34E; box-shadow: 0 0 10px #FFC107; pointer-events: none; animation: e10Spark .7s ease-out forwards; }
/* round 2 */
.e10-r2 { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr auto; grid-template-rows: 1fr auto; align-items: center; padding: 3cqw 4cqw 4cqw 15cqw; gap: 2cqw 3cqw; direction: rtl; }
.e10-card { grid-row: 1; grid-column: 1; justify-self: end; width: 19cqw; aspect-ratio: 1; border-radius: 2.2cqw; border: .5cqw solid #fff; overflow: hidden; background: #fff; box-shadow: 0 .5cqw 0 #E2C98A, 0 1cqw 2cqw rgba(0,0,0,.25); padding: 0; cursor: pointer; min-width: 64px; min-height: 64px; }
.e10-card img { width: 100%; height: 100%; object-fit: cover; }
.e10-word { grid-row: 1; grid-column: 2; display: flex; direction: rtl; align-items: center; justify-content: center; font: 400 7.5cqw/1.5 var(--ff-child, 'Noto Naskh Arabic', serif); color: var(--navy, #00345B);
  background: rgba(255,253,242,.92); border-radius: 2cqw; padding: .4cqw 1.6cqw 1.2cqw; box-shadow: 0 .5cqw 0 #E2C98A; min-width: 36cqw; }
.e10-word .gap { display: inline-flex; align-items: center; justify-content: center; min-width: 11cqw; height: 9cqw; border: .45cqw dashed #9CC9E6; border-radius: 1.6cqw; background: #fff; margin-inline: .2cqw; }
.e10-word .gap.is-glow { border: .6cqw solid #FFC107; animation: e10Glow 1.1s ease-in-out infinite; }
.e10-word .gap.is-full { border-color: transparent; background: none; }
.e10-word .mm { color: var(--coral, #E4553F); }
.e10-pieces { grid-row: 2; grid-column: 1 / -1; display: flex; direction: rtl; justify-content: center; gap: 3cqw; }
.e10-pc { min-width: max(11cqw, 64px); min-height: max(9cqw, 56px); padding: 0 1.4cqw .9cqw; border-radius: 1.8cqw; border: .35cqw solid #E2C98A; background: #FFFDF2; box-shadow: 0 .5cqw 0 #E2C98A, 0 1cqw 1.6cqw rgba(0,0,0,.2);
  font: 400 6.4cqw/1.4 var(--ff-child, 'Noto Naskh Arabic', serif); color: var(--navy, #00345B); cursor: grab; touch-action: none; }
.e10-pc.is-glow { border-color: #FFC107; box-shadow: 0 0 0 .5cqw #FFD34E, 0 1cqw 1.6cqw rgba(0,0,0,.2); }
.e10-pc.is-shake { animation: e10Shake .45s ease-in-out; }
.e10-pc.is-drag { position: relative; z-index: 9; cursor: grabbing; }
.e10-pc.is-used { visibility: hidden; }
.e10-pc:focus-visible, .e10-card:focus-visible { outline: 4px solid var(--sun, #FEBA02); outline-offset: 3px; }
.e10-win { position: absolute; inset: 0; background: center / cover no-repeat; animation: e10In .5s ease-out; }
@keyframes e10Glow { 50% { filter: drop-shadow(0 0 12px #FFD34E) drop-shadow(0 0 26px #FFC107); } }
@keyframes e10Shake { 20%, 60% { translate: -8px 0; } 40%, 80% { translate: 8px 0; } }
@keyframes e10Float { 50% { transform: translateY(-1.2cqw); } }
@keyframes e10Hop { 30% { transform: translateY(-3cqw) scale(.96, 1.06); } 60% { transform: translateY(0) scale(1.06, .94); } }
@keyframes e10Tilt { 30%, 70% { transform: rotate(-9deg); } }
@keyframes e10Pop { from { transform: translateX(-50%) scale(.2); } }
@keyframes e10Spark { to { transform: translate(var(--dx), var(--dy)) scale(.3); opacity: 0; } }
@keyframes e10In { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .e10-bq > div, .e10-it.is-glow img, .e10-word .gap.is-glow { animation: none !important; } .e10-bq { transition: none; } }
/* the Godot board is landscape 16:9 (the original's helper is portrait) */
.e10 .bq-godot { height: 100%; justify-content: center; }
.e10 .bq-godot-box { aspect-ratio: 16 / 9 !important; width: var(--e10-w, 100%) !important; max-width: 100% !important; }`;

  const pct = (v, of) => (v / of * 100) + '%';
  const wait = (ctx, ms) => ctx.sleep(ms);

  /* ================================================================ the HTML game */
  function htmlGame(stage, ctx, wrap) {
    const h = BQ.h;
    const ok = () => ctx.alive();
    const say = (id) => (id ? ctx.say(id, { noCaption: !BQ.state.cc }) : Promise.resolve());
    let pi = 0; const praise = () => PRAISE[(pi++) % PRAISE.length];
    const box = h('div.e10-box', { style: { backgroundImage: 'url("' + ctx.img('g7_room_bg') + '")' } });
    wrap.append(box);
    const res = { found: 0, targets: 4, wrong: 0, build_ok: true, picks: [], words: [], html: true };
    // Bariq + basket
    const bqImg = h('img.b', { src: ctx.img('g7_bariq_basket'), alt: '' });
    const inBasket = h('div.in');
    const bq = h('div.e10-bq', { 'aria-hidden': 'true' }, h('div', null, bqImg, inBasket));
    const place = (el, r) => { el.style.left = pct(r[0], 1920); el.style.top = pct(r[1], 1080); el.style.width = pct(r[2], 1920); el.style.height = pct(r[3], 1080); };
    place(bq, BQ_HOME);
    const bqTo = (x, y) => { bq.style.left = pct(x, 1920); bq.style.top = pct(y, 1080); return wait(ctx, BQ.reduced() ? 50 : 620); };
    const react = (k) => { bq.classList.remove('is-hop', 'is-think'); void bq.offsetWidth; bq.classList.add(k === 'think' ? 'is-think' : 'is-hop'); };
    // things in the room
    let lock = true, streak = 0, clean = true;
    const its = ITEMS.map((d) => {
      const b = h('button.e10-it', { type: 'button', 'aria-label': 'شَيْءٌ في الغُرْفَةِ' }, h('img', { src: ctx.img('g7_sp_' + d.s), alt: '' }));
      if (d.s === 'maktab') b.style.zIndex = 0; else b.style.zIndex = 1;
      const it = Object.assign({ b, gone: false }, d);
      b.addEventListener('click', () => tap(it));
      box.append(b);
      return it;
    });
    box.append(bq);
    /* R3b: hit boxes that never overlap — each object's picture grown towards 60 CSS px where the room allows it.
       Neighbours split the gap between their pictures; things on the desk grow upwards only, and the desk keeps the lower
       part (drawers, legs, chair) so its centre is never covered. Recomputed whenever the board is resized. */
    function layoutHits() {
      const k = box.clientWidth / 1920; if (!k) return;
      const want = 60 / k;
      const R = its.map((it) => { const a = { x0: it.r[0], y0: it.r[1], x1: it.r[0] + it.r[2], y1: it.r[1] + it.r[3] };
        const cx = (a.x0 + a.x1) / 2, cy = (a.y0 + a.y1) / 2, w = Math.max(a.x1 - a.x0, want), hh = Math.max(a.y1 - a.y0, want);
        return { it, a, host: it.s === 'maktab', b: it.s === 'maktab' ? Object.assign({}, a) : { x0: cx - w / 2, x1: cx + w / 2, y0: cy - hh / 2, y1: cy + hh / 2 } }; });
      const ov = (p, q) => p.x0 < q.x1 && q.x0 < p.x1 && p.y0 < q.y1 && q.y0 < p.y1;
      const host = R.find((o) => o.host);
      R.forEach((o) => { // things standing on the desk: grow up, not down into it
        if (o.host || !host || !ov(o.a, host.a)) return;
        const lim = Math.max(o.a.y1, host.a.y0 + (host.a.y1 - host.a.y0) * 0.4); const hgt = o.b.y1 - o.b.y0;
        if (o.b.y1 > lim) { o.b.y1 = lim; o.b.y0 = Math.min(o.a.y0, lim - hgt); }
      });
      for (let pass = 0; pass < 2; pass++) for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
        const A = R[i], B = R[j]; if (A.host || B.host || !ov(A.b, B.b)) continue;
        const gx = Math.max(A.a.x0, B.a.x0) - Math.min(A.a.x1, B.a.x1), gy = Math.max(A.a.y0, B.a.y0) - Math.min(A.a.y1, B.a.y1);
        if (gx >= gy) { const [L, Rr] = A.a.x0 < B.a.x0 ? [A, B] : [B, A]; const m = (L.a.x1 + Rr.a.x0) / 2; L.b.x1 = Math.max(L.a.x1, Math.min(L.b.x1, m)); Rr.b.x0 = Math.min(Rr.a.x0, Math.max(Rr.b.x0, m)); }
        else { const [T, D] = A.a.y0 < B.a.y0 ? [A, B] : [B, A]; const m = (T.a.y1 + D.a.y0) / 2; T.b.y1 = Math.max(T.a.y1, Math.min(T.b.y1, m)); D.b.y0 = Math.min(D.a.y0, Math.max(D.b.y0, m)); }
      }
      if (host) R.forEach((o) => {
        if (o.host || !ov(o.b, host.b)) return;
        if (ov(o.a, host.a)) { host.b.y0 = Math.max(host.b.y0, o.b.y1); return; }   // standing on the desk: the desk keeps the part below
        if (o.a.x0 >= host.a.x1) o.b.x0 = Math.max(o.b.x0, host.a.x1);               // a neighbour beside the desk gives way
        else if (o.a.x1 <= host.a.x0) o.b.x1 = Math.min(o.b.x1, host.a.x0);
        else if (o.a.y0 >= host.a.y1) o.b.y0 = Math.max(o.b.y0, host.a.y1);
        else o.b.y1 = Math.min(o.b.y1, host.a.y0);
      });
      R.forEach((o) => {
        const b = o.b; b.x0 = Math.max(0, b.x0); b.y0 = Math.max(0, b.y0); b.x1 = Math.min(1920, b.x1); b.y1 = Math.min(1080, b.y1);
        const el = o.it.b, W = b.x1 - b.x0, H2 = b.y1 - b.y0;
        el.style.left = pct(b.x0, 1920); el.style.top = pct(b.y0, 1080); el.style.width = pct(W, 1920); el.style.height = pct(H2, 1080);
        el.style.setProperty('--ix', ((o.a.x0 - b.x0) / W * 100) + '%'); el.style.setProperty('--iy', ((o.a.y0 - b.y0) / H2 * 100) + '%');
        el.style.setProperty('--iw', ((o.a.x1 - o.a.x0) / W * 100) + '%'); el.style.setProperty('--ih', ((o.a.y1 - o.a.y0) / H2 * 100) + '%');
      });
    }
    layoutHits(); requestAnimationFrame(layoutHits);
    let hro = null; try { hro = new ResizeObserver(layoutHits); hro.observe(box); ctx.onCleanup(() => hro.disconnect()); } catch (e) { window.addEventListener('resize', layoutHits); ctx.onCleanup(() => window.removeEventListener('resize', layoutHits)); }

    const spark = (x, y) => { for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; const s = h('i.e10-spark'); s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.setProperty('--dx', Math.cos(a) * 60 + 'px'); s.style.setProperty('--dy', Math.sin(a) * 60 + 'px'); box.append(s); setTimeout(() => s.remove(), 750); } };
    const mouth = () => { const r = bq.getBoundingClientRect(), b0 = box.getBoundingClientRect(); return [r.left - b0.left + r.width * 0.545, r.top - b0.top + r.height * 0.77]; };

    async function intoBasket(it, juicy) {
      const b0 = box.getBoundingClientRect(), ir = it.b.querySelector('img').getBoundingClientRect();
      // Bariq floats beside the thing
      const side = it.r[0] > 960 ? -1 : 1;
      const bx = Math.max(0, Math.min(1920 - BQ_HOME[2], it.r[0] + it.r[2] / 2 + side * (it.r[2] / 2 + 90) - BQ_HOME[2] / 2));
      const by = Math.max(140, Math.min(1080 - BQ_HOME[3], it.r[1] + it.r[3] / 2 - 40 - BQ_HOME[3] * 0.8));
      await bqTo(bx, by); if (!ok()) return;
      const fly = h('img.e10-fly', { src: ctx.img('g7_sp_' + it.s), alt: '' });
      Object.assign(fly.style, { left: ir.left - b0.left + 'px', top: ir.top - b0.top + 'px', width: ir.width + 'px', height: ir.height + 'px' });
      box.append(fly); it.b.classList.add('is-gone'); it.gone = true;
      const [mx, my] = mouth();
      const dx = mx - (ir.left - b0.left + ir.width / 2), dy = my - (ir.top - b0.top + ir.height / 2);
      const an = fly.animate([{ transform: 'none' }, { transform: `translate(${dx / 2}px, ${dy / 2 - 120}px) scale(.7)` }, { transform: `translate(${dx}px, ${dy}px) scale(.3)` }],
        { duration: BQ.reduced() ? 60 : 620, easing: 'ease-in-out', fill: 'forwards' });
      await new Promise((r2) => { an.onfinish = r2; setTimeout(r2, 900); });
      fly.remove();
      const n = inBasket.childElementCount; const off = [-2.2, 1.9, 0, -3.5, 3.4][n % 5];
      inBasket.append(h('img', { src: ctx.img('g7_sp_' + it.s), alt: '', style: { left: off + 'cqw', transform: 'translateX(-50%) rotate(' + [-10, 9, -3, 12, -12][n % 5] + 'deg)' } }));
      if (juicy) { BQ.audio.fx && BQ.audio.fx(BQ.sfx.ok, 1); spark(mx, my - 10); react('right'); }
    }

    async function tap(it) {
      if (lock || it.gone || !ok()) return;
      lock = true;
      it.b.classList.add('is-say');
      await say('bq7_W_' + it.s); if (!ok()) return;
      it.b.classList.remove('is-say');
      if (it.t) {
        const good = clean, how = good && !it.hinted ? 'first' : 'hint';
        its.forEach((x) => x.b.classList.remove('is-glow'));
        await intoBasket(it, true); if (!ok()) return;
        res.found++; res.picks.push({ slug: it.s, ok: good, how });
        ctx.record('S1', good, { item: it.s, from: 'E10' });
        streak = 0; clean = true;
        await say(L.found); if (!ok()) return;
        await bqTo(BQ_HOME[0], BQ_HOME[1]);
        if (its.every((x) => !x.t || x.gone)) { lock = true; return round2(); }
      } else {
        res.wrong++; streak++; clean = false;
        it.b.classList.remove('is-shake'); void it.b.offsetWidth; it.b.classList.add('is-shake'); react('think');
        await wait(ctx, 300);
        await say(it.m ? L.notfirst : L.start); if (!ok()) return;
        if (streak >= 3) { streak = 0; its.forEach((x) => { if (x.t && !x.gone) { x.b.classList.add('is-glow'); x.hinted = true; } }); await say(L.light); }
      }
      lock = false;
    }

    async function start() {
      await wait(ctx, 500); if (!ok()) return;
      await say(L.intro); if (!ok()) return;
      const m = its.find((x) => x.demo);
      m.b.classList.add('is-say'); await say('bq7_W_' + m.s); if (!ok()) return; m.b.classList.remove('is-say');
      await say(L.demo); if (!ok()) return;
      await intoBasket(m, true); if (!ok()) return;
      await bqTo(BQ_HOME[0], BQ_HOME[1]); if (!ok()) return;
      lock = false;
      await ctx.instruction('اِلْمِسْ كُلَّ شَيْءٍ يَبْدَأُ بِصَوْتِ المِيمِ.', L.r1, { icon: 'hand' });
    }

    /* ---------------- round 2 «أَكْمِلِ الكَلِمَةَ» */
    async function round2() {
      await wait(ctx, 600); if (!ok()) return;
      its.forEach((x) => x.b.remove());
      box.style.backgroundImage = 'url("' + ctx.img('g7_r2_bg') + '")';
      await bqTo(30, 330); if (!ok()) return;
      await say(L.r2i); if (!ok()) return;
      for (let k = 0; k < WORDS.length; k++) {
        await word(WORDS[k], k === 0); if (!ok()) return;
      }
      await win();
    }

    function word(w, first) {
      return new Promise((done) => {
        const r2 = h('div.e10-r2');
        const card = h('button.e10-card', { type: 'button', 'aria-label': 'اِسْمَعِ الكَلِمَةَ' }, h('img', { src: ctx.img('card_' + w.s), alt: '' }));
        card.addEventListener('click', () => say('bq7_W_' + w.s));
        const gap = h('span.gap');
        const row = h('div.e10-word', null, w.parts.map((p) => (p === '#' ? gap : h('span', null, p))));
        const bag = BQ.shuffle ? BQ.shuffle([w.right].concat(w.wrong)) : [w.right].concat(w.wrong).sort(() => Math.random() - 0.5);
        let tier = 0, busy = false;
        const pcs = bag.map((t) => { const b = h('button.e10-pc', { type: 'button' }, t); b.dataset.t = t; return b; });
        r2.append(card, row, h('div.e10-pieces', null, pcs));
        box.append(r2);
        const judge = async (b) => {
          if (busy || !ok()) return; busy = true;
          if (b.dataset.t === w.right) { await finish(b, tier === 0 ? 'first' : 'hint', true); return; }
          tier++; b.classList.remove('is-shake'); void b.offsetWidth; b.classList.add('is-shake'); react('think');
          await wait(ctx, 300);
          if (tier === 1) await say(L.shape);
          else if (tier === 2) { const rb = pcs.find((x) => x.dataset.t === w.right); rb.classList.add('is-glow'); gap.classList.add('is-glow'); await say(L.light); }
          else { await say(L.model); if (!ok()) return; await finish(pcs.find((x) => x.dataset.t === w.right), 'shown', false); return; }
          busy = false;
        };
        const finish = async (b, how, juicy) => {
          b.classList.add('is-used'); gap.classList.remove('is-glow'); gap.classList.add('is-full'); gap.textContent = w.right;
          const okk = how === 'first';
          res.words.push({ slug: w.s, skill: w.skill, ok: okk, how }); if (how === 'shown') res.build_ok = false;
          ctx.record(w.skill, okk, { item: w.s, from: 'E10' });
          await wait(ctx, 350); if (!ok()) return;
          // the whole printed word, م coral
          let i0 = 0, n = -1; for (let i = 0; i < w.word.length; i++) { if (/[ً-ٟ]/.test(w.word[i])) continue; n++; if (n === w.m) { i0 = i; break; } }
          let i1 = i0 + 1; while (i1 < w.word.length && /[ً-ٟ]/.test(w.word[i1])) i1++;
          const ZWJ = '‍';
          row.replaceChildren(h('span', null, w.word.slice(0, i0) + (i0 ? ZWJ : '')), h('span.mm', null, (i0 ? ZWJ : '') + w.word.slice(i0, i1) + (i1 < w.word.length ? ZWJ : '')), h('span', null, (i1 < w.word.length ? ZWJ : '') + w.word.slice(i1)));
          if (juicy) { BQ.audio.fx && BQ.audio.fx(BQ.sfx.ok, 1); const rr = row.getBoundingClientRect(), b0 = box.getBoundingClientRect(); spark(rr.left - b0.left + rr.width / 2, rr.top - b0.top + rr.height / 2); react('right'); }
          await say('bq7_W_' + w.s); if (!ok()) return;
          await say(juicy ? praise() : L.next); if (!ok()) return;
          await wait(ctx, 400);
          r2.remove(); done();
        };
        // touch = into the gap · or drag it there with a finger
        pcs.forEach((b) => {
          let st = null;
          b.addEventListener('pointerdown', (e) => { if (busy) return; st = { x: e.clientX, y: e.clientY, moved: false }; try { b.setPointerCapture(e.pointerId); } catch (er) { /* */ } });
          b.addEventListener('pointermove', (e) => { if (!st) return; const dx = e.clientX - st.x, dy = e.clientY - st.y; if (!st.moved && Math.hypot(dx, dy) < 10) return; st.moved = true; b.classList.add('is-drag'); b.style.transform = `translate(${dx}px, ${dy}px)`; });
          const up = (e) => { if (!st) return; const moved = st.moved; st = null; b.classList.remove('is-drag'); b.style.transform = '';
            if (!moved) return judge(b);
            const g = gap.getBoundingClientRect(); if (Math.abs(e.clientX - (g.left + g.width / 2)) < g.width && Math.abs(e.clientY - (g.top + g.height / 2)) < g.height) judge(b); };
          b.addEventListener('pointerup', up); b.addEventListener('pointercancel', () => { st = null; b.classList.remove('is-drag'); b.style.transform = ''; });
          b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); judge(b); } });
          b.addEventListener('click', (e) => { if (e.detail === 0) judge(b); }); // keyboard «click»
        });
        (async () => {
          await wait(ctx, 300); if (!ok()) return;
          if (first) await ctx.instruction('اُنْظُرْ إِلى الصّورَةِ، وَضَعِ القِطْعَةَ النّاقِصَةَ.', L.r2t, { icon: 'hand' });
          if (!ok()) return;
          await say('bq7_W_' + w.s);
        })();
      });
    }

    async function win() {
      bq.remove();
      box.append(h('div.e10-win', { style: { backgroundImage: 'url("' + ctx.img('g7_win') + '")' } }));
      spark(box.clientWidth / 2, box.clientHeight * 0.4);
      await say(L.win); if (!ok()) return;
      report(ctx, res);
      ctx.done();
      ctx.endCard({ title: 'أَحْسَنْتَ!', onReplay: () => BQ.open(ID, { skipCover: true, history: 'replace' }) });
    }
    // R3-F7: phone portrait → the platform's «أَدِرِ الجِهازَ» card (icon + Bariq, no text) until the phone turns or «تابِعْ»
    const mq = window.matchMedia ? matchMedia('(orientation: portrait) and (max-width: 599.98px)') : null;
    if (mq && mq.matches) {
      const ROT = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="20" y="8" width="24" height="40" rx="5" fill="none" stroke="currentColor" stroke-width="4"/><path d="M12 44a22 22 0 0 0 30 12" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M38 50l5 6-7 3" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      let gone = false;
      const go = () => { if (gone) return; gone = true; card.remove(); if (mq.removeEventListener) mq.removeEventListener('change', onMq); start(); };
      const onMq = () => { if (!mq.matches) go(); };
      const card = h('div.bq-rot7', { role: 'dialog', 'aria-label': 'أَدِرِ الجِهازَ' }, h('span.bq-rot7-ic', { html: ROT }),
        BQ.ui.brq ? BQ.ui.brq('point', 'bq-rot7-brq') : null,
        h('button.bq-rot7-go', { type: 'button', 'aria-label': 'تابِعْ', onclick: go }, BQ.icon('next')));
      stage.style.position = stage.style.position || 'relative';
      stage.append(card);
      if (mq.addEventListener) mq.addEventListener('change', onMq);
      ctx.onCleanup(() => { if (mq.removeEventListener) mq.removeEventListener('change', onMq); });
    } else start();
  }

  /* ================================================================ teacher note (the guide drawer only — never on the child screen) */
  function report(ctx, r) {
    const AR = BQ.AR || String;
    const pk = (r.picks || []).map((p) => ({ maktab: 'مَكْتَب', musht: 'مُشْط', miftah: 'مِفْتاح', manju: 'مانْجو' }[p.slug] || p.slug) + (p.ok ? ' ✓' : ' (بعد لمسة في غير موضعها)')).join(' · ');
    const wd = (r.words || []).map((w) => ({ mawz: 'مَوْز', musht: 'مُشْط', qamar: 'قَمَر', fam: 'فَم' }[w.slug] || w.slug) + ': ' + (w.how === 'first' ? 'من المحاولة الأولى' : w.how === 'shown' ? 'عُرض النموذج' : 'بعد تلميح')).join(' · ');
    ctx.adultNote('<p class="goal"><b>نتيجة «اِلْعَبْ» (قرائن لا درجة):</b> وجد ' + AR(r.found || 0) + ' من ' + AR(r.targets || 4) + ' أشياء تبدأ بصوت الميم · لمسات في غير موضعها: ' + AR(r.wrong || 0) + '.</p>' +
      (pk ? '<p>الجولة ١ (S1): ' + pk + '</p>' : '') + (wd ? '<p>الجولة ٢ (S5 أوّل الكلمة · S6 وسطها وآخرها): ' + wd + '</p>' : '') +
      '<p class="lp-muted">لاحظ: هل يعتمد على الصوت (يستمع قبل أن يقرّر) أم على التخمين بالصورة؟ قَلَم وقَميص فيهما ميم ليست في الأوّل.</p>');
  }

  /* the 16:9 board as big as the screen allows (the stage is an inline-size container: no cqh) */
  function fitBoard(stage, ctx) {
    const fit = () => {
      if (!stage.isConnected) return;
      const top = stage.getBoundingClientRect().top;
      const nav = ctx.frame.querySelector('.elp-nav');
      const navH = nav ? nav.getBoundingClientRect().height + 24 : 90;
      const vh = window.visualViewport ? visualViewport.height : innerHeight;
      // short screens (phone landscape): the board takes the whole height (the page scrolls to it); else it fits under the header
      // PLATFORM R3b-L1: on short screens the stage already fits under the 46 px header — the board fits the stage (below the header, no stage scroll)
      const hdrB = (document.querySelector('.hdr') || { getBoundingClientRect: () => ({ bottom: 0 }) }).getBoundingClientRect().bottom;
      const availH = vh < 520 ? Math.max(180, Math.min(vh - hdrB - 8, stage.clientHeight - 8)) : Math.max(240, vh - Math.min(Math.max(0, top), 150) - navH - 12);
      let w = Math.max(280, Math.min(stage.clientWidth, availH * 16 / 9));
      stage.style.setProperty('--e10-w', Math.floor(w) + 'px');
      // R3-F11: no scroll inside the stage — shrink by whatever still overflows (the instruction row above the board)
      const over = stage.scrollHeight - stage.clientHeight;
      if (over > 0) { w = Math.max(280, w - over * 16 / 9 - 4); stage.style.setProperty('--e10-w', Math.floor(w) + 'px'); }
    };
    fit(); requestAnimationFrame(fit);
    window.addEventListener('resize', fit);
    let ro = null; try { ro = new ResizeObserver(fit); ro.observe(stage); } catch (e) { /* */ }
    ctx.onCleanup(() => { window.removeEventListener('resize', fit); if (ro) ro.disconnect(); });
  }

  /* ================================================================ render: Godot first, HTML fallback */
  function render(stage, ctx) {
    const h = BQ.h;
    if (!document.getElementById('st-e10')) document.head.append(h('style', { id: 'st-e10' }, CSS));
    stage.classList.add('e10');
    fitBoard(stage, ctx);
    ctx.later(() => { const b = stage.querySelector('.e10-box, .bq-godot-box'); if (b && innerHeight < 520) try { b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* */ } }, 400);
    const runHtml = () => { stage.replaceChildren(); const w = h('div.e10-wrap', { style: { display: 'contents' } }); stage.append(w); htmlGame(stage, ctx, w); };
    const canGame = BQ.ui && BQ.ui.godot && BQ.ui.godotOK && BQ.ui.godotOK();
    if (!canGame) return runHtml();
    const note = h('p.meta', null, 'التجربة الأساسية هنا لعبة على لوحة أفقية؛ النتيجة تظهر هنا للمعلّم حين تنتهي.');
    const alt = h('p', null, h('button.bq-btn.ghost', { type: 'button', onclick: () => { g.destroy(); alt.remove(); note.textContent = 'تعمل الآن النسخة الخفيفة.'; runHtml(); } }, 'تشغيل النسخة الخفيفة (تعمل في أيّ متصفّح)'));
    ctx.adultNote(h('div', null, note, alt));
    let finished = false;
    const g = BQ.ui.godot(stage, { src: GAME_SRC, station: ID, age: ctx.age(), title: 'لعبة: ساعِدْ بارِقًا',
      onFail() {
        if (!ctx.alive() || finished) return;
        g.destroy(); alt.remove(); note.textContent = 'تعذّر تحميل اللعبة على هذا الجهاز، فشُغّلت النسخة الخفيفة تلقائياً.';
        runHtml();
      },
      onDone(m) {
        if (finished || !ctx.alive() || (m.station && m.station !== ID)) return;
        finished = true;
        const r = m.result || {};
        (r.picks || []).forEach((p) => ctx.record('S1', !!p.ok, { item: p.slug, from: 'E10' }));
        (r.words || []).forEach((w) => ctx.record(w.skill || 'S5', !!w.ok, { item: w.slug, from: 'E10' }));
        try { BQ.store.set('e10-last', Object.assign({ t: Date.now() }, r)); } catch (e) { /* */ }
        ctx.done();
        report(ctx, r);
        const nb = ctx.frame.querySelector('.nextbtn'); if (nb) nb.classList.add('is-ready');
      } });
    ctx.onCleanup(() => g.destroy());
  }

  BQ.register(ID, { render });
})();
