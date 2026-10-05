/* E08 · اِقْرَأْ وَرَكِّبْ (+ ب «حَلِّلْ») — IX2 · v7 · draft_unapproved · SPEC_v7 §E08 · الناتجان 7 · 6 · S7 · S6
   بعده: يقرأ مقاطع الميم وكلمات الدرس قراءة مستقلّة، ويركّب الكلمة من مقاطعها، ويفكّكها ليحدّد موقع الميم.
   امتداد «تدرّب» (EL13) في الأصل: جولات قصيرة بخطوات مرئيّة، بارق يتفاعل، والتغذية بصفوفها.
   أ١ سلاسل القراءة (غير مسجّلة): مَ → ما → مانْجو · مُ → مو → نُمورْ — يقرأ الطفل أوّلاً ثم يلمس فيسمع + «هَلْ قَرَأْتَها هَكَذا؟»
   أ٢ التركيب بالسحب (قطعتان + مشتِّتة، الخانات من اليمين) — S7 · أ٣ القراءة المستقلّة (كلمة مكتوبة ← صورتها، بلا صوت قبل الجواب) — S7
   ب «حَلِّلْ»: الكلمة تتفكّك إلى حروفها؛ الميم وحدها تُسحب إلى خانتها (أوّل/وسط/آخر) — S6. (لا تسمية للحروف الأخرى.)
   المحاولات (DECISIONS ح): ✗١ تلميح يعلّل · ✗٢ ضوء على الصواب · ③ «هَذا هُوَ. اِسْمَعْ مَعي:» + النموذج بهدوء. لا «خطأ».
   القطع تُعرض بأشكالها السياقية (ZWJ) فتلتحم بصرياً حين تتجاور، ثم تُستبدل بالكلمة مطبوعة كاملة. */
(function () {
  'use strict';
  const ID = 'E08';
  const L = {
    intro: 'bq7_E08_intro', self: 'bq7_E08_selfcheck', build: 'bq7_E08_build_intro', order: 'bq7_E08_hint_order', read: 'bq7_E08_read_intro',
    b: 'bq7_E08_b_intro', end: 'bq7_E08_end',
  };
  const CHAINS = [
    { links: ['مَ', 'ما'], word: 'manju' },
    { links: ['مُ', 'مو'], word: 'numur' },
  ];
  const BUILD = [
    { w: 'manju', parts: ['ما', 'نْجو'], dis: 'با' },
    { w: 'musht', parts: ['مُ', 'شْطْ'], dis: 'بُ' },
    { w: 'maktab', parts: ['مَكْ', 'تَبْ'], dis: 'فَ' },
    { w: 'miftah', parts: ['مِفْ', 'تاحْ'], dis: 'بِ' },
    { w: 'qamis', parts: ['قَ', 'ميصْ'], dis: 'بيصْ' },
    { w: 'timsah', parts: ['تِمْ', 'ساحْ'], dis: 'تِبْ' },
  ];
  const READ = [
    { w: 'musht', opts: ['musht', 'miftah', 'maktab'] },
    { w: 'manju', opts: ['manju', 'mawz', 'qamar'] },
    { w: 'qamar', opts: ['qamar', 'fam', 'qalam'] },
  ];
  const ANALYZE = ['mawz', 'qamar', 'fam'];

  const CSS = `
.e08 { justify-content: flex-start; }
.e08-top { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
.e08-body { flex: 1 1 auto; min-height: 0; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(10px, 2.4cqi, 22px); }
.e08-card { --s: min(clamp(96px, 21cqi, 200px), calc(var(--H, 600px) * .26)); position: relative; width: var(--s); aspect-ratio: 1; border-radius: 24px; border: 5px solid #fff; overflow: hidden; background: #fff; box-shadow: 0 6px 0 var(--sky-line), 0 12px 24px var(--shade); flex: none; }
.e08-card .x7-pic { border-radius: 19px; }
.e08-pic-row { display: flex; align-items: center; gap: 14px; }
/* السلاسل */
.e08-chain { display: flex; align-items: center; justify-content: center; gap: clamp(6px, 2cqi, 18px); flex-wrap: wrap; direction: rtl; }
.e08-link { position: relative; min-width: 96px; min-height: 96px; padding: 2px 18px 12px; border-radius: 22px; background: #FFFDF2; border: 3px solid #E9D7A6; box-shadow: 0 6px 0 #E2C98A, 0 10px 20px var(--shade); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
.e08-link .x7-w { font-size: clamp(40px, 8.5cqi, 76px); line-height: 1.4; }
.e08-link.is-wait { animation: x7Pulse 1.3s ease-in-out infinite; }
.e08-link.is-heard { border-color: var(--sky); box-shadow: 0 6px 0 #9ED6F0, 0 10px 20px var(--shade); }
.e08-link .e08-ear { position: absolute; top: -12px; inset-inline-start: -12px; width: 34px; height: 34px; border-radius: 50%; background: var(--sky); color: #fff; display: grid; place-items: center; box-shadow: 0 3px 0 #0084B5; }
.e08-link .e08-ear .x7-ic { width: 22px; height: 22px; }
.e08-arrow { width: 34px; height: 34px; color: var(--sky); flex: none; }
.e08-arrow svg { width: 100%; height: 100%; }
/* التركيب */
.e08-slots { display: flex; direction: rtl; align-items: stretch; justify-content: center; gap: 10px; transition: gap .35s; }
.e08-slot { min-width: clamp(84px, 17cqi, 150px); min-height: min(96px, calc(var(--H, 600px) * .17)); padding: 2px 6px 10px; border-radius: 20px; border: 3px dashed #9CC9E6; background: rgba(255,255,255,.75); display: flex; align-items: center; justify-content: center; }
.e08-slot .x7-w { font-size: clamp(40px, 8.5cqi, 76px); line-height: 1.4; }
.e08-slot.is-full { border-style: solid; border-color: transparent; background: #FFFDF2; }
.e08-slot.is-hint .x7-w { opacity: .28; }
.e08-slots.is-fused { gap: 0; }
.e08-slots.is-fused .e08-slot { border-color: transparent; background: transparent; padding-inline: 0; min-width: 0; }
.e08-word { font-size: clamp(48px, 10cqi, 92px); padding: 0 18px 10px; border-radius: 22px; background: #FFFDF2; box-shadow: 0 6px 0 #E2C98A; }
.e08-tray { display: flex; direction: rtl; flex-wrap: wrap; justify-content: center; gap: clamp(10px, 2.6cqi, 22px); min-height: 80px; padding: 10px 16px; border-radius: 22px; background: rgba(255,255,255,.55); }
/* القراءة المستقلّة */
.e08-readw { font-size: clamp(56px, 12cqi, 110px); padding: 0 26px 12px; border-radius: 24px; background: #FFFDF2; border: 3px solid #E9D7A6; box-shadow: 0 6px 0 #E2C98A; }
.e08-readw.is-pulse b { animation: x7Pulse .8s ease-in-out 3; display: inline-block; }
.e08-opts { display: flex; direction: rtl; gap: clamp(10px, 3cqi, 28px); justify-content: center; flex-wrap: wrap; }
.e08-opt { padding: 0; cursor: pointer; --s: min(clamp(96px, 24cqi, 220px), calc(var(--H, 600px) * .34)); }
.e08-opt.is-ok { border-color: var(--ok, #1B7F53); box-shadow: 0 0 0 5px var(--ok, #1B7F53), 0 12px 24px var(--shade); }
.e08-opt.is-dim { opacity: .45; filter: saturate(.5); }
.e08-opt.is-glow { box-shadow: 0 0 0 6px var(--sun), 0 0 30px var(--sun); }
/* حَلِّلْ */
.e08-split { display: flex; direction: rtl; gap: clamp(10px, 3cqi, 26px); justify-content: center; align-items: center; transition: gap .4s; }
.e08-split.is-joined { gap: 0; }
.e08-let { min-width: 74px; min-height: 84px; display: inline-flex; align-items: center; justify-content: center; padding: 0 8px 8px; }
.e08-let .x7-w { font-size: clamp(46px, 9.5cqi, 84px); line-height: 1.4; color: #9AAFC0; }
.e08-let.is-meem { border-radius: 18px; }
.e08-let.is-meem .x7-w { color: var(--coral); }
.e08-boxes { display: flex; direction: rtl; gap: clamp(10px, 3cqi, 26px); justify-content: center; }
.e08-box { width: clamp(78px, 15cqi, 120px); height: clamp(84px, 15cqi, 120px); border-radius: 20px; border: 3px dashed #9CC9E6; background: rgba(255,255,255,.8); display: grid; place-items: center; }
.e08-box.is-full { border-style: solid; border-color: var(--ok, #1B7F53); background: #E6F5EC; }
.e08-box .x7-w { font-size: clamp(44px, 9cqi, 80px); line-height: 1.4; }
/* شاشة قصيرة (هاتف أفقيّ): الصورة جانبَ الخانات والدرج */
.e08.is-short .x7-buddy { display: none; }
.e08.is-short .e08-top { position: absolute; top: 2px; inset-inline-end: 168px; z-index: 2; }
.e08.is-short .e08-body { padding-top: 36px; }
.e08.is-short .e08-top .x7-phase { display: none; }
.e08.is-short .e08-body:has(.e08-tray), .e08.is-short .e08-body:has(.e08-boxes), .e08.is-short .e08-body:has(.e08-opts) { display: grid; grid-template-columns: auto auto; align-content: center; justify-content: center; column-gap: 18px; row-gap: 10px; }
.e08.is-short .e08-body:has(.e08-tray) > .e08-pic-row, .e08.is-short .e08-body:has(.e08-boxes) > .e08-card, .e08.is-short .e08-body:has(.e08-opts) > .e08-readw { grid-row: 1 / span 2; align-self: center; }
.e08.is-short .e08-slot { min-height: 64px; }
.e08.is-short .e08-tray { min-height: 0; padding: 6px 10px; }
.e08.is-short .e08-let { min-height: 64px; }
.e08.is-short .e08-box { height: 66px; }
@container stage (max-width: 520px) {
  .e08-card { --s: 104px; }
  .e08-slot { min-height: 84px; }
  .e08-link { min-width: 76px; min-height: 80px; padding: 2px 10px 10px; }
  .e08-arrow { width: 22px; height: 22px; }
}
`;
  const ARROW = '<svg viewBox="0 0 48 48"><path d="M30 10 16 24l14 14" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function run(stage, ctx) {
    const X = BQ.ix7b, h = BQ.h, W = X.W;
    X.style('st-e08', CSS);
    const S = X.session(ctx);
    const root = X.root(ctx, 'e08');
    const top = h('div.e08-top');
    const ph = X.phase(top, ['اِقْرَأْ وَرَكِّبْ', 'حَلِّلْ']);
    const total = CHAINS.length + BUILD.length + READ.length + ANALYZE.length;
    const dots = X.dots(top, total);
    const body = h('div.e08-body');
    root.append(top, body);
    const buddy = X.buddy(root);
    const log = { build: [], read: [], analyze: [] };
    const fitH = () => { const H = stage.clientHeight || 600; root.style.setProperty('--H', H + 'px'); root.classList.toggle('is-short', H < 420); };
    fitH();
    if (window.ResizeObserver) { const ro = new ResizeObserver(fitH); ro.observe(stage); ctx.onCleanup(() => ro.disconnect()); }
    let k = 0;
    const clear = () => body.replaceChildren();
    const yes = async () => { buddy.mood('cheer', 2000); S.fx(X.sfx.ok, 0.45); await S.say(X.yes()); };

    /* وضع المراجعة: S7 ← E08 الخطوة 'a' (نبدأ بالتركيب) · 'b' حَلِّلْ */
    let from = 'a1';
    if (ctx.step === 'b') from = 'b'; else if (ctx.review || ctx.step === 'a') from = 'a2';
    note();
    (async () => {
      if (from === 'a1') { ph.set(0); ctx.instruction(X.text(L.intro), L.intro, { icon: 'eye' }); await S.say(L.intro); for (const c of CHAINS) { dots.set(k++); await chain(c); } }
      else k = CHAINS.length;
      if (from !== 'b') {
        ph.set(0);
        ctx.instruction(X.text(L.build), L.build, { icon: 'hand' });
        await S.say(L.build);
        for (const it of BUILD) { dots.set(k++); await build(it); }
        ctx.instruction(X.text(L.read), L.read, { icon: 'eye' });
        await S.say(L.read);
        for (const it of READ) { dots.set(k++); await read(it); }
      } else k = CHAINS.length + BUILD.length + READ.length;
      ph.set(1);
      ctx.instruction(X.text(L.b), L.b, { icon: 'hand' });
      clear();
      await X.nameSound(S, L.b);
      for (const w of ANALYZE) { dots.set(k++); await analyze(w); }
      dots.set(total);
      ctx.done();
      buddy.mood('cheer', 4000);
      await S.say(L.end);
      X.end(ctx, S, {});
    })();

    /* ---------- أ١ سلسلة القراءة ---------- */
    async function chain(c) {
      clear();
      const row = h('div.e08-chain');
      const picBox = h('div.e08-card', { hidden: true }, X.pic(ctx, W[c.word].img));
      const wrap = h('div.e08-pic-row', null, row, picBox);
      body.append(wrap);
      const items = c.links.map((s) => ({ text: s, au: X.sylId(s) })).concat([{ text: W[c.word].t, au: X.wordId(c.word), word: true }]);
      for (let i = 0; i < items.length; i++) {
        if (i) row.append(h('span.e08-arrow.x7-in', { 'aria-hidden': 'true', html: ARROW }));
        const it = items[i];
        const b = h('button.e08-link.x7-in.is-wait', { type: 'button', 'aria-label': 'اِلْمِسْ وَاسْمَعْ' }, X.markMeem(it.text), h('span.e08-ear', { 'aria-hidden': 'true' }, X.icon('ear')));
        row.append(b);
        await S.sleep(it.word ? 900 : 600); // وقت ليقرأ بصوته أوّلاً
        await new Promise((res) => {
          let busy = false;
          b.addEventListener('click', async () => {
            if (busy) return; busy = true;
            b.classList.remove('is-wait'); b.classList.add('is-heard');
            X.anim(b, 'fx7-pop', 450);
            await S.say(it.au, { stim: true });
            if (it.word) { picBox.hidden = false; picBox.classList.add('x7-in'); }
            buddy.mood('talk', 1200);
            await S.say(L.self);
            res();
          });
        });
      }
      await S.sleep(700);
    }

    /* ---------- أ٢ التركيب بالسحب ---------- */
    async function build(it) {
      clear();
      const w = W[it.w];
      const ear = h('button.x7-ear', { type: 'button', 'aria-label': 'اِسْمَعِ الكَلِمَةَ', onclick: () => S.say(X.wordId(it.w), { stim: true }) }, X.icon('ear'));
      const card = h('div.e08-card.x7-in', null, X.pic(ctx, w.img));
      body.append(h('div.e08-pic-row', null, card, ear));
      const pcs = X.pieces(it.parts);
      const slots = h('div.e08-slots');
      const tray = h('div.e08-tray');
      body.append(slots, tray);
      const slotEls = pcs.map((p, i) => h('div.e08-slot', { 'aria-label': 'خانَةٌ ' + X.AR(i + 1), dataset: { i } }));
      slots.append(...slotEls);
      // القطع: الصحيحتان بشكلهما السياقيّ + المشتِّتة بشكل الخانة الأولى
      const disShape = X.pieces([it.dis].concat(it.parts.slice(1)))[0].t;
      const tilesData = pcs.map((p, i) => ({ src: p.src, t: p.t, slot: i })).concat([{ src: it.dis, t: disShape, slot: -1 }]);
      let errors = 0, filled = 0, done = false, resolve;
      const fin = new Promise((r) => { resolve = r; });
      const dnd = X.dnd({
        root: body,
        onPick: (t) => { const a = X.sylId(t._d.src); if (a && ctx.hasAudio(a)) S.say(a, { stim: true }); },
        onDrop: (t, z) => {
          if (done) return false;
          const ok = t._d.slot === +z.dataset.i;
          if (ok) { place(t, z); return true; }
          wrong(t);
          return false;
        },
      });
      BQ.shuffle(tilesData).forEach((d) => tray.append(dnd.tile(h('div.x7-in', { 'aria-label': 'قِطْعَةٌ', dataset: { slot: d.slot } }, h('span.x7-w', null, d.t)), d)));
      slotEls.forEach((z, i) => dnd.zone(z, { i }));
      await S.say(X.wordId(it.w), { stim: true });
      function place(t, z) {
        z.replaceChildren(h('span.x7-w', null, t._d.t));
        z.classList.add('is-full'); z.classList.remove('is-hint');
        t.classList.add('is-used');
        S.fx(X.sfx.snap, 0.5);
        if (++filled === pcs.length) complete();
      }
      async function wrong(t) {
        errors++;
        X.anim(t, 'fx7-wob', 450);
        if (errors === 1) { buddy.mood('think', 1500); await S.say(L.order); await S.say(X.segId(it.w), { stim: true }); }
        else if (errors === 2) {
          const z = slotEls.find((s) => !s.classList.contains('is-full'));
          if (z) { z.classList.add('is-hint'); z.replaceChildren(h('span.x7-w', null, pcs[+z.dataset.i].t)); }
          [...tray.children].forEach((c) => { if (c._d && z && c._d.slot === +z.dataset.i) c.classList.add('is-glow'); });
          await S.say(X.G.light);
        } else if (errors >= 3 && !done) {
          done = true;
          await S.say(X.G.model);
          [...tray.children].forEach((c) => { if (c._d.slot >= 0 && !c.classList.contains('is-used')) { const z = slotEls[c._d.slot]; z.replaceChildren(h('span.x7-w', null, c._d.t)); z.classList.add('is-full'); c.classList.add('is-used'); } else if (c._d.slot < 0) c.classList.add('is-dim'); });
          await fuse(false);
        }
      }
      async function complete() { if (done) return; done = true; tray.querySelectorAll('.x7-tile').forEach((c) => { if (!c.classList.contains('is-used')) c.classList.add('is-dim'); }); await fuse(true); }
      async function fuse(good) {
        slots.classList.add('is-fused');
        await S.sleep(420);
        const word = h('div.e08-word.x7-in', null, X.markMeem(w.t));
        slots.replaceChildren(word);
        if (good) X.burst(word, 12);
        await S.say(X.wordId(it.w), { stim: true });
        if (good) await yes(); else await S.say(X.G.next);
        const ok1 = good && errors === 0;
        X.record(ctx, 'S7', ok1, { task: 'build', word: it.w });
        log.build.push({ w: w.t, errors, ok: ok1 }); note();
        await S.sleep(600);
        resolve();
      }
      await fin;
    }

    /* ---------- أ٣ القراءة المستقلّة ---------- */
    async function read(it) {
      clear();
      const w = W[it.w];
      const wordEl = h('div.e08-readw.x7-in', { dataset: { k: it.w } }, X.markMeem(w.t));
      const opts = h('div.e08-opts');
      body.append(wordEl, opts);
      let tries = 0, over = false, resolve;
      const fin = new Promise((r) => { resolve = r; });
      const btns = BQ.shuffle(it.opts).map((o) => {
        const b = h('button.e08-card.e08-opt.x7-in', { type: 'button', 'aria-label': 'صورَةٌ', dataset: { k: o } }, X.pic(ctx, W[o].img));
        b.addEventListener('click', () => pick(b, o));
        return b;
      });
      opts.append(...btns);
      async function pick(b, o) {
        if (over || b.classList.contains('is-dim')) return;
        tries++;
        if (o === it.w) {
          over = true;
          b.classList.add('is-ok'); X.burst(b, 12);
          await S.say(X.wordId(it.w), { stim: true });
          await yes();
          finish(tries === 1);
          return;
        }
        b.classList.add('is-dim'); X.anim(b, 'fx7-wob', 450);
        if (tries === 1) { buddy.mood('think', 1500); wordEl.classList.add('is-pulse'); setTimeout(() => wordEl.classList.remove('is-pulse'), 2500); await S.say(X.G.try); }
        else if (tries === 2) { const c = btns.find((x) => x.dataset.k === it.w); c.classList.add('is-glow'); await S.say(X.G.light); }
        else {
          over = true;
          const c = btns.find((x) => x.dataset.k === it.w); c.classList.remove('is-glow'); c.classList.add('is-ok');
          await S.say(X.G.model); await S.say(X.wordId(it.w), { stim: true });
          finish(false);
        }
      }
      async function finish(ok1) {
        X.record(ctx, 'S7', ok1, { task: 'read', word: it.w });
        log.read.push({ w: w.t, tries, ok: ok1 }); note();
        await S.sleep(700);
        resolve();
      }
      await fin;
    }

    /* ---------- ب حَلِّلْ ---------- */
    async function analyze(key) {
      clear();
      const w = W[key];
      const card = h('div.e08-card.x7-in', null, X.pic(ctx, w.img));
      const wordRow = h('div.e08-split.is-joined');
      const pcs = X.pieces(w.letters);
      const mIdx = w.letters.findIndex((l) => X.bare(l) === 'م');
      const letEls = pcs.map((p, i) => h('span.e08-let' + (i === mIdx ? '.is-meem' : ''), null, h('span.x7-w', null, p.t)));
      wordRow.append(...letEls);
      body.append(card, wordRow);
      await S.say(X.wordId(key), { stim: true });
      // التفكّك: الحروف تنفصل إلى أشكالها المنفردة
      await S.sleep(300);
      letEls.forEach((el, i) => { el.firstChild.textContent = w.letters[i]; });
      wordRow.classList.remove('is-joined');
      await S.sleep(500);
      const boxes = h('div.e08-boxes', { dataset: { m: mIdx } });
      const boxEls = w.letters.map((l, i) => h('div.e08-box.x7-in', { 'aria-label': 'خانَةٌ ' + X.AR(i + 1), dataset: { i } }));
      boxes.append(...boxEls);
      body.append(boxes);
      let errors = 0, over = false, resolve;
      const fin = new Promise((r) => { resolve = r; });
      const meem = letEls[mIdx];
      const dnd = X.dnd({
        root: body,
        onDrop: (t, z) => {
          if (over) return false;
          if (+z.dataset.i === mIdx) { good(z); return true; }
          bad(); return false;
        },
      });
      dnd.tile(meem, { i: mIdx });
      meem.classList.add('x7-in');
      boxEls.forEach((z, i) => dnd.zone(z, { i }));
      const posLine = X.G.pos[w.pos];
      async function good(z) {
        over = true;
        z.replaceChildren(h('span.x7-w', null, w.letters[mIdx])); z.classList.add('is-full');
        meem.classList.add('is-used');
        S.fx(X.sfx.snap, 0.5);
        await S.sleep(450);
        await rejoin(true);
      }
      async function bad() {
        errors++;
        X.anim(meem, 'fx7-wob', 450);
        if (errors === 1) { buddy.mood('think', 1500); await S.say(X.G.hintStart); await S.say(X.segId(key), { stim: true }); }
        else if (errors === 2) { boxEls[mIdx].classList.add('is-glow'); await S.say(X.G.light); }
        else if (!over) {
          over = true;
          boxEls[mIdx].classList.remove('is-glow');
          boxEls[mIdx].replaceChildren(h('span.x7-w', null, w.letters[mIdx])); boxEls[mIdx].classList.add('is-full');
          meem.classList.add('is-used');
          await S.say(X.G.model);
          await rejoin(false);
        }
      }
      async function rejoin(ok) {
        boxes.remove();
        meem.classList.remove('is-used', 'x7-tile'); meem.style.visibility = 'visible';
        wordRow.replaceChildren(h('div.e08-word.x7-in', null, X.markMeem(w.t)));
        if (ok) { X.burst(wordRow, 12); await yes(); }
        await S.say(posLine);
        const ok1 = ok && errors === 0;
        X.record(ctx, 'S6', ok1, { task: 'analyze', word: key });
        log.analyze.push({ w: w.t, errors, ok: ok1 }); note();
        await S.sleep(700);
        resolve();
      }
      await fin;
    }

    function note() {
      const esc = X.esc, AR = X.AR;
      const row = (r) => '<tr><td>' + esc(r.w) + '</td><td>' + (r.ok ? 'من المحاولة الأولى' : 'بعد مساعدة') + '</td></tr>';
      const tbl = (t, a) => a.length ? '<p><b>' + t + '</b></p><table class="x7-log"><tbody>' + a.map(row).join('') + '</tbody></table>' : '';
      const okN = (a) => a.filter((r) => r.ok).length;
      X.note(ctx, '<p><b>ما يجري:</b> أ١ سلسلتا قراءة (مَ ← ما ← مانْجو · مُ ← مو ← نُمور): يقرأ الطفل بصوته أوّلاً ثم يلمس ليتحقّق. ' +
        'أ٢ يركّب ٦ كلمات بسحب المقاطع (قطعة مشتِّتة في كلّ بند). أ٣ يقرأ ٣ كلمات وحده ويلمس صورتها (لا صوت قبل الجواب). ' +
        'ب «حَلِّلْ»: تتفكّك الكلمة (مَوْز · قَمَر · فَم) ويضع الطفل الميم في خانة موضعها.</p>' +
        '<p><b>للمعلّم:</b> القطعة الأولى في التركيب = الميم وحركتها (مُ + شْطْ، ما + نْجو)؛ هذا تركيب للقراءة لا تقطيع عروضيّ.</p>' +
        '<p><b>المحاولات:</b> الأولى تلميح يعلّل (ابدأ من اليمين / الكلمة مقطّعة) · الثانية ضوء على الصواب · الثالثة يُعرض الجواب بهدوء. قرائن S7 (أ٢، أ٣) وS6 (ب) — الحكم في E11.</p>' +
        '<p><b>النجاح:</b> أ٣ ٢ من ٣ من المحاولة الأولى على الأقلّ + ب ٢ من ٣.' + (log.read.length ? ' الآن: أ٣ ' + AR(okN(log.read)) + '/' + AR(log.read.length) : '') + (log.analyze.length ? ' · ب ' + AR(okN(log.analyze)) + '/' + AR(log.analyze.length) : '') + '</p>' +
        tbl('التركيب', log.build) + tbl('القراءة المستقلّة', log.read) + tbl('حَلِّلْ', log.analyze));
    }
  }

  BQ.register(ID, {
    render(stage, ctx) {
      BQ.loadScript('js/el7/ix7b.js').then(() => { if (ctx.alive()) run(stage, ctx); })
        .catch((e) => { console.warn('[E08] ' + e.message); if (ctx.placeholder) ctx.placeholder(); });
    },
  });
})();
