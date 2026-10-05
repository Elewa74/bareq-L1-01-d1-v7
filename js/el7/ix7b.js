/* ix7b.js — أدوات مشتركة لفريق IX2 (E08 · E09 · E11 · E14 · E15) — بارق v7 · L1-01-d1 «صَوْتُ «م»» · draft_unapproved
   يُحمَّل كسولاً: await BQ.loadScript('js/el7/ix7b.js') — لا يعدّل المنصّة؛ يستعمل عقدها فقط (PLATFORM_status.md):
   ctx.say · ctx.instruction · ctx.record · ctx.img/hasImg · ctx.hasAudio · ctx.adultNote · ctx.done · BQ.h · BQ.ui.brq · BQ.audio.
   ─ الصوت: السطر يُشغَّل عبر ctx.say؛ لكلّ مقطع/كلمة قائمة مرشّحين (معرّفات محتملة من فريق الصوت) يُختار أوّل ما له ملفّ،
     وإن لم يوجد شيء يظهر النصّ المصاحب بزمن تقديريّ (العنصر يعمل في كلّ حال).
   ─ الصور: ctx.img(key) (media/img7/<key>.webp أو بديل محايد من المنصّة) + بطاقة احتياطية بالكلمة إن لم تُدرج الصورة.
   ─ السحب: أحداث المؤشّر (إصبع/فأرة/قلم) + بديل «المس ثم المس» + لوحة المفاتيح.
   ─ الكتابة: محرّك تتبّع v6 المعتمد للّمس (نقطة بدء + سهم اتّجاه + سماحية) معمَّم لأشكال الميم الأربعة: م · مـ · ـمـ · ـم. */
(function () {
  'use strict';
  const BQ = window.BQ; if (!BQ || BQ.ix7b) return;
  const h = BQ.h;
  const X = {};
  const never = () => new Promise(() => {});
  const AR = BQ.AR || ((n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]));
  const reduced = () => (BQ.reduced ? BQ.reduced() : false);
  X.AR = AR; X.never = never; X.reduced = reduced;
  const ZWJ = '‍';

  /* ================= النصوص ================= */
  /* الأسطر كلّها من LINES_v7.json (بيانات المنصّة: BQ.line). هنا احتياط للنصّ المصاحب فقط إن غاب السطر من البيانات. */
  const T = (X.T = {});
  X.text = (id) => { const L = BQ.line && BQ.line(id); if (L && L.t) return L.t; return T[id] ? T[id][1] : ''; };
  X.addText = (map) => Object.assign(T, map);
  const YES = ['bq7_G_yes1', 'bq7_G_yes2', 'bq7_G_yes3', 'bq7_G_yes4'];
  let yesI = 0;
  X.yes = () => YES[yesI++ % YES.length];
  X.G = { try: 'bq7_G_try', listen: 'bq7_G_listen_again', hintStart: 'bq7_G_hint_start', light: 'bq7_G_look_light', shape: 'bq7_G_look_shape', model: 'bq7_G_model', next: 'bq7_G_next', choose: 'bq7_G_listen_choose', end: 'bq7_G_end', pos: { ini: 'bq7_G_pos_first', mid: 'bq7_G_pos_mid', fin: 'bq7_G_pos_last' } };

  /* ================= المفردات والمقاطع (SPEC v7 · DECISIONS و) ================= */
  /* الكلمة تُكتب وتُنطق بالوقف · img: card_<k> · au: bq7_W_<k> · seg: bq7_W_<k>_seg */
  const W = (X.W = {
    maktab: { t: 'مَكْتَبْ', syl: ['مَكْ', 'تَبْ'], pos: 'ini' },
    musht: { t: 'مُشْطْ', syl: ['مُ', 'شْطْ'], pos: 'ini' },
    miftah: { t: 'مِفْتاحْ', syl: ['مِفْ', 'تاحْ'], pos: 'ini' },
    timsah: { t: 'تِمْساحْ', syl: ['تِمْ', 'ساحْ'], pos: 'mid' },
    manju: { t: 'مانْجو', syl: ['ما', 'نْجو'], pos: 'ini' },
    numur: { t: 'نُمورْ', syl: ['نُ', 'مورْ'], pos: 'mid' },
    qamis: { t: 'قَميصْ', syl: ['قَ', 'ميصْ'], pos: 'mid' },
    mawz: { t: 'مَوْزْ', letters: ['مَ', 'وْ', 'زْ'], pos: 'ini' },
    qamar: { t: 'قَمَرْ', letters: ['قَ', 'مَ', 'رْ'], pos: 'mid' },
    fam: { t: 'فَمْ', letters: ['فَ', 'مْ'], pos: 'fin' },
    qalam: { t: 'قَلَمْ', letters: ['قَ', 'لَ', 'مْ'], pos: 'fin' },
    // مشتِّتات سمعية/صورية فقط (لا تُكتب على شاشة الطفل — قرار أ)
    bab: { t: 'بابْ', dis: true }, fil: { t: 'فيلْ', dis: true }, batta: { t: 'بَطَّةْ', dis: true }, farasha: { t: 'فَراشَةْ', dis: true }, kura: { t: 'كُرَةْ', dis: true },
  });
  Object.keys(W).forEach((k) => { const w = W[k]; w.key = k; w.img = 'card_' + k; w.au = 'bq7_W_' + k; w.seg = 'bq7_W_' + k + '_seg'; T[w.au] = ['HAB', w.t]; });
  /** المقاطع ← ملفّ الصوت (LINES_v7: bq7_S_*) */
  const SYL = (X.SYL = { 'مَ': 'bq7_S_ma', 'مِ': 'bq7_S_mi', 'مُ': 'bq7_S_mu', 'ما': 'bq7_S_maa', 'مي': 'bq7_S_mii', 'مو': 'bq7_S_muu', 'مْ': 'bq7_S_m0',
    'بَ': 'bq7_S_ba', 'بِ': 'bq7_S_bi', 'بُ': 'bq7_S_bu', 'با': 'bq7_S_baa', 'بو': 'bq7_S_buu', 'فَ': 'bq7_S_fa', 'فِ': 'bq7_S_fi', 'فُ': 'bq7_S_fu', 'في': 'bq7_S_fii',
    'فا': 'bq7_S_faa', 'فو': 'bq7_S_fuu', 'نَ': 'bq7_S_na', 'نُ': 'bq7_S_nu', 'مَكْ': 'bq7_S_mak', 'مِفْ': 'bq7_S_mif', 'تِمْ': 'bq7_S_tim' });
  Object.keys(SYL).forEach((k) => { T[SYL[k]] = ['HAB', k]; });
  /** أوّل معرّف له ملفّ صوت (أو الأوّل) */
  X.pick = function (ctx, list) {
    list = [].concat(list || []);
    const has = (id) => (ctx && ctx.hasAudio ? ctx.hasAudio(id) : BQ.hasAudio && BQ.hasAudio(id));
    return list.find(has) || list[0];
  };
  X.sylId = (s) => SYL[s] || null;
  X.wordId = (k) => 'bq7_W_' + k;
  X.segId = (k) => 'bq7_W_' + k + '_seg';

  /* ================= وصل الحروف (ZWJ) ================= */
  const NOLEFT = 'اأإآٱدذرزوؤةء'; // لا تتّصل بما بعدها
  const HARAKA = /[ً-ْٰـ]/g;
  const bare = (s) => String(s).replace(HARAKA, '').replace(/‍/g, '');
  const lastBase = (s) => { const b = bare(s); return b[b.length - 1] || ''; };
  const firstBase = (s) => bare(s)[0] || '';
  X.bare = bare;
  /** حروف الكلمة بحركاتها: «قَميصْ» ← [قَ، مي… ] */
  X.letters = (w) => String(w).replace(/\u200D/g, '').match(/[^\u064B-\u0652\u0670][\u064B-\u0652\u0670]*/g) || [];
  /** قطع كلمة → نصوص تُظهر الشكل السياقيّ وحدها: [{t, joinPrev, joinNext}] — إذا تجاورت القطع بلا فراغ اتّصلت بصرياً */
  X.pieces = function (parts) {
    return parts.map((p, i) => {
      const prev = parts[i - 1], next = parts[i + 1];
      const joinNext = !!next && !NOLEFT.includes(lastBase(p)) && firstBase(next) !== 'ء';
      const joinPrev = !!prev && !NOLEFT.includes(lastBase(prev)) && firstBase(p) !== 'ء';
      return { src: p, t: (joinPrev ? ZWJ : '') + p + (joinNext ? ZWJ : ''), joinPrev, joinNext };
    });
  };
  /** إبراز الميم في كلمة: يلفّ كلّ «م» (وحركاتها) بـ<b> مع الحفاظ على الوصل (ZWJ داخل الوسم وخارجه) */
  X.markMeem = function (word, cls) {
    const out = h('span.x7-w' + (cls ? '.' + cls : ''), { lang: 'ar' });
    const re = /(م[ً-ْ]*)/g;
    let last = 0, m;
    while ((m = re.exec(word))) {
      const before = word.slice(last, m.index);
      const after = word.slice(m.index + m[0].length);
      const jp = before && !NOLEFT.includes(lastBase(before));
      const jn = after.length > 0;
      if (before) out.append(before + (jp ? ZWJ : ''));
      out.append(h('b', null, (jp ? ZWJ : '') + m[0] + (jn ? ZWJ : '')));
      last = m.index + m[0].length;
      if (jn) out.append(ZWJ);
    }
    out.append(word.slice(last));
    return out;
  };

  /* ================= الجلسة والصوت ================= */
  X.session = function (ctx) {
    let live = true;
    const timers = new Set();
    ctx.onCleanup(() => { live = false; timers.forEach(clearTimeout); timers.clear(); });
    const alive = () => live && (typeof ctx.alive !== 'function' || ctx.alive());
    const gate = (p) => p.then((v) => (alive() ? v : never()));
    const capEl = () => BQ.audio && BQ.audio.capEl;
    const SPN = { BRQ: 'بارِق', SAY: 'سَيْف', MAJ: 'ماجِد' };
    function caption(id) {
      const cap = capEl(); if (!cap || !T[id]) return;
      cap.replaceChildren(SPN[T[id][0]] ? h('b', null, SPN[T[id][0]] + ': ') : '', T[id][1]);
      cap.hidden = !BQ.state.cc;
    }
    function capOff() { const cap = capEl(); if (cap) { cap.hidden = true; cap.textContent = ''; } }
    const S = {
      ctx,
      get live() { return alive(); },
      gate,
      /** يقول سطراً (أو أوّل الموجود من قائمة). stim: مثير مسموع بلا نصّ مصاحب */
      say(idOrList, opt) {
        if (!alive()) return never();
        opt = opt || {};
        const id = X.pick(ctx, idOrList);
        const known = (ctx.hasAudio && ctx.hasAudio(id)) || (BQ.line && BQ.line(id));
        if (known) return gate(ctx.say(id, { noCaption: !!opt.stim, rate: opt.rate }));
        // لا ملفّ ولا نصّ في البيانات: نصّنا الاحتياطيّ بزمن تقديريّ (يقطعه أيّ صوت آخر)
        BQ.audio.stop();
        if (!opt.stim) caption(id);
        const my = BQ.audio.token;
        const ms = Math.max(800, (X.text(id) || '').length * 80);
        return gate(new Promise((res) => {
          const t = setTimeout(() => { timers.delete(t); if (BQ.audio.token === my) capOff(); res(); }, ms);
          timers.add(t);
          const iv = setInterval(() => { if (BQ.audio.token !== my || !alive()) { clearInterval(iv); clearTimeout(t); res(); } }, 120);
          setTimeout(() => clearInterval(iv), ms + 50);
        }));
      },
      sleep(ms) { return alive() ? gate(new Promise((r) => { const t = setTimeout(() => { timers.delete(t); r(); }, ms); timers.add(t); })) : never(); },
      later(fn, ms) { const t = setTimeout(() => { timers.delete(t); if (alive()) fn(); }, ms); timers.add(t); return t; },
      clear(t) { clearTimeout(t); timers.delete(t); },
      fx(id, vol) { try { return alive() && BQ.audio.fx ? BQ.audio.fx(id, vol == null ? 0.6 : vol) : null; } catch (e) { return null; } },
      stop() { BQ.audio.stop(); },
      async seq(list) { for (const it of list) { if (!alive()) return never(); if (typeof it === 'number') await S.sleep(it); else if (typeof it === 'function') await it(); else await S.say(it); } },
    };
    return S;
  };
  X.sfx = (BQ.sfx) || { ok: 'bariq_L1-01_sfx-check-done', snap: 'bariq_L1-01_sfx-tile-snap' };

  /* ================= الإتقان ================= */
  X.record = function (ctx, skill, ok, extra) {
    try {
      if (ctx && typeof ctx.record === 'function') return ctx.record(skill, !!ok, extra);
      if (BQ.mastery && BQ.mastery.record) return BQ.mastery.record(skill, !!ok, (ctx && ctx.meta && ctx.meta.id) || 'IX2', extra);
    } catch (e) { /* */ }
    return null;
  };

  /* ================= الصور ================= */
  X.hasImg = (ctx, key) => !!(ctx && ctx.hasImg ? ctx.hasImg(key) : BQ.hasImg7 && BQ.hasImg7(key));
  /** صورة كلمة داخل إطار: صورة img7 إن أُدرجت، وإلا بطاقة دافئة بالكلمة (أو علامة استفهام للمشتِّت الذي لا يُكتب) */
  X.pic = function (ctx, key, opt) {
    opt = opt || {};
    const wk = key.replace(/^(w|card)_/, '');
    const box = h('span.x7-pic' + (opt.cls ? '.' + opt.cls : ''), { 'aria-hidden': 'true', dataset: { k: key } });
    if (X.hasImg(ctx, key)) box.append(h('img', { src: ctx.img(key), alt: '', draggable: 'false', decoding: 'async' }));
    else {
      box.classList.add('is-ph');
      const w = W[wk];
      const txt = opt.noText || !w || w.dis ? '' : w.t;
      box.append(h('span.x7-pic-ph', null, txt ? h('span.x7-pic-w', { lang: 'ar' }, txt) : h('span.x7-pic-q', null, '?')));
    }
    return box;
  };

  /* ================= بارق ================= */
  X.brq = (state, cls) => (BQ.ui && BQ.ui.brq ? BQ.ui.brq(state || 'idle', cls) : h('span.bq-brq' + (cls ? '.' + cls : '')));
  /** بارق صغير يتفاعل في زاوية المسرح */
  X.buddy = function (host) {
    const b = X.brq('idle', 'x7-buddy');
    host.append(b);
    let t = 0;
    b.mood = (s, ms) => { clearTimeout(t); if (b.brq) b.brq(s); if (ms) t = setTimeout(() => b.brq && b.brq('idle'), ms); };
    return b;
  };
  /** نجوم صغيرة تتطاير من عنصر (لا شيء مع تقليل الحركة) */
  X.burst = function (el, n) {
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect(); if (!r.width) return;
    const host = document.body;
    const cols = ['#FEBA02', '#FBE65B', '#00AEED', '#E4553F', '#3DBB6B'];
    for (let i = 0; i < (n || 10); i++) {
      const s = h('i.x7-spark', { 'aria-hidden': 'true' });
      const a = (Math.PI * 2 * i) / (n || 10) + Math.random() * 0.5, d = 50 + Math.random() * 60;
      Object.assign(s.style, { left: r.left + r.width / 2 + 'px', top: r.top + r.height / 2 + 'px', background: cols[i % cols.length], '--dx': Math.cos(a) * d + 'px', '--dy': Math.sin(a) * d + 'px' });
      host.append(s);
      setTimeout(() => s.remove(), 800);
    }
  };
  X.anim = function (el, cls, ms) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms || 600); };

  /** مؤشّر تقدّم بلا أرقام (نقاط) */
  X.dots = function (parent, n) {
    const el = h('div.x7-dots', { 'aria-hidden': 'true' });
    const ds = Array.from({ length: n }, () => h('i'));
    el.append(...ds); parent.append(el);
    return { el, set(i) { ds.forEach((d, j) => { d.className = j < i ? 'on' : j === i ? 'cur' : ''; }); } };
  };
  /** شارة مرحلة (أ / ب) */
  X.phase = function (parent, labels) {
    const el = h('div.x7-phase', { role: 'list' });
    const ps = labels.map((l) => h('span', { role: 'listitem' }, l));
    el.append(...ps); parent.append(el);
    return { el, set(i) { ps.forEach((p, j) => p.classList.toggle('on', j === i)); } };
  };

  /** ختام النشاط (فوق منطقة اللعب): بارق يصفّق + «أَعِدْ» + «التّالي» */
  X.end = function (ctx, S, opt) {
    opt = opt || {};
    if (BQ.ui && BQ.ui.endCard && !opt.custom) return BQ.ui.endCard(ctx.stage, { title: opt.title || 'أَحْسَنْتَ!', line: opt.line ? X.pick(ctx, opt.line) : null, onReplay: () => BQ.open(ctx.meta.id, { skipCover: true, history: 'replace' }) });
    return null;
  };

  /* ================= السحب والإفلات (إصبع / فأرة / المس-ثم-المس / لوحة المفاتيح) ================= */
  /** X.dnd({root, onDrop(tile, zone) → true|false|Promise, canDrag(tile)}) → {tile(el, data), zone(el, data), selected, clearSel()} */
  X.dnd = function (opt) {
    const root = opt.root;
    const tiles = new Set(), zones = new Set();
    let sel = null, drag = null;
    const zoneAt = (x, y) => {
      let best = null, bd = 1e9;
      zones.forEach((z) => {
        if (z.classList.contains('is-full') || z.hidden || !z.isConnected) return;
        const r = z.getBoundingClientRect(); const pad = Math.max(12, r.width * 0.12);
        if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) {
          const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
          if (d < bd) { bd = d; best = z; }
        }
      });
      return best;
    };
    const setSel = (t) => { if (sel) sel.classList.remove('is-sel'); sel = t; if (t) t.classList.add('is-sel'); root.classList.toggle('x7-has-sel', !!t); };
    async function attempt(tile, zone, ghost) {
      setSel(null);
      let ok = false;
      try { ok = await opt.onDrop(tile, zone); } catch (e) { ok = false; }
      if (ghost) {
        if (ok) {
          const zr = zone.getBoundingClientRect(), gr = ghost.getBoundingClientRect();
          ghost.style.transition = reduced() ? 'none' : 'transform .18s ease-out, opacity .18s';
          ghost.style.transform = `translate(${zr.left + zr.width / 2 - gr.left - gr.width / 2}px, ${zr.top + zr.height / 2 - gr.top - gr.height / 2}px) scale(.9)`;
          ghost.style.opacity = '0';
          setTimeout(() => ghost.remove(), reduced() ? 0 : 190);
        } else back(tile, ghost);
      }
      tile.classList.remove('is-lifted');
      return ok;
    }
    function back(tile, ghost) {
      const tr = tile.getBoundingClientRect(), gr = ghost.getBoundingClientRect();
      ghost.style.transition = reduced() ? 'none' : 'transform .28s cubic-bezier(.3,1.4,.5,1)';
      ghost.style.transform = `translate(${tr.left - gr.left}px, ${tr.top - gr.top}px)`;
      setTimeout(() => { ghost.remove(); tile.classList.remove('is-lifted'); }, reduced() ? 0 : 300);
    }
    function tile(el, data) {
      el._d = data; tiles.add(el);
      el.classList.add('x7-tile');
      el.setAttribute('role', 'button'); el.tabIndex = 0;
      el.style.touchAction = 'none';
      el.addEventListener('pointerdown', (e) => {
        if (el.classList.contains('is-used') || (opt.canDrag && !opt.canDrag(el))) return;
        if (e.button && e.button !== 0) return;
        if (e.cancelable) e.preventDefault();
        try { el.setPointerCapture(e.pointerId); } catch (x) { /* */ }
        drag = { el, id: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, ghost: null, over: null };
      });
      el.addEventListener('pointermove', (e) => {
        if (!drag || drag.el !== el || drag.id !== e.pointerId) return;
        if (e.cancelable) e.preventDefault();
        const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
        if (!drag.moved && Math.hypot(dx, dy) < 8) return;
        if (!drag.moved) {
          drag.moved = true;
          const r = el.getBoundingClientRect();
          const g = el.cloneNode(true);
          g.classList.add('x7-ghost'); g.classList.remove('is-sel');
          g.removeAttribute('id'); g.setAttribute('aria-hidden', 'true');
          Object.assign(g.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
          document.body.append(g);
          drag.ghost = g; drag.r = r;
          el.classList.add('is-lifted');
          setSel(null);
        }
        drag.ghost.style.transform = `translate(${dx}px, ${dy}px) scale(1.08)`;
        const z = zoneAt(e.clientX, e.clientY);
        if (z !== drag.over) { if (drag.over) drag.over.classList.remove('is-over'); if (z) z.classList.add('is-over'); drag.over = z; }
      });
      const end = (e, cancel) => {
        if (!drag || drag.el !== el || (e && drag.id !== e.pointerId)) return;
        const d = drag; drag = null;
        try { el.releasePointerCapture(d.id); } catch (x) { /* */ }
        if (d.over) d.over.classList.remove('is-over');
        if (!d.moved) { if (!cancel) { setSel(sel === el ? null : el); if (opt.onPick) opt.onPick(el); } return; }
        const z = cancel ? null : zoneAt(e.clientX, e.clientY);
        if (z) attempt(el, z, d.ghost); else { back(el, d.ghost); if (opt.onMiss) opt.onMiss(el); }
      };
      el.addEventListener('pointerup', (e) => end(e, false));
      el.addEventListener('pointercancel', (e) => end(e, true));
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!el.classList.contains('is-used')) { setSel(sel === el ? null : el); if (opt.onPick) opt.onPick(el); } } });
      el.addEventListener('contextmenu', (e) => e.preventDefault());
      return el;
    }
    function zone(el, data) {
      el._d = data; zones.add(el);
      el.classList.add('x7-zone');
      if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
      const put = (e) => { if (!sel || el.classList.contains('is-full')) return false; if (e) e.preventDefault(); attempt(sel, el, null); return true; };
      el.addEventListener('click', (e) => { if (sel) put(e); else if (opt.onZoneTap) opt.onZoneTap(el); });
      el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && sel) put(e); });
      return el;
    }
    return { tile, zone, get selected() { return sel; }, clearSel: () => setSel(null), tiles, zones };
  };

  /* ================= الكتابة باللمس ================= */
  /* الأشكال: مسار واحد بحركة واحدة. iso = مسار v6 المعتمد كما هو. ini/med/fin في صندوق عرضه 60 وخطّه 55.
     الاتّجاه: من نقطة البدء الخضراء؛ الرأس يُدار كما في v6؛ الوصلة الداخلة من اليمين (وسط/آخر) تُكتب أوّلاً. */
  const FORMS = (X.FORMS = {
    iso: { d: 'M45.81 53.19 A13 13 0 1 1 68 44 A13 13 0 0 1 45.81 53.19 Q40.5 60 40.5 72 L40.5 82 Q40.5 88 35 89.5', vb: [24, 22, 56, 72], base: 57, glyph: 'م', arrows: [0.18, 0.62, 0.86] },
    ini: { d: 'M29.64 52.36 A9 9 0 1 1 45 46 A9 9 0 0 1 29.64 52.36 Q26 55 18 55 L2 55', vb: [0, 4, 60, 80], base: 55, glyph: 'مـ', arrows: [0.2, 0.62, 0.9], exitL: [2, 55] },
    med: { d: 'M58 55 L30 55 A9 9 0 0 1 30 37 A9 9 0 0 1 30 55 L2 55', vb: [0, 4, 60, 80], base: 55, glyph: 'ـمـ', arrows: [0.12, 0.5, 0.92], exitL: [2, 55], exitR: [58, 55] },
    fin: { d: 'M58 55 L32 55 A9 9 0 0 1 32 37 A9 9 0 0 1 32 55 Q24 60 24 72 L24 84 Q24 90 18 91', vb: [6, 4, 54, 92], base: 55, glyph: 'ـم', arrows: [0.1, 0.42, 0.85], exitR: [58, 55] },
  });
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.append(e); return e; };
  let mkN = 0;
  /**
   * X.writePad(parent, {form, guide:'road'|'dots'|'none', arrows:true|'faint'|false, start:true|false, ink:'path'|'free',
   *                     ctxBefore, ctxAfter (نصّ قبل/بعد في الكلمة، مثل 'قَـ' و'ـرْ'), tol, onFail(reason, n), onOk(info), lenient})
   * → {el, done:Promise, reset(), showStart(), setGuide(g), setArrows(a), demo(ms), runner(), fill(word), get fails}
   * reason: 'start' (بدأ بعيداً عن نقطة البدء) · 'off' (رفع إصبعه قبل الإكمال أو خرج عن الشكل)
   */
  X.writePad = function (parent, opt) {
    opt = opt || {};
    const F = FORMS[opt.form || 'iso'];
    const id = 'x7w' + (++mkN);
    const el = h('div.x7-wp' + (opt.cls ? '.' + opt.cls : ''), { role: 'img', 'aria-label': 'لَوْحَةُ الكِتابَةِ: اُكْتُبْ بِإِصْبَعِكَ' });
    const svg = svgEl('svg', { class: 'x7-wp-svg' });
    svg.innerHTML = '<defs><marker id="' + id + 'a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.6" markerHeight="3.6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#E4553F"/></marker></defs>';
    el.append(svg);
    parent.append(el);
    // سطر الكتابة
    const [vx, vy, vw, vh] = F.vb;
    let X0 = vx, W0 = vw;
    const lines = svgEl('g', { class: 'x7-wp-lines' }, svg);
    const box = svgEl('rect', { class: 'x7-wp-box', x: vx + 1, y: vy + 1, width: vw - 2, height: vh - 2, rx: 4 }, svg);
    const gCtx = svgEl('g', { class: 'x7-wp-ctx' }, svg);
    const road = svgEl('path', { d: F.d, class: 'road' }, svg);
    const dots = svgEl('path', { d: F.d, class: 'dots' }, svg);
    const ghost = svgEl('path', { d: F.d, class: 'ghost' }, svg); // للتحقّق والعرض بعد النجاح
    const demoInk = svgEl('path', { d: F.d, class: 'demo' }, svg);
    const ink = svgEl('path', { d: F.d, class: 'ink' }, svg);
    const free = svgEl('path', { d: '', class: 'free' }, svg);
    const arr = svgEl('g', { class: 'arr' }, svg);
    const runnerDot = svgEl('circle', { class: 'runner', r: 2.4, cx: -50, cy: -50 }, svg);
    const nextp = svgEl('circle', { class: 'nextp', r: 3, cx: -50, cy: -50 }, svg);
    const startRing = svgEl('circle', { class: 'start-ring', r: 6, cx: 0, cy: 0 }, svg);
    const start = svgEl('circle', { class: 'start pulse', r: 3.2, cx: 0, cy: 0 }, svg);
    const tip = h('div.x7-wp-tip', { hidden: true }, 'اِبْدَأْ مِنْ هُنا');
    el.append(tip);
    const Ltot = ghost.getTotalLength();
    const N = 160;
    const pts = Array.from({ length: N + 1 }, (_, i) => { const q = ghost.getPointAtLength(Ltot * i / N); return [q.x, q.y]; });
    start.setAttribute('cx', pts[0][0]); start.setAttribute('cy', pts[0][1]);
    startRing.setAttribute('cx', pts[0][0]); startRing.setAttribute('cy', pts[0][1]);
    [ink, demoInk].forEach((p) => { p.style.strokeDasharray = Ltot + ' ' + Ltot; p.style.strokeDashoffset = Ltot; });
    // أسهم الاتّجاه
    (F.arrows || []).forEach((f) => {
      const a = ghost.getPointAtLength(Ltot * f), b = ghost.getPointAtLength(Math.min(Ltot, Ltot * f + 5));
      const tx = b.x - a.x, ty = b.y - a.y, tl = Math.hypot(tx, ty) || 1;
      const nx = -ty / tl, ny = tx / tl, off = 6.5;
      const x1 = a.x + nx * off - (tx / tl) * 4, y1 = a.y + ny * off - (ty / tl) * 4, x2 = a.x + nx * off + (tx / tl) * 4, y2 = a.y + ny * off + (ty / tl) * 4;
      svgEl('path', { d: `M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`, 'marker-end': 'url(#' + id + 'a)' }, arr);
    });
    // سياق الكلمة (نصّ قبل الشكل وبعده) — بعد تحميل الخطّ نقيس ونعيد ضبط الصندوق
    const FS = opt.fontSize || 36;
    const tBefore = opt.ctxBefore ? svgEl('text', { class: 'ctx', 'font-size': FS, y: F.base || 55 }, gCtx) : null;
    const tAfter = opt.ctxAfter ? svgEl('text', { class: 'ctx', 'font-size': FS, y: F.base || 55 }, gCtx) : null;
    if (tBefore) tBefore.textContent = opt.ctxBefore;
    if (tAfter) tAfter.textContent = opt.ctxAfter;
    function layout() {
      let left = vx, right = vx + vw;
      if (tAfter) { const w = tAfter.getComputedTextLength() || FS; tAfter.setAttribute('x', (F.exitL ? F.exitL[0] : vx) + 0.6); tAfter.setAttribute('text-anchor', 'start'); left = Math.min(left, (F.exitL ? F.exitL[0] : vx) - w - 3); }
      if (tBefore) { const w = tBefore.getComputedTextLength() || FS; tBefore.setAttribute('x', (F.exitR ? F.exitR[0] : vx + vw) - 0.6); tBefore.setAttribute('text-anchor', 'end'); right = Math.max(right, (F.exitR ? F.exitR[0] : vx + vw) + w + 3); }
      X0 = left; W0 = right - left;
      svg.setAttribute('viewBox', `${X0} ${vy} ${W0} ${vh}`);
      el.style.setProperty('--wp-ar', (W0 / vh).toFixed(3));
      lines.replaceChildren();
      const base = F.base || (vy + vh * 0.62);
      svgEl('line', { x1: X0, x2: X0 + W0, y1: base, y2: base, class: 'baseline' }, lines);
      svgEl('line', { x1: X0, x2: X0 + W0, y1: base - 22, y2: base - 22, class: 'midline' }, lines);
      placeTip();
    }
    function placeTip() {
      const r = svg.viewBox.baseVal; if (!r || !r.width) return;
      tip.style.left = ((pts[0][0] - r.x) / r.width * 100) + '%';
      tip.style.top = ((pts[0][1] - r.y) / r.height * 100) + '%';
    }
    // ملاحظة: نصّ SVG بالعربية يحتاج dir=rtl ليختار text-anchor جهة البداية الصحيحة
    [tBefore, tAfter].forEach((t) => { if (t) { t.setAttribute('direction', 'rtl'); t.style.direction = 'rtl'; } });
    layout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (el.isConnected) layout(); });
    if (document.fonts && document.fonts.load) document.fonts.load('700 46px "Scheherazade New"').then(() => { if (el.isConnected) layout(); }).catch(() => {});

    let guide = opt.guide || 'road', arrows = opt.arrows == null ? true : opt.arrows, showStartDot = opt.start !== false;
    const inkMode = opt.ink || (guide === 'none' ? 'free' : 'path');
    function apply() {
      el.dataset.guide = guide;
      el.classList.toggle('arr-faint', arrows === 'faint');
      el.classList.toggle('arr-off', !arrows);
      el.classList.toggle('no-start', !showStartDot);
    }
    apply();
    const TOL = opt.tol || (opt.form === 'iso' ? 9 : 7.5), START = opt.startTol || 7.5;
    let prog = 0, down = false, lost = false, done = false, fails = 0, resolveDone, trail = [], bad = null;
    const donePromise = new Promise((r) => { resolveDone = r; });
    const setInk = () => { ink.style.strokeDashoffset = Ltot * (1 - prog / N); };
    const toSvg = (e) => { const m = svg.getScreenCTM(); if (!m) return null; const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(m.inverse()); return [q.x, q.y]; };
    const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const flashNext = () => { const i = Math.min(N, prog + 14); nextp.setAttribute('cx', pts[i][0]); nextp.setAttribute('cy', pts[i][1]); nextp.classList.remove('on'); void nextp.getBBox(); nextp.classList.add('on'); };
    function showStart() {
      showStartDot = true; apply();
      start.classList.remove('pulse'); void start.getBBox(); start.classList.add('pulse');
      startRing.classList.remove('on'); void startRing.getBBox(); startRing.classList.add('on');
      placeTip(); tip.hidden = false; X.anim(tip, 'is-in', 2600);
      clearTimeout(tip._t); tip._t = setTimeout(() => { tip.hidden = true; }, 2600);
    }
    function clearInk() { prog = 0; lost = false; trail = []; free.setAttribute('d', ''); setInk(); }
    function fail(reason) {
      fails++;
      clearInk();
      el.classList.add('is-retry'); setTimeout(() => el.classList.remove('is-retry'), 500);
      if (opt.onFail) opt.onFail(reason, fails);
    }
    function finish(info) {
      if (done) return; done = true; down = false;
      if (!(info && info.failed)) { prog = N; setInk(); el.classList.add('is-done'); } else el.classList.add('is-over');
      tip.hidden = true;
      const out = Object.assign({ fails }, info || {});
      resolveDone(out);
      if (opt.onOk) opt.onOk(out);
    }
    const drawFreeAny = () => { free.setAttribute('d', trail.length ? 'M' + trail.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') : ''); };
    const drawFree = () => { if (inkMode !== 'free') return; free.setAttribute('d', trail.length ? 'M' + trail.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') : ''); };
    const advance = (p) => {
      trail.push(p); drawFree();
      let best = -1, bd = 1e9;
      const lo = Math.max(0, prog - 6), hi = Math.min(N, prog + 24);
      for (let i = lo; i <= hi; i++) { const dd = d2(p, pts[i]); if (dd < bd) { bd = dd; best = i; } }
      if (bd > TOL) { if (!lost) { lost = true; if (guide !== 'none') flashNext(); } return; }
      if (lost) { if (Math.abs(best - prog) > 12) return; lost = false; }
      if (best > prog) { prog = best; if (inkMode === 'path') setInk(); }
      if (prog >= N - 3) finish({});
    };
    svg.addEventListener('pointerdown', (e) => {
      if (done || el.classList.contains('is-demo') || el.classList.contains('is-locked')) return;
      if (e.button && e.button !== 0) return;
      if (e.cancelable) e.preventDefault();
      const p = toSvg(e); if (!p) return;
      if (opt.oneShot && d2(p, pts[0]) > START + 4) {
        // قياس محايد: ضربة تبدأ بعيداً تُحسب محاولةً (لا تلميح)؛ اللمسة بلا حركة تُتجاهل
        bad = { p, moved: false }; trail = [p];
        try { svg.setPointerCapture(e.pointerId); } catch (x) { /* */ }
        return;
      }
      if (d2(p, pts[0]) > START + 4) {
        if (opt.lenient && prog > 0 && d2(p, pts[prog]) <= TOL * 1.3) { /* يكمل من حيث توقّف (التتبّع الأوّل فقط) */ }
        else { fail('start'); showStart(); return; }
      } else if (prog > 0) clearInk();
      down = true; lost = false; start.classList.remove('pulse'); tip.hidden = true;
      try { svg.setPointerCapture(e.pointerId); } catch (x) { /* */ }
      advance(p);
    });
    svg.addEventListener('pointermove', (e) => {
      if (bad && !done) { const p = toSvg(e); if (p) { trail.push(p); if (d2(p, bad.p) > 4) bad.moved = true; const m = inkMode; drawFreeAny(); void m; } return; }
      if (!down || done) return; if (e.cancelable) e.preventDefault();
      const ev = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
      (ev && ev.length ? ev : [e]).forEach((c) => { const p = toSvg(c); if (p && down) advance(p); });
    });
    const up = (e) => {
      if (bad) { const b = bad; bad = null; try { svg.releasePointerCapture(e.pointerId); } catch (x) { /* */ } if (b.moved && !done) { fails++; finish({ failed: true }); } else { trail = []; free.setAttribute('d', ''); } return; }
      if (!down) return; down = false;
      try { svg.releasePointerCapture(e.pointerId); } catch (x) { /* */ }
      if (done) return;
      if (prog >= N * 0.8 && !lost) { finish({}); return; }
      if (opt.lenient && prog > 0 && !lost) { flashNext(); return; } // التتبّع الأوّل: يُسمح بالرفع والمتابعة
      if (opt.oneShot) { if (trail.length > 3) { fails++; finish({ failed: true }); } return; }
      fail('off'); showStart();
    };
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    const noScroll = (e) => { if (e.cancelable) e.preventDefault(); };
    el.addEventListener('touchstart', noScroll, { passive: false });
    el.addEventListener('touchmove', noScroll, { passive: false });
    el.addEventListener('contextmenu', noScroll);
    let runT = 0;
    return {
      el, done: donePromise,
      get fails() { return fails; },
      get progress() { return prog / N; },
      showStart,
      setGuide(g) { guide = g; apply(); },
      setArrows(a) { arrows = a; apply(); },
      lock(v) { el.classList.toggle('is-locked', v !== false); },
      /** نقطة تجري على المسار وتعيد (تلميح المحاولة الثانية) */
      runner(on) {
        cancelAnimationFrame(runT);
        if (on === false || reduced()) { runnerDot.setAttribute('cx', -50); return; }
        const t0 = performance.now(), dur = 2200;
        const tick = () => { if (!el.isConnected || done) { runnerDot.setAttribute('cx', -50); return; } const k = ((performance.now() - t0) % (dur + 600)) / dur; const q = pts[Math.round(Math.min(1, k) * N)]; runnerDot.setAttribute('cx', q[0]); runnerDot.setAttribute('cy', q[1]); runT = requestAnimationFrame(tick); };
        runT = requestAnimationFrame(tick);
      },
      /** القلم يرسم الشكل بحركة واحدة (النموذج / بارق يرسم ببطء) */
      demo(ms, keep) {
        ms = reduced() ? 350 : ms || 2600;
        el.classList.add('is-demo');
        const pen = svgEl('circle', { class: 'pen', r: 3, cx: pts[0][0], cy: pts[0][1] }, svg);
        demoInk.style.opacity = 1; demoInk.style.strokeDashoffset = Ltot;
        return new Promise((res) => {
          const t0 = performance.now();
          const tick = () => {
            if (!el.isConnected) { pen.remove(); res(); return; }
            const k = Math.min(1, (performance.now() - t0) / ms);
            const q = pts[Math.round(k * N)];
            pen.setAttribute('cx', q[0]); pen.setAttribute('cy', q[1]);
            demoInk.style.strokeDashoffset = Ltot * (1 - k);
            if (k < 1) requestAnimationFrame(tick);
            else { pen.remove(); el.classList.remove('is-demo'); if (!keep) setTimeout(() => { demoInk.style.strokeDashoffset = Ltot; }, 500); res(); }
          };
          requestAnimationFrame(tick);
        });
      },
      /** يُتمّ الشكل (بمساعدة) */
      fill() { finish({ assisted: true }); },
      reset() { done = false; fails = 0; down = false; el.classList.remove('is-done'); clearInk(); start.classList.add('pulse'); },
      /** بعد النجاح: يستبدل اللوحة بالكلمة مطبوعة والميم مرجانية */
      typeset(word) {
        const w = h('div.x7-wp-word', null, X.markMeem(word));
        el.classList.add('is-typeset');
        el.append(w);
        return w;
      },
      pts, svg,
    };
  };

  /* ================= أفواه (S4) وأيقونات ================= */
  X.ICON = {
    ear: '<svg viewBox="0 0 48 48"><path d="M16 20a10 10 0 1 1 18 6c-2 3-5 4-5 8a5 5 0 0 1-9 2" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M21 21a4 4 0 1 1 7 2" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
    speaker: '<svg viewBox="0 0 48 48"><path d="M8 18h8l11-9v30l-11-9H8z" fill="currentColor"/><path d="M32 17a9 9 0 0 1 0 14M36.5 12a16 16 0 0 1 0 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 48 48"><path d="M11 25l9 9 17-19" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    star: '<svg viewBox="0 0 48 48"><path d="M24 4l5.6 12.3 13.4 1.4-10 9 2.9 13.2L24 33.2 12.1 39.9 15 26.7l-10-9 13.4-1.4z" fill="#FEBA02" stroke="#C98F00" stroke-width="2" stroke-linejoin="round"/></svg>',
    sprout: '<svg viewBox="0 0 48 48"><path d="M24 44V24" stroke="#1B7F53" stroke-width="4" stroke-linecap="round"/><path d="M24 26c-2-9-9-13-17-12 1 8 8 13 17 12zM24 22c2-8 8-12 16-11-1 8-7 12-16 11z" fill="#3DBB6B" stroke="#1B7F53" stroke-width="2" stroke-linejoin="round"/><path d="M12 44h24" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/></svg>',
    print: '<svg viewBox="0 0 48 48"><path d="M14 18V6h20v12" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><rect x="6" y="18" width="36" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M14 28h20v14H14z" fill="#fff" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/></svg>',
    undo: '<svg viewBox="0 0 48 48"><path d="M18 14 8 24l10 10" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 24h19a11 11 0 0 1 0 22h-6" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/></svg>',
    trash: '<svg viewBox="0 0 48 48"><path d="M10 14h28M19 14V9h10v5M14 14l2 26h16l2-26" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pencil: '<svg viewBox="0 0 48 48"><path d="M8 40l3-11L31 9l8 8-20 20z" fill="#FEBA02" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M8 40l3-11 8 8z" fill="#F7D9B0" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
    book: '<svg viewBox="0 0 48 48"><path d="M6 10c6-2 12-1 18 3 6-4 12-5 18-3v28c-6-2-12-1-18 3-6-4-12-5-18-3z" fill="#D6EEFE" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M24 13v28" stroke="currentColor" stroke-width="3"/></svg>',
    chat: '<svg viewBox="0 0 48 48"><path d="M6 10h36v22H20l-9 8v-8H6z" fill="#FBE65B" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
    train: '<svg viewBox="0 0 96 48"><rect x="4" y="12" width="26" height="22" rx="5" fill="currentColor" opacity=".35"/><rect x="35" y="12" width="26" height="22" rx="5" fill="currentColor" opacity=".35"/><rect x="66" y="12" width="26" height="22" rx="5" fill="currentColor"/><circle cx="12" cy="38" r="4" fill="currentColor"/><circle cx="23" cy="38" r="4" fill="currentColor"/><circle cx="43" cy="38" r="4" fill="currentColor"/><circle cx="54" cy="38" r="4" fill="currentColor"/><circle cx="74" cy="38" r="4" fill="currentColor"/><circle cx="85" cy="38" r="4" fill="currentColor"/></svg>',
    shortlong: '<svg viewBox="0 0 64 48"><circle cx="50" cy="16" r="6" fill="currentColor"/><rect x="6" y="30" width="52" height="10" rx="5" fill="currentColor"/></svg>',
    ears2: '<svg viewBox="0 0 64 48"><circle cx="18" cy="24" r="10" fill="none" stroke="currentColor" stroke-width="4"/><path d="M40 14h16v20H40z" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
    letter: '<svg viewBox="0 0 48 48"><rect x="5" y="5" width="38" height="38" rx="9" fill="#FEFEDE" stroke="currentColor" stroke-width="3"/><text x="24" y="31" font-size="24" text-anchor="middle" font-family="Scheherazade New" fill="#E4553F" font-weight="700">م</text></svg>',
    mouth: '<svg viewBox="0 0 48 48"><path d="M8 24c5-6 11-7 16-4 5-3 11-2 16 4-5 7-11 9-16 9s-11-2-16-9z" fill="#E4553F"/><path d="M11 24h26" stroke="#FEFEDE" stroke-width="2.5"/></svg>',
  };
  X.icon = (name, cls) => h('span.x7-ic' + (cls ? '.' + cls : ''), { 'aria-hidden': 'true', html: X.ICON[name] || '' });

  /* ================= لوحة المعلّم المخفيّة (ضغط مطوَّل ١٫٥ ث) ================= */
  X.longPress = function (el, ms, fn) {
    let t = 0;
    const start = (e) => { clearTimeout(t); el.classList.add('is-hold'); t = setTimeout(() => { el.classList.remove('is-hold'); fn(); }, ms || 1500); };
    const stop = () => { clearTimeout(t); el.classList.remove('is-hold'); };
    el.addEventListener('pointerdown', start); el.addEventListener('pointerup', stop); el.addEventListener('pointerleave', stop); el.addEventListener('pointercancel', stop);
    el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); start(); } });
    el.addEventListener('keyup', stop);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  };

  /* ================= دليل المعلّم (درج «ملاحظات النشاط») ================= */
  X.esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  X.note = function (ctx, html) {
    try { if (ctx.adultNote) ctx.adultNote(html); else if (ctx.adult) ctx.adult(html); } catch (e) { /* */ }
  };


  /* ================= الطباعة (للمعلّم/وليّ الأمر فقط — من دليل المعلّم) ================= */
  /** يطبع صفحات A4: pages = [{img: url} | {node: Element}] — إطار مخفيّ، لا نافذة منبثقة */
  X.print = function (pages, opt) {
    opt = opt || {};
    const old = document.getElementById('x7-print'); if (old) old.remove();
    const st = document.getElementById('x7-print-st') || document.head.appendChild(h('style', { id: 'x7-print-st' }));
    st.textContent = '#x7-print { display: none; } @media print { @page { size: A4 ' + (opt.landscape ? 'landscape' : 'portrait') + '; margin: 10mm; } ' +
      'html body.x7-printing > *:not(#x7-print) { display: none !important; } body.x7-printing { background: #fff !important; margin: 0 !important; } ' +
      'body.x7-printing #x7-print { display: block !important; } #x7-print .pg { page-break-after: always; break-after: page; display: flex; align-items: center; justify-content: center; height: ' + (opt.landscape ? '186mm' : '273mm') + '; overflow: hidden; } ' +
      '#x7-print .pg:last-child { page-break-after: auto; break-after: auto; } #x7-print .pg img { max-width: 100%; max-height: 100%; object-fit: contain; } #x7-print .x7-tile, #x7-print .x7-zone { box-shadow: none !important; } }';
    const box = h('div', { id: 'x7-print', dir: 'rtl', lang: 'ar', 'aria-hidden': 'true' });
    pages.forEach((p) => { const pg = h('section.pg'); if (p.img) pg.append(h('img', { src: p.img, alt: '' })); else if (p.node) pg.append(p.node); box.append(pg); });
    document.body.append(box);
    document.body.classList.add('x7-printing');
    const cleanup = () => { document.body.classList.remove('x7-printing'); box.remove(); window.removeEventListener('afterprint', cleanup); document.removeEventListener('pointerdown', cleanup, true); };
    window.addEventListener('afterprint', cleanup);
    const imgs = [...box.querySelectorAll('img')];
    Promise.all(imgs.map((i) => (i.complete && i.naturalWidth ? 1 : new Promise((r) => { i.onload = i.onerror = r; })))).then(() => (document.fonts && document.fonts.ready) || 1).then(() => {
      setTimeout(() => { try { window.print(); } catch (e) { /* */ } /* iPad Safari: print() لا يحجب — التنظيف عند afterprint، أو عند أوّل لمسة بعد العودة */ setTimeout(() => document.addEventListener('pointerdown', cleanup, { once: true, capture: true }), 1200); }, 150);
    });
    return box;
  };

  /** اسم الحرف يُقرن بصوته (DECISIONS ب · R1-10): يقول سطر الافتتاح، وإن لم يذكر نصُّه «صَوْتُهُ/صَوْتُها مَ» أتبعه بارق «حَرْفُ المِيمِ! صَوْتُهُ: مَ!» */
  X.NAME_SOUND = 'bq7_E06_brq_wow';
  X.saysSound = (id) => /صَوْتُ(?:هُ|ها)[:،\s]*مَ/.test(X.text(id) || '');
  X.nameSound = async function (S, id) {
    await S.say(id);
    if (!X.saysSound(id)) await S.say(X.NAME_SOUND);
  };

  /* ================= الأنماط ================= */
  const CSS = `
.x7 { --x7-touch: 60px; position: relative; width: 100%; flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: clamp(8px, 2cqi, 18px); padding: 0 4px; box-sizing: border-box; }
.x7.a79, .x7.a1012 { --x7-touch: 48px; }
.x7, .x7 * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
.x7 :is(button, [role="button"]) { touch-action: manipulation; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; font-family: inherit; }
.x7 img, .x7 svg { -webkit-user-drag: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
.x7-in { animation: x7In .38s cubic-bezier(.2,.9,.3,1.15) both; }
@keyframes x7In { from { opacity: 0; transform: translateY(12px) scale(.97); } }
.x7-row { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2.4cqi, 22px); flex-wrap: wrap; max-width: 100%; }
.x7-sr { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.x7-ic { display: inline-grid; place-items: center; width: 1em; height: 1em; line-height: 0; }
.x7-ic svg { width: 100%; height: 100%; }
/* النصّ العربيّ للطفل */
.x7-w { font-family: var(--ff-child, 'Scheherazade New', serif); font-weight: 700; color: var(--navy, #00345B); line-height: 1.5; white-space: nowrap; }
.x7-w b { color: var(--coral, #E4553F); font-weight: 700; }
/* الصورة */
.x7-pic { position: relative; display: block; width: 100%; height: 100%; overflow: hidden; border-radius: inherit; background: #FFF8EC; }
.x7-pic > img { display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
.x7-pic.is-ph { background: radial-gradient(circle at 50% 40%, #FFFDF5, #FBEFD5); }
.x7-pic-ph { position: absolute; inset: 0; display: grid; place-items: center; padding: 6%; }
.x7-pic-w { font: 700 clamp(18px, 5cqi, 40px)/1.3 var(--ff-child); color: var(--navy); text-align: center; }
.x7-pic-q { font: 700 clamp(28px, 8cqi, 64px)/1 var(--ff-ui, sans-serif); color: #C9B48A; }
/* أزرار عامّة */
.x7-btn { min-height: var(--x7-touch); min-width: var(--x7-touch); padding: 0 22px; border: 0; border-radius: 999px; background: var(--sun, #FEBA02); color: var(--navy); font: 700 19px/1 var(--ff-ui, sans-serif); display: inline-flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; box-shadow: 0 5px 0 var(--sun-edge, #D99A00); }
.x7-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 var(--sun-edge, #D99A00); }
.x7-btn.ghost { background: var(--white); box-shadow: 0 4px 0 var(--sky-line, #D5EBF7), 0 0 0 2px var(--sky-line) inset; }
.x7-btn .x7-ic { width: 28px; height: 28px; }
.x7-btn:focus-visible, .x7-tile:focus-visible, .x7-zone:focus-visible, .x7-choice:focus-visible, .x7-ear:focus-visible { outline: 4px solid var(--navy); outline-offset: 3px; }
.x7-ear { flex: none; width: var(--x7-touch); height: var(--x7-touch); border-radius: 50%; border: 0; background: var(--sky, #00AEED); color: #fff; display: inline-grid; place-items: center; cursor: pointer; box-shadow: 0 4px 0 #0084B5; padding: 0; }
.x7-ear .x7-ic { width: 58%; height: 58%; }
.x7-ear.is-on { animation: x7Pulse .9s ease-in-out infinite; }
.x7-ear:active { transform: translateY(3px); box-shadow: 0 1px 0 #0084B5; }
@keyframes x7Pulse { 50% { transform: scale(1.1); } }
/* بلاطة قابلة للسحب */
.x7-tile { position: relative; flex: none; min-width: max(var(--x7-touch), 64px); min-height: max(var(--x7-touch), 64px); padding: 4px 14px 10px; border-radius: 18px; background: #FFFDF2; border: 3px solid #E9D7A6; box-shadow: 0 5px 0 #E2C98A, 0 10px 18px var(--shade); display: inline-flex; align-items: center; justify-content: center; cursor: grab; touch-action: none; -webkit-user-select: none; user-select: none; transition: transform .15s, opacity .2s, box-shadow .2s; }
.x7-tile .x7-w { font-size: clamp(30px, 6.4cqi, 54px); line-height: 1.45; }
.x7-tile.is-sel { border-color: var(--sky); box-shadow: 0 0 0 5px rgba(0,174,237,.35), 0 5px 0 #E2C98A; transform: translateY(-3px); }
.x7-tile.is-lifted { opacity: .25; }
.x7-tile.is-used { visibility: hidden; }
.x7-tile.is-glow { box-shadow: 0 0 0 6px var(--sun), 0 0 26px var(--sun); }
.x7-tile.is-dim { opacity: .35; pointer-events: none; }
.x7-ghost { position: fixed !important; z-index: 9999; pointer-events: none; margin: 0 !important; box-shadow: 0 16px 30px rgba(0,52,91,.28) !important; opacity: .96; }
.x7-zone { transition: box-shadow .15s, background .15s, transform .15s; }
.x7-zone.is-over, .x7-has-sel .x7-zone:not(.is-full):not(.x7-off) { box-shadow: 0 0 0 4px rgba(0,174,237,.45); }
.x7-zone.is-over { transform: scale(1.04); background: #E3F5FD; }
.x7-zone.is-glow { box-shadow: 0 0 0 6px var(--sun), 0 0 24px var(--sun) !important; }
/* مؤشّرات */
.x7-dots { display: inline-flex; gap: 7px; justify-content: center; align-items: center; min-height: 32px; padding: 7px 14px; border-radius: 999px; background: var(--white, #fff); border: 1.5px solid var(--sky-line, #D5EBF7); }
.x7-dots i { width: 9px; height: 9px; border-radius: 99px; background: var(--sky-line, #D5EBF7); transition: width .35s, background .35s; }
.x7-dots i.on { background: var(--sun); }
.x7-dots i.cur { width: 24px; background: var(--sky); }
.x7-phase { display: inline-flex; gap: 6px; padding: 4px; border-radius: 999px; background: rgba(255,255,255,.8); box-shadow: 0 2px 8px var(--shade); }
.x7-phase span { padding: 4px 14px; border-radius: 999px; font: 700 15px/1.4 var(--ff-child); color: #6A879E; }
.x7-phase span.on { background: var(--navy); color: #fff; }
/* بارق الصغير */
.x7-buddy { position: absolute; z-index: 4; inset-inline-start: 2px; bottom: 2px; width: clamp(64px, 13cqi, 120px); aspect-ratio: 1; pointer-events: none; }
.x7-buddy img { width: 100%; height: 100%; object-fit: contain; }
@container stage (max-width: 520px) { .x7-buddy { width: 58px; } }
/* شرارات */
.x7-spark { position: fixed; z-index: 10000; width: 10px; height: 10px; border-radius: 3px; pointer-events: none; transform: translate(-50%, -50%); animation: x7Spark .75s ease-out forwards; }
@keyframes x7Spark { to { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(200deg) scale(.4); opacity: 0; } }
.fx7-pop { animation: x7Pop .45s ease-out; }
@keyframes x7Pop { 40% { transform: scale(1.1); } }
.fx7-wob { animation: x7Wob .45s ease-in-out; }
@keyframes x7Wob { 25% { transform: rotate(-4deg); } 75% { transform: rotate(4deg); } }
/* لوحة الكتابة */
.x7-wp { position: relative; width: min(100%, calc(var(--wp-h, 300px) * var(--wp-ar, 1))); aspect-ratio: var(--wp-ar, 1); touch-action: none; -webkit-user-select: none; user-select: none; background: #fff; border-radius: 22px; box-shadow: 0 6px 0 var(--sky-line), 0 12px 26px var(--shade); }
.x7-wp-svg { width: 100%; height: 100%; display: block; overflow: visible; touch-action: none; cursor: crosshair; }
.x7-wp .x7-wp-box { fill: none; stroke: none; }
.x7-wp .baseline { stroke: #9CC9E6; stroke-width: .6; }
.x7-wp .midline { stroke: #D8EAF6; stroke-width: .45; stroke-dasharray: 2 2; }
.x7-wp .ctx { font-family: var(--ff-child, 'Scheherazade New'); font-weight: 700; fill: var(--navy); }
.x7-wp .road { fill: none; stroke: rgba(0,52,91,.09); stroke-width: 11; stroke-linecap: round; stroke-linejoin: round; }
.x7-wp .dots { fill: none; stroke: rgba(0,52,91,.45); stroke-width: 1.3; stroke-dasharray: .1 3.2; stroke-linecap: round; }
.x7-wp .ghost { fill: none; stroke: transparent; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
.x7-wp .ink, .x7-wp .free { fill: none; stroke: var(--navy); stroke-width: 6.5; stroke-linecap: round; stroke-linejoin: round; }
.x7-wp .free { stroke-width: 5.5; }
.x7-wp .demo { fill: none; stroke: #2E6CA6; stroke-width: 6.5; stroke-linecap: round; stroke-linejoin: round; opacity: .85; }
.x7-wp .arr path { fill: none; stroke: #E4553F; stroke-width: 1.5; stroke-linecap: round; }
.x7-wp.arr-faint .arr { opacity: .35; } .x7-wp.arr-off .arr { display: none; }
.x7-wp[data-guide="dots"] .road { stroke: rgba(0,52,91,.04); }
.x7-wp[data-guide="none"] .road, .x7-wp[data-guide="none"] .dots { display: none; }
.x7-wp[data-guide="bold"] .road { stroke: rgba(0,174,237,.16); } .x7-wp[data-guide="bold"] .dots { stroke: rgba(0,52,91,.75); stroke-width: 1.8; }
.x7-wp .start { fill: #22B14C; stroke: #fff; stroke-width: 1.1; }
.x7-wp .start.pulse { animation: x7Dot 1.1s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.x7-wp .start-ring { fill: none; stroke: #22B14C; stroke-width: 1.4; opacity: 0; transform-box: fill-box; transform-origin: center; }
.x7-wp .start-ring.on { animation: x7Ring 1s ease-out 3; }
@keyframes x7Ring { 0% { opacity: .9; transform: scale(.6); } 100% { opacity: 0; transform: scale(2.2); } }
.x7-wp.no-start .start, .x7-wp.no-start .start-ring { display: none; }
@keyframes x7Dot { 50% { transform: scale(1.5); } }
.x7-wp .runner { fill: var(--sun); stroke: #fff; stroke-width: .8; }
.x7-wp .nextp { fill: none; stroke: var(--sun); stroke-width: 1.5; opacity: 0; }
.x7-wp .nextp.on { animation: x7Next .9s ease-out 2; }
@keyframes x7Next { 0% { opacity: 1; r: 2; } 100% { opacity: 0; r: 7; } }
.x7-wp .pen { fill: #fff; stroke: #2E6CA6; stroke-width: 1.1; }
.x7-wp.is-done .start, .x7-wp.is-done .start-ring, .x7-wp.is-done .arr, .x7-wp.is-done .runner { display: none; }
.x7-wp.is-done .free { stroke: var(--ok, #1B7F53); }
.x7-wp.is-done { box-shadow: 0 0 0 4px var(--ok, #1B7F53), 0 12px 26px var(--shade); }
.x7-wp.is-retry { animation: x7Wob .4s ease-in-out; }
.x7-wp.is-typeset svg { opacity: 0; transition: opacity .3s; }
.x7-wp-word { position: absolute; inset: 0; display: grid; place-items: center; font-size: clamp(54px, 13cqi, 120px); animation: x7In .4s ease-out both; }
.x7-wp-tip { position: absolute; z-index: 3; transform: translate(-50%, calc(-100% - 22px)); padding: 6px 14px 8px; border-radius: 14px; background: #22B14C; color: #fff; font: 700 18px/1.3 var(--ff-child); white-space: nowrap; pointer-events: none; box-shadow: 0 6px 14px rgba(0,0,0,.18); }
.x7-wp-tip::after { content: ''; position: absolute; left: 50%; bottom: -9px; transform: translateX(-50%); border: 9px solid transparent; border-bottom: 0; border-top-color: #22B14C; }
.x7-wp-tip.is-in { animation: x7In .3s ease-out both; }
/* تغذية مكتوبة قصيرة (فقاعة) */
.x7-fb { min-height: 48px; display: flex; align-items: center; justify-content: center; }
.x7-fb > span { padding: 6px 18px 9px; border-radius: 16px; font: 700 clamp(19px, 3.6cqi, 26px)/1.4 var(--ff-child); animation: x7In .3s ease-out both; }
.x7-fb .ok { background: #E6F5EC; color: var(--ok, #1B7F53); border: 2px solid #9ED3B4; }
.x7-fb .try { background: #FFF6E0; color: #8A5A00; border: 2px solid #F3D48A; }
@media (prefers-reduced-motion: reduce) {
  .x7-in, .x7-ear.is-on, .x7-wp .start.pulse, .x7-wp .start-ring.on, .x7-wp-tip.is-in, .fx7-pop, .fx7-wob, .x7-wp.is-retry, .x7-wp-word, .x7-fb > span { animation: none !important; }
  .x7-tile, .x7-zone { transition: none; }
}`;
  X.style = function (id, css) { if (!document.getElementById(id)) document.head.append(h('style', { id }, css)); };
  X.style('st-ix7b', CSS);

  /** جذر العنصر مع صنف العمر (أحجام اللمس ٦٠ لـ٤–٦) */
  X.root = function (ctx, cls) {
    const a = (ctx.age && ctx.age()) || BQ.state.age || '4-6';
    const r = h('div.x7' + (cls ? '.' + cls : '') + (a === '4-6' ? '.a46' : a === '10-12' ? '.a1012' : '.a79'), { dir: 'rtl', lang: 'ar' });
    ctx.stage.append(r);
    return r;
  };
  /** فقاعة تغذية مكتوبة (للكتابة: «✔ الشَّكْلُ صَحيحٌ» / «جَرِّبْ مَرَّةً أُخْرى. اِبْدَأْ مِنْ هُنا.») */
  X.fbBox = function (parent) {
    const el = h('div.x7-fb', { 'aria-live': 'polite' });
    parent.append(el);
    return { el, ok(t) { el.replaceChildren(h('span.ok', null, t)); }, tryAgain(t) { el.replaceChildren(h('span.try', null, t)); }, clear() { el.replaceChildren(); } };
  };

  BQ.ix7b = X;
})();
