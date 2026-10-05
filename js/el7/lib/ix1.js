/* js/el7/lib/ix1.js — أدوات فريق IX1 المشتركة (E01 E03 E04 E05 E06) · بارق v7 · L1-01-d1 · draft_unapproved
   تُحمَّل مرّة بـ BQ.loadScript('js/el7/lib/ix1.js') من ملفّ العنصر. تعتمد عقد المنصّة v7 (PLATFORM_status.md):
   ctx.say · ctx.instruction · ctx.record · ctx.hasAudio · ctx.img/hasImg · ctx.step — ولها بدائل إن غاب شيء منها.
   ─ قواعد مطبَّقة: لا رمز «م» ولا اسمه ولا أيّ نصّ عربيّ على شاشة الطفل قبل E06 (S.noText) · لا «خطأ» · سُلّم التغذية:
     تلميح ← تلميح أقوى ← نموذج هادئ · أهداف لمس ≥ ٦٠ نقطة · أحداث المؤشّر · RTL · prefers-reduced-motion.
   ─ الصوت الغائب: زرّ 🔈 هادئ معطَّل (لا انهيار ولا طلب 404) · الصورة الغائبة: بطاقة ناعمة (رمز تعبيريّ؛ والكلمة المشكولة في E06 وحده). */
(function () {
  'use strict';
  const BQ = window.BQ; if (!BQ || BQ.ix1) return;
  const h = BQ.h;
  const I = {};
  const never = () => new Promise(() => {});
  const reduced = () => (BQ.reduced ? BQ.reduced() : false);
  const D = BQ.D || window.BQ_DATA || {};
  I.never = never;
  I.reduced = reduced;
  I.AR = BQ.AR || ((n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]));

  /* ================= المفردات ================= */
  /** slug ← {w: الكلمة مشكولة (بالوقف كما في DECISIONS «و»), e: رمز البديل, alias: أسماء ملفّات بديلة} */
  const W = (I.W = {
    maktab: { w: 'مَكْتَبْ', e: '🪑' },
    musht: { w: 'مُشْطْ', e: '🪮' },
    miftah: { w: 'مِفْتاحْ', e: '🔑' },
    timsah: { w: 'تِمْساحْ', e: '🐊' },
    manju: { w: 'مانْجو', e: '🥭', alias: ['mango'] },
    numur: { w: 'نُمورْ', e: '🐅' },
    qamis: { w: 'قَميصْ', e: '👕' },
    mawz: { w: 'مَوْزْ', e: '🍌' },
    qamar: { w: 'قَمَرْ', e: '🌙' },
    fam: { w: 'فَمْ', e: '👄' },
    qalam: { w: 'قَلَمْ', e: '✏️' },
    bab: { w: 'بابْ', e: '🚪' },
    fil: { w: 'فيلْ', e: '🐘' },
    batta: { w: 'بَطَّةْ', e: '🦆' },
    farasha: { w: 'فَراشَةْ', e: '🦋' },
    kura: { w: 'كُرَةْ', e: '⚽' },
  });
  const names = (slug) => [slug].concat((W[slug] && W[slug].alias) || []);
  /** ملفّ نطق الكلمة (bq7_W_<slug>، أو اسمه البديل إن كان هو الموجود) · suffix: '_seg' للمقطّعة */
  I.wordId = (slug, suffix) => I.pick(names(slug).map((n) => 'bq7_W_' + n + (suffix || '')));
  I.segId = (slug) => I.wordId(slug, '_seg');

  /* ================= الأسطر (نصوص احتياطية للدليل والنصّ المصاحب؛ النصّ المعتمد من LINES_v7.json عبر data.js) ================= */
  const LT = (I.LT = {});
  I.lines = (o) => Object.assign(LT, o);
  I.text = (id) => {
    const l = (D.lines && D.lines[id]) || null;
    return (l && (l.t || l.text)) || LT[id] || '';
  };

  /* ================= التوفّر ================= */
  let CTX = null;
  const a7 = new Set(D.audio7 || []);
  I.hasAudio = (id) => {
    if (!id) return false;
    if (CTX && typeof CTX.hasAudio === 'function') { try { return !!CTX.hasAudio(id); } catch (e) { /* */ } }
    return a7.has(id) || (BQ.hasAudio ? BQ.hasAudio(id) : false);
  };
  /** أوّل معرّف متوفّر من قائمة مرشّحات (وإلا الأوّل — يُعامَل غائباً) */
  I.pick = (...ids) => ids.flat().find((x) => I.hasAudio(x)) || ids.flat()[0];
  I.hasImg = (key) => {
    if (CTX && typeof CTX.hasImg === 'function') { try { return !!CTX.hasImg(key); } catch (e) { /* */ } }
    return !!(D.img7 && D.img7[key]);
  };
  I.imgSrc = (key) => {
    if (D.img7 && D.img7[key]) return D.img7[key];
    if (CTX && typeof CTX.img === 'function') { try { return CTX.img(key); } catch (e) { /* */ } }
    return 'media/img7/' + key + '.webp';
  };

  /* ================= مؤثّرات مركّبة خفيفة (WebAudio — بلا ملفّات) ================= */
  let AC = null;
  const ac = () => {
    try {
      if (BQ.audio && BQ.audio.ctx) AC = BQ.audio.ctx;
      if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (C) AC = new C(); }
      if (AC && AC.state !== 'running') AC.resume().catch(() => {});
    } catch (e) { AC = null; }
    return AC;
  };
  function tone(freqs, opt) {
    const c = ac(); if (!c || c.state !== 'running') return;
    opt = opt || {};
    const t0 = c.currentTime + 0.01, vol = (opt.vol == null ? 0.08 : opt.vol) * I.sfxLevel;
    freqs.forEach((f, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = opt.type || 'sine';
      const st = t0 + i * (opt.gap || 0.07), d = opt.dur || 0.16;
      o.frequency.setValueAtTime(Array.isArray(f) ? f[0] : f, st);
      if (Array.isArray(f)) o.frequency.exponentialRampToValueAtTime(f[1], st + d);
      g.gain.setValueAtTime(0.0001, st);
      g.gain.exponentialRampToValueAtTime(vol, st + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, st + d);
      o.connect(g); g.connect(c.destination);
      o.start(st); o.stop(st + d + 0.05);
    });
  }
  I.sfxLevel = 1;
  const SFX = {
    pop: () => tone([[520, 880]], { dur: 0.12, vol: 0.09 }),
    ok: () => tone([660, 880, 1320], { dur: 0.18, gap: 0.08, vol: 0.07, type: 'triangle' }),
    soft: () => tone([[330, 250]], { dur: 0.22, vol: 0.06, type: 'triangle' }),
    tick: () => tone([1200], { dur: 0.05, vol: 0.04 }),
    sparkle: () => tone([1568, 2093, 2637, 3136], { dur: 0.12, gap: 0.05, vol: 0.035 }),
    whoosh: () => tone([[300, 900]], { dur: 0.25, vol: 0.04, type: 'sawtooth' }),
    flip: () => tone([[700, 420]], { dur: 0.09, vol: 0.05, type: 'triangle' }),
    rise: () => tone([[400, 1200]], { dur: 0.45, vol: 0.05 }),
  };
  /* مؤثّرات النسخة الأصليّة (ملفّات media/audio عبر BQ.audio.fx، كما في IX2) — والنغمات المركّبة احتياط فقط إن غاب الملفّ.
     (WebAudio المتزامن مع بدء تحميل سطر صوتيّ أفشل التحميل أحياناً في Chromium: net::ERR_INSUFFICIENT_RESOURCES.) */
  const FILE = { ok: ['bariq_L1-01_sfx-check-done', 0.45], pop: ['bariq_L1-01_sfx-tile-snap', 0.3], tick: ['bariq_L1-01_sfx-tile-snap', 0.2],
    flip: ['bariq_L1-01_sfx-card-flip', 0.35], sparkle: ['bariq_L1-01_sfx-compass-bead', 0.25], rise: ['bariq_L1-01_sfx-compass-bead', 0.3], soft: null, whoosh: null };
  I.sfx = (name) => {
    try {
      const f = FILE[name];
      if (f === null) return;
      if (f && BQ.audio && BQ.audio.fx && (!BQ.hasAudio || BQ.hasAudio(f[0]))) { BQ.audio.fx(f[0], f[1] * I.sfxLevel); return; }
      (SFX[name] || (() => {}))();
    } catch (e) { /* */ }
  };

  /* ================= بدايات صوتية شاردة (R2-B3 · R2-B4) =================
     ملفّان فيهما همهمة شاردة + صمت قبل الكلام (بقايا تقطيع الدفعة). إلى أن يعيد VOICE قصّهما: نبدأ التشغيل بعد البقايا،
     والعنصر مكتوم حتى يتمّ القفز (لا تُسمَع الهمهمة). الشرط بالمدّة: بعد القصّ (الملفّ أقصر) لا يُقفَز شيء. */
  const SKIP = { bq7_E01_hint1: { from: 1.28, ifDur: 2.9 }, bq7_E06_reveal: { from: 1.18, ifDur: 3.7 } };
  I.skipLead = function (id) {
    const au = BQ.audio && BQ.audio.cur;
    if (!au) return;
    const k = SKIP[id];
    if (!k || String(au.src || '').indexOf(id + '.mp3') < 0) { if (au.muted) au.muted = false; return; } // أيّ سطر آخر: غير مكتوم دائماً
    const mine = () => String(au.src || '').indexOf(id + '.mp3') >= 0;
    const un = () => { if (mine()) au.muted = false; };
    function go() {
      if (!mine()) { au.muted = false; return; }
      try {
        if (isFinite(au.duration) && au.duration > k.ifDur && au.currentTime < k.from) { au.addEventListener('seeked', un, { once: true }); au.currentTime = k.from; }
        else un();
      } catch (e) { un(); }
    }
    au.muted = true;
    setTimeout(() => { au.muted = false; }, 2500); // أمان: لا يبقى العنصر المشترك مكتوماً أبداً
    if (au.readyState >= 1) go(); else au.addEventListener('loadedmetadata', go, { once: true });
  };

  /* ================= الجلسة ================= */
  /** S: كلام وانتظار يتوقّفان عند مغادرة العنصر (الوعد لا يُحلّ بعد الخروج). opt.noText = لا نصّ مصاحب (قبل E06) */
  I.session = function (ctx, opt) {
    opt = opt || {};
    CTX = ctx;
    let live = true;
    const timers = new Set();
    ctx.onCleanup(() => { live = false; timers.forEach(clearTimeout); timers.clear(); });
    const alive = () => live && (typeof ctx.alive !== 'function' || ctx.alive());
    const gate = (p) => p.then((v) => (alive() ? v : never()));
    const estMs = (id) => Math.max(900, I.text(id).length * 80);
    const S = {
      ctx, noText: !!opt.noText, buddy: null,
      get live() { return alive(); },
      gate,
      sleep(ms) { return alive() ? gate(new Promise((r) => { const t = setTimeout(() => { timers.delete(t); r(); }, reduced() ? Math.min(ms, 350) : ms); timers.add(t); })) : never(); },
      wait(ms) { return alive() ? gate(new Promise((r) => { const t = setTimeout(() => { timers.delete(t); r(); }, ms); timers.add(t); })) : never(); },
      later(fn, ms) { const t = setTimeout(() => { timers.delete(t); if (alive()) fn(); }, ms); timers.add(t); return t; },
      /** say(id, {stim, rate, talk}) — stim: مثير مسموع بلا نصّ · غائب ← صمت بزمن تقديريّ */
      say(id, o) {
        o = o || {};
        if (!alive()) return never();
        const has = I.hasAudio(id);
        const brq = S.buddy && (o.talk || /^bq7_(BRQ|C_brq)|_brq_/.test(id) || ((D.lines && D.lines[id] && (D.lines[id].sp || D.lines[id].speaker)) === 'BRQ'));
        if (brq) S.buddy.set('talk');
        let p;
        if (!has) {
          // لا ملفّ: لا طلب، صمت قصير (المثير) أو بزمن النصّ؛ النصّ المصاحب فقط حيث يُسمح بالنصّ
          if (!S.noText && !o.stim && BQ.audio && BQ.audio.capEl && BQ.state.cc) { const cap = BQ.audio.capEl; cap.textContent = I.text(id); cap.hidden = !cap.textContent; }
          p = new Promise((r) => setTimeout(r, o.stim ? 650 : Math.min(estMs(id), 2600)));
          p = p.then(() => { if (BQ.audio && BQ.audio.capEl && !S.noText) BQ.audio.capEl.hidden = true; });
        } else {
          const sayOnce = () => { const q = ctx.say(id, { rate: o.rate, noCaption: !!(o.stim || S.noText), volume: o.volume }); I.skipLead(id); return q && q.then ? q : Promise.resolve(); };
          // إعادة محاولة واحدة إن فشل تحميل الملفّ لحظياً (خطأ شبكة/موارد عابر) — حتى لا تضيع كلمة على الطفل
          const failed = () => { const au = BQ.audio && BQ.audio.cur; return !!(au && au.error && String(au.currentSrc || au.src || '').indexOf(id + '.mp3') >= 0); };
          p = sayOnce().then(() => (failed() && alive() ? new Promise((r) => setTimeout(r, 250)).then(() => (alive() ? sayOnce() : null)) : null));
        }
        return gate(p.then(() => { if (brq && S.buddy) S.buddy.set('idle'); }));
      },
      stim(id, o) { return S.say(id, Object.assign({ stim: true }, o || {})); },
      async seq(list) { for (const it of list) { if (typeof it === 'number') await S.sleep(it); else if (typeof it === 'function') await it(); else if (it) await S.say(it); } },
      stop() { try { BQ.audio.stop(); } catch (e) { /* */ } },
      sfx: I.sfx,
      fx(id, vol) { try { return BQ.audio.fx(id, vol == null ? 0.35 : vol); } catch (e) { return null; } },
    };
    return S;
  };

  /* ================= الأنماط ================= */
  const CSS = `
.i7 { --i7-h: max(300px, calc(var(--play-h, 700px) - 96px)); --i7-gold: #FBE65B; --i7-gold-d: #E3B81E; --i7-ink: var(--navy, #00345B);
  position: relative; width: 100%; height: var(--i7-h); max-height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: clamp(8px, 2.2cqi, 22px); padding: 6px 10px; box-sizing: border-box; overflow: visible; }
.i7, .i7 * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
.i7 :is(button, [role="button"]) { touch-action: manipulation; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; font: inherit; }
.i7 img { -webkit-user-drag: none; user-select: none; -webkit-touch-callout: none; pointer-events: none; }
.i7 button:focus-visible { outline: 4px solid var(--i7-ink); outline-offset: 4px; }
.i7-sr { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.i7-row { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.6cqi, 26px); flex-wrap: wrap; max-width: 100%; }
.i7-in { animation: i7In .45s cubic-bezier(.2,.9,.3,1.2) both; }
@keyframes i7In { from { opacity: 0; transform: translateY(14px) scale(.94); } }
.i7-pop { animation: i7Pop .45s ease-out; }
@keyframes i7Pop { 40% { transform: scale(1.12); } }
.i7-wob { animation: i7Wob .55s ease-in-out; }
@keyframes i7Wob { 20% { transform: rotate(-6deg); } 40% { transform: rotate(5deg); } 60% { transform: rotate(-3deg); } 80% { transform: rotate(2deg); } }
.i7-pulse { animation: i7Pulse 1.1s ease-in-out infinite; }
@keyframes i7Pulse { 50% { transform: scale(1.07); } }
/* الصورة */
.i7-pic { position: relative; display: block; width: 100%; height: 100%; overflow: hidden; border-radius: inherit; background: linear-gradient(160deg, #F4FBFF, #E3F3FC); container-type: inline-size; }
.i7-pic > img { display: block; width: 100%; height: 100%; object-fit: cover; }
.i7-pic.is-ph { display: grid; place-items: center; background: repeating-linear-gradient(135deg, #F6FBFE 0 12px, #EDF7FD 12px 24px); }
.i7-pic.is-ph .i7-emo { font-size: 46cqi; line-height: 1; filter: saturate(.9); font-family: "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif; }
.i7-pic.is-ph .i7-phw { position: absolute; bottom: 6%; inset-inline: 0; text-align: center; font: 700 15cqi/1.2 var(--ff-child, serif); color: var(--i7-ink); }
/* بطاقة صورة */
.i7-card { --s: 160px; position: relative; width: var(--s); aspect-ratio: 1; padding: 0; border: 5px solid #fff; border-radius: 26px; background: #fff; cursor: pointer; overflow: visible;
  box-shadow: 0 6px 0 var(--sky-line, #D5EBF7), 0 12px 24px var(--shade, rgba(0,52,91,.1)); transition: transform .2s ease, opacity .35s, filter .35s, box-shadow .25s; }
.i7-card > .i7-pic { border-radius: 21px; }
.i7-card.is-gold { border-color: #F4C24A; box-shadow: 0 0 0 3px #FFE7A3 inset, 0 6px 0 #E0A821, 0 12px 24px var(--shade); }
.i7-steps { align-self: center; }
.i7-next { min-height: 64px; font-size: 18px; animation: i7In .35s ease-out both; }
.i7-card:active:not([aria-disabled="true"]) { transform: scale(.95); }
.i7-card.is-play { box-shadow: 0 0 0 6px var(--sky, #00AEED), 0 12px 26px var(--shade); transform: translateY(-4px); }
.i7-card.is-ok { border-color: var(--ok, #1B7F53); box-shadow: 0 0 0 5px var(--ok, #1B7F53), 0 12px 24px var(--shade); }
.i7-card.is-glow { box-shadow: 0 0 0 7px var(--i7-gold), 0 0 34px var(--i7-gold); }
.i7-card.is-dim { opacity: .4; filter: saturate(.4); }
.i7-card.is-gone { opacity: 0; transform: scale(.6); pointer-events: none; }
.i7-card .i7-tick { position: absolute; z-index: 3; top: -12px; inset-inline-end: -12px; width: 40px; height: 40px; border-radius: 50%; background: var(--ok, #1B7F53); color: #fff; display: none; place-items: center; padding: 8px; box-shadow: 0 3px 8px rgba(0,0,0,.2); }
.i7-card.is-ok .i7-tick { display: grid; animation: i7Pop .4s ease-out; }
.i7-card .i7-tick svg { width: 100%; height: 100%; }
/* قلب البطاقة (ظهرها) */
.i7-flip { perspective: 900px; }
.i7-flip .i7-face { position: absolute; inset: 0; border-radius: 21px; backface-visibility: hidden; transition: transform .55s cubic-bezier(.3,.8,.3,1.1); }
.i7-flip .i7-back { transform: rotateY(0deg); background: radial-gradient(circle at 50% 40%, #FFF6B8, var(--i7-gold) 60%, var(--i7-gold-d)); display: grid; place-items: center; color: #8A6A00; }
.i7-flip .i7-back svg { width: 44%; height: 44%; }
.i7-flip .i7-front { transform: rotateY(180deg); overflow: hidden; }
.i7-flip.is-open .i7-back { transform: rotateY(-180deg); }
.i7-flip.is-open .i7-front { transform: rotateY(0deg); }
/* زرّ صوت (خيار «أيّ صوت؟» — بلا كتابة) */
.i7-snd { --c: #7B4FD0; --cd: #5A35A3; position: relative; width: var(--sz, 104px); height: var(--sz, 104px); border-radius: 50%; border: 5px solid #fff; padding: 0; cursor: pointer; color: #fff;
  background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--c) 60%, #fff), var(--c) 55%, var(--cd)); box-shadow: 0 6px 0 var(--cd), 0 12px 22px var(--shade);
  display: grid; place-items: center; transition: transform .18s, opacity .3s, filter .3s, box-shadow .25s; }
.i7-snd svg { width: 46%; height: 46%; position: relative; z-index: 1; }
.i7-snd:active:not([aria-disabled="true"]) { transform: translateY(4px); box-shadow: 0 2px 0 var(--cd); }
.i7-snd::before, .i7-snd::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 4px solid var(--c); opacity: 0; pointer-events: none; }
.i7-snd.is-play::before { animation: i7Ring 1s ease-out infinite; }
.i7-snd.is-play::after { animation: i7Ring 1s ease-out .45s infinite; }
@keyframes i7Ring { from { transform: scale(.9); opacity: .8; } to { transform: scale(1.55); opacity: 0; } }
.i7-snd.is-play { transform: scale(1.08); }
.i7-snd.is-ok { box-shadow: 0 0 0 6px var(--ok, #1B7F53), 0 12px 22px var(--shade); }
.i7-snd.is-glow { box-shadow: 0 0 0 7px var(--i7-gold), 0 0 30px var(--i7-gold); }
.i7-snd.is-dim { opacity: .4; filter: saturate(.4); }
.i7-snd.is-mute, .i7-ear.is-mute { filter: grayscale(1); opacity: .45; cursor: default; }
.i7-snd .i7-mute-ic, .i7-ear .i7-mute-ic { position: absolute; z-index: 2; bottom: -4px; inset-inline-end: -4px; font-size: 20px; line-height: 1; }
.i7-c1 { --c: #7B4FD0; --cd: #5A35A3; } .i7-c2 { --c: #12A39B; --cd: #0B7570; } .i7-c3 { --c: #F07E1E; --cd: #B85A0C; }
.i7-c4 { --c: #E0457B; --cd: #A92A58; } .i7-c5 { --c: #2E8CE6; --cd: #1B62AA; } .i7-c6 { --c: #5DB43A; --cd: #3E8524; }
/* زرّ أذن صغير على البطاقة */
.i7-ear { position: absolute; z-index: 4; top: -16px; inset-inline-start: -16px; width: 64px; height: 64px; border-radius: 50%; border: 4px solid #fff; padding: 0; background: var(--sky, #00AEED); color: #fff;
  display: grid; place-items: center; cursor: pointer; box-shadow: 0 4px 0 #0084b6, 0 6px 12px var(--shade); }
.i7-ear svg { width: 60%; height: 60%; }
.i7-ear:active { transform: translateY(3px); box-shadow: 0 1px 0 #0084b6; }
.i7-ear.is-play { animation: i7Pulse .8s ease-in-out infinite; }
/* بارق الرفيق */
.i7-buddy { position: absolute; z-index: 6; bottom: 0; inset-inline-end: 4px; width: clamp(70px, 13cqi, 132px); aspect-ratio: 1; pointer-events: none; transition: transform .35s cubic-bezier(.3,.9,.3,1.3); }
.i7-buddy .bq-brq, .i7-buddy img { width: 100%; height: 100%; object-fit: contain; display: block; }
.i7-buddy.is-listen::after { content: ''; position: absolute; top: -6%; inset-inline-start: -10%; width: 42%; aspect-ratio: 1; border-radius: 50%; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath d='M16 20a10 10 0 1 1 18 6c-2 3-5 4-5 8a5 5 0 0 1-9 2' fill='none' stroke='%2300AEED' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E") center/70% no-repeat; box-shadow: 0 3px 8px var(--shade); animation: i7Pulse 1s ease-in-out infinite; }
.i7-buddy.is-hop { transform: translateY(-14px) scale(1.06); }
@container stage (max-width: 560px) { .i7-buddy { width: 72px; } }
/* الأزرار الدائرية */
.i7-go { width: 92px; height: 92px; border-radius: 50%; border: 0; padding: 0; background: var(--sun, #FEBA02); color: var(--i7-ink); display: grid; place-items: center; cursor: pointer;
  box-shadow: 0 6px 0 #C98F00, 0 12px 24px var(--shade); animation: i7In .35s ease-out both; }
.i7-go svg { width: 46%; height: 46%; }
.i7-go:active { transform: translateY(4px); box-shadow: 0 2px 0 #C98F00; }
.i7-go.is-next svg { transform: none; }
/* شرائح التقدّم (نجوم) */
.i7-stars { display: flex; gap: 6px; justify-content: center; align-items: center; padding: 6px 12px; border-radius: 999px; background: rgba(255,255,255,.85); box-shadow: 0 3px 10px var(--shade); }
.i7-stars i { width: 22px; height: 22px; display: block; color: #D9E6EE; transition: color .35s, transform .35s; }
.i7-stars i svg { width: 100%; height: 100%; display: block; }
.i7-stars i.on { color: var(--sun, #FEBA02); transform: scale(1.15); }
.i7-stars i.cur { color: #BFE6F8; }
/* قصاصات الاحتفال */
.i7-burst { position: absolute; z-index: 20; width: 0; height: 0; pointer-events: none; }
.i7-burst i { position: absolute; width: 10px; height: 14px; border-radius: 3px; background: var(--c); animation: i7Conf .9s cubic-bezier(.2,.7,.4,1) forwards; }
@keyframes i7Conf { from { transform: translate(0,0) rotate(0); opacity: 1; } to { transform: translate(var(--x), var(--y)) rotate(var(--r)); opacity: 0; } }
/* الختام */
.i7-end { position: absolute; inset: 0; z-index: 30; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(10px, 3vh, 22px); padding: 14px;
  background: radial-gradient(circle at 50% 40%, rgba(255,250,215,.96), rgba(238,248,253,.95)); animation: i7In .4s ease-out both; }
.i7-end .bq-brq { width: min(46vw, 34vh, 240px); aspect-ratio: 1; display: block; }
.i7-end .bq-brq img { width: 100%; height: 100%; object-fit: contain; }
.i7-end-row { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
.i7-end-row .bq-btn { min-height: 64px; font-size: 19px; }
.i7-end-row .i7-again { width: 64px; height: 64px; padding: 0; border-radius: 50%; display: grid; place-items: center; }
.i7-end-row .i7-again .bq-ic { width: 28px; height: 28px; }
.i7-end .i7-stars { transform: scale(1.2); }
/* هاتف أفقيّ (المنصّة R3-F1: ترويسة ٤٦ + صفّ التعليمة ٦٠ داخل المسرح): الارتفاع الحقيقيّ للمسرح بلا حدّ أدنى ٣٠٠ */
@media (max-height: 500px) {
  .i7 { --i7-h: calc(100svh - 156px); gap: 8px; padding-block: 2px; }
  .i7-buddy { width: 64px; }
  .i7-steps { transform: scale(.85); margin-block: -4px; }
}
@media (prefers-reduced-motion: reduce) {
  .i7-in, .i7-pop, .i7-wob, .i7-pulse, .i7-end, .i7-go, .i7-card .i7-tick { animation: none !important; }
  .i7-snd.is-play::before, .i7-snd.is-play::after, .i7-ear.is-play { animation: none !important; }
  .i7-flip .i7-face, .i7-buddy, .i7-card { transition: none !important; }
}`;
  if (!document.getElementById('st-ix1')) document.head.append(h('style', { id: 'st-ix1' }, CSS));

  /* ================= أيقونات ================= */
  const IC = (I.IC = {
    snd: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 18h8l11-9v30l-11-9H7z" fill="currentColor"/><path d="M31 17a9 9 0 0 1 0 14M36 12a16 16 0 0 1 0 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
    ear: (BQ.icons && BQ.icons.ear) || '<svg viewBox="0 0 48 48"><path d="M16 20a10 10 0 1 1 18 6c-2 3-5 4-5 8a5 5 0 0 1-9 2" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
    check: (BQ.icons && BQ.icons.check) || '<svg viewBox="0 0 48 48"><path d="M11 25l9 9 17-19" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M17 10v28l22-14z" fill="currentColor"/></svg>',
    next: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M30 10 16 24l14 14" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    star: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l5.8 12.4 13.6 1.5-10.1 9.2 2.9 13.4L24 33.7 11.8 40.5l2.9-13.4L4.6 17.9l13.6-1.5z" fill="currentColor"/></svg>',
    mouth: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 22c5-5 11-6 17-3 6-3 12-2 17 3-4 8-10 11-17 11S11 30 7 22z" fill="#E4553F"/><path d="M11 23c4 2 8 3 13 3s9-1 13-3" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
    eye: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 24c5-9 12-14 20-14s15 5 20 14c-5 9-12 14-20 14S9 33 4 24z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><circle cx="24" cy="24" r="7" fill="currentColor"/></svg>',
  });

  /* ================= مكوّنات ================= */
  I.anim = (el, cls, ms) => { if (!el || reduced()) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms || 600); };
  I.root = (stage, cls) => { const r = h('div.i7' + (cls ? '.' + cls : '')); stage.replaceChildren(r); return r; };

  /** صورة كلمة: img7/w_<slug> أو بطاقة ناعمة (رمز تعبيريّ؛ والكلمة المشكولة حين يُسمح بالنصّ) */
  I.pic = function (slug, opt) {
    opt = opt || {};
    const info = W[slug] || {};
    const cands = opt.key ? [].concat(opt.key) : [].concat(...names(slug).map((n) => ['card_' + n, 'w_' + n]));
    const key = cands.find((k) => I.hasImg(k)) || cands[0];
    const box = h('span.i7-pic', { 'aria-hidden': 'true', dataset: { k: key } });
    const ph = () => { box.classList.add('is-ph'); box.replaceChildren(h('span.i7-emo', null, info.e || '❔')); if (opt.text && info.w) box.append(h('span.i7-phw', { lang: 'ar' }, info.w)); };
    if (I.hasImg(key)) {
      const im = h('img', { alt: '', draggable: 'false', decoding: 'async', src: I.imgSrc(key) });
      im.addEventListener('error', ph, { once: true });
      box.append(im);
    } else ph();
    return box;
  };

  /** بطاقة صورة (زرّ) — {slug, aria, flip, ear:fn, text} */
  I.card = function (slug, opt) {
    opt = opt || {};
    const pic = I.pic(slug, { text: opt.text });
    const tick = h('span.i7-tick', { 'aria-hidden': 'true', html: IC.check });
    let b;
    if (opt.flip) {
      b = h('button.i7-card.i7-flip', { type: 'button', 'aria-label': opt.aria || 'صورة', dataset: { k: slug } },
        h('span.i7-face.i7-back', { 'aria-hidden': 'true', html: IC.ear }), h('span.i7-face.i7-front', null, pic), tick);
    } else b = h('button.i7-card', { type: 'button', 'aria-label': opt.aria || 'صورة', dataset: { k: slug } }, pic, tick);
    if (opt.ear) {
      const ear = I.ear(opt.earId, opt.ear);
      b.append(ear); b.ear = ear;
    }
    b.slug = slug;
    return b;
  };

  /** زرّ أذن صغير (يُسمع ولا يختار) */
  I.ear = function (id, onTap) {
    const mute = id && !I.hasAudio(id);
    const e = h('span.i7-ear' + (mute ? '.is-mute' : ''), { role: 'button', tabindex: '0', 'aria-label': 'اِسْمَعْ', html: IC.ear });
    if (mute) e.append(h('span.i7-mute-ic', { 'aria-hidden': 'true' }, '🔈'));
    const go = (ev) => { ev.stopPropagation(); if (ev.cancelable) ev.preventDefault(); if (!mute && onTap) onTap(e); };
    e.addEventListener('click', go);
    e.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') go(ev); });
    return e;
  };

  /** زرّ صوت ملوّن بلا كتابة — {id, c:1..6, aria, size} */
  I.sndBtn = function (opt) {
    const mute = !I.hasAudio(opt.id);
    const b = h('button.i7-snd.i7-c' + (opt.c || 1) + (mute ? '.is-mute' : ''), { type: 'button', 'aria-label': opt.aria || 'صَوْتٌ', html: IC.snd, dataset: { k: opt.key || opt.id } });
    if (mute) b.append(h('span.i7-mute-ic', { 'aria-hidden': 'true' }, '🔈'));
    if (opt.size) b.style.setProperty('--sz', opt.size);
    b.sid = opt.id;
    return b;
  };
  /** يشغّل صوت عنصر مع حالة «يعزف» */
  I.playOn = async function (S, el, id, o) {
    if (el) el.classList.add('is-play');
    try { await S.stim(id, o); } finally { if (el) el.classList.remove('is-play'); }
  };

  /** بارق الرفيق في زاوية المسرح — set(state, ms) · hop() */
  I.buddy = function (S, parent, state) {
    const brq = BQ.ui && BQ.ui.brq ? BQ.ui.brq(state || 'idle') : h('span.bq-brq', null, h('img', { src: 'media/brq/brq_idle_still.webp', alt: '' }));
    const el = h('div.i7-buddy', { 'aria-hidden': 'true' }, brq);
    parent.append(el);
    let t = 0;
    const api = {
      el,
      set(s, ms) { clearTimeout(t); if (brq.brq) brq.brq(s); if (ms) t = setTimeout(() => { if (brq.brq) brq.brq('idle'); }, ms); },
      hop() { if (reduced()) return; el.classList.add('is-hop'); setTimeout(() => el.classList.remove('is-hop'), 380); },
      cheer() { api.set('cheer', 2200); api.hop(); },
      think() { api.set('think', 1800); },
      point() { api.set('point', 1800); },
    };
    S.buddy = api;
    S.ctx.onCleanup(() => clearTimeout(t));
    return api;
  };

  /** قصاصات احتفال من مركز عنصر */
  I.burst = function (host, target, n) {
    if (reduced() || !host || !target) return;
    const hr = host.getBoundingClientRect(), r = target.getBoundingClientRect();
    const b = h('span.i7-burst');
    b.style.left = (r.left - hr.left + r.width / 2) + 'px'; b.style.top = (r.top - hr.top + r.height / 2) + 'px';
    const cols = ['#FEBA02', '#00AEED', '#E4553F', '#1B7F53', '#7B4FD0', '#FBE65B'];
    for (let i = 0; i < (n || 16); i++) {
      const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 90;
      const p = h('i'); p.style.setProperty('--c', cols[i % cols.length]);
      p.style.setProperty('--x', Math.cos(a) * d + 'px'); p.style.setProperty('--y', (Math.sin(a) * d - 30) + 'px'); p.style.setProperty('--r', (Math.random() * 540 - 270) + 'deg');
      p.style.animationDelay = (Math.random() * 0.08) + 's';
      b.append(p);
    }
    host.append(b);
    setTimeout(() => b.remove(), 1200);
  };

  /** مؤشّر الخطوات الأصليّ (نقاط BQ.ui.steps — تقدّم لا درجة) · الاسم «stars» باقٍ للتوافق */
  I.stars = function (parent, n) {
    let st = null;
    try { st = BQ.ui.steps(null, n); } catch (e) { st = null; }
    const el = st ? st.el : h('div.bq-steps');
    el.classList.add('i7-steps');
    parent.append(el);
    let done = -1;
    const set = (i) => { if (st) st.set(Math.min(n - 1, i)); if (st && i >= n) el.querySelectorAll('.bq-step').forEach((d) => { d.className = 'bq-step is-done'; }); };
    return { el, on(i) { done = Math.max(done, i); set(i + 1); I.sfx('sparkle'); }, cur(i) { set(i); }, all() { set(n); } };
  };

  /** زرّ دائريّ (ابدأ/التالي) يُحلّ عند اللمس */
  I.goBtn = (parent, kind, aria) => new Promise((res) => {
    const b = kind === 'next'
      ? h('button.bq-btn.kx-cont.i7-next', { type: 'button', 'aria-label': aria || 'التّالي' }, 'التّالي', BQ.icon ? BQ.icon('next') : '')
      : h('button.i7-go', { type: 'button', 'aria-label': aria || 'ابْدَأْ', html: IC.play });
    b.onclick = () => { try { BQ.audio.unlock && BQ.audio.unlock(); } catch (e) { /* */ } I.sfx('pop'); b.remove(); res(); };
    parent.append(b);
    requestAnimationFrame(() => { try { b.focus({ preventScroll: true }); } catch (e) { /* */ } });
  });

  /** يحرّك عنصراً (نسخة طائرة) نحو هدف ثم يزيلها */
  I.flyTo = function (host, el, target, ms) {
    return new Promise((res) => {
      if (!host || !el || !target || reduced()) return res();
      const hr = host.getBoundingClientRect(), a = el.getBoundingClientRect(), b = target.getBoundingClientRect();
      const ghost = el.cloneNode(true);
      ghost.removeAttribute('id'); ghost.setAttribute('aria-hidden', 'true'); ghost.tabIndex = -1;
      Object.assign(ghost.style, { position: 'absolute', zIndex: 25, margin: 0, left: (a.left - hr.left) + 'px', top: (a.top - hr.top) + 'px', width: a.width + 'px', height: a.height + 'px', transition: 'transform ' + (ms || 650) + 'ms cubic-bezier(.5,-0.2,.4,1), opacity ' + (ms || 650) + 'ms', pointerEvents: 'none' });
      host.append(ghost);
      const dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
      const sc = Math.max(0.15, Math.min(0.5, b.width / a.width * 0.6));
      requestAnimationFrame(() => requestAnimationFrame(() => { ghost.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sc + ') rotate(-12deg)'; ghost.style.opacity = '0.2'; }));
      setTimeout(() => { ghost.remove(); res(); }, (ms || 650) + 30);
    });
  };

  /** صفّ التعليمة: سمّاعة تعيد السطر؛ بلا نصّ قبل E06 (التعليمة صوتية وأيقونة فقط) */
  I.instr = function (S, id, icon, replay) {
    const ctx = S.ctx;
    const text = S.noText ? '' : I.text(id);
    try { ctx.instruction(text, null, { icon: icon || 'ear' }); } catch (e) { /* */ }
    ctx.onReplay(replay || (() => S.say(id)));
    // المنصّة تُخفي صفّ التعليمة الفارغ: نُبقي السمّاعة ظاهرة (زرّ الإعادة) ونعطّلها بهدوء إن غاب الصوت
    const ins = ctx.frame && ctx.frame.querySelector('.elp-instr');
    if (ins) {
      ins.classList.remove('is-empty');
      const btn = ins.querySelector('.elp-say');
      const fn = ins.querySelector('.elp-fn');
      if (fn) { fn.hidden = !!text && (BQ.state.cc || BQ.state.age === '10-12'); if (BQ.icons && BQ.icons[icon || 'ear']) fn.innerHTML = BQ.icons[icon || 'ear']; }
      if (btn) { const mute = id && !I.hasAudio(id) && !replay; btn.classList.toggle('i7-say-mute', !!mute); btn.style.opacity = mute ? '.45' : ''; btn.setAttribute('aria-disabled', mute ? 'true' : 'false'); }
    }
  };

  /** الإتقان: ctx.record (المنصّة) أو BQ.mastery مباشرة · وسجلّ محلّيّ للمعلّم */
  I.record = function (S, skill, ok, extra) {
    const ctx = S.ctx;
    try {
      if (typeof ctx.record === 'function') ctx.record(skill, !!ok, extra);
      else if (BQ.mastery && BQ.mastery.record) BQ.mastery.record(skill, !!ok, ctx.meta && ctx.meta.id);
    } catch (e) { /* */ }
    try {
      const k = 'bq7_ix1_' + (ctx.meta && ctx.meta.id);
      const log = JSON.parse(localStorage.getItem(k) || '[]');
      log.push({ s: skill, ok: !!ok, x: extra || null, t: Date.now() });
      localStorage.setItem(k, JSON.stringify(log.slice(-60)));
    } catch (e) { /* */ }
  };

  /** ملاحظة في دليل المعلّم (لا على شاشة الطفل) */
  I.note = function (S, html) {
    const ctx = S.ctx;
    try {
      if (typeof ctx.adultNote === 'function') return ctx.adultNote(html);
      const b = ctx.frame && ctx.frame.querySelector('.elp-adult-body'); if (!b) return;
      let r = b.querySelector(':scope > .i7-note'); if (!r) { r = h('div.i7-note'); b.append(r); }
      r.innerHTML = html;
    } catch (e) { /* */ }
  };

  /** سُلّم التغذية: wrong(n) → n=1 تلميح · n=2 تلميح أقوى · n≥3 نموذج هادئ (يعيد 'model') */
  I.ladder = function (fns) {
    let n = 0;
    return {
      get n() { return n; },
      reset() { n = 0; },
      async wrong(...a) { n++; if (n === 1) { await (fns.hint1 && fns.hint1(...a)); return 'hint1'; } if (n === 2) { await (fns.hint2 && fns.hint2(...a)); return 'hint2'; } await (fns.model && fns.model(...a)); return 'model'; },
    };
  };

  /** الختام: بطاقة الإغلاق الأصليّة (BQ.ui.endCard: بارق يفرح · «أَعِدِ النَّشاطَ» · «التّالي») — بلا رقم */
  I.finish = function (S, opt) {
    opt = opt || {};
    const ctx = S.ctx;
    try { ctx.done(); } catch (e) { /* */ }
    I.sfx('ok');
    const replay = () => BQ.open(ctx.meta.id, { skipCover: true, history: 'replace' });
    if (BQ.ui && BQ.ui.endCard) {
      try { BQ.audio.stop(); } catch (e) { /* */ }
      return BQ.ui.endCard(ctx.stage, { title: opt.title || 'أَحْسَنْتَ!', line: I.hasAudio(opt.line) ? opt.line : null, onReplay: replay });
    }
    const host = (ctx.frame && ctx.frame.querySelector('.elp-play')) || ctx.stage;
    const nextBtn = h('button.bq-btn', { type: 'button', onclick: () => BQ.goNext() }, 'التّالي');
    const el = h('div.i7-end', { role: 'dialog', 'aria-label': 'انْتَهى النَّشاطُ' }, BQ.ui.brq(opt.pose || 'clap', null, 6500), h('div.i7-end-row', null, h('button.bq-btn.ghost.i7-again', { type: 'button', 'aria-label': 'أَعِدِ النَّشاطَ', onclick: replay }, '↺'), nextBtn));
    host.append(el);
    if (opt.line) S.say(opt.line, { talk: true });
    return el;
  };

  /* ================= أسطر عامّة (LINES_v7: bq7_G_*) ================= */
  I.lines({
    bq7_G_yes1: 'نَعَمْ! هَذا هُوَ!', bq7_G_yes2: 'أَحْسَنْتَ!', bq7_G_yes3: 'رائِعٌ!', bq7_G_yes4: 'مُمْتازٌ!',
    bq7_G_try: 'جَرِّبْ مَرَّةً أُخْرى.', bq7_G_listen_again: 'اِسْمَعْ مَرَّةً أُخْرى.', bq7_G_hint_start: 'اِسْمَعْ أَوَّلَ الكَلِمَةِ.',
    bq7_G_hint_lips: 'الشَّفَتانِ تَلْتَقِيانِ، ثُمَّ تَنْفَتِحانِ: مَ.', bq7_G_look_light: 'اُنْظُرْ إِلى الضَّوْءِ.',
    bq7_G_look_shape: 'اُنْظُرْ إِلى شَكْلِ المِيمِ.', bq7_G_model: 'هَذا هُوَ. اِسْمَعْ مَعي:', bq7_G_next: 'هَيّا نُكْمِلْ.',
    bq7_G_listen_choose: 'اِسْمَعْ، ثُمَّ اخْتَرْ.', bq7_G_your_turn: 'دَوْرُكَ!', bq7_G_end: 'أَحْسَنْتَ! أَنْهَيْتَ النَّشاطَ.',
  });
  let yesI = Math.floor(Math.random() * 4);
  /** مديح بارق القصير بالتناوب (G_yes1..4) */
  I.yes = () => { yesI = (yesI % 4) + 1; return I.pick('bq7_G_yes' + yesI, 'bq7_G_yes2', 'bq7_fb_yes'); };

  /** سُلّم المحاولات (DECISIONS «ح»): opts = عناصر الخيارات (DOM) · right = الصحيح · n = عددها
   *  ≥٣ خيارات: ١ تلميح يعلّل (hint1) · ٢ يخفت خيار خاطئ ويضيء الصواب بلطف + «اُنْظُرْ إِلى الضَّوْءِ» · ٣ نموذج «هَذا هُوَ. اِسْمَعْ مَعي:» + model ثم «هَيّا نُكْمِلْ»
   *  خياران: ١ تلميح + إعادة الصوتين · ٢ نموذج. يعيد wrong() → 'hint1' | 'hint2' | 'model' */
  I.policy = function (S, o) {
    let n = 0;
    const two = (o.opts || []).length <= 2;
    const model = async (picked) => {
      const r = o.right();
      (o.opts || []).forEach((x) => { if (x !== r) x.classList.add('is-dim'); });
      if (r) { r.classList.remove('is-dim'); r.classList.add('is-glow'); }
      if (S.buddy) S.buddy.point();
      if (o.modelLine !== false) await S.say(o.modelLine || I.pick('bq7_G_model', 'bq7_fb_show'));
      if (o.model) await o.model(picked);
      if (r) { r.classList.remove('is-glow'); r.classList.add('is-ok'); }
      await S.sleep(250);
      if (o.next !== false) await S.say('bq7_G_next');
    };
    return {
      get n() { return n; },
      async wrong(picked) {
        n++;
        if (S.buddy) S.buddy.think();
        if (n === 1) { await (o.hint1 ? o.hint1(picked) : S.say('bq7_G_try')); return 'hint1'; }
        if (n === 2 && !two) {
          const r = o.right();
          const wrongs = (o.opts || []).filter((x) => x !== r && !x.classList.contains('is-dim'));
          const off = wrongs.find((x) => x !== picked) || wrongs[0];
          if (off) off.classList.add('is-dim');
          if (r) r.classList.add('is-soft');
          if (o.lookLine !== false) await S.say(o.lookLine || 'bq7_G_look_light');
          if (o.hint2) await o.hint2(picked);
          return 'hint2';
        }
        await model(picked);
        return 'model';
      },
    };
  };

  /* ================= الفم (لقطات ماجد) ================= */
  /** ART mouth_closed/a/i/u إن وُجدت كلّها، وإلا media/img/vis5/majed-V* مقصوصة حول الوجه — {el, set(v), say(S, id, v, opt)} · v: rest|closed|a|i|u */
  // قاعدة النسخة الأولى: لقطات فم سيف media/img/vis/saif-V*.webp (600×600) — لا لقطة ضمّ فيها: «u» = V2 مضغوطة أفقياً (تقريب) حتى تصل mouth_u
  const VIS = { rest: 'V0', closed: 'V1', a: 'V3', i: 'V2', u: 'V2' };
  I.mouth = function (S, cls) {
    const art = ['mouth_closed', 'mouth_a', 'mouth_i', 'mouth_u'].every((k) => I.hasImg(k));
    const el = h('div.i7-mouth' + (cls ? '.' + cls : '') + (art ? '.is-art' : ''), { role: 'img', 'aria-label': 'فَمُ ماجِدٍ' });
    const imgs = {};
    const src = (v) => (art ? I.imgSrc(v === 'rest' ? 'mouth_closed' : 'mouth_' + v) : 'media/img/vis/saif-' + VIS[v] + '.webp');
    Object.keys(VIS).forEach((v) => { const im = h('img', { alt: '', src: src(v), decoding: 'async', draggable: 'false' }); if (v === 'u' && !art) im.classList.add('is-u'); imgs[v] = im; el.append(im); });
    el.append(h('span.i7-lips', { 'aria-hidden': 'true' }));
    let cur = 'rest'; imgs.rest.classList.add('on');
    const api = {
      el,
      set(v) { if (!imgs[v] || v === cur) return; imgs[v].classList.add('on'); imgs[cur].classList.remove('on'); cur = v; },
      lips(on) { el.classList.toggle('show-lips', on !== false); },
      /** سطر ينتهي بالمقطع («قُلْ مَعي: مَ.»): الفم ينطبق ثم ينفتح قرب آخر السطر */
      async sayLine(id, v, tail) {
        tail = tail || 0.62;
        let fired = 0, t0 = performance.now();
        const est = Math.max(900, I.text(id).length * 80) / 1000;
        const iv = setInterval(() => {
          const au = BQ.audio && BQ.audio.cur;
          const d = au && isFinite(au.duration) && au.duration > 0 ? au.duration : est;
          const t = au && !au.paused ? au.currentTime : (performance.now() - t0) / 1000;
          if (!fired && t >= d - tail) { fired = 1; api.set('closed'); setTimeout(() => api.set(v || 'a'), 120); }
        }, 40);
        try { await S.say(id); } finally { clearInterval(iv); }
        await S.wait(120); api.set('rest');
      },
      /** يُسمِع مقطعاً والفم: مطبق ← الحركة ← راحة */
      async say(id, v, o) {
        o = o || {};
        el.classList.toggle('is-mute', !I.hasAudio(id));
        api.set('closed');
        if (o.onStart) o.onStart();
        const p = o.line ? S.say(id) : S.stim(id);
        await S.wait(o.lead || 130);
        api.set(v || 'a');
        await p;
        await S.wait(110);
        api.set('rest');
      },
    };
    return api;
  };

  /* ================= كلمة مكتوبة بحروف قابلة للّمس — تشكيل حقيقيّ ================= */
  /** I.tapWord(text, {aria}) → {el, cl:[{b, i, hit}], paint(i, cls), unpaint(i, cls), layout()}
   *  الكلمة عقدة نصّ واحدة (الاتصال والحركات بمحرّك الخطّ نفسه في كلّ متصفّح، بلا ZWJ ولا تقطيع).
   *  مناطق اللمس أزرار شفّافة فوقها، تُقاس من Range.getClientRects لكلّ حرف (بحركاته)، وتُقسَم المسافة بين الحروف
   *  عند منتصفها فلا ثغرات ولا تداخل. التلوين: نسخة من الكلمة فوقها مقصوصة (clip-path) على مستطيل الحرف وحده. */
  I.tapWord = function (text, o) {
    o = o || {};
    const MARKS = /[ً-ٰٟ]/;
    const wrap = h('span.i7-tw-w');
    const txt = h('span.i7-tw-t', null, text);
    const hitL = h('span.i7-tw-hl');
    const el = h('div.i7-tw', { lang: 'ar', dir: 'rtl', role: 'group', 'aria-label': o.aria || text }, wrap);
    wrap.append(txt, hitL);
    const chars = [...text];
    const cl = [];
    for (let k = 0, off = 0; k < chars.length;) {
      let j = k + 1; while (j < chars.length && MARKS.test(chars[j])) j++;
      const s = chars.slice(k, j).join('');
      cl.push({ b: chars[k], t: s, s: off, e: off + s.length, i: cl.length });
      off += s.length; k = j;
    }
    cl.forEach((c) => {
      c.hit = h('button.i7-tw-hit.lt', { type: 'button', 'aria-label': 'حَرْفٌ ' + I.AR(c.i + 1) });
      c.hit.c = c; c.hit.idx = c.i;
      hitL.append(c.hit);
      c.paints = {};
    });
    const clip = (c) => {
      const W = wrap.clientWidth || 1;
      const a = Math.max(0, c.x0 - 2), b = Math.max(0, W - c.x1 - 2);
      return 'inset(-40% ' + b + 'px -40% ' + a + 'px)';
    };
    const api = {
      el, cl, text,
      layout() {
        const node = txt.firstChild; if (!node) return;
        const wr0 = wrap.getBoundingClientRect(); if (!wr0.width) return;
        // القياس بلا تحويل: الكلمة قد تكون في حركة دخول (scale .94) — نقسم على معامل التحجيم فتبقى المناطق صحيحة بعد انتهائها
        const sc = wrap.offsetWidth ? wr0.width / wrap.offsetWidth : 1;
        const wr = { left: wr0.left, width: wrap.offsetWidth || wr0.width };
        cl.forEach((c) => {
          const r = document.createRange(); r.setStart(node, c.s); r.setEnd(node, c.e);
          const b = r.getBoundingClientRect();
          c.x0 = (b.left - wr.left) / sc; c.x1 = (b.right - wr.left) / sc;
        });
        const cs = getComputedStyle(el), padL = parseFloat(cs.paddingLeft) || 0, padR = parseFloat(cs.paddingRight) || 0; // حرفا الطرفين يمتدّان إلى الحاشية
        const order = cl.slice().sort((p, q) => (p.x0 + p.x1) - (q.x0 + q.x1)); // يسار ← يمين
        const n = order.length;
        // حدود طبيعية: منتصف المسافة بين الحروف، وحرفا الطرفين يمتدّان إلى الحاشية
        const B = [-padL];
        for (let k = 1; k < n; k++) B.push((order[k - 1].x1 + order[k].x0) / 2);
        B.push(wr.width + padR);
        // R3-F3: كلّ منطقة ≥ minW (٦٠ نقطة للطفل) — دفعٌ أماميّ ثم خلفيّ يحفظ الترتيب ولا يترك ثغرة ولا تداخلاً
        const m = Math.min(o.minW || 60, (B[n] - B[0]) / n);
        for (let k = 1; k <= n; k++) B[k] = Math.max(B[k], B[k - 1] + m);
        B[n] = wr.width + padR;
        for (let k = n - 1; k >= 0; k--) B[k] = Math.min(B[k], B[k + 1] - m);
        const padT = parseFloat(cs.paddingTop) || 0, padB = parseFloat(cs.paddingBottom) || 0; // اللمس يشمل البطاقة كلّها عمودياً
        order.forEach((c, k) => {
          Object.assign(c.hit.style, { left: B[k] + 'px', width: Math.max(1, B[k + 1] - B[k]) + 'px', top: -padT + 'px', bottom: -padB + 'px' });
          c.zw = B[k + 1] - B[k];
          Object.values(c.paints).forEach((d) => { d.style.clipPath = clip(c); });
        });
      },
      /** يلوّن حرفاً بصنف (is-m · is-hint · is-try) */
      paint(i, cls) {
        const c = cl[i]; if (!c || c.paints[cls]) return;
        const d = h('span.i7-tw-d.' + cls, { 'aria-hidden': 'true' }, text);
        d.style.clipPath = clip(c);
        wrap.insertBefore(d, hitL);
        c.paints[cls] = d;
        c.hit.classList.add(cls);
      },
      unpaint(i, cls) { const c = cl[i]; if (!c || !c.paints[cls]) return; c.paints[cls].remove(); delete c.paints[cls]; c.hit.classList.remove(cls); },
    };
    try { const ro = new ResizeObserver(() => api.layout()); ro.observe(wrap); api.ro = ro; } catch (e) { window.addEventListener('resize', api.layout); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => api.layout());
    requestAnimationFrame(() => api.layout());
    return api;
  };

  /* ================= لوحة المعلّم المخفيّة (ضغط مطوَّل ١٫٥ ث على بارق) ================= */
  /** I.teacherPanel(S, {opts:[{id, label}], onPick(id)}) — لا نصّ على شاشة الطفل حتى يُفتح بضغط مطوَّل */
  I.teacherPanel = function (S, o) {
    const ctx = S.ctx;
    const host = (ctx.frame && ctx.frame.querySelector('.elp-play')) || ctx.stage;
    // R3-N3: لا نصّ للكبار يُقرأ على شاشة الطفل — المنطقة مخفيّة عن قارئ الشاشة وخارج ترتيب Tab (البديل للوحة المفاتيح: صفحة «دليل الإتقان» #mastery)
    const zone = h('button.i7-tz', { type: 'button', tabindex: '-1', 'aria-hidden': 'true' });
    let t = 0, panel = null, t0 = 0, raf = 0;
    const close = () => { if (panel) { panel.remove(); panel = null; } };
    const open = () => {
      close();
      panel = h('div.i7-tpanel', { role: 'group', 'aria-label': 'لِلمُعَلِّمِ' }, h('p', null, o.title || 'النطق (S4) — حكم المعلّم'),
        h('div', null, o.opts.map((x) => h('button.bq-btn' + (x.ghost ? '.ghost' : ''), { type: 'button', onclick: () => { close(); o.onPick(x.id); I.sfx('tick'); } }, x.label))));
      host.append(panel);
    };
    const fill = () => { const p = Math.min(1, (performance.now() - t0) / 1500); zone.style.setProperty('--p', p); if (p < 1) raf = requestAnimationFrame(fill); };
    const cancel = () => { clearTimeout(t); cancelAnimationFrame(raf); zone.style.setProperty('--p', 0); };
    zone.addEventListener('pointerdown', (e) => { if (e.cancelable) e.preventDefault(); try { zone.setPointerCapture(e.pointerId); } catch (x) { /* */ } cancel(); t0 = performance.now(); raf = requestAnimationFrame(fill); t = setTimeout(() => { cancel(); open(); }, 1500); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => zone.addEventListener(ev, cancel));
    zone.addEventListener('contextmenu', (e) => e.preventDefault());
    zone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    host.append(zone);
    ctx.onCleanup(() => { cancel(); close(); zone.remove(); });
    return { open, close, el: zone };
  };

  const CSS2 = `
.i7-mouth { position: relative; overflow: hidden; border-radius: 30px; border: 6px solid #fff; background: #C98E6A; box-shadow: 0 8px 0 var(--sky-line, #D5EBF7), 0 14px 28px var(--shade, rgba(0,52,91,.1)); aspect-ratio: 1; }
.i7-mouth img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .07s linear; }
.i7-mouth img.is-u { transform: scaleX(.72); transform-origin: 50% 45%; }
.i7-mouth img.on { opacity: 1; }
.i7-mouth .i7-lips { position: absolute; left: 50%; top: 42%; width: 74%; aspect-ratio: 2.3; transform: translate(-50%, -50%); border-radius: 50%; border: 5px solid var(--sun, #FEBA02); box-shadow: 0 0 18px var(--sun, #FEBA02); opacity: 0; transition: opacity .3s; pointer-events: none; }
/* لقطات ART (1600×900، ماجد): قصّ مربّع على الوجه (مركز ≈ 815,410؛ ضلع 500) — الفم عند 51% · 80% */
.i7-mouth.is-art img { inset: auto; left: -113%; top: -32%; width: 320%; height: 180%; object-fit: fill; max-width: none; }
.i7-mouth.is-art .i7-lips { left: 51%; top: 79.5%; width: 40%; }
.i7-mouth.show-lips .i7-lips { opacity: 1; animation: i7Pulse 1s ease-in-out infinite; }
.i7-mouth.is-mute::after { content: '🔈'; position: absolute; bottom: 8px; inset-inline-end: 10px; font-size: 22px; filter: grayscale(1); opacity: .6; }
.i7-card.is-soft, .i7-snd.is-soft { box-shadow: 0 0 0 5px rgba(251,230,91,.9), 0 0 22px rgba(251,230,91,.8); }
.i7-tz { position: absolute; z-index: 8; bottom: 0; inset-inline-end: 0; width: 92px; height: 92px; border: 0; padding: 0; background: transparent; border-radius: 50%; cursor: default; touch-action: none; }
.i7-tz::after { content: ''; position: absolute; inset: 6px; border-radius: 50%; background: conic-gradient(rgba(0,52,91,.55) calc(var(--p, 0) * 360deg), transparent 0); -webkit-mask: radial-gradient(circle, transparent 62%, #000 63%); mask: radial-gradient(circle, transparent 62%, #000 63%); pointer-events: none; }
.i7-tz:focus-visible { outline: 3px solid var(--navy); outline-offset: -4px; }
.i7-tpanel { position: absolute; z-index: 31; bottom: 96px; inset-inline-end: 10px; padding: 12px 14px; border-radius: 20px; background: #fff; box-shadow: 0 12px 34px rgba(0,52,91,.25); font: 600 15px/1.4 var(--ff-ui, sans-serif); color: var(--navy); animation: i7In .25s ease-out both; }
.i7-tpanel p { margin: 0 0 8px; }
.i7-tpanel div { display: flex; gap: 8px; flex-wrap: wrap; }
.i7-tpanel .bq-btn { min-height: 48px; }
.i7-tw { display: inline-block; direction: rtl; font-family: var(--ff-child); font-weight: 700; line-height: 1.95; color: var(--ink, #0F2A44); white-space: nowrap; }
.i7-tw-w { position: relative; display: block; }
.i7-tw-t { display: block; white-space: nowrap; }
.i7-tw-d { position: absolute; inset: 0; display: block; white-space: nowrap; pointer-events: none; animation: i7Fade .3s ease-out both; }
.i7-tw-d.is-m { color: var(--coral, #E4553F); text-shadow: 0 0 .14em rgba(254,186,2,.55); }
.i7-tw-d.is-hint { color: var(--ink, #0F2A44); text-shadow: 0 0 .16em rgba(254,186,2,.95), 0 0 .4em rgba(254,186,2,.65); }
.i7-tw-d.is-try { color: #7FB2D3; }
@keyframes i7Fade { from { opacity: 0; } }
.i7-tw-hl { position: absolute; inset: 0; }
.i7-tw-hit { position: absolute; top: 0; bottom: 0; margin: 0; padding: 0; border: 0; border-radius: 14px; background: transparent; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.i7-tw-hit:active { background: rgba(0,174,237,.08); }
.i7-tw-hit:focus-visible { outline: 4px solid var(--navy, #00345B); outline-offset: -4px; }
@media (prefers-reduced-motion: reduce) { .i7-mouth.show-lips .i7-lips { animation: none; } .i7-tw-d { animation: none; } }`;
  if (!document.getElementById('st-ix1b')) document.head.append(h('style', { id: 'st-ix1b' }, CSS2));

  BQ.ix1 = I;
})();
