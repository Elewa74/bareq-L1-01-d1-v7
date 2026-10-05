/* E11 · تَحَقَّقْ مِنْ تَقَدُّمي — IX2 · v7 · draft_unapproved · SPEC_v7 §E11 · DECISIONS (ح) · كلّ النواتج · S1–S9
   بعده: يعرف الطفل (والمعلّم ووليّ الأمر) ما أتقنه، ويتلقّى مراجعة قصيرة موجّهة من بارق لما لم يتقنه بعد.
   خلَف «اختبر نفسك» (EL16) في الأصل: محاولة واحدة لكلّ بند · ردّ محايد واحد بعد كلّ بند (شُكْرًا / هَيّا إِلى التّالي) · لا صواب/خطأ ·
   لا رقم ولا عدد أمام الطفل · زرّ السمّاعة يعيد السؤال وأصواته فقط · ترتيب الخيارات مخلوط.
   ١٧ بنداً بالترتيب S1→S9 (S4: البند ١ إدراكيّ «أيّهما صحيحة؟» + البند ٢ «قُلْ» بحكم المعلّم/وليّ الأمر من لوحة مخفيّة: ضغط مطوَّل ١٫٥ ث على بارق).
   التسجيل (عقد المنصّة): record(S, ok, {kind:'item', item:1|2}) · بعد المراجعة بند إعادة واحد {kind:'retest'} · تدريب المراجعة {kind:'practice'} (لا يُحتسب).
   النتيجة: ٩ أيقونات بلا أسماء — المتقنة ذهبية، وعلى غيرها بارق صغير يلوّح ← مراجعات تلقائية بالترتيب (≤ ٤٠ ث لكلّ مهارة) بتلميحات كاملة ← بند إعادة محايد.
   الحكم من BQ.mastery (E11 وحده يقرّر «أتقن»). */
(function () {
  'use strict';
  const ID = 'E11';
  const SK = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'];
  /* مواصفة البنود: type pic | snd | txt | img | tapword | write | say · opts[0] = الصواب (يُخلط العرض) */
  const P = (k) => ({ pic: k });
  const ITEMS = {
    S1: [{ type: 'pic', q: 'bq7_E11_s1_q', opts: ['numur', 'batta', 'kura'].map(P), announce: true },
         { type: 'pic', q: 'bq7_E11_s1_q', opts: ['qamis', 'farasha', 'fil'].map(P), announce: true }],
    S2: [{ type: 'snd', q: 'bq7_E11_s2_q', opts: ['مَ', 'بَ', 'فَ'], announce: true },
         { type: 'snd', q: 'bq7_E11_s2_q', opts: ['مُ', 'نُ', 'بُ'], announce: true }],
    S3: [{ type: 'img', q: 'bq7_E11_s3_q1', stim: 'bq7_S_muu', opts: ['glide', 'hop'] },
         { type: 'snd', q: 'bq7_E11_s3_q2', opts: ['ما', 'مَ'], announce: true }],
    S4: [{ type: 'brq', q: 'bq7_E05_puppet_intro', opts: ['bq7_E11_brq_miftah_ok', 'bq7_E11_brq_miftah_bad'] },
         { type: 'say', q: 'bq7_E11_s4_q2' }],
    S5: [{ type: 'txt', q: 'bq7_E11_s5_q1', stim: 'bq7_S_mi', opts: ['مِ', 'فِ', 'بِ'] },
         { type: 'txt', q: 'bq7_E11_s5_q2', opts: ['م', 'ب', 'ف'] }],
    S6: [{ type: 'tapword', q: 'bq7_E11_s6_q1', word: 'qamis' },
         { type: 'form', q: 'bq7_E11_s6_q2', before: 'فَـ', opts: ['ـم', 'مـ', 'ـمـ'] }],
    S7: [{ type: 'read', q: 'bq7_E08_read_intro', word: 'mawz', opts: ['mawz', 'qamar', 'fam'].map(P) },
         { type: 'read', q: 'bq7_E08_read_intro', word: 'miftah', opts: ['miftah', 'musht', 'maktab'].map(P) }],
    S8: [{ type: 'write', q: 'bq7_E11_s8_q1', form: 'iso' },
         { type: 'write', q: 'bq7_E11_s8_q2', form: 'med', before: 'قَـ', after: 'ـرْ', word: 'قَمَرْ' }],
    S9: [{ type: 'pic', q: 'bq7_E11_s9_q1', opts: ['musht', 'miftah', 'manju'].map(P) },
         { type: 'pic', q: 'bq7_E11_s9_q2', opts: ['miftah', 'musht', 'mawz'].map(P) }],
  };
  /* المراجعة التكيّفية (SPEC: بارق يعيد · بندان تدريبيان · بند إعادة محايد) */
  const REVIEW = {
    S1: { teach: [{ line: 'bq7_E11_r_s1' }, { line: 'bq7_W_maktab_seg', pic: 'maktab' }, { line: 'bq7_W_musht_seg', pic: 'musht' }, { line: 'bq7_W_miftah_seg', pic: 'miftah' }],
      practice: [{ type: 'pic', q: 'bq7_E03_intro', opts: ['miftah', 'fil'].map(P), announce: true }, { type: 'pic', q: 'bq7_E03_intro', opts: ['numur', 'batta'].map(P), announce: true }],
      retest: { type: 'pic', q: 'bq7_E11_s1_q', opts: ['musht', 'kura', 'bab'].map(P), announce: true } },
    S2: { teach: [{ line: 'bq7_E11_r_s2' }, { line: 'bq7_S_pair_mb', snd: ['مَ', 'بَ'] }, { line: 'bq7_S_pair_mf', snd: ['مَ', 'فَ'] }],
      practice: [{ type: 'snd', q: 'bq7_E11_s2_q', opts: ['مِ', 'بِ'], announce: true }, { type: 'snd', q: 'bq7_E11_s2_q', opts: ['مُ', 'فُ'], announce: true }],
      retest: { type: 'snd', q: 'bq7_E11_s2_q', opts: ['ما', 'با', 'فا'], announce: true } }, // كلّها طويلة، تختلف في الصامت وحده (R1b N4)
    S3: { teach: [{ line: 'bq7_E11_r_s3', hopglide: true }, { line: 'bq7_S_pair_a', hopglide: true }, { line: 'bq7_S_pair_i', hopglide: true }, { line: 'bq7_S_pair_u', hopglide: true }],
      practice: [{ type: 'img', q: 'bq7_E05_q_len', stim: 'bq7_S_mii', opts: ['glide', 'hop'] }, { type: 'img', q: 'bq7_E05_q_len', stim: 'bq7_S_mi', opts: ['hop', 'glide'] }],
      retest: { type: 'img', q: 'bq7_E11_s3_q1', stim: 'bq7_S_maa', opts: ['glide', 'hop'] } },
    S4: { teach: [{ line: 'bq7_E11_r_s4', mouth: 'mouth_closed' }, { line: 'bq7_G_hint_lips', mouth: 'mouth_a' }, { line: 'bq7_S_chain_short', mouth: 'mouth_a', turn: true }, { line: 'bq7_S_chain_long', mouth: 'mouth_u', turn: true }],
      practice: [],
      retest: { type: 'brq', q: 'bq7_E05_puppet_intro', opts: ['bq7_E11_brq_qamis_ok', 'bq7_E11_brq_qamis_bad'] } },
    S5: { teach: [{ line: 'bq7_E11_r_s5', glyph: 'م' }],
      practice: [{ type: 'txt', q: 'bq7_G_listen_choose', stim: 'bq7_S_ma', opts: ['مَ', 'بَ', 'فَ'] }, { type: 'txt', q: 'bq7_G_listen_choose', stim: 'bq7_S_muu', opts: ['مو', 'بو', 'فو'] }], // تختلف في الصامت وحده (R1b N4)
      retest: { type: 'txt', q: 'bq7_E11_s5_q1', stim: 'bq7_S_mii', opts: ['مي', 'في', 'بي'] } },
    S6: { teach: [{ line: 'bq7_E11_r_s6', words: ['maktab', 'numur', 'qalam'] }],
      practice: [{ type: 'tapword', q: 'bq7_E08_b_intro', word: 'mawz', say: true }, { type: 'tapword', q: 'bq7_E08_b_intro', word: 'qalam', say: true }],
      retest: { type: 'tapword', q: 'bq7_E11_retest', word: 'qamar', say: true } },
    S7: { teach: [{ line: 'bq7_E11_r_s7', chain: ['مَ', 'ما', 'مانْجو'] }],
      practice: [{ type: 'read', q: 'bq7_E08_read_intro', word: 'musht', opts: ['musht', 'miftah', 'maktab'].map(P) }, { type: 'read', q: 'bq7_E08_read_intro', word: 'qamar', opts: ['qamar', 'fam', 'qalam'].map(P) }],
      retest: { type: 'read', q: 'bq7_E08_read_intro', word: 'maktab', opts: ['maktab', 'musht', 'miftah'].map(P) } },
    S8: { teach: [{ line: 'bq7_E11_r_s8' }],
      practice: [{ type: 'trace', q: 'bq7_E09_trace' }, { type: 'trace', q: 'bq7_E09_trace' }],
      retest: { type: 'write', q: 'bq7_E11_s8_q1', form: 'iso' } },
    S9: { teach: [{ line: 'bq7_E11_r_s9' }, { line: 'bq7_E04_mean_musht', ctxImg: 'ctx_musht' }, { line: 'bq7_E04_mean_miftah', ctxImg: 'ctx_miftah' }, { line: 'bq7_E04_mean_manju', ctxImg: 'ctx_manju' }],
      practice: [{ type: 'pic', q: 'bq7_E11_r9_q1', opts: ['manju', 'maktab', 'qamis'].map(P) }],
      retest: { type: 'pic', q: 'bq7_E11_r9_q2', opts: ['maktab', 'numur', 'mawz'].map(P) } },
  };
  const LBL = { S1: 'تمييز صوت م', S2: 'تمييز م عن أصوات أخرى', S3: 'التمييز بين مَ وما', S4: 'نطق م', S5: 'ربط الصوت بالحرف', S6: 'تمييز موقع الحرف', S7: 'قراءة كلمات', S8: 'كتابة الحرف', S9: 'استخدام المفردة' };
  const SND_COL = ['#00AEED', '#E4553F', '#3DBB6B', '#8E6CD9'];

  const CSS = `
.e11 { justify-content: flex-start; }
.e11-top { display: flex; justify-content: center; }
.e11-body { flex: 1 1 auto; min-height: 0; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(10px, 2.6cqi, 24px); }
.e11-opts { display: flex; direction: rtl; flex-wrap: wrap; justify-content: center; align-items: center; gap: clamp(12px, 3cqi, 30px); }
.e11-opt { position: relative; cursor: pointer; padding: 0; border: 0; background: none; transition: transform .15s, box-shadow .2s, opacity .3s; }
.e11-opt:active { transform: scale(.96); }
.e11-card { --s: min(clamp(96px, 23cqi, 210px), calc(var(--H, 600px) * .32)); width: var(--s); aspect-ratio: 1; border-radius: 24px; border: 5px solid #fff; overflow: hidden; background: #fff; box-shadow: 0 6px 0 var(--sky-line), 0 12px 24px var(--shade); }
.e11-card .x7-pic { border-radius: 19px; }
.e11-snd { width: clamp(96px, 18cqi, 140px); aspect-ratio: 1; border-radius: 50%; color: #fff; display: grid; place-items: center; box-shadow: 0 7px 0 rgba(0,0,0,.18), 0 12px 22px var(--shade); background: radial-gradient(circle at 34% 30%, rgba(255,255,255,.55), transparent 42%), var(--c, #00AEED); }
.e11-snd .x7-ic { width: 46%; height: 46%; }
.e11-snd[data-c="1"] { --c: #E4553F; } .e11-snd[data-c="2"] { --c: #3DBB6B; } .e11-snd[data-c="3"] { --c: #8E6CD9; }
.e11-txt { min-width: clamp(96px, 17cqi, 150px); min-height: clamp(96px, 17cqi, 150px); padding: 0 16px 12px; border-radius: 24px; background: #FFFDF2; border: 3px solid #E9D7A6; box-shadow: 0 6px 0 #E2C98A; display: inline-flex; align-items: center; justify-content: center; }
.e11-txt .x7-w { font-size: clamp(52px, 11cqi, 96px); line-height: 1.35; color: var(--navy); }
.e11-imgopt { width: min(clamp(110px, 24cqi, 220px), calc(var(--H, 600px) * .34)); aspect-ratio: 1; border-radius: 26px; background: #fff; box-shadow: 0 6px 0 var(--sky-line), 0 12px 24px var(--shade); overflow: hidden; display: grid; place-items: center; }
.e11-imgopt img { width: 92%; height: 92%; object-fit: contain; }
.e11-opt.is-play { box-shadow: 0 0 0 6px var(--sun), 0 0 26px var(--sun) !important; transform: scale(1.05); }
.e11-opt.is-pick { box-shadow: 0 0 0 6px var(--sky), 0 12px 24px var(--shade) !important; }
.e11-opts.is-locked .e11-opt:not(.is-pick) { opacity: .55; }
.e11-opt.is-ok { box-shadow: 0 0 0 6px var(--ok, #1B7F53), 0 12px 24px var(--shade) !important; }
.e11-opt.is-dim { opacity: .4; filter: saturate(.4); }
.e11-opt.is-glow { box-shadow: 0 0 0 6px var(--sun), 0 0 30px var(--sun) !important; }
.e11-word { font-size: clamp(54px, 12cqi, 110px); padding: 0 24px 12px; border-radius: 24px; background: #FFFDF2; border: 3px solid #E9D7A6; box-shadow: 0 6px 0 #E2C98A; }
.e11-tw { display: inline-flex; direction: rtl; padding: 4px 22px 14px; cursor: pointer; border-radius: 24px; background: #FFFDF2; border: 3px solid #E9D7A6; box-shadow: 0 6px 0 #E2C98A; }
.e11-tw button { min-width: 0; min-height: 110px; padding: 0; margin: 0; border: 0; border-radius: 14px; background: transparent; cursor: pointer; font: 700 clamp(60px, 13cqi, 116px)/1.35 var(--ff-child); color: var(--navy); }
.e11-tw button.is-pick { background: rgba(0,174,237,.16); }
.e11-tw button.is-ok { color: var(--coral); background: #E6F5EC; }
.e11-tw button.is-glow { background: rgba(254,186,2,.3); }
.e11-form { display: flex; direction: rtl; align-items: center; gap: 6px; }
.e11-form .x7-w { font-size: clamp(60px, 13cqi, 116px); }
.e11-blank { width: clamp(70px, 13cqi, 110px); height: clamp(84px, 14cqi, 120px); border-radius: 18px; border: 3px dashed #9CC9E6; background: rgba(255,255,255,.8); display: grid; place-items: center; }
.e11-blank .x7-w { color: var(--coral); }
.e11-brqs .e11-opt { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.e11-brqbtn { width: clamp(110px, 20cqi, 170px); aspect-ratio: 1; border-radius: 28px; background: #fff; box-shadow: 0 6px 0 var(--sky-line), 0 12px 24px var(--shade); display: grid; place-items: center; position: relative; }
.e11-brqbtn .bq-brq { width: 82%; height: 82%; }
.e11-brqbtn .bq-brq img { width: 100%; height: 100%; object-fit: contain; }
.e11-brqbtn .e11-n { position: absolute; top: 8px; inset-inline-end: 8px; width: 34px; height: 34px; border-radius: 50%; background: var(--sky); color: #fff; display: grid; place-items: center; }
.e11-brqbtn .e11-n .x7-ic { width: 20px; height: 20px; }
.e11-say { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.e11-saybrq { width: clamp(130px, 24cqi, 220px); aspect-ratio: 1; touch-action: none; -webkit-user-select: none; user-select: none; border-radius: 50%; }
.e11-saybrq .bq-brq, .e11-saybrq .bq-brq img { width: 100%; height: 100%; object-fit: contain; }
.e11-saybrq.is-hold { box-shadow: 0 0 0 6px rgba(0,52,91,.15); }
.e11-chain { display: flex; direction: rtl; gap: 12px; flex-wrap: wrap; justify-content: center; }
.e11-chain .x7-w { font-size: clamp(44px, 9cqi, 80px); padding: 0 14px 8px; border-radius: 18px; background: #FFFDF2; box-shadow: 0 5px 0 #E2C98A; }
.e11-chain .is-lit { box-shadow: 0 0 0 5px var(--sun), 0 0 22px var(--sun); }
.e11-judge { position: absolute; z-index: 20; inset-inline: 0; top: 8px; margin: auto; width: max-content; display: flex; gap: 10px; padding: 10px 14px; border-radius: 22px; background: var(--navy); box-shadow: 0 10px 30px rgba(0,0,0,.25); }
.e11-judge button { min-width: 64px; min-height: 64px; border: 0; border-radius: 16px; background: #fff; display: grid; place-items: center; cursor: pointer; padding: 6px; }
.e11-judge button .x7-ic { width: 40px; height: 40px; }
.e11-judge button[aria-pressed="true"] { box-shadow: 0 0 0 4px var(--sun); }
.e11-res { display: grid; grid-template-columns: repeat(3, auto); gap: clamp(10px, 2.6cqi, 22px); justify-content: center; }
.e11-ri { position: relative; width: min(clamp(80px, 14cqi, 124px), calc(var(--H, 600px) * .2)); aspect-ratio: 1; border-radius: 26px; background: #fff; box-shadow: 0 5px 0 var(--sky-line), 0 10px 20px var(--shade); display: grid; place-items: center; transition: box-shadow .4s, background .4s; }
.e11-ri img.ic { width: 74%; height: 74%; object-fit: contain; filter: saturate(.55); opacity: .8; transition: filter .4s, opacity .4s; }
.e11-ri.is-gold { background: radial-gradient(circle at 50% 40%, #FFF6C4, #FBE65B); box-shadow: 0 0 0 4px var(--sun), 0 0 26px rgba(254,186,2,.65); }
.e11-ri.is-gold img.ic { filter: none; opacity: 1; }
.e11-ri.is-cur { box-shadow: 0 0 0 5px var(--sky), 0 10px 20px var(--shade); }
.e11-ri .e11-wave { position: absolute; bottom: -12px; inset-inline-start: -12px; width: 52%; aspect-ratio: 1; }
.e11-ri .e11-wave img { width: 100%; height: 100%; object-fit: contain; }
.e11-ri .e11-glyph { position: absolute; left: 31%; top: 47%; transform: translate(-50%, -50%); font: 700 clamp(14px, 2.6cqi, 24px)/1 var(--ff-child); color: var(--coral); padding-bottom: .2em; }
.e11-teach { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.e11-teach .e11-big { font: 700 clamp(90px, 20cqi, 170px)/1 var(--ff-child); color: var(--coral); padding-bottom: 20px; }
.e11-ctx { width: min(clamp(160px, 44cqi, 420px), calc(var(--H, 600px) * .7 * 16 / 9)); aspect-ratio: 16/9; border-radius: 22px; overflow: hidden; border: 5px solid #fff; box-shadow: 0 10px 22px var(--shade); }
.e11-mouth { width: min(clamp(160px, 40cqi, 380px), calc(var(--H, 600px) * .6 * 16 / 9)); aspect-ratio: 16/9; border-radius: 22px; overflow: hidden; border: 5px solid #fff; box-shadow: 0 10px 22px var(--shade); }
.e11-ctx img, .e11-mouth img { width: 100%; height: 100%; object-fit: cover; }
.e11 .x7-wp { --wp-h: calc(var(--H, 600px) - 150px); width: min(100%, calc((var(--H, 600px) - 150px) * var(--wp-ar, 1))); }
.e11-go { min-width: 96px; min-height: 96px; border-radius: 50%; padding: 0; }
.e11-go .x7-ic { width: 44px; height: 44px; }
.e11.is-short .x7-buddy { display: none; }
.e11.is-short .e11-top { position: absolute; top: 2px; inset-inline-end: 168px; z-index: 2; }
.e11.is-short .e11-body { padding-top: 34px; }
.e11.is-short .e11-say { flex-direction: row; gap: 12px; }
.e11.is-short .e11-saybrq { width: 104px; }
.e11.is-short .e11-chain { flex-wrap: nowrap; gap: 6px; }
.e11.is-short .e11-chain .x7-w { font-size: 34px; padding: 0 8px 4px; }
.e11.is-short .e11-word, .e11.is-short .e11-tw button { font-size: 56px; min-height: 80px; }
.e11.is-short .e11-teach { flex-direction: row; }
.e11.is-short .e11-teach .e11-big { font-size: 90px; }
.e11.is-short .e11-snd, .e11.is-short .e11-txt { width: 88px; min-width: 88px; min-height: 88px; }
.e11.is-short .e11-txt .x7-w { font-size: 48px; }
@container stage (max-width: 520px) { .e11-res { gap: 10px; } .e11-snd { width: 92px; } .e11-tw button { font-size: 72px; } }
@media (prefers-reduced-motion: reduce) { .e11-opt, .e11-ri { transition: none; } }
`;
  const NEXT_SVG = '<svg viewBox="0 0 48 48"><path d="M30 10 16 24l14 14" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function run(stage, ctx) {
    const X = BQ.ix7b, h = BQ.h, W = X.W;
    X.style('st-e11', CSS);
    X.ICON.next = NEXT_SVG;
    X.ICON.near = '<svg viewBox="0 0 48 48"><path d="M24 4l5.6 12.3 13.4 1.4-10 9 2.9 13.2L24 33.2 12.1 39.9 15 26.7l-10-9 13.4-1.4z" fill="#FFF6C4" stroke="#C98F00" stroke-width="2" stroke-linejoin="round"/><path d="M24 4l5.6 12.3 13.4 1.4-10 9 2.9 13.2L24 33.2z" fill="#FEBA02"/></svg>';
    const S = X.session(ctx);
    const root = X.root(ctx, 'e11');
    const top = h('div.e11-top');
    const nItems = SK.reduce((a, s) => a + ITEMS[s].length, 0);
    const dots = X.dots(top, nItems);
    const body = h('div.e11-body');
    root.append(top, body);
    const buddy = X.buddy(root);
    const fitH = () => { const H = stage.clientHeight || 600; root.style.setProperty('--H', H + 'px'); root.classList.toggle('is-short', H < 420); };
    fitH();
    if (window.ResizeObserver) { const ro = new ResizeObserver(fitH); ro.observe(stage); ctx.onCleanup(() => ro.disconnect()); }
    const M = () => BQ.mastery;
    const log = {}; SK.forEach((s) => { log[s] = { items: [], practice: [], retest: null, judge: null }; });
    let ackI = 0;
    const clear = () => body.replaceChildren();
    const status = (s) => { try { return M() ? M().status(s) : null; } catch (e) { return null; } };

    note();
    (async () => {
      ctx.instruction(X.text('bq7_E11_intro'), 'bq7_E11_intro', { icon: 'ear' });
      buddy.mood('wave', 1800);
      await S.say('bq7_E11_intro');
      let k = 0;
      for (const s of SK) {
        for (let i = 0; i < ITEMS[s].length; i++) {
          dots.set(k++);
          const it = ITEMS[s][i];
          // الاسم يُقرن بصوته بعد بنود S2 وS5 (لا تلقين لجوابهما — R1b N5): قبل أوّل بند من S6
          if (s === 'S6' && i === 0) await S.say(X.NAME_SOUND);
          if (it.type === 'say') { await sayItem(it); continue; }
          const r = await runItem(it, 'neutral');
          log[s].items.push(r.ok);
          X.record(ctx, s, r.ok, { kind: 'item', item: i + 1 });
          note();
          buddy.mood('talk', 900);
          await S.say(ackI++ % 2 ? 'bq7_E11_ack2' : 'bq7_E11_ack1');
        }
      }
      dots.set(nItems);
      await results();
    })();

    /* ================= البنود ================= */
    /** يشغّل بنداً: mode 'neutral' (قياس: محاولة واحدة) · 'learn' (تدريب: سياسة التعلّم الكاملة) → {ok, tries} */
    async function runItem(it, mode) {
      clear();
      if (it.type === 'write' || it.type === 'trace') return writeItem(it, mode);
      const learn = mode === 'learn';
      const correctKey = optKey(it, 0);
      let opts = (it.opts || []).map((o, i) => ({ o, key: optKey(it, i), i }));
      opts = BQ.shuffle(opts);
      // الرأس: الكلمة المكتوبة / الشكل / الكلمة اللمسية
      let wrapOpts, btns = [];
      if (it.type === 'read') body.append(h('div.e11-word.x7-w.x7-in', null, X.markMeem(W[it.word].t)));
      if (it.type === 'form') body.append(h('div.e11-form.x7-in', null, h('span.x7-w', null, it.before), h('div.e11-blank', null, h('span.x7-w', null, '?'))));
      if (it.type === 'tapword') {
        const w = W[it.word];
        const pcs = X.pieces(w.letters || X.letters(w.t));
        wrapOpts = h('div.e11-tw.x7-in', { role: 'group', 'aria-label': 'الكَلِمَةُ' });
        btns = pcs.map((p, i) => { const b = h('button', { type: 'button', 'aria-label': 'حَرْفٌ ' + X.AR(i + 1), dataset: { k: X.bare(p.src) === 'م' ? 'm' : 'x' + i } }, p.t); wrapOpts.append(b); return b; });
        // الحرف هدفٌ ضيّق: لمسة في أيّ مكان من البطاقة تذهب إلى أقرب حرف (الحروف متّصلة بلا فراغات)
        wrapOpts.addEventListener('click', (e) => {
          if (e.target.closest('button')) return;
          let best = null, bd = 1e9;
          btns.forEach((b) => { const r = b.getBoundingClientRect(); const d = Math.abs(e.clientX - (r.left + r.width / 2)); if (d < bd) { bd = d; best = b; } });
          if (best) best.click();
        });
        body.append(wrapOpts);
      } else {
        wrapOpts = h('div.e11-opts' + (it.type === 'brq' ? '.e11-brqs' : ''), { role: 'group' });
        btns = opts.map((x, n) => { const b = optEl(it, x.o, n); b.dataset.k = x.key; wrapOpts.append(b); return b; });
        body.append(wrapOpts);
      }
      const ck = it.type === 'tapword' ? 'm' : correctKey;
      if (window.BQ_QA) wrapOpts.dataset.ck = ck; // للاختبار الآليّ فقط
      // السؤال + المثير + إسماع الخيارات بالترتيب (كلّ خيار يضيء)
      let asking = null;
      const ask = async () => {
        if (it.q) await S.say(it.q);
        if (it.type === 'tapword' && it.say) await S.say(X.wordId(it.word), { stim: true });
        if (it.stim) await S.say(it.stim, { stim: true });
        if (it.announce || it.type === 'brq') for (const b of btns) { b.classList.add('is-play'); await S.say(audioOf(it, b.dataset.k), { stim: true }); b.classList.remove('is-play'); await S.sleep(180); }
      };
      ctx.instruction(X.text(it.q), it.q, { icon: 'ear' });
      ctx.onReplay(() => { if (!asking) asking = ask().finally(() => { asking = null; }); });
      wrapOpts.classList.add('is-locked');
      asking = ask(); await asking; asking = null;
      wrapOpts.classList.remove('is-locked');
      let tries = 0;
      return new Promise((resolve) => {
        let over = false;
        btns.forEach((b) => b.addEventListener('click', async () => {
          if (over || b.classList.contains('is-dim') || asking) return;
          if (!learn) {
            over = true;
            b.classList.add('is-pick'); wrapOpts.classList.add('is-locked'); X.anim(b, 'fx7-pop', 420);
            if (it.announce || it.type === 'brq') await S.say(audioOf(it, b.dataset.k), { stim: true }); // اللمس يُسمِع الصوت ثم يُحكم
            await S.sleep(350);
            resolve({ ok: b.dataset.k === ck, tries: 1 });
            return;
          }
          tries++;
          if (it.announce || it.type === 'brq') { b.classList.add('is-play'); await S.say(audioOf(it, b.dataset.k), { stim: true }); b.classList.remove('is-play'); }
          if (b.dataset.k === ck) {
            over = true; b.classList.add('is-ok'); X.burst(b, 10); buddy.mood('cheer', 1800); S.fx(X.sfx.ok, 0.45);
            await S.say(X.yes()); await evidence(it);
            resolve({ ok: tries === 1, tries }); return;
          }
          b.classList.add('is-dim'); X.anim(b, 'fx7-wob', 420); buddy.mood('think', 1400);
          const right = btns.find((x) => x.dataset.k === ck);
          if (tries === 1 && btns.length > 2) { await S.say(hintOf(it)); }
          else if (tries === 2 && btns.length > 2) { right.classList.add('is-glow'); await S.say(X.G.light); }
          else {
            over = true; right.classList.remove('is-glow'); right.classList.add('is-ok');
            await S.say(X.G.model); await evidence(it); await S.say(X.G.next);
            resolve({ ok: false, tries });
          }
        }));
      });
    }
    function optKey(it, i) {
      const o = it.opts ? it.opts[i] : null;
      if (o == null) return '';
      return typeof o === 'string' ? o : o.pic;
    }
    function audioOf(it, key) {
      if (it.type === 'pic') return X.wordId(key);
      if (it.type === 'snd') return X.sylId(key);
      if (it.type === 'brq') return key;
      return null;
    }
    function hintOf(it) {
      if (it.type === 'pic' && it.announce) return X.G.hintStart;
      if (it.type === 'snd' || it.type === 'img') return X.G.listen;
      if (it.type === 'tapword' || it.type === 'form') return X.G.shape;
      return X.G.try;
    }
    async function evidence(it) {
      if (it.type === 'pic' && it.announce) return S.say(X.segId(optKey(it, 0)), { stim: true });
      if (it.type === 'read') return S.say(X.wordId(it.word), { stim: true });
      if (it.type === 'tapword') return S.say(X.G.pos[W[it.word].pos]);
      if (it.type === 'img' && it.stim) return S.say(it.stim, { stim: true });
      if (it.type === 'snd' || it.type === 'txt') { const a = X.sylId(optKey(it, 0)); return a ? S.say(a, { stim: true }) : null; }
      return null;
    }
    function optEl(it, o, n) {
      const aria = 'خِيارٌ ' + X.AR(n + 1);
      if (it.type === 'pic' || it.type === 'read') return h('button.e11-opt.e11-card.x7-in', { type: 'button', 'aria-label': aria }, X.pic(ctx, W[o.pic].img));
      if (it.type === 'snd') return h('button.e11-opt.e11-snd.x7-in', { type: 'button', 'aria-label': aria, dataset: { c: n % SND_COL.length } }, X.icon('speaker'));
      if (it.type === 'txt' || it.type === 'form') return h('button.e11-opt.e11-txt.x7-in', { type: 'button', 'aria-label': aria }, h('span.x7-w', null, o));
      if (it.type === 'img') return h('button.e11-opt.e11-imgopt.x7-in', { type: 'button', 'aria-label': o === 'hop' ? 'قَصيرٌ' : 'طَويلٌ' }, h('img', { src: ctx.img(o === 'hop' ? 'bariq_hop' : 'bariq_glide'), alt: '', draggable: 'false' }));
      if (it.type === 'brq') return h('button.e11-opt.x7-in', { type: 'button', 'aria-label': aria }, h('span.e11-brqbtn', null, X.brq(n ? 'think' : 'talk'), h('span.e11-n', null, X.icon('speaker'))));
      return h('button.e11-opt', { type: 'button' }, String(o));
    }

    /* الكتابة: قياس = محاولة واحدة بلا دليل · تدريب (trace) = سياسة E09 */
    async function writeItem(it, mode) {
      const learn = mode === 'learn';
      const trace = it.type === 'trace';
      ctx.instruction(X.text(it.q), it.q, { icon: 'hand' });
      ctx.onReplay(() => S.say(it.q));
      const wrap = h('div.x7-in', { style: { display: 'flex', justifyContent: 'center', width: '100%' } });
      body.append(wrap);
      let fails = 0;
      const pad = X.writePad(wrap, {
        form: it.form || 'iso', ctxBefore: it.before, ctxAfter: it.after,
        guide: trace ? 'road' : 'none', arrows: trace, start: trace, lenient: trace, ink: trace ? 'path' : 'free',
        oneShot: !learn,
        onFail: async (reason, n) => {
          fails = n;
          if (!learn) return;
          if (n === 1) { pad.showStart(); buddy.mood('think', 1400); S.say('bq7_E09_retry'); }
          else if (n === 2) { pad.setGuide('bold'); pad.setArrows(true); pad.showStart(); pad.runner(true); S.say(X.G.light); }
          else { pad.runner(false); pad.lock(true); await S.say('bq7_E09_watch'); await pad.demo(3400, true); pad.fill(); }
        },
      });
      await S.say(it.q);
      const res = await S.gate(pad.done);
      pad.runner(false);
      if (!learn) { await S.sleep(300); return { ok: !res.failed && !res.assisted, tries: 1 }; }
      if (!res.assisted) { X.burst(pad.el, 10); buddy.mood('cheer', 1600); await S.say('bq7_E09_ok'); }
      return { ok: !res.assisted && fails <= 1, tries: fails + 1 };
    }

    /* S4 البند ٢: «قُلْ…» — يقول الطفل؛ الحكم للمعلّم/وليّ الأمر (ضغط مطوَّل ١٫٥ ث على بارق) */
    async function sayItem(it) {
      clear();
      ctx.instruction(X.text(it.q), it.q, { icon: 'mouth' });
      ctx.onReplay(() => S.say(it.q));
      const brqWrap = h('div.e11-saybrq.x7-in', { role: 'img', 'aria-label': 'بارِق' }, X.brq('talk'));
      const chain = h('div.e11-chain', { 'aria-hidden': 'true' }, ['مَ', 'مِ', 'مُ', 'ما', 'مي', 'مو'].map((t) => h('span.x7-w', null, X.markMeem(t))));
      const go = h('button.x7-btn.e11-go', { type: 'button', 'aria-label': 'التّالي', disabled: true }, X.icon('next'));
      body.append(h('div.e11-say', null, brqWrap, chain, go));
      X.longPress(brqWrap, 1500, () => judgePanel(body));
      await S.say(it.q);
      brqWrap.firstChild.brq && brqWrap.firstChild.brq('idle');
      go.disabled = false;
      await new Promise((r) => go.addEventListener('click', r, { once: true }));
      const p = body.querySelector('.e11-judge'); if (p) p.remove();
    }
    function judgePanel(host) {
      let p = host.querySelector('.e11-judge');
      if (p) { p.remove(); return; }
      const cur = (M() && M().get && M().get().S4 && M().get().S4.judge) || null;
      const opt = [['mastered', 'star', 'أَتْقَنَ'], ['near', 'near', 'قَريبٌ'], ['notyet', 'sprout', 'لَيْسَ بَعْدُ']];
      p = h('div.e11-judge', { role: 'group', 'aria-label': 'حُكْمُ المُعَلِّمِ عَلى النُّطْقِ' },
        opt.map(([k, ic, a]) => h('button', { type: 'button', 'aria-label': a, title: a, 'aria-pressed': String(cur === k), onclick: () => { try { M().judge('S4', k); } catch (e) { /* */ } log.S4.judge = k; note(); p.remove(); } }, X.icon(ic))));
      host.append(p);
    }

    /* ================= النتيجة والمراجعة ================= */
    async function results() {
      clear();
      ctx.instruction(X.text('bq7_E11_results'), 'bq7_E11_results', { icon: 'eye' });
      ctx.onReplay(() => S.say('bq7_E11_results'));
      const grid = h('div.e11-res', { role: 'list' });
      const cells = {};
      SK.forEach((s, i) => {
        const st = status(s);
        const c = h('div.e11-ri.x7-in', { role: 'listitem', 'aria-label': st === 'mastered' ? 'أَتْقَنْتَ' : 'نَتَدَرَّبُ', style: { animationDelay: (i * 60) + 'ms' } },
          h('img.ic', { src: ctx.img('icon_' + s.toLowerCase()), alt: '', draggable: 'false' }));
        if (s === 'S5') c.append(h('span.e11-glyph', { 'aria-hidden': 'true' }, 'م'));
        cells[s] = c; grid.append(c);
      });
      body.append(grid);
      const weak = SK.filter((s) => status(s) !== 'mastered');
      const paint = () => SK.forEach((s) => {
        const c = cells[s]; const st = status(s);
        c.classList.toggle('is-gold', st === 'mastered');
        const wv = c.querySelector('.e11-wave');
        if (st !== 'mastered' && !wv) c.append(h('span.e11-wave', null, X.brq('wave')));
        if (st === 'mastered' && wv) wv.remove();
      });
      await S.sleep(500);
      paint();
      await S.say('bq7_E11_results');
      if (!weak.length) { buddy.mood('cheer', 4000); await S.say('bq7_E11_all'); return finish(true); }
      await S.say('bq7_E11_some');
      const follow = [];
      for (const s of weak) {
        await review(s, grid, cells);
        if (log[s].retest === false) follow.push(s);
        clear(); body.append(grid); paint();
        await S.sleep(500);
      }
      buddy.mood('cheer', 3000);
      await S.say('bq7_E11_review_done');
      if (follow.length) await S.say('bq7_E11_followup');
      finish(SK.every((s) => status(s) === 'mastered'));
    }
    async function review(s, grid, cells) {
      const R = REVIEW[s];
      SK.forEach((x) => cells[x].classList.toggle('is-cur', x === s));
      clear();
      // بارق يعيد
      const box = h('div.e11-teach.x7-in');
      body.append(box);
      buddy.mood('talk', 1500);
      for (const t of R.teach) {
        box.replaceChildren();
        if (t.pic) box.append(h('div.e11-card', null, X.pic(ctx, W[t.pic].img)));
        if (t.ctxImg) box.append(h('div.e11-ctx', null, h('img', { src: ctx.img(t.ctxImg), alt: '', draggable: 'false' })));
        if (t.mouth) box.append(h('div.e11-mouth', null, h('img', { src: ctx.img(t.mouth), alt: '', draggable: 'false' })));
        if (t.glyph) box.append(h('div.e11-big', { 'aria-hidden': 'true' }, t.glyph));
        if (t.hopglide) box.append(h('div.e11-opts', null, h('span.e11-imgopt', null, h('img', { src: ctx.img('bariq_hop'), alt: '' })), h('span.e11-imgopt', null, h('img', { src: ctx.img('bariq_glide'), alt: '' }))));
        if (t.snd) box.append(h('div.e11-opts', null, t.snd.map((x, i) => h('span.e11-snd', { dataset: { c: i } }, X.icon('speaker')))));
        if (t.words) box.append(h('div.e11-chain', null, t.words.map((w) => h('span.x7-w.is-lit', null, X.markMeem(W[w].t)))));
        if (t.chain) { const ch = h('div.e11-chain', null, t.chain.map((w) => h('span.x7-w', null, X.markMeem(w)))); box.append(ch); [...ch.children].forEach((c, i) => setTimeout(() => c.classList.add('is-lit'), 500 + i * 700)); }
        ctx.instruction(X.text(t.line), t.line, { icon: 'ear' });
        await S.say(t.line, { stim: /^bq7_(W|S)_/.test(t.line) });
        if (t.turn) { await S.say('bq7_G_your_turn'); await S.sleep(2600); }
        await S.sleep(250);
      }
      // تدريب (تعلّميّ — لا يُحتسب)
      for (const p of R.practice) {
        const r = await runItem(p, 'learn');
        log[s].practice.push(r.ok);
        X.record(ctx, s, r.ok, { kind: 'practice' });
        await S.sleep(400);
      }
      // بند الإعادة (محايد)
      clear();
      await S.say('bq7_E11_retest');
      const r = await runItem(R.retest, 'neutral');
      log[s].retest = r.ok;
      X.record(ctx, s, r.ok, { kind: 'retest' });
      note();
      buddy.mood('talk', 900);
      await S.say(ackI++ % 2 ? 'bq7_E11_ack2' : 'bq7_E11_ack1');
    }
    async function finish(all) {
      ctx.done();
      note();
      X.end(ctx, S, { title: all ? 'أَحْسَنْتَ!' : 'تَعَلَّمْتَ كَثيرًا!' });
    }

    /* ================= دليل المعلّم: النتيجة لكلّ مهارة ================= */
    function note() {
      const esc = X.esc;
      const g = (M() && M().get) ? M().get() : {};
      const mark = (v) => (v === true ? '✔' : v === false ? '✗' : '—');
      const rows = SK.map((s) => {
        const L = log[s], st = g[s] || {};
        return '<tr><td><b>' + s + '</b> ' + esc(LBL[s]) + '</td><td>' + (L.items.map(mark).join(' ') || '—') + '</td><td>' + (L.retest == null ? '—' : mark(L.retest)) + '</td><td>' + esc(st.status_ar || '') + '</td></tr>';
      }).join('');
      const node = h('div', null,
        h('div', { html: '<p><b>قياس محايد:</b> محاولة واحدة لكلّ بند، بلا تلميح ولا صواب/خطأ أمام الطفل. لا تساعده أثناء القياس. بعده نتيجة بالأيقونات للطفل ومراجعة قصيرة من بارق لما لم يُتقَن ثم بند إعادة واحد.</p>' +
          '<p><b>النطق (S4):</b> بعد «قُلْ: مَ، مِ، مُ، ما، مي، مو» احكم أنت: اضغط مطوّلاً (١٫٥ ث) على بارق في شاشة البند، أو من هنا:</p>' }),
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '6px 0 10px' } },
          [['mastered', 'أتقن'], ['near', 'قريب'], ['notyet', 'ليس بعد']].map(([k, a]) => h('button', { type: 'button', class: 'bq-btn ghost', 'aria-pressed': String((g.S4 && g.S4.judge) === k), onclick: () => { try { M().judge('S4', k); } catch (e) { /* */ } log.S4.judge = k; note(); } }, a))),
        h('div', { html: '<table class="x7-log"><thead><tr><th>المهارة</th><th>البندان</th><th>الإعادة</th><th>الحالة</th></tr></thead><tbody>' + rows + '</tbody></table>' +
          '<p><a href="#mastery">افتح «دليل الإتقان ودور الأسرة» (قابل للطباعة)</a></p>' }));
      X.note(ctx, node);
    }
  }

  BQ.register(ID, {
    render(stage, ctx) {
      BQ.loadScript('js/el7/ix7b.js').then(() => { if (ctx.alive()) run(stage, ctx); })
        .catch((e) => { console.warn('[E11] ' + e.message); if (ctx.placeholder) ctx.placeholder(); });
    },
  });
})();
