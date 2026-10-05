/* E16 · مُهِمَّةٌ مَعَ الأُسْرَةِ — PLATFORM · v7 (الأساس = النسخة الأولى) · draft_unapproved · SPEC_v7 §E16
   شاشة الطفل: صورة family_card + «مُهِمَّتي مَعَ أُسْرَتي» + المهمّة (bq7_E16_task ثم bq7_E16_bye) + ثلاث خانات يلمسها كلّما وجد شيئاً
   (R1-24: لا زرّ طباعة على شاشة الطفل — «اطبع» في دليل المعلّم و#mastery). لا نصّ للكبار على هذه الشاشة: «دور وليّ الأمر» في دليل المعلّم وصفحة «دليل الإتقان ودور الأسرة» وفي المطبوع.
   المطبوع (A4): الصفحة ١ بطاقة المهمّة (٣ مربّعات للرسم + سطر لاسم الشيء) + دور وليّ الأمر · الصفحة ٢ دليل الإتقان (من bq7_mastery). */
(function () {
  'use strict';
  const ID = 'E16';
  const CSS = `
.e16 { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(10px, 2.4cqh, 22px); padding: 8px 12px 12px; container-type: inline-size; }
.e16-card { position: relative; width: min(100%, 880px); display: grid; grid-template-columns: auto 1fr; align-items: center; gap: clamp(10px, 3cqi, 28px);
  background: var(--c-card-fill); border: 5px solid var(--c-card-border); border-radius: 28px; padding: clamp(12px, 2.6cqi, 26px); box-shadow: 0 10px 0 color-mix(in srgb, var(--c-card-border) 55%, transparent); }
.e16-art { width: clamp(96px, 22cqi, 220px); aspect-ratio: 1; border-radius: 20px; overflow: hidden; background: #fff; display: grid; place-items: center; }
.e16-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
.e16-art .bq-brq { width: 86%; }
.e16-h { margin: 0 0 2px; display: inline-flex; align-items: center; gap: 8px; font: 700 clamp(17px, 2.8cqi, 24px)/1.5 var(--ff-child); color: #166B46; }
.e16-h .bq-ic { width: 26px; height: 26px; }
.e16-t { margin: 0; font: 700 clamp(22px, 4.6cqi, 42px)/1.7 var(--ff-child); color: var(--navy, #00345B); text-wrap: balance; }
.e16-slots { display: flex; gap: clamp(12px, 4cqi, 36px); justify-content: center; }
.e16-slot { width: clamp(84px, 16cqi, 140px); aspect-ratio: 1; border-radius: 26px; border: 4px dashed var(--c-header-light); background: #fff; display: grid; place-items: center;
  cursor: pointer; touch-action: manipulation; color: var(--c-header-light); transition: transform .2s, background .2s; }
.e16-slot svg { width: 46%; height: 46%; }
.e16-slot:focus-visible, .e16-print-btn:focus-visible { outline: 4px solid var(--c-focus-ring); outline-offset: 4px; }
.e16-slot.is-on { border-style: solid; border-color: var(--c-godot-btn); background: #FFF6CF; color: var(--c-start-btn); transform: scale(1.04); }
.e16-print-btn { width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--sky-line, #B9DDF1); background: #fff; color: var(--navy, #00345B); display: grid; place-items: center; cursor: pointer; padding: 14px; touch-action: manipulation; }
.e16-print-btn svg { width: 100%; height: 100%; }
@container (max-width: 560px) { .e16-card { grid-template-columns: 1fr; justify-items: center; text-align: center; } .e16-art { width: 120px; } }
@media (prefers-reduced-motion: reduce) { .e16-slot { transition: none; } }
/* R3b-L2: الهاتف الأفقيّ — البطاقة والخانات جنباً إلى جنب، لا قصّ */
@media (max-height: 500px) and (orientation: landscape) {
  .e16 { flex-direction: row; gap: 14px; padding: 4px 10px; }
  .e16-card { flex: 1 1 auto; width: auto; grid-template-columns: auto 1fr; padding: 10px 14px; border-width: 4px; box-shadow: 0 6px 0 color-mix(in srgb, var(--c-card-border) 55%, transparent); }
  .e16-art { width: 84px; }
  .e16-h { font-size: 16px; }
  .e16-t { font-size: clamp(18px, 5.2vh, 24px); line-height: 1.75; }
  .e16-slots { flex-direction: column; gap: 8px; }
  .e16-slot { width: 64px; border-radius: 18px; }
}
.e16-print { display: none; }
@media print {
  @page { size: A4 portrait; margin: 12mm; }
  body.e16-printing > *:not(.e16-print) { display: none !important; }
  body.e16-printing { background: #fff !important; display: block !important; min-height: 0 !important; }
  body.e16-printing .e16-print { display: block !important; color: #000; font: 400 12pt/1.65 'Readex Pro', 'Noto Sans Arabic', sans-serif; direction: rtl; }
  .e16-print .p-card { border: 2.5pt solid #DEC68E; border-radius: 16pt; padding: 10pt 14pt; background: #FEFEDE; break-inside: avoid; }
  .e16-print .p-top { display: flex; align-items: center; gap: 12pt; }
  .e16-print .p-top img { width: 72pt; height: 72pt; object-fit: cover; border-radius: 10pt; }
  .e16-print .p-h { font: 700 15pt/1.5 'Scheherazade New', serif; margin: 0; color: #166B46; }
  .e16-print .p-k { font: 700 19pt/1.7 'Scheherazade New', serif; margin: 0; }
  .e16-print .p-small { font: 700 12pt/1.6 'Scheherazade New', serif; margin: 6pt 0 0; }
  .e16-print .p-boxes { display: flex; gap: 12pt; margin-top: 6pt; }
  .e16-print .p-boxes > div { flex: 1; }
  .e16-print .p-box { height: 118pt; border: 2pt dashed #82C3E8; border-radius: 12pt; background: #fff; }
  .e16-print .p-line { border-bottom: 1pt solid #999; height: 18pt; margin: 4pt 6pt 0; }
  .e16-print .p-cut { border: 0; border-top: 1.2pt dashed #999; margin: 12pt 0 8pt; }
  .e16-print h2 { font-size: 14pt; margin: 0 0 4pt; color: #00345B; }
  .e16-print .p-role { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8pt; }
  .e16-print .p-role ul { margin: 2pt 0 0; padding-inline-start: 1.1em; font-size: 10pt; line-height: 1.5; }
  .e16-print .p-role b { color: #00345B; }
  .e16-print .p-foot { margin-top: 8pt; font-size: 8.5pt; color: #777; }
  .e16-print .p-ms { break-before: page; }
  .e16-print .p-ms .ms-bar-act, .e16-print .p-ms .ms-foot, .e16-print .p-ms .ms-parent, .e16-print .p-ms .ms-intro, .e16-print .p-ms .ms-judge { display: none !important; }
}`;
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const STAR = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5l5.6 12.3 13.4 1.4-10 9 2.9 13.2L24 34.2 12.1 40.9 15 27.7l-10-9 13.4-1.4z" fill="currentColor"/></svg>';
  const PLUS = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 12v24M12 24h24" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>';
  const PRINT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v5H7z" fill="currentColor"/><path d="M4.5 9h15A1.5 1.5 0 0 1 21 10.5V17h-4v4H7v-4H3v-6.5A1.5 1.5 0 0 1 4.5 9z" fill="currentColor"/><path d="M9 15h6v4H9z" fill="#fff"/></svg>';
  const list = (v) => (Array.isArray(v) ? v : v ? [v] : []);

  /** دور وليّ الأمر: guide_v7.json → parent_role (قوائم أو نصوص)، وإلا نصّ الفريق العلمي في البيانات */
  function parentRole() {
    const D = BQ.D, G = D.guide7 || {};
    const pr = (G.parent_role && typeof G.parent_role === 'object') ? G.parent_role : (D.parent_role || {});
    return { title: pr.title || 'دور وليّ الأمر', goal: pr.goal || '', before: list(pr.before), during: list(pr.during), after: list(pr.after) };
  }
  const roleHtml = (r) => '<p><b>هدف اليوم:</b> ' + esc(r.goal) + '</p><ul class="do"><li><b>قبل الدرس:</b> ' + r.before.map(esc).join(' ') + '</li><li><b>أثناء الدرس:</b> ' +
    r.during.map(esc).join(' ') + '</li><li><b>بعد الدرس:</b> ' + r.after.map(esc).join(' ') + '</li></ul>';

  BQ.register(ID, {
    render(stage, ctx) {
      const h = BQ.h, D = BQ.D;
      if (!document.getElementById('st-e16')) document.head.append(h('style', { id: 'st-e16' }, CSS));
      const task = D.family_task || 'اِبْحَثْ مَعَ أُسْرَتِكَ في البَيْتِ عَنْ ثَلاثَةِ أَشْياءَ فيها صَوْتُ المِيمِ.';
      const title = D.family_title || 'مُهِمَّتي مَعَ أُسْرَتي';
      const role = parentRole();
      const art = BQ.hasImg7 && BQ.hasImg7('family_card') ? h('img', { src: BQ.img7('family_card'), alt: '', draggable: 'false' }) : BQ.ui.brq('wave');
      const slots = [0, 1, 2].map((i) => {
        const b = h('button.e16-slot', { type: 'button', 'aria-pressed': 'false', 'aria-label': 'الشَّيْءُ ' + ['الأَوَّلُ', 'الثّاني', 'الثّالِثُ'][i], html: PLUS });
        b.addEventListener('click', () => {
          const on = b.getAttribute('aria-pressed') !== 'true';
          b.setAttribute('aria-pressed', String(on)); b.classList.toggle('is-on', on); b.innerHTML = on ? STAR : PLUS;
          const found = slots.filter((x) => x.getAttribute('aria-pressed') === 'true').length;
          if (on) { BQ.audio.fx(BQ.sfx.ok, 0.6); BQ.ui.pulse(b); }
          if (found === 3) { ctx.done(); if (ctx.hasAudio('bq7_E16_bye')) ctx.say('bq7_E16_bye'); BQ.ui.bariq(stage, null, { mood: 'cheer', ms: 1200 }); }
        });
        return b;
      });
      const printBtn = h('button.e16-print-btn', { type: 'button', 'aria-label': 'اِطْبَعِ البِطاقَةَ', html: PRINT, onclick: () => doPrint() });
      stage.append(h('div.e16', null,
        h('div.e16-card', null, h('div.e16-art', null, art),
          h('div', null, h('p.e16-h', { lang: 'ar' }, BQ.icon('home'), h('span', null, title)), h('p.e16-t', { lang: 'ar' }, task))),
        h('div.e16-slots', { role: 'group', 'aria-label': 'ما وَجَدْتَهُ' }, slots)));
      void printBtn; // R1-24: الطباعة من دليل المعلّم وصفحة الأسرة فقط (لا زرّ على شاشة الطفل)
      (async () => { await ctx.instruction(task, 'bq7_E16_task', { icon: 'eye' }); })();
      const pbtn = h('button.bq-btn', { type: 'button', onclick: () => doPrint() }, 'اطبع البطاقة ودور وليّ الأمر ودليل الإتقان (A4)');
      const note = h('div', null, h('div', { html: '<p><b>' + esc(role.title) + '</b> (للطباعة وصفحة الأسرة — لا يظهر على شاشة الطفل):</p>' + roleHtml(role) +
        '<p><b>في الحصّة التالية:</b> يعرض كلّ طفل أشياءه ويقول جملة عن واحد منها («هَذا مِفْتاحٌ»)؛ سجّل حكمك على «استخدام المفردة» (S9) في «دليل الإتقان».</p>' +
        '<p>الخانات الثلاث على الشاشة يلمسها الطفل كلّما وجد شيئاً؛ عند الثالثة يُعلَّم العنصر منجَزاً. المطبوع: صفحة البطاقة ودور وليّ الأمر، ثم «دليل الإتقان» المعبّأ آلياً من «تحقّق من تقدّمي».</p>' }), pbtn);
      ctx.adultNote(note);

      function doPrint() {
        BQ.audio.stop();
        let p = document.querySelector('.e16-print'); if (p) p.remove();
        p = h('div.e16-print', { dir: 'rtl', lang: 'ar' });
        const img = BQ.hasImg7 && BQ.hasImg7('family_card') ? BQ.img7('family_card') : BQ.char.still('wave');
        const box = '<div><div class="p-box"></div><div class="p-line"></div></div>';
        const ul = (a) => '<ul>' + a.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
        p.innerHTML = '<div class="p-card"><div class="p-top"><img src="' + img + '" alt=""><div><p class="p-h">' + esc(title) + '</p><p class="p-k">' + esc(task) + '</p></div></div>' +
          '<p class="p-small">' + esc(D.family_draw || 'اِرْسُمْها هُنا:') + '</p><div class="p-boxes">' + box + box + box + '</div></div>' +
          '<hr class="p-cut"><h2>' + esc(role.title) + '</h2><p><b>هدف اليوم:</b> ' + esc(role.goal) + '</p>' +
          '<div class="p-role"><div><b>قبل الدرس</b>' + ul(role.before) + '</div><div><b>أثناء الدرس</b>' + ul(role.during) + '</div><div><b>بعد الدرس</b>' + ul(role.after) + '</div></div>' +
          '<p class="p-foot">بارق · L1-01-d1 · صوت الميم · v7 مسوّدة (draft_unapproved)</p>';
        if (BQ.masteryView) { const ms = h('div.p-ms.lp.ms-view'); BQ.masteryView.render(ms); p.append(ms); }
        document.body.append(p);
        document.body.classList.add('e16-printing');
        /* R3b-P1: لا مؤقّت — iPad Safari لا يحجب print()؛ التنظيف عند afterprint أو أوّل لمسة بعد العودة (نمط IX2 X.print) */
        const done = () => { document.body.classList.remove('e16-printing'); const q = document.querySelector('.e16-print'); if (q) q.remove();
          window.removeEventListener('afterprint', done); document.removeEventListener('pointerdown', done, true); };
        window.addEventListener('afterprint', done);
        setTimeout(() => { try { window.print(); } catch (e) { /* */ } setTimeout(() => document.addEventListener('pointerdown', done, true), 400); }, 60);
      }
      ctx.onCleanup(() => { document.body.classList.remove('e16-printing'); const p = document.querySelector('.e16-print'); if (p) p.remove(); });
    },
  });
})();
