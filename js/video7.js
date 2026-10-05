/* video7.js — عناصر الفيديو في v7 (E02 E07 E12 E13) + «سؤال النهاية» (PLATFORM · draft_unapproved)
   · BQ.video.element7def(id) → تعريف عنصر فيديو: media/video7/<ID>.mp4 (+ .jpg ملصق · .cues.json اختياري) في مشغّل v6 (BQ.video.mp4)؛
     المقطع غير موجود ⇒ بطاقة «قيد الإنتاج» الموحّدة. يُستعمل تلقائياً ما لم يوجد js/el7/<ID>.js.
   · سؤال النهاية اختياري من بيانات العنصر meta.endq (أو media/video7/<ID>.endq.json عبر المولّد):
       {prompt, prompt_text, skill, img?, options:[{id, audio?, img?, glyph?, label?}], correct, fb_yes, fb_retry, fb_show}
       يجوز أن تكون endq مصفوفة أسئلة تُعرض تباعاً. حقول إضافية: pre (سطر قبل الخيارات) · word:true (الخيارات أجزاء كلمة متلاصقة) ·
       shuffle · fb_yes/fb_retry/fb_glow/fb_show/model: معرّف سطر أو مصفوفة أسطر تُشغَّل تباعاً (fb_yes مصفوفة مصفوفات = تدوير).
   · BQ.video.endQuestion(host, ctx, q) → Promise<{ok, tries}> — سياسة SPEC: خطأ ١ fb_retry · خطأ ٢ يضيء الصواب + fb_glow ·
     خطأ ٣ fb_show + model (يُعرض الصواب بهدوء)؛ يسجّل q.skill في دليل الإتقان (المحاولة الأولى).
   بلا همهمة في التغذية، وبلا كلمة «خطأ». */
(function () {
  'use strict';
  const BQ = window.BQ; if (!BQ || !BQ.video) return;
  const h = BQ.h, V = BQ.video, D = BQ.D;
  const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const SND = ['#00AEED', '#F89928', '#43A047', '#9B6BD3'];

  /* ---------- سؤال النهاية ---------- */
  function endQuestion(host, ctx, q) {
    q = q || {};
    const opts = q.shuffle ? BQ.shuffle(q.options || []) : (q.options || []).slice();
    let res; const done = new Promise((r) => { res = r; });
    let tries = 0, over = false, busy = false;
    const alive = () => !ctx || !ctx.alive || ctx.alive();
    const say = async (id) => { if (!id) return; if (Array.isArray(id)) { for (const x of id) { if (!alive()) return; await say(x); } return; } await BQ.audio.play(id); };
    let yesN = 0;
    const yesLine = () => { const y = q.fb_yes; if (Array.isArray(y) && y.length && Array.isArray(y[0])) return y[(yesN++) % y.length]; return y; };
    const showText = BQ.state.cc || BQ.state.age === '10-12';
    const picks = [];
    const card = h('div.v7-eq', { role: 'group', 'aria-label': q.prompt_text || 'سُؤالٌ' });
    const replay = h('button.v7-eq-say', { type: 'button', 'aria-label': 'أَعِدِ السُّؤالَ', onclick: () => { BQ.audio.unlock(); intro(); } }, BQ.icon('speaker'));
    const head = h('div.v7-eq-head', null, replay, showText && q.prompt_text ? h('p.v7-eq-t', null, q.prompt_text) : null);
    const pic = q.img ? h('div.v7-eq-img', null, h('img', { src: BQ.img7(q.img), alt: '', draggable: 'false' })) : null;
    const row = h('div.v7-eq-opts' + (opts.some((o) => o.img) ? '.has-img' : '') + (q.word ? '.is-word' : ''), { role: 'group', 'aria-label': 'الخِياراتُ' });
    opts.forEach((o, i) => {
      const vis = o.img ? h('img', { src: BQ.img7(o.img), alt: '', draggable: 'false' })
        : o.glyph ? h('span.v7-eq-g', { lang: 'ar' }, o.glyph)
        : o.label ? h('span.v7-eq-l', { lang: 'ar' }, o.label)
        : h('span.v7-eq-snd', { style: { color: SND[i % SND.length] }, html: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 18h8l11-9v30l-11-9H8z" fill="currentColor"/><path d="M32 17a9 9 0 0 1 0 14M36.5 12a16 16 0 0 1 0 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>' });
      const b = h('button.v7-eq-pick', { type: 'button', 'aria-label': o.aria || o.glyph || o.label || ('الخِيارُ ' + BQ.AR(i + 1)), dataset: { id: o.id } }, vis,
        h('span.bq-tick', { 'aria-hidden': 'true', html: BQ.icons.check }));
      b.addEventListener('click', () => pick(o, b));
      const ear = o.audio ? h('button.v7-eq-ear', { type: 'button', 'aria-label': 'اسْمَعْ', onclick: (e) => { e.stopPropagation(); BQ.audio.unlock(); hear(o, b); } }, BQ.icon('ear')) : null;
      picks.push(b);
      row.append(h('div.v7-eq-opt', null, ear, b));
    });
    card.append(...[head, pic, row].filter(Boolean));
    host.append(card);
    async function hear(o, b) { b.classList.add('is-hear'); await say(o.audio); b.classList.remove('is-hear'); }
    async function intro() {
      if (over) return;
      busy = true;
      await say(q.prompt);
      if (q.pre && opts.some((o) => o.audio)) await say(q.pre);
      for (const [i, o] of opts.entries()) { if (!alive() || over) break; if (o.audio) { await BQ.sleep(250); await hear(o, picks[i]); } }
      busy = false;
    }
    async function pick(o, b) {
      if (over || b.classList.contains('is-dim')) return;
      BQ.audio.unlock();
      const ok = o.id === q.correct;
      if (ok) {
        over = true; BQ.ui.ok(b); card.classList.add('is-done');
        if (tries === 0 && q.skill && ctx && ctx.record) ctx.record(q.skill, true, { from: 'endq' });
        await say(yesLine());
        res({ ok: true, tries: tries + 1 });
        return;
      }
      tries++;
      BQ.ui.shake(b);
      if (tries === 1 && q.skill && ctx && ctx.record) ctx.record(q.skill, false, { from: 'endq' });
      const good = picks.find((x) => x.dataset.id === q.correct);
      const max = q.attempts || 3;
      if (tries >= max) {
        over = true;
        if (good) { BQ.ui.glow(good); good.classList.add('is-ok'); }
        await say(q.fb_show); await say(q.model);
        await BQ.sleep(900);
        res({ ok: false, tries });
        return;
      }
      if (tries === max - 1) { if (good) BQ.ui.glow(good); await say(q.fb_glow || q.fb_retry); }
      else await say(q.fb_retry);
    }
    requestAnimationFrame(() => card.classList.add('in'));
    setTimeout(intro, 350);
    done.card = card;
    return done;
  }

  /* ---------- عنصر الفيديو v7 ---------- */
  function element7def(id) {
    return {
      kind: 'video',
      render(stage, ctx) {
        const meta = ctx.meta, vid = meta.video || id, base = 'media/video7/' + vid;
        const { alive } = V.liveGuard(ctx);
        ctx.frame.dataset.kind = 'video';
        const has = meta.video_ok || ((D.videos7 || []).includes(vid + '.mp4')) || BQ.scan;
        const qs = (Array.isArray(meta.endq) ? meta.endq : meta.endq ? [meta.endq] : []).filter((x) => x && (x.options || []).length);
        const q = qs.length ? qs : null;
        ctx.adultNote('<p>' + (q ? 'بعد نهاية المقطع يظهر سؤال قصير للطفل (يُسجَّل في دليل الإتقان).' : 'مقطع للمشاهدة بلا أسئلة.') +
          ' يمكنك إيقاف المقطع بلمس الصورة.</p>');
        if (!has) { ctx.placeholder(); return; }
        let finished = false;
        const next = () => { BQ.audio.unlock(); BQ.goNext(); };
        const finish = () => { if (finished || !alive()) return; finished = true; ctx.done(); };
        /* R3-F10: نسخة 720p (<ID>_720.mp4 من VIDEO) على الشاشات ≤ ١١٨٠ أو الشبكة البطيئة/توفير البيانات؛ 1080p للعرض على الشاشة الكبيرة */
        const cn = navigator.connection || {};
        const small = Math.max(screen.width || 0, screen.height || 0) <= 1180 || (window.innerWidth || 0) <= 1180;
        const slow = cn.saveData || (cn.downlink && cn.downlink < 5) || /(^|-)2g|3g/.test(cn.effectiveType || '');
        const src = meta.video_720 && (small || slow) ? base + '_720.mp4' : null;
        const P = V.mp4(stage, ctx, { id: vid, base, src, aria: 'مَقْطَعُ «' + (meta.cover_title || meta.name) + '»', captions: true, noCues: true, cuesOptional: true,
          noCuesFile: !meta.video_cues && !BQ.scan, posterSrc: meta.video_poster ? base + '.jpg' : (meta.cover_file || BLANK), poster: meta.cover_file || BLANK,
          title: meta.name, failNext: 'التّالي', slow: false });
        ctx.onReplay(() => P.goto(P.scene));
        let endEl = null, asked = false, inQ = false;
        const clearEnd = () => { if (endEl) { endEl.remove(); endEl = null; } if (P.root) P.root.classList.remove('v5-ended'); };
        const endRow = () => {
          const box = P.root && P.root.querySelector('.vp-box'); if (!box || !alive()) return;
          clearEnd();
          P.root.classList.add('v5-ended');
          const nx = BQ.nextInfo && BQ.nextInfo();
          endEl = h('div.v5-end', { role: 'group', 'aria-label': 'انْتَهى المَقْطَعُ' },
            h('button.bq-btn.ghost', { type: 'button', onclick: () => { clearEnd(); asked = false; P.goto(0); } }, BQ.icon('replay'), 'أَعِدِ المَقْطَعَ'),
            nx ? h('button.bq-btn.go', { type: 'button', onclick: next }, 'التّالي', BQ.icon('next')) : null);
          box.append(endEl);
        };
        const onEnd = async () => {
          if (!alive() || inQ) return;
          if (q && !asked) {
            asked = true;
            const box = P.root && P.root.querySelector('.vp-box'); if (!box) return;
            clearEnd(); P.root.classList.add('v5-ended');
            const layer = h('div.v7-eq-layer'); (P.root.closest('.elp-play') || box).append(layer); endEl = layer; // فوق منطقة اللعب كلّها (الهاتف: إطار الفيديو صغير)
            inQ = true;
            for (const one of q) { if (!alive()) break; layer.replaceChildren(); await endQuestion(layer, ctx, one); }
            inQ = false;
            if (!alive()) return;
            finish(); endRow();
            return;
          }
          finish(); endRow();
        };
        if (P.video) {
          P.video.addEventListener('ended', onEnd);
          ['play', 'seeking'].forEach((ev) => P.video.addEventListener(ev, () => { if (!P.video.ended && !inQ) clearEnd(); }));
        }
        P.done.then((ok) => { if (ok === false) { if (alive()) next(); return; } onEnd(); });
      },
    };
  }
  V.endQuestion = endQuestion;
  V.element7def = element7def;
})();
