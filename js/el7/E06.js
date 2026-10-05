/* E06 · اِكْتَشِفِ الحَرْفَ — IX1 · v7 (قاعدة: النسخة الأولى — عنصر جديد بلغة «اقرأ» الأصليّ: بطاقة ورقية للحرف + صور) · draft_unapproved
   SPEC_v7 §E06 · الناتج 2 · S5 · DECISIONS (ب): هنا فقط يظهر الرمز «م» واسمه «المِيم» — والاسم يتبعه الصوت دائماً.
   ماذا يستطيع بعده ولم يكن قبله؟ يربط صوت /م/ بالرمز «م»، ويعرف اسمه مقروناً بصوته، ويجده بعينه داخل كلمة مكتوبة سمعها.
   ١ bq7_E06_recall (لقطة الفم، بلا كتابة) · ٢ الكشف: لوح بارق (e06_board) ← «م» يُرسَم كبيراً لحظة bq7_E06_reveal ← bq7_E06_brq_wow
   ٣ bq7_E06_vowels ← مَ مِ مُ مكتوبة · bq7_E06_tap_vowels (يجب لمس الثلاث؛ كلّ لمسة تُسمِع المقطع)
   ٤ bq7_E06_find_intro ← مُشْطْ · مِفْتاحْ · نُمورْ (الميم في الوسط): الكلمة بخطّ النسخ الحقيقيّ وكلّ حرف منطقة لمس (عقدة نصّ واحدة بتشكيل حقيقيّ + مناطق لمس مقيسة بـ Range — I.tapWord)
     ✓ الميم تضيء مرجانياً + G_yes* + E06_ok_letter + _seg · ✗١ G_look_shape («م» الكبيرة تنبض) · ✗٢ G_look_light (الميم تتوهّج) · ③ G_model + _seg
   ٥ bq7_E06_match_intro — من الصوت إلى الرمز، الخيارات مكتوبة **صامتة** حتى الحكم: مُ (بُ · فُ) · مِ (نِ · فِ) · ما (با · فا)
     ✓ G_yes* + المقطع · ✗١ G_look_shape + إعادة الصوت · ✗٢ يخفت مشتّت + G_look_light · ③ G_model + المقطع. النهاية bq7_E06_end.
   record('S5', ok1) لكلّ بند في ٤ و٥. ctx.step 'words' | 'match'.
   جولة إصلاح 2026-10-05: الاسم «المِيم» لا يُقال وحده أبداً — يتبعه الصوت «مَ» فوراً (DECISIONS ب · R1-10):
   الكشف ← bq7_E06_brq_wow مباشرة («حَرْفُ المِيمِ! صَوْتُهُ: مَ!») · الإصابة في الكلمة ← brq_wow بدل ok_letter (الاسم وحده) ·
   find_intro (الاسم وحده إلى أن يُعاد تسجيله) ← يتبعه «مَ» وبطاقة «م» تنبض. مناطق لمس الحروف ≥ ٦٠ نقطة (R3-F3، I.tapWord). */
(function () {
  'use strict';
  const ID = 'E06';
  const lib = () => (BQ.ix1 ? Promise.resolve(BQ.ix1) : BQ.loadScript('js/el7/lib/ix1.js').then(() => BQ.ix1));

  const CSS = `
.e06 { justify-content: space-between; }
.e06 .e06-main { position: relative; flex: 1 1 auto; min-height: 0; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(10px, 2.4cqi, 22px); }
.e06 .e06-mouthw { width: min(30cqi, calc(var(--i7-h) - 140px), 320px); }
.e06 .e06-mouthw .i7-mouth { width: 100%; border-radius: var(--r-lg, 26px); }
/* اللوح */
.e06 .e06-boardw { position: relative; width: min(72cqi, calc((var(--i7-h) - 90px) * 1.5), 720px); aspect-ratio: 3 / 2; }
.e06 .e06-board { position: absolute; inset: 6% 4% 10% 22%; border-radius: 22px; background: linear-gradient(180deg, #FFFDF4, var(--paper, #FFFBEA)); border: 8px solid #D9A35C;
  box-shadow: inset 0 0 0 3px #F1DFA6, 0 14px 30px rgba(110,60,10,.22); display: grid; place-items: center; overflow: hidden; }
.e06 .e06-board.is-art { inset: 0; border: 0; background: center/cover no-repeat; box-shadow: 0 14px 30px var(--shade); border-radius: var(--r-lg, 26px); }
.e06 .e06-board svg { width: 78%; height: 88%; overflow: visible; }
.e06 .e06-board svg text { font-family: var(--ff-child); font-weight: 700; font-size: 232px; fill: rgba(228,85,63,0); stroke: var(--coral, #E4553F); stroke-width: 5; stroke-linejoin: round; stroke-dasharray: 1700; stroke-dashoffset: 1700; }
.e06 .e06-board.drawn svg text { animation: e06Draw 1.5s ease-out forwards; }
.e06 .e06-board.lit svg text { fill: var(--coral, #E4553F); stroke: #F7A08F; filter: drop-shadow(0 0 14px rgba(254,186,2,.65)); transition: fill .5s; }
@keyframes e06Draw { to { stroke-dashoffset: 0; } }
.e06 .e06-holder { position: absolute; bottom: 0; inset-inline-end: 0; width: 30%; aspect-ratio: 1; }
.e06 .e06-holder .bq-brq { width: 100%; height: 100%; }
.e06 .e06-holder .bq-brq img { width: 100%; height: 100%; object-fit: contain; }
.e06 .e06-boardw.is-art .e06-holder { display: none; }
/* لوح ART (1600×900): السطح الأبيض ≈ 7%–62% أفقياً و19%–78% عمودياً — الحرف يُرسم داخله لا فوق بارق */
.e06 .e06-boardw.is-art { aspect-ratio: 16 / 9; width: min(76cqi, calc((var(--i7-h) - 90px) * 1.78), 820px); }
.e06 .e06-board.is-art svg { position: absolute; left: 7.5%; top: 19%; width: 55%; height: 58%; }
/* بطاقات الحرف (ورقية كما في «اقرأ» الأصليّ) */
.e06 .e06-tiles { display: flex; gap: clamp(14px, 4cqi, 40px); justify-content: center; }
.e06 .e06-tile { position: relative; width: min(22cqi, calc(var(--i7-h) - 230px), 180px); min-width: 96px; aspect-ratio: 1; border-radius: var(--r-lg, 26px); border: 2px solid var(--paper-edge, #F1DFA6); background: var(--paper, #FFFBEA); cursor: pointer; padding: 0;
  box-shadow: 0 6px 0 var(--paper-edge, #F1DFA6), 0 12px 22px var(--shade); display: grid; place-items: center; transition: transform .2s, opacity .3s, box-shadow .25s; }
.e06 .e06-tile span { font: 700 min(11cqi, 92px)/1 var(--ff-child); color: var(--ink, #0F2A44); transform: translateY(-15%); } /* الضمّة فوق والكسرة تحت داخل البطاقة */
.e06 .e06-tile span b { color: var(--coral); font-weight: 700; }
.e06 .e06-tile.is-play { box-shadow: 0 0 0 6px var(--sky), 0 12px 22px var(--shade); transform: translateY(-5px); }
.e06 .e06-tile.is-heard::after { content: ''; position: absolute; top: -10px; inset-inline-end: -10px; width: 32px; height: 32px; border-radius: 50%; background: var(--sky) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath d='M11 25l9 9 17-19' fill='none' stroke='%23fff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/70% no-repeat; }
.e06 .e06-tile.is-ok { box-shadow: 0 0 0 6px var(--ok), 0 12px 22px var(--shade); }
.e06 .e06-tile.is-soft, .e06 .e06-tile.is-glow { box-shadow: 0 0 0 7px var(--sun-soft), 0 0 30px var(--sun-soft); }
.e06 .e06-tile.is-dim { opacity: .35; }
.e06 .e06-tile:active { transform: scale(.95); }
.e06 .e06-tile.need:not(.is-heard) { animation: i7Pulse 1.6s ease-in-out infinite; }
/* الكلمة */
.e06 .e06-wrow { display: flex; align-items: center; justify-content: center; gap: clamp(14px, 4cqi, 44px); flex-wrap: wrap; }
.e06 .e06-wpic { --s: min(24cqi, calc(var(--i7-h) - 300px), 210px); min-width: 96px; }
.e06 .e06-word { font-size: clamp(72px, 13cqi, 140px); padding: 0 .4em; text-align: center; border-radius: var(--r-lg, 26px); background: var(--paper, #FFFBEA); border: 2px solid var(--paper-edge, #F1DFA6); box-shadow: 0 10px 24px var(--shade); }
.e06 .e06-ref { display: inline-grid; place-items: center; width: 92px; height: 92px; border-radius: 26px; background: var(--paper, #FFFBEA); color: var(--coral); font: 700 66px/1 var(--ff-child); border: 2px solid var(--paper-edge); box-shadow: 0 5px 0 var(--paper-edge); padding: 0; cursor: pointer; }
.e06 .e06-ref span { transform: translateY(-8%); }
.e06 .e06-ref.is-hint { animation: i7Pulse .8s ease-in-out 3; box-shadow: 0 0 0 5px var(--sun), 0 0 24px var(--sun); }
@container stage (max-width: 600px) {
  .e06 .e06-boardw, .e06 .e06-boardw.is-art { width: 94cqi; }
  .e06 .e06-tile { width: 27cqi; min-width: 92px; } .e06 .e06-tile span { font-size: 14cqi; }
  .e06 .e06-word { font-size: 22cqi; padding: 0 .4em; min-width: min(100cqi, 312px); } .e06 .e06-wpic { --s: min(36cqi, calc(var(--i7-h) - 440px), 150px); }
  .e06 .e06-mouthw { width: 56cqi; }
}
@media (max-height: 500px) {
  .e06 .e06-main { flex-direction: row; gap: 16px; }
  .e06 .e06-mouthw { width: max(120px, calc(var(--i7-h) - 40px)); }
  .e06 .e06-boardw.is-art, .e06 .e06-boardw { width: calc((var(--i7-h) - 30px) * 1.78); }
  .e06 .e06-wrow { flex-wrap: nowrap; gap: 16px; }
  .e06 .e06-word { font-size: min(80px, calc((var(--i7-h) - 40px) / 2.3)); min-width: 312px; }
  .e06 .e06-wpic { --s: max(96px, calc(var(--i7-h) - 110px)); }
  .e06 .e06-ref { width: 64px; height: 64px; font-size: 46px; border-radius: 18px; }
  .e06 .e06-tile { width: max(96px, calc(var(--i7-h) - 100px)); }
  .e06 .e06-tile span { font-size: min(64px, calc(var(--i7-h) / 3.6)); }
}
@media (prefers-reduced-motion: reduce) { .e06 .e06-board.drawn svg text { animation: none; stroke-dashoffset: 0; } .e06 .e06-ref.is-hint, .e06 .e06-tile.need { animation: none !important; } }`;

  function render(stage, ctx) {
    lib().then((I) => { if (ctx.alive()) run(I, stage, ctx); })
      .catch((e) => { console.warn('E06 lib', e); if (ctx.placeholder) ctx.placeholder(); });
  }

  function run(I, stage, ctx) {
    const h = BQ.h;
    if (!document.getElementById('st-e06')) document.head.append(h('style', { id: 'st-e06' }, CSS));
    const S = I.session(ctx, { noText: false });
    I.lines({
      bq7_E06_recall: 'سَمِعْنا هَذا الصَّوْتَ: مَ… مِ… مُ.', bq7_E06_reveal: 'وَهَذا شَكْلُهُ: م. هَذا حَرْفُ المِيمِ.', bq7_E06_brq_wow: 'حَرْفُ المِيمِ! صَوْتُهُ: مَ!',
      bq7_E06_vowels: 'المِيمُ مَعَ الحَرَكاتِ: مَ… مِ… مُ.', bq7_E06_tap_vowels: 'اِلْمِسْ كُلَّ واحِدَةٍ، وَاسْمَعْ.',
      bq7_E06_find_intro: 'اِسْمَعِ الكَلِمَةَ، وَالْمِسِ المِيمَ — صَوْتُها مَ — فيها.', bq7_E06_ok_letter: 'هَذا حَرْفُ المِيمِ، صَوْتُهُ مَ.',
      bq7_E06_match_intro: 'اِسْمَعْ، وَالْمِسِ المَكْتوبَ الَّذي سَمِعْتَهُ.', bq7_E06_end: 'الآنَ نَعْرِفُ شَكْلَ صَوْتِنا: م!',
    });
    const SYL = [{ s: 'ma', g: 'مَ' }, { s: 'mi', g: 'مِ' }, { s: 'mu', g: 'مُ' }];
    const WORDS = [{ slug: 'musht' }, { slug: 'miftah' }, { slug: 'numur' }];
    const MATCH = [{ s: 'mu', opts: ['مُ', 'بُ', 'فُ'] }, { s: 'mi', opts: ['مِ', 'نِ', 'فِ'] }, { s: 'maa', opts: ['ما', 'با', 'فا'] }];
    const sid = (s) => 'bq7_S_' + s;
    const colorM = (g) => (g[0] === 'م' ? '<b>' + g + '</b>' : g);

    const root = I.root(stage, 'e06');
    const top = h('div.i7-row');
    const steps = I.stars(top, 2 + WORDS.length + MATCH.length);
    const main = h('div.e06-main');
    root.append(top, main);
    const buddy = I.buddy(S, root, 'wave');
    let busy = true, si = 0;
    const log = [];

    async function recall() {
      steps.cur(si);
      const mw = h('div.e06-mouthw'); const mouth = I.mouth(S); mw.append(mouth.el);
      main.replaceChildren(mw);
      I.instr(S, 'bq7_E06_recall', 'ear', async () => { if (busy) return; busy = true; await mouth.sayLine('bq7_E06_recall', 'a', 1.6); busy = false; });
      await S.sleep(400);
      await mouth.sayLine('bq7_E06_recall', 'a', 1.6);
    }

    async function reveal() {
      const art = I.hasImg('e06_board');
      const board = h('div.e06-board' + (art ? '.is-art' : ''), { role: 'img', 'aria-label': 'الحَرْفُ م' });
      if (art) board.style.backgroundImage = 'url("' + I.imgSrc('e06_board') + '")';
      board.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 400 300" aria-hidden="true"><text x="200" y="176" text-anchor="middle">م</text></svg>');
      const wrap = h('div.e06-boardw' + (art ? '.is-art' : ''), null, board, h('span.e06-holder', null, BQ.ui.brq('point')));
      main.replaceChildren(wrap);
      buddy.el.style.visibility = 'hidden';
      I.instr(S, 'bq7_E06_reveal', 'eye', async () => { if (busy) return; busy = true; await S.say('bq7_E06_reveal'); busy = false; });
      await S.sleep(400);
      const p = S.say('bq7_E06_reveal');
      await S.wait(1100);
      I.sfx('rise'); board.classList.add('drawn');
      await S.wait(I.reduced() ? 150 : 1400);
      board.classList.add('lit'); I.sfx('sparkle'); I.burst(root, board, 26);
      await p;
      wrap.querySelector('.e06-holder .bq-brq').brq && wrap.querySelector('.e06-holder .bq-brq').brq('cheer');
      await S.say('bq7_E06_brq_wow', { talk: true }); // بلا فاصل: «…حَرْفُ المِيمِ.» ← «حَرْفُ المِيمِ! صَوْتُهُ: مَ!» (الاسم لا يبقى وحده)
      buddy.el.style.visibility = '';
      steps.on(si++);
    }

    async function vowels() {
      steps.cur(si);
      const wrap = h('div.e06-tiles', { role: 'group', 'aria-label': 'مَ مِ مُ' });
      const tiles = SYL.map((x, i) => { const t = h('button.e06-tile', { type: 'button', 'aria-label': x.g, lang: 'ar' }, h('span', { html: colorM(x.g) })); t.x = x; t.classList.add('i7-in'); t.style.animationDelay = (i * 0.12) + 's'; wrap.append(t); return t; });
      main.replaceChildren(wrap);
      const p = S.say('bq7_E06_vowels');
      for (const t of tiles) { await S.wait(900); t.classList.add('is-play'); setTimeout(() => t.classList.remove('is-play'), 600); }
      await p;
      I.instr(S, 'bq7_E06_tap_vowels', 'hand', async () => { if (busy) return; busy = true; await S.say('bq7_E06_tap_vowels'); busy = false; });
      await S.say('bq7_E06_tap_vowels');
      tiles.forEach((t) => t.classList.add('need'));
      let res = null;
      tiles.forEach((t) => t.addEventListener('click', async () => {
        if (busy) return; busy = true;
        await I.playOn(S, t, sid(t.x.s));
        t.classList.add('is-heard'); busy = false;
        if (res && tiles.every((x) => x.classList.contains('is-heard'))) { const r = res; res = null; r(); }
      }));
      busy = false;
      await S.gate(new Promise((r) => { res = r; }));
      busy = true;
      I.sfx('sparkle'); buddy.cheer();
      await S.sleep(500);
      steps.on(si++);
    }

    async function words() {
      for (const w of WORDS) {
        steps.cur(si);
        const info = I.W[w.slug];
        const tw = I.tapWord(info.w, { aria: info.w, minW: 60 }); // تشكيل حقيقيّ + مناطق لمس مقيسة (lib)
        const word = tw.el; word.classList.add('e06-word');
        const spans = tw.cl.map((c) => c.hit);
        const tIdx = tw.cl.findIndex((c) => c.b === 'م');
        const target = spans[tIdx];
        const pic = I.card(w.slug, { aria: info.w, text: true }); pic.classList.add('e06-wpic', 'i7-in');
        const refB = h('button.e06-ref', { type: 'button', 'aria-label': 'م', lang: 'ar' }, h('span', null, 'م'));
        main.replaceChildren(refB, h('div.e06-wrow', null, pic, word));
        word.classList.add('i7-in');
        const sayWord = () => I.playOn(S, pic, I.wordId(w.slug));
        pic.addEventListener('click', async () => { if (busy) return; busy = true; await sayWord(); busy = false; });
        refB.addEventListener('click', async () => { if (busy) return; busy = true; refB.classList.add('is-hint'); await S.stim(sid('ma')); refB.classList.remove('is-hint'); busy = false; });
        // الاسم يتبعه الصوت: سطر find_intro المسجَّل يذكر «حَرْفَ المِيمِ» وحده ← «مَ» فوراً مع نبض بطاقة «م»
        const findIntro = async () => { await S.say('bq7_E06_find_intro'); refB.classList.remove('is-hint'); void refB.offsetWidth; refB.classList.add('is-hint'); await S.stim(sid('ma')); await S.sleep(250); };
        I.instr(S, 'bq7_E06_find_intro', 'hand', async () => { if (busy) return; busy = true; await findIntro(); await sayWord(); busy = false; });
        let n = 0, first = null;
        await new Promise((resolve) => {
          const tap = async (s) => {
            if (busy || s.classList.contains('is-m')) return;
            busy = true;
            if (s === target) {
              if (first == null) { first = true; I.record(S, 'S5', true, { item: w.slug }); log.push([info.w, true]); }
              tw.unpaint(tIdx, 'is-hint'); tw.paint(tIdx, 'is-m'); I.sfx('ok'); I.burst(root, s, 16); buddy.cheer();
              await S.say(I.yes(), { talk: true });
              await S.say('bq7_E06_brq_wow', { talk: true }); // «حَرْفُ المِيمِ! صَوْتُهُ: مَ!» — الاسم مقروناً بالصوت (ok_letter المسجَّل يقول الاسم وحده)
              await I.playOn(S, pic, I.segId(w.slug));
              await S.sleep(350);
              return resolve();
            }
            if (first == null) { first = false; I.record(S, 'S5', false, { item: w.slug }); log.push([info.w, false]); }
            const si2 = s.idx; tw.paint(si2, 'is-try'); I.sfx('soft'); setTimeout(() => tw.unpaint(si2, 'is-try'), 700);
            n++; buddy.think();
            if (n === 1) { refB.classList.remove('is-hint'); void refB.offsetWidth; refB.classList.add('is-hint'); await S.say('bq7_G_look_shape'); busy = false; return; }
            if (n === 2) { tw.paint(tIdx, 'is-hint'); await S.say('bq7_G_look_light'); busy = false; return; }
            tw.unpaint(tIdx, 'is-hint'); tw.paint(tIdx, 'is-m'); buddy.point();
            await S.say('bq7_G_model'); await I.playOn(S, pic, I.segId(w.slug)); await S.say('bq7_G_next');
            return resolve();
          };
          spans.forEach((s) => s.addEventListener('click', () => tap(s)));
          (async () => { busy = true; await S.sleep(450); if (w === WORDS[0]) await findIntro(); await sayWord(); busy = false; })();
        });
        steps.on(si++);
        busy = true;
      }
    }

    async function match() {
      for (let k = 0; k < MATCH.length; k++) {
        const it = MATCH[k];
        steps.cur(si);
        const refB = h('button.e06-ref', { type: 'button', 'aria-label': 'م', lang: 'ar', tabindex: '-1' }, h('span', null, 'م'));
        const wrap = h('div.e06-tiles', { role: 'group', 'aria-label': 'مَكْتوبٌ' });
        const tiles = BQ.shuffle(it.opts).map((g, i) => { const t = h('button.e06-tile', { type: 'button', 'aria-label': g, lang: 'ar' }, h('span', { html: g })); t.g = g; t.classList.add('i7-in'); t.style.animationDelay = (i * 0.1) + 's'; wrap.append(t); return t; });
        main.replaceChildren(refB, wrap);
        const right = () => tiles.find((t) => t.g === it.opts[0]);
        const ask = () => S.stim(sid(it.s));
        I.instr(S, 'bq7_E06_match_intro', 'ear', async () => { if (busy) return; busy = true; await ask(); busy = false; });
        let first = null;
        const pol = I.policy(S, {
          opts: tiles, right,
          async hint1() { refB.classList.remove('is-hint'); void refB.offsetWidth; refB.classList.add('is-hint'); await S.say('bq7_G_look_shape'); await ask(); },
          async model() { await I.playOn(S, right(), sid(it.s)); },
        });
        await new Promise((resolve) => {
          tiles.forEach((t) => t.addEventListener('click', async () => {
            if (busy || t.classList.contains('is-dim')) return;
            busy = true; // الخيار المكتوب صامت حتى الحكم (DECISIONS ج)
            if (t === right()) {
              if (first == null) { first = true; I.record(S, 'S5', true, { item: 'match-' + it.s }); log.push([it.opts[0], true]); }
              t.classList.remove('is-soft'); t.classList.add('is-ok'); I.anim(t, 'i7-pop', 450); I.sfx('ok'); I.burst(root, t, 12); buddy.cheer();
              tiles.forEach((x) => { if (x !== t) x.classList.add('is-dim'); });
              await S.say(I.yes(), { talk: true });
              await I.playOn(S, t, sid(it.s));
              await S.sleep(350);
              return resolve();
            }
            if (first == null) { first = false; I.record(S, 'S5', false, { item: 'match-' + it.s, picked: t.g }); log.push([it.opts[0], false]); }
            I.anim(t, 'i7-wob', 550); I.sfx('soft');
            const st = await pol.wrong(t);
            if (st === 'model') return resolve();
            busy = false;
          }));
          (async () => { busy = true; await S.sleep(400); if (k === 0) await S.say('bq7_E06_match_intro'); await ask(); busy = false; })();
        });
        steps.on(si++);
        busy = true;
      }
    }

    (async () => {
      const st = ctx.step;
      if (st !== 'words' && st !== 'match') { if (!ctx.review) await recall(); await reveal(); await vowels(); } else { steps.on(si++); steps.on(si++); }
      if (st !== 'match') await words(); else { WORDS.forEach(() => steps.on(si++)); }
      await match();
      const okN = log.filter((x) => x[1]).length;
      I.note(S, '<p><b>نتيجة «اكتشف الحرف» (S5):</b> ' + I.AR(okN) + ' من ' + I.AR(log.length) + ' من المحاولة الأولى (النجاح: ٥ من ٦).' +
        (log.some((x) => !x[1]) ? ' احتاج تلميحاً في: ' + log.filter((x) => !x[1]).map((x) => x[0]).join('، ') + '.' : '') + '</p><p>اربط دائماً: الاسم «مِيم» ← الصوت «مَ». اقبل لمس الحرف في أيّ شكل من أشكاله.</p>');
      main.replaceChildren();
      buddy.set('cheer');
      await S.say('bq7_E06_end', { talk: true });
      I.finish(S, { pose: 'cheer' });
    })();
  }

  BQ.register(ID, { render });
})();
