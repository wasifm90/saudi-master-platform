// =========================================================================
// SAUDI MASTER COMPANY (ULMA ALLIANCE) - ROBUST BILINGUAL SPA ENGINE
// Complete English / Arabic Internationalization (zero untranslated fields)
// =========================================================================

let currentLang = 'en';
let activeClassification = 'LOCAL';
let activeCategory = 'all';
let productsCache = [];
let currentAssemblyStepIndex = 0;
let activeGeomId = 'wall';

// Complete Bilingual Dictionary for UI
const i18n = {
  en: {
    nav_systems: "Systems",
    nav_geometry: "Geometries",
    nav_assembly: "Assembly In Motion",
    nav_services: "Services",
    nav_mfg: "KSA Manufacturing",
    nav_projects: "Projects",
    cta_rfq: "Request RFQ",
    hero_badge: "Sovereign Alliance • Saudi Master × ULMA",
    hero_title: "Local Manufacturing.<br/><span class=\"text-primary-gold\">European Engineering.</span><br/>One Construction Partner.",
    hero_subcopy: "Bespoke steel shutters, modular formwork systems, certified heavy shoring, and high-safety access scaffolding engineered for the Kingdom's most demanding gigaprojects and regional trade corridors.",
    btn_explore_systems: "Explore Systems",
    btn_talk_engineer: "Talk To Engineer",
    btn_instant_rfq: "Instant RFQ",
    badge_iktva: "Saudi Local Content",
    badge_euro: "European Certified",
    badge_dispatch: "KSA Site Dispatch",
    sec_inventory: "Technical Inventory Matrix",
    sec_engineered_systems: "Engineered Systems",
    tab_local: "Local Made (KSA)",
    tab_european: "European / ULMA",
    cat_all: "All Systems",
    cat_scaff: "Scaffolding",
    cat_form: "Formwork",
    cat_shore: "Heavy Shoring",
    cat_precast: "Precast & Moulds",
    geom_label: "Architectural Versatility",
    geom_title: "Formwork for Every Geometry",
    geom_subtitle: "Select a structural geometry to inspect the optimal engineering pairing between Saudi Master local steel and ULMA systems.",
    seq_label: "Systems in Motion",
    seq_title: "Structural Assembly Protocol",
    step_tolerance: "Plumb Deviation Tolerance",
    btn_prev: "Previous",
    btn_next: "Next Phase",
    svc_protocol: "Full Lifecycle Protocol",
    svc_from_design: "From Design to Site",
    mfg_badge: "In-Kingdom Infrastructure",
    mfg_title: "Manufactured Here. Ready for the Kingdom.",
    proj_badge: "Kingdom Gigaprojects",
    proj_title: "Proven Project Deployments",
    rfq_badge: "Engineering Consultation",
    rfq_headline: "Bring Us The Structure.<br/><span class=\"text-primary-gold\">We'll Engineer The System.</span>",
    rfq_subcopy: "Upload your structural drawings or CAD layouts for instant temporary works review, FEA stress verification, and quotation from our senior engineering team in Riyadh.",
    rfq_phone_label: "Senior Engineer Direct Line",
    rfq_whatsapp: "Chat on WhatsApp",
    form_name: "Full Name & Title *",
    form_company: "Company Name *",
    form_email: "Email *",
    form_phone: "Phone (KSA / GCC) *",
    form_system: "System Requirement",
    form_type: "Transaction Type",
    form_btn: "Dispatch Spec to Engineering Desk",
    footer_about: "Engineering sovereign heavy-civil formwork, high-load shoring towers, and certified modular scaffolding across the Kingdom of Saudi Arabia.",
    footer_hq: "Riyadh Central HQ",
    footer_addr: "Al-Malaz District, Industrial Corridor, PO Box 41293 Riyadh, KSA",
    footer_yards: "Logistics Yards",
    yard_ryd: "Riyadh Central Distribution Yard",
    yard_dam: "Dammam 2nd Industrial Yard",
    yard_jed: "Jeddah Maritime Logistics Hub",
    yard_neom: "NEOM Forward Tactical Base (Tabuk)",
    footer_rights: "© 2025 Saudi Master Company (ULMA Alliance). All rights reserved.",
    footer_motto: "Sovereign KSA Manufacturing & European Engineering.",
    what_is_it: "What It Is:",
    used_for: "Used For:",
    quote_btn: "Quote System",
    view_details: "View Details & Specs",
    sales_and_rental: "Sales & Rental",
    sales_only: "Direct Sale",
    sec_products_kicker: "OUR PRODUCTS",
    tab_all_systems: "ALL PRODUCTS",
    tab_local_mfg: "LOCAL MANUFACTURED",
    tab_euro_systems: "EUROPEAN SYSTEMS",
    sec_products_sub: "Sovereign KSA fabrication and European ULMA engineering chapters discovered in continuous motion.",
    view_product_cta: "VIEW PRODUCT →",
    explore_chapter: "EXPLORE PRODUCT",
    scroll_hint: "Scroll to explore next system",
    back_to_showcase: "← Back to Systems Showcase",
    enquire_product: "ENQUIRE ABOUT THIS PRODUCT →",
    what_is_it_title: "What It Is",
    what_used_for_title: "What It Is Used For",
    how_works_title: "How It Works",
    key_advantages_title: "Key Engineering Advantages",
    tech_specs_title: "Technical Features & Load Ratings",
    product_gallery_title: "Project & Application Gallery",
    related_products_title: "Complementary Systems",
    enquiry_box_title: "Need this system for your project?",
    enquiry_box_desc: "Speak directly with our Chief Structural Engineer in Riyadh for custom CAD drawings, FEA calculations, and project supply schedules."
  },
  ar: {
    nav_systems: "الأنظمة الهندسية",
    nav_geometry: "الأشكال الإنشائية",
    nav_assembly: "تسلسل التركيب",
    nav_services: "الخدمات",
    nav_mfg: "التصنيع بالمملكة",
    nav_projects: "المشاريع الكبرى",
    cta_rfq: "طلب تسعير فوري",
    hero_badge: "تحالف وطني استراتيجي • الماستر السعودي مع أولما",
    hero_title: "تصنيع سعودي محلي.<br/><span class=\"text-primary-gold\">هندسة أوروبية متقدمة.</span><br/>شريك إنشائي متكامل.",
    hero_subcopy: "شدات فولاذية متطورة، قوالب صب معيارية، أبراج تدعيم ثقيل للجسور، وسقالات وصول عالية الأمان مصممة خصيصاً لمشاريع المملكة الكبرى والشرق الأوسط.",
    btn_explore_systems: "استكشف الأنظمة",
    btn_talk_engineer: "استشر مهندساً",
    btn_instant_rfq: "طلب تسعير فوري",
    badge_iktva: "محتوى محلي سعودي 85%",
    badge_euro: "اعتماد أوروبي EN 12810",
    badge_dispatch: "توريد فوري خلال 24-48 ساعة",
    sec_inventory: "مصفوفة المعدات والأنظمة",
    sec_engineered_systems: "الأنظمة والحلول الهندسية",
    tab_local: "تصنيع محلي (المملكة)",
    tab_european: "أوروبي / أولما",
    cat_all: "كافة الأنظمة",
    cat_scaff: "السقالات",
    cat_form: "الشدات وقوالب الخرسانة",
    cat_shore: "أبراج التدعيم الثقيل",
    cat_precast: "الصب المسبق والقوالب الخاصة",
    geom_label: "مرونة معمارية مطلقة",
    geom_title: "شدات لجميع الأشكال الهندسية",
    geom_subtitle: "اختر الشكل الإنشائي للاطلاع على الحلول الهندسية المطابقة من أولما والتصنيع المحلي السعودي.",
    seq_label: "الأنظمة أثناء الحركة",
    seq_title: "تسلسل التركيب الميداني المعتمد",
    step_tolerance: "نسبة التفاوت المسموح للشاقولية",
    btn_prev: "السابق",
    btn_next: "المرحلة التالية",
    svc_protocol: "دورة العمل الهندسية الشاملة",
    svc_from_design: "من التصميم إلى موقع العمل",
    mfg_badge: "البنية التحتية التصنيعية بالرياض",
    mfg_title: "صُنعت هنا في المملكة. جاهزة لخدمة مشاريع الوطن.",
    proj_badge: "مشاريع المملكة العملاقة",
    proj_title: "مشاريع معتمدة على أرض الواقع",
    rfq_badge: "استشارة هندسية معتمدة",
    rfq_headline: "أحضر المخطط المعماري..<br/><span class=\"text-primary-gold\">وسنتولى الهندسة والتنفيذ.</span>",
    rfq_subcopy: "ارفع المخططات الإنشائية أو ملفات الأوتوكاد للحصول على دراسة فورية للشدات المؤقتة، وتحليل إجهادات معتمد وعرض سعر من المكتب الفني بالرياض.",
    rfq_phone_label: "الخط المباشر لكبير المهندسين",
    rfq_whatsapp: "مراسلة فورية عبر واتساب",
    form_name: "الاسم الكامل والمنصب *",
    form_company: "اسم شركة المقاولات *",
    form_email: "البريد الإلكتروني *",
    form_phone: "رقم الجوال (المملكة / الخليج) *",
    form_system: "النظام الهندسي المطلوب",
    form_type: "طبيعة التعاقد",
    form_btn: "إرسال المخططات للمكتب الفني بالرياض",
    footer_about: "هندسة وتصنيع الشدات الإنشائية الثقيلة وأبراج تدعيم الجسور والسقالات المعيارية المعتمدة في كافة أنحاء المملكة العربية السعودية.",
    footer_hq: "المقر الرئيسي بالرياض",
    footer_addr: "حي الملز، المنطقة الصناعية، ص.ب 41293 الرياض، المملكة العربية السعودية",
    footer_yards: "ساحات الإمداد والتوريد",
    yard_ryd: "ساحة الإمداد والتوزيع المركزية بالرياض",
    yard_dam: "ساحة المدينة الصناعية الثانية بالدمام",
    yard_jed: "مركز الخدمات اللوجستية البحرية بجدة",
    yard_neom: "قاعدة العمليات الميدانية بنيوم (تبوك)",
    footer_rights: "© 2025 شركة الماستر السعودي (تحالف أولما الإسبانية). جميع الحقوق محفوظة.",
    footer_motto: "تصنيع وطني سعودي وهندسة أوروبية متقدمة.",
    what_is_it: "ما هو النظام:",
    used_for: "أبرز الاستخدامات:",
    quote_btn: "طلب تسعير النظام",
    view_details: "عرض المواصفات والتفاصيل",
    sales_and_rental: "بيع وتأجير",
    sales_only: "بيع مباشر وتصنيع",
    sec_products_kicker: "أنظمتنا الهندسية",
    tab_all_systems: "كافة الأنظمة",
    tab_local_mfg: "تصنيع محلي سعودي",
    tab_euro_systems: "أنظمة أوروبية (أولما)",
    sec_products_sub: "استكشف فصول التصنيع السعودي المعتمد والهندسة الأوروبية المتطورة عبر التمرير التفاعلي المستمر.",
    view_product_cta: "استكشف النظام ←",
    explore_chapter: "تفاصيل النظام",
    scroll_hint: "مرر لاكتشاف النظام التالي",
    back_to_showcase: "→ العودة لمعرض الأنظمة",
    enquire_product: "طلب دراسة وتسعير لهذا النظام ←",
    what_is_it_title: "ماهية النظام ومواصفاته",
    what_used_for_title: "مجالات الاستخدام الإنشائي",
    how_works_title: "آلية العمل والتركيب الميداني",
    key_advantages_title: "الميزات الهندسية التنافسية",
    tech_specs_title: "المواصفات الفنية وسعة التحمل",
    product_gallery_title: "معرض الصور والتطبيقات الميدانية",
    related_products_title: "أنظمة هندسية مكملة",
    enquiry_box_title: "هل تحتاج هذا النظام لمشروعك القادم؟",
    enquiry_box_desc: "تواصل مباشرة مع كبير المهندسين بالرياض للحصول على مخططات CAD تفصيلية، وحسابات الإجهاد FEA، وتأكيد التوريد."
  }
};

// Technical CAD Blueprint SVG Generator for 100% Fail-Safe Visuals
function getBlueprintSvg(sku, category, title) {
  const catGraphics = {
    'scaffolding': `
      <line x1="80" y1="40" x2="80" y2="340" stroke="#B58A52" stroke-width="4"/>
      <line x1="250" y1="40" x2="250" y2="340" stroke="#B58A52" stroke-width="4"/>
      <line x1="420" y1="40" x2="420" y2="340" stroke="#B58A52" stroke-width="4"/>
      <line x1="80" y1="110" x2="420" y2="110" stroke="#B58A52" stroke-width="3"/>
      <line x1="80" y1="190" x2="420" y2="190" stroke="#B58A52" stroke-width="3"/>
      <line x1="80" y1="270" x2="420" y2="270" stroke="#B58A52" stroke-width="3"/>
      <line x1="80" y1="110" x2="250" y2="190" stroke="#E2882A" stroke-width="2" stroke-dasharray="4"/>
      <line x1="250" y1="190" x2="420" y2="110" stroke="#E2882A" stroke-width="2" stroke-dasharray="4"/>
      <line x1="80" y1="190" x2="250" y2="270" stroke="#E2882A" stroke-width="2" stroke-dasharray="4"/>
      <line x1="250" y1="270" x2="420" y2="190" stroke="#E2882A" stroke-width="2" stroke-dasharray="4"/>
      <circle cx="80" cy="110" r="6" fill="#B58A52"/>
      <circle cx="250" cy="110" r="6" fill="#B58A52"/>
      <circle cx="420" cy="110" r="6" fill="#B58A52"/>
      <circle cx="80" cy="190" r="6" fill="#B58A52"/>
      <circle cx="250" cy="190" r="6" fill="#B58A52"/>
      <circle cx="420" cy="190" r="6" fill="#B58A52"/>
    `,
    'formwork': `
      <rect x="90" y="70" width="320" height="230" fill="none" stroke="#B58A52" stroke-width="4" rx="4"/>
      <line x1="190" y1="70" x2="190" y2="300" stroke="#B58A52" stroke-width="2"/>
      <line x1="290" y1="70" x2="290" y2="300" stroke="#B58A52" stroke-width="2"/>
      <line x1="90" y1="150" x2="410" y2="150" stroke="#B58A52" stroke-width="2"/>
      <line x1="90" y1="220" x2="410" y2="220" stroke="#B58A52" stroke-width="2"/>
      <circle cx="140" cy="110" r="5" fill="#E2882A"/>
      <circle cx="240" cy="110" r="5" fill="#E2882A"/>
      <circle cx="340" cy="110" r="5" fill="#E2882A"/>
      <circle cx="140" cy="180" r="5" fill="#E2882A"/>
      <circle cx="240" cy="180" r="5" fill="#E2882A"/>
      <circle cx="340" cy="180" r="5" fill="#E2882A"/>
      <line x1="140" y1="180" x2="60" y2="310" stroke="#B66E3C" stroke-width="3"/>
      <line x1="340" y1="180" x2="440" y2="310" stroke="#B66E3C" stroke-width="3"/>
    `,
    'heavy-shoring': `
      <polygon points="120,320 180,80 320,80 380,320" fill="none" stroke="#B58A52" stroke-width="4"/>
      <line x1="160" y1="150" x2="340" y2="150" stroke="#B58A52" stroke-width="3"/>
      <line x1="140" y1="230" x2="360" y2="230" stroke="#B58A52" stroke-width="3"/>
      <line x1="180" y1="80" x2="360" y2="230" stroke="#E2882A" stroke-width="2"/>
      <line x1="320" y1="80" x2="140" y2="230" stroke="#E2882A" stroke-width="2"/>
      <line x1="100" y1="320" x2="400" y2="320" stroke="#B66E3C" stroke-width="5"/>
      <line x1="150" y1="80" x2="350" y2="80" stroke="#B66E3C" stroke-width="5"/>
    `,
    'precast-custom': `
      <rect x="110" y="90" width="280" height="170" fill="none" stroke="#B58A52" stroke-width="4"/>
      <polygon points="110,90 170,50 450,50 390,90" fill="none" stroke="#B58A52" stroke-width="2.5"/>
      <polygon points="390,90 450,50 450,220 390,260" fill="none" stroke="#B58A52" stroke-width="2.5"/>
      <line x1="180" y1="90" x2="180" y2="260" stroke="#B58A52" stroke-width="1.5" stroke-dasharray="3"/>
      <line x1="250" y1="90" x2="250" y2="260" stroke="#B58A52" stroke-width="1.5" stroke-dasharray="3"/>
      <line x1="320" y1="90" x2="320" y2="260" stroke="#B58A52" stroke-width="1.5" stroke-dasharray="3"/>
    `
  };

  const graphic = catGraphics[category] || catGraphics['formwork'];
  const safeSku = sku || 'SM-SPEC';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="350" viewBox="0 0 500 350">
    <rect width="500" height="350" fill="#1C2024"/>
    <defs>
      <pattern id="grid_${safeSku.replace(/[^a-zA-Z0-9]/g, '_')}" width="25" height="25" patternUnits="userSpaceOnUse">
        <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#283038" stroke-width="0.8"/>
      </pattern>
    </defs>
    <rect width="500" height="350" fill="url(#grid_${safeSku.replace(/[^a-zA-Z0-9]/g, '_')})"/>
    <rect x="15" y="15" width="470" height="320" fill="none" stroke="#B58A52" stroke-width="1" stroke-opacity="0.3"/>
    ${graphic}
    <rect x="25" y="25" width="90" height="22" rx="3" fill="#B58A52" fill-opacity="0.25" stroke="#B58A52" stroke-width="1"/>
    <text x="70" y="40" font-family="monospace" font-size="10" font-weight="bold" fill="#B58A52" text-anchor="middle">${safeSku}</text>
    <text x="465" y="40" font-family="monospace" font-size="9" fill="#9BA3AF" text-anchor="end">SASO / EN 12810 VERIFIED</text>
    <line x1="80" y1="325" x2="420" y2="325" stroke="#B58A52" stroke-width="1"/>
    <line x1="80" y1="320" x2="80" y2="330" stroke="#B58A52" stroke-width="1"/>
    <line x1="420" y1="320" x2="420" y2="330" stroke="#B58A52" stroke-width="1"/>
    <text x="250" y="320" font-family="monospace" font-size="9" fill="#B58A52" text-anchor="middle">CAD TECHNICAL SCHEMATIC</text>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function handleImageFallback(img, sku, category, title) {
  img.onerror = null;
  img.src = getBlueprintSvg(sku, category, title);
  img.style.display = 'block';
  img.classList.remove('opacity-0');
  img.classList.add('opacity-100');
}

let geometries = (typeof window !== 'undefined' && window.DB_SNAPSHOT && Array.isArray(window.DB_SNAPSHOT.geometries) && window.DB_SNAPSHOT.geometries.length > 0)
  ? window.DB_SNAPSHOT.geometries
  : [
  {
    id: 'wall',
    name_en: 'Wall & Shear',
    name_ar: 'جدران وقص',
    code: 'ULMA ORMA + SM Walers',
    title_en: 'Monolithic Retaining & Shear Walls',
    title_ar: 'حوائط القص والجدران الاستنادية المصمتة',
    desc_en: 'Engineered for swift cycle repetitions. Integrates ULMA modular wall panels with locally fabricated high-load alignment struts to hold lateral pressure up to 80 kN/m².',
    desc_ar: 'مصممة لدورات صب سريعة ومتكررة. تدمج ألواح أورما المعيارية مع دعامات تقوية محلية تتحمل ضغط خرسانة حتى 80 كيلو نيوتن/م².',
    image: 'images/geometries/geometry-wall.jpg',
    type_tag: 'Vertical Formwork',
    p1_label_en: 'Pressure Capacity',
    p1_label_ar: 'تحمل ضغط الخرسانة',
    p1_val: '80 kN/m²',
    p2_label_en: 'Striking Speed',
    p2_label_ar: 'سرعة الفك والتدوير',
    p2_val: '0.25 hr/m²'
  },
  {
    id: 'column',
    name_en: 'Column',
    name_ar: 'أعمدة صقيلة',
    code: 'SM Rolled Shells + ULMA LGR',
    title_en: 'Circular & Rectangular High-Speed Columns',
    title_ar: 'الأعمدة الدائرية والمستطيلة فائقة النعومة',
    desc_en: 'Custom-rolled high-tensile steel half-cylinders and universal clamp assemblies for fair-faced columns up to 100 kN/m² pour speeds.',
    desc_ar: 'أنصاف قوالب فولاذية مدرفلة مخصصة لصب الأعمدة الصقيلة Class A بسرعة صب هيدروستاتيكي تصل إلى 100 كيلو نيوتن/م² بدون عيوب.',
    image: 'images/geometries/geometry-column.jpg',
    type_tag: 'Column & Pier',
    p1_label_en: 'Pour Pressure',
    p1_label_ar: 'ضغط الصب الأقصى',
    p1_val: '100 kN/m²',
    p2_label_en: 'Diameter Range',
    p2_label_ar: 'أقطار متوفرة',
    p2_val: 'Ø300 – Ø2000mm'
  },
  {
    id: 'circular',
    name_en: 'Circular & Tanks',
    name_ar: 'خزانات وصوامع',
    code: 'ULMA BIRAMAX + SM Radius Walers',
    title_en: 'Curved Containment & Silo Structures',
    title_ar: 'المنشآت المنحنية وخزانات المياه والصوامع',
    desc_en: 'Continuously adjustable radius wall formwork engineered for wastewater treatment digesters and cylindrical water storage tanks.',
    desc_ar: 'شدات حوائط بنصف قطر قابل للتعديل المستمر مصممة لخزانات معالجة المياه وصوامع الحبوب والغاز الطبيعي المسال.',
    image: 'images/geometries/geometry-circular.jpg',
    type_tag: 'Curved Geometry',
    p1_label_en: 'Concrete Proof',
    p1_label_ar: 'مقاومة الضغط',
    p1_val: '60 kN/m²',
    p2_label_en: 'Min Radius',
    p2_label_ar: 'أقل نصف قطر',
    p2_val: 'Radius ≥ 2.5m'
  },
  {
    id: 'slab',
    name_en: 'Slab & Deck',
    name_ar: 'أسقف وبلاطات',
    code: 'ULMA CC-4 Drop-Head + SM Props',
    title_en: 'Rapid Post-Tensioned & Flat Slabs',
    title_ar: 'الأسقف المستوية والبلاطات مسبقة الإجهاد',
    desc_en: 'Aluminum drop-head modular decking enabling 3-day striking cycles while leaving shoring props untouched, reducing inventory on-site by 40%.',
    desc_ar: 'نظام أسقف ألومنيوم برؤوس إسقاط سريعة يتيح فك الألواح بعد 3 أيام مع إبقاء الركائز داعمة، مما يخفض تكلفة المعدات بنسبة 40%.',
    image: 'images/geometries/geometry-slab.jpg',
    type_tag: 'Horizontal Decking',
    p1_label_en: 'Slab Thickness',
    p1_label_ar: 'سماكة البلاطة',
    p1_val: 'Up to 90cm',
    p2_label_en: 'Striking Cycle',
    p2_label_ar: 'دورة فك الشدة',
    p2_val: '72 Hours'
  },
  {
    id: 'high-rise',
    name_en: 'High-Rise Core',
    name_ar: 'أبراج شاهقة',
    code: 'ULMA ATR Hydraulic Self-Climbing',
    title_en: 'Wind-Shielded High-Rise Cores',
    title_ar: 'قلوب الأبراج وأنظمة التسلق الهيدروليكي الآلي',
    desc_en: 'Crane-free self-climbing hydraulic system carrying multi-tiered placing booms, formwork panels, and weather shields up skyscraper towers.',
    desc_ar: 'منظومة تسلق ذاتية بدون رافعة برجية ترفع شدات الحوائط ومضخات الخرسانة وشاشات حماية الرياح لأطول ناطحات السحاب.',
    image: 'images/geometries/geometry-high-rise.jpg',
    type_tag: 'Climbing Systems',
    p1_label_en: 'Lifting Cylinder',
    p1_label_ar: 'قدرة المكبس',
    p1_val: '100 kN Force',
    p2_label_en: 'Wind Safety',
    p2_label_ar: 'مقاومة الرياح',
    p2_val: '72 km/h Safe'
  },
  {
    id: 'bridge',
    name_en: 'Bridge & Viaduct',
    name_ar: 'جسور وأنفاق',
    code: 'ULMA MK Carriage & Heavy Shoring',
    title_en: 'Cantilever & Launching Bridge Systems',
    title_ar: 'عربات صب الجسور وأبراج التدعيم الجبارة',
    desc_en: 'Specialized modular trusses for balanced cantilever bridges, composite decks, and high-clearance overpass flyovers.',
    desc_ar: 'جمالونات فولاذية متطورة للجسور المعلقة والأنفاق تتيح فتح مسارات مرورية عريضة أسفل منطقة العمل دون إغلاق الطرق.',
    image: 'images/geometries/geometry-bridge.jpg',
    type_tag: 'Heavy Civil Works',
    p1_label_en: 'Leg Capacity',
    p1_label_ar: 'تحمل القائم',
    p1_val: '500 kN / Leg',
    p2_label_en: 'Clear Span',
    p2_label_ar: 'البحور المفتوحة',
    p2_val: 'Up to 24m'
  }
];

async function loadAdminOverrides() {
  if (!window.DB_SNAPSHOT) return;

  // 0. Sanitize and purge corrupted / empty localStorage entries
  const storageKeys = ['sm_products_override', 'sm_geometries_override', 'sm_projects_override', 'sm_processes_override', 'sm_assembly_override'];
  storageKeys.forEach(key => {
    try {
      const val = localStorage.getItem(key);
      if (val) {
        const parsed = JSON.parse(val);
        if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0] || typeof parsed[0] !== 'object') {
          localStorage.removeItem(key);
        }
      }
    } catch(e) {
      localStorage.removeItem(key);
    }
  });

  // Clear legacy invalid hero video override if present
  if (localStorage.getItem('sm_hero_override')) {
    try {
      const h = JSON.parse(localStorage.getItem('sm_hero_override'));
      if (h.video_url && (h.video_url.includes('ForBiggerBlazes') || h.video_url.includes('commondatastorage'))) {
        localStorage.removeItem('sm_hero_override');
      }
    } catch(e) {}
  }

  // 1. Live SQLite DB fetch if API server is reachable
  try {
    const res = await fetch('/api/public/products');
    if (res.ok) {
      const json = await res.json();
      const live = Array.isArray(json) ? json : (json && Array.isArray(json.data) ? json.data : null);
      if (live && live.length > 0 && live[0].slug && live[0].name_en) {
        window.DB_SNAPSHOT.products = live;
        renderProducts();
      }
    }
  } catch(e) {
    // Offline / static snapshot fallback
  }

  // 2. Products Override (only if valid non-empty array with required fields)
  if (localStorage.getItem('sm_products_override')) {
    try {
      const p = JSON.parse(localStorage.getItem('sm_products_override'));
      if (Array.isArray(p) && p.length > 0 && p[0].sku && (p[0].name_en || p[0].slug)) {
        window.DB_SNAPSHOT.products = p;
        renderProducts();
      } else {
        localStorage.removeItem('sm_products_override');
      }
    } catch(e) {
      localStorage.removeItem('sm_products_override');
    }
  }

  // 3. Geometries Override
  if (localStorage.getItem('sm_geometries_override')) {
    try {
      const g = JSON.parse(localStorage.getItem('sm_geometries_override'));
      if (Array.isArray(g) && g.length > 0 && g[0].id && g[0].name_en) {
        geometries = g;
        renderGeometry();
      } else {
        localStorage.removeItem('sm_geometries_override');
      }
    } catch(e) {
      localStorage.removeItem('sm_geometries_override');
    }
  }

  // 4. Projects Override
  if (localStorage.getItem('sm_projects_override')) {
    try {
      const prjs = JSON.parse(localStorage.getItem('sm_projects_override'));
      if (Array.isArray(prjs) && prjs.length > 0 && prjs[0].id && prjs[0].name_en) {
        window.DB_SNAPSHOT.projects = prjs;
        renderProjects();
      } else {
        localStorage.removeItem('sm_projects_override');
      }
    } catch(e) {
      localStorage.removeItem('sm_projects_override');
    }
  }

  // 5. Processes Override
  if (localStorage.getItem('sm_processes_override')) {
    try {
      const procs = JSON.parse(localStorage.getItem('sm_processes_override'));
      if (Array.isArray(procs) && procs.length > 0 && procs[0].id && procs[0].name_en) {
        window.DB_SNAPSHOT.processes = procs;
        renderManufacturing();
      } else {
        localStorage.removeItem('sm_processes_override');
      }
    } catch(e) {
      localStorage.removeItem('sm_processes_override');
    }
  }

  // 6. Site Settings Override
  if (localStorage.getItem('sm_site_override')) {
    try {
      const s = JSON.parse(localStorage.getItem('sm_site_override'));
      if (s && typeof s === 'object') {
        window.DB_SNAPSHOT.site = Object.assign({}, window.DB_SNAPSHOT.site, s);
        if (s.phone) {
          document.querySelectorAll('a[href^="tel:"]').forEach(a => a.href = `tel:${s.phone}`);
        }
      }
    } catch(e) {}
  }

  // 7. Hero Configuration Override
  if (localStorage.getItem('sm_hero_override')) {
    try {
      const h = JSON.parse(localStorage.getItem('sm_hero_override'));
      if (h && typeof h === 'object') {
        if (h.video_url && document.getElementById('heroVideoSource')) {
          const srcEl = document.getElementById('heroVideoSource');
          srcEl.src = h.video_url;
          const v = document.getElementById('heroVideo');
          if (v) v.load();
        }
        if (h.poster_url && document.getElementById('heroPosterBg')) {
          document.getElementById('heroPosterBg').style.backgroundImage = `url('${h.poster_url}')`;
        }
        if (h.title_en) i18n.en.hero_title = h.title_en;
        if (h.title_ar) i18n.ar.hero_title = h.title_ar;
        if (h.subcopy_en) i18n.en.hero_subcopy = h.subcopy_en;
        if (h.subcopy_ar) i18n.ar.hero_subcopy = h.subcopy_ar;
      }
    } catch(e) {}
  }

  // 8. Sections Visibility Override (Core showcase, geometry, and assembly are ALWAYS guaranteed visible)
  const coreProtectedSections = ['systems-matrix', 'geometry-section', 'assembly-section', 'services-section', 'manufacturing-section', 'projects-section', 'hero-section'];
  coreProtectedSections.forEach(secId => {
    const el = document.getElementById(secId);
    if (el) el.style.display = '';
  });

  if (localStorage.getItem('sm_sections_override')) {
    try {
      const secList = JSON.parse(localStorage.getItem('sm_sections_override'));
      if (Array.isArray(secList)) {
        secList.forEach(s => {
          if (!s || !s.id) return;
          const el = document.getElementById(s.id);
          if (el) {
            if (coreProtectedSections.includes(s.id)) {
              el.style.display = '';
            } else {
              el.style.display = (s.visible === false) ? 'none' : '';
            }
          }
        });
      }
    } catch(e) {}
  }
}

function initApp() {
  refreshAllComponents();
  loadAdminOverrides();
  initPerformanceObservers();
  checkRouteOnLoad();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initPerformanceObservers() {
  // Video Intersection Observer: pause video when scrolled past to free 100% CPU/GPU resources
  const heroSec = document.getElementById('hero-section');
  const video = document.getElementById('heroVideo');
  if (heroSec && video && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (video.paused) video.play().catch(() => {});
        } else {
          if (!video.paused) video.pause();
        }
      });
    }, { threshold: 0.1 });
    videoObserver.observe(heroSec);
  }

  // Scroll listeners for sticky horizontal scroll runways (Geometry & Assembly)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleHorizontalRunways();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function handleHorizontalRunways() {
  // 1. Geometry Runway Scroll Sync
  const geomRunway = document.getElementById('geometryScrollRunway');
  if (geomRunway) {
    const rect = geomRunway.getBoundingClientRect();
    const runwayHeight = geomRunway.offsetHeight;
    const windowH = window.innerHeight;
    const scrollableDistance = runwayHeight - windowH;

    if (scrollableDistance > 0) {
      // Calculate how far into the runway we have scrolled
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      const geomList = (Array.isArray(geometries) && geometries.length > 0) ? geometries : (window.DB_SNAPSHOT ? window.DB_SNAPSHOT.geometries : []);
      const count = geomList ? geomList.length : 6;
      const targetIndex = Math.min(count - 1, Math.floor(progress * count));
      if (targetIndex !== activeGeomIndex && rect.top <= 100 && rect.bottom >= windowH) {
        updateGeometrySlide(targetIndex, false);
      }
    }
  }

  // 2. Assembly Runway Scroll Sync
  const asmRunway = document.getElementById('assemblyScrollRunway');
  const db = window.DB_SNAPSHOT;
  if (asmRunway && db && Array.isArray(db.assembly) && db.assembly.length > 0) {
    const rect = asmRunway.getBoundingClientRect();
    const runwayHeight = asmRunway.offsetHeight;
    const windowH = window.innerHeight;
    const scrollableDistance = runwayHeight - windowH;

    if (scrollableDistance > 0) {
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      const count = db.assembly.length;
      const targetIndex = Math.min(count - 1, Math.floor(progress * count));
      if (targetIndex !== currentAssemblyStepIndex && rect.top <= 100 && rect.bottom >= windowH) {
        updateAssemblySlide(targetIndex);
      }
    }
  }
}

function toggleLanguage() {
  currentLang = (currentLang === 'en') ? 'ar' : 'en';
  document.documentElement.setAttribute('lang', currentLang);
  document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  document.getElementById('langLabel').innerText = (currentLang === 'en') ? 'عربي' : 'EN';
  refreshAllComponents();
  const detail = document.getElementById('productDetailView');
  if (detail && !detail.classList.contains('hidden') && window.currentDetailPageProduct) {
    renderProductDetailPage(window.currentDetailPageProduct);
  }
}

function refreshAllComponents() {
  const dict = i18n[currentLang] || i18n.en;
  const isAr = (currentLang === 'ar');

  // 1. Static text elements
  try {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });
  } catch(e) { console.warn('i18n error:', e); }

  // 2. Dynamic Hero Text
  try {
    const hl = document.getElementById('heroHeadline');
    if (hl) hl.innerHTML = dict.hero_title;
    const sc = document.getElementById('heroSubcopy');
    if (sc) sc.innerText = dict.hero_subcopy;
    const tl = document.getElementById('headerTagline');
    if (tl) tl.innerText = isAr
      ? 'تحالف وطني رائد لتصنيع وهندسة الشدات والسقالات'
      : 'Sovereign Formwork & Scaffolding Alliance';
  } catch(e) { console.warn('Hero text error:', e); }

  // 3. Render Modules with isolated error boundaries
  try { renderProducts(); } catch(e) { console.error('renderProducts error:', e); }
  try { renderGeometry(); } catch(e) { console.error('renderGeometry error:', e); }
  try { renderAssemblyStep(); } catch(e) { console.error('renderAssemblyStep error:', e); }
  try { renderServices(); } catch(e) { console.error('renderServices error:', e); }
  try { renderManufacturing(); } catch(e) { console.error('renderManufacturing error:', e); }
  try { renderProjects(); } catch(e) { console.error('renderProjects error:', e); }
}

let showcaseObserver = null;
let currentShowcaseProducts = [];
let activeShowcaseIndex = 0;
window.currentDetailPageProduct = null;

function switchClassification(code) {
  activeClassification = code;
  const filterCodes = ['ALL', 'LOCAL', 'EUROPEAN'];
  filterCodes.forEach(f => {
    const btn = document.getElementById('filter-' + f);
    if (!btn) return;
    if (f === code) {
      btn.className = 'editorial-filter pb-1.5 border-b-2 border-primary-gold text-charcoal font-bold transition-all cursor-pointer';
    } else {
      btn.className = 'editorial-filter pb-1.5 border-b-2 border-transparent text-muted-brown hover:text-charcoal transition-all cursor-pointer';
    }
  });
  renderProducts();
}

function filterByCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(pill => {
    if (pill.getAttribute('data-cat') === cat) {
      pill.className = 'cat-pill px-3.5 py-1.5 rounded-full bg-charcoal text-content-offwhite font-display text-xs font-semibold uppercase tracking-wider shadow-xs';
    } else {
      pill.className = 'cat-pill px-3.5 py-1.5 rounded-full bg-card-surface text-charcoal border border-divider-color font-display text-xs font-semibold uppercase tracking-wider hover:bg-soft-sand';
    }
  });
  renderProducts();
}

function scrollProductsTrack(direction) {}
function updateScrollProgress() {}

function renderProducts() {
  const container = document.getElementById('productShowcaseStage');
  if (!container || !window.DB_SNAPSHOT) return;

  const db = window.DB_SNAPSHOT;
  const isAr = (currentLang === 'ar');
  const dict = i18n[currentLang];

  let list = db.products || [];
  if (activeClassification === 'LOCAL') {
    list = list.filter(p => p.class_code === 'LOCAL');
  } else if (activeClassification === 'EUROPEAN') {
    list = list.filter(p => p.class_code === 'EUROPEAN');
  }
  if (activeCategory !== 'all') {
    const catFiltered = list.filter(p => p.cat_slug === activeCategory);
    if (catFiltered.length > 0) list = catFiltered;
  }
  if (list.length === 0 && db.products && db.products.length > 0) {
    list = db.products;
  }
  currentShowcaseProducts = list;
  activeShowcaseIndex = 0;

  const total = list.length;
  const first = list[0] || {};
  const firstIsLocal = first.class_code === 'LOCAL';
  const firstTagBg = firstIsLocal ? 'bg-primary-gold text-white' : 'bg-ulma-orange text-white';
  const firstOrigin = firstIsLocal ? (isAr ? 'تصنيع محلي بالرياض' : 'KSA Riyadh Yard') : (isAr ? 'هندسة أولما الأوروبية' : 'ULMA Europe');
  const firstClassLabel = firstIsLocal ? (isAr ? 'تصنيع محلي' : 'LOCAL MANUFACTURED') : (isAr ? 'أنظمة أوروبية' : 'EUROPEAN SYSTEMS');
  const firstAdvantages = isAr 
    ? (Array.isArray(first.key_advantages_ar) ? first.key_advantages_ar : [])
    : (Array.isArray(first.key_advantages_en) ? first.key_advantages_en : []);

  container.innerHTML = `
    <!-- SCROLL-DRIVEN SHOWCASE ENGINE -->
    <div class="w-full relative">
      
      <!-- Desktop Two-Column Immersive Sticky Presentation (Hidden on mobile < lg) -->
      <div class="hidden lg:flex items-start gap-10 xl:gap-14 relative">
        
        <!-- Left Sticky Narrative Column (stays pinned while chapters scroll naturally) -->
        <div class="w-[40%] xl:w-[38%] shrink-0 sticky top-28 h-[calc(100vh-8.5rem)] flex flex-col justify-between py-4 pr-6 rtl:pr-0 rtl:pl-6 border-r rtl:border-r-0 rtl:border-l border-divider-color/60">
          
          <!-- Top Counter & Understated Progress Indicator -->
          <div class="flex items-center justify-between pb-4 border-b border-divider-color">
            <div class="flex items-center gap-3">
              <span id="showcaseCounter" class="font-mono text-base font-bold text-primary-gold tracking-widest">
                01 / ${String(total).padStart(2, '0')}
              </span>
              <span class="text-xs uppercase font-display tracking-widest text-muted-brown">
                ${dict.showcase_kicker || (isAr ? 'فصل النظام الإنشائي' : 'SYSTEM CHAPTER')}
              </span>
            </div>
            <!-- Progress Line Indicator -->
            <div class="w-28 h-1 bg-divider-color/70 rounded-full overflow-hidden">
              <div id="showcaseProgressBar" class="h-full bg-primary-gold transition-all duration-300 ease-out" style="width: ${Math.round((1 / total) * 100)}%;"></div>
            </div>
          </div>

          <!-- Active Narrative Card (Updated via IntersectionObserver with smooth transition) -->
          <div id="activeNarrativeCard" class="my-auto flex flex-col gap-4 transition-all duration-300">
            <!-- Classification, SKU & Origin -->
            <div class="flex items-center gap-2 flex-wrap">
              <span id="activeClassBadge" class="px-2.5 py-1 rounded text-[11px] font-display font-bold uppercase tracking-wider ${firstTagBg} shadow-xs">
                ${firstClassLabel}
              </span>
              <span id="activeSkuBadge" class="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-desert-ivory text-charcoal border border-divider-color">
                ${first.sku || ''}
              </span>
              <span id="activeOriginLabel" class="text-xs font-display text-muted-brown font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-gold"></span>
                <span>${firstOrigin}</span>
              </span>
            </div>

            <!-- System Title -->
            <h3 id="activeTitle" class="text-2xl xl:text-3xl font-display font-bold text-charcoal uppercase leading-tight tracking-tight hover:text-primary-gold transition-colors cursor-pointer" onclick="navigateToProduct('${first.slug}')">
              ${isAr ? first.name_ar : first.name_en}
            </h3>

            <!-- Tagline / Subtitle -->
            <p id="activeTagline" class="text-xs font-display text-secondary-earth font-bold uppercase tracking-wider">
              ${isAr ? (first.tagline_ar || '') : (first.tagline_en || '')}
            </p>

            <!-- Short Summary -->
            <p id="activeSummary" class="text-xs sm:text-sm text-muted-brown font-body leading-relaxed line-clamp-3">
              ${isAr ? first.short_summary_ar : first.short_summary_en}
            </p>

            <!-- Key Engineering Attributes -->
            <div class="pt-2 border-t border-divider-color/60">
              <span class="text-[10px] font-display font-bold uppercase tracking-widest text-secondary-earth block mb-2">
                ${dict.tech_highlights || (isAr ? 'أبرز المواصفات الهندسية' : 'KEY ENGINEERING ATTRIBUTES')}
              </span>
              <ul id="activeHighlights" class="space-y-1.5">
                ${firstAdvantages.slice(0, 3).map(adv => `
                  <li class="flex items-start gap-2 text-xs text-charcoal">
                    <span class="material-symbols-outlined text-sm text-primary-gold shrink-0 mt-0.5">verified</span>
                    <span class="leading-tight font-medium">${adv}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Prominent View Product CTA Button -->
            <div class="pt-3">
              <a id="activeViewBtn" href="/products/${first.slug}" onclick="handleProductCtaClick(event, '${first.slug}')" class="inline-flex items-center gap-2.5 px-6 py-3.5 bg-charcoal hover:bg-primary-gold text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md group">
                <span>${dict.view_product_specs || (isAr ? 'عرض المواصفات الفنية الكاملة' : 'VIEW PRODUCT SPECIFICATION')}</span>
                <span class="material-symbols-outlined text-sm group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 transition-transform">arrow_forward</span>
              </a>
            </div>
          </div>

          <!-- Bottom Natural Scroll Guidance Hint -->
          <div class="flex items-center gap-2 text-[11px] font-display text-muted-brown uppercase tracking-wider pt-3 border-t border-divider-color">
            <span class="material-symbols-outlined text-sm animate-bounce text-primary-gold">south</span>
            <span>${dict.scroll_to_discover || (isAr ? 'مرر للأسفل لاكتشاف بقية الأنظمة' : 'SCROLL TO DISCOVER SYSTEMS')}</span>
          </div>

        </div>

        <!-- Right Continuous Scroll Chapters (60% width, natural browser scrolling) -->
        <div class="w-[60%] xl:w-[62%] flex flex-col gap-12" id="desktopShowcaseChapters">
          ${list.map((p, idx) => {
            const isLocal = p.class_code === 'LOCAL';
            const tagBg = isLocal ? 'bg-primary-gold text-white' : 'bg-ulma-orange text-white';
            const name = isAr ? p.name_ar : p.name_en;
            const terms = (p.sales_available && p.rental_available) ? dict.sales_and_rental : dict.sales_only;
            const origin = isLocal ? (isAr ? 'تصنيع محلي بالرياض' : 'KSA Riyadh Yard') : (isAr ? 'هندسة أولما الأوروبية' : 'ULMA Europe');
            const imgSrc = p.main_image || p.hero_image;
            const padIndex = String(idx + 1).padStart(2, '0');

            return `
              <!-- Product Chapter ${padIndex} -->
              <div 
                class="desktop-scroll-chapter min-h-[85vh] flex flex-col justify-center py-6"
                data-product-index="${idx}"
                data-product-slug="${p.slug}"
              >
                <!-- Large Visual Photographic Card (~60-70% visual area) -->
                <div 
                  onclick="navigateToProduct('${p.slug}')"
                  class="relative h-[68vh] xl:h-[72vh] rounded-2xl overflow-hidden bg-charcoal border border-divider-color shadow-2xl group cursor-pointer"
                >
                  <img 
                    src="${imgSrc}" 
                    alt="${name}" 
                    class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                    onerror="handleImageFallback(this, '${p.sku}', '${p.cat_slug}', '${name.replace(/'/g, "\\'")}')"
                    loading="lazy" decoding="async"
                  />
                  <!-- Cinematic Dark Vignette Overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/30 to-black/35 pointer-events-none"></div>

                  <!-- Technical HUD Crosshairs -->
                  <div class="absolute top-3 left-3 text-xs font-mono text-primary-gold/70 pointer-events-none z-10 leading-none">┌</div>
                  <div class="absolute top-3 right-3 text-xs font-mono text-primary-gold/70 pointer-events-none z-10 leading-none">┐</div>
                  <div class="absolute bottom-3 left-3 text-xs font-mono text-primary-gold/70 pointer-events-none z-10 leading-none">└</div>
                  <div class="absolute bottom-3 right-3 text-xs font-mono text-primary-gold/70 pointer-events-none z-10 leading-none">┘</div>

                  <!-- Top Status Ribbon -->
                  <div class="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
                    <span class="px-3 py-1 rounded-md text-xs font-mono font-bold text-white bg-black/60 backdrop-blur-md border border-white/15">
                      ${padIndex} / ${String(total).padStart(2, '0')}
                    </span>
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-1 rounded-md text-[11px] font-display font-bold uppercase tracking-wider ${tagBg} shadow-xs">
                        ${p.sku}
                      </span>
                      <span class="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-display uppercase tracking-wider font-semibold border border-white/15">
                        ${terms}
                      </span>
                    </div>
                  </div>

                  <!-- Bottom Telemetry HUD Ribbon & Direct Action Trigger -->
                  <div class="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none z-10 gap-4">
                    <div>
                      <div class="flex items-center gap-2 text-[11px] font-display text-primary-gold uppercase tracking-wider font-bold drop-shadow-xs mb-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-primary-gold animate-pulse"></span>
                        <span>${origin}</span>
                        <span class="text-white/40">•</span>
                        <span class="text-white/80 font-mono">SASO / EN 12810</span>
                      </div>
                      <h4 class="text-xl sm:text-2xl font-display font-bold text-white uppercase drop-shadow-md">
                        ${name}
                      </h4>
                    </div>

                    <!-- Interactive Pill -->
                    <div class="pointer-events-auto shrink-0">
                      <button 
                        onclick="event.stopPropagation(); navigateToProduct('${p.slug}')"
                        class="px-4 py-2.5 bg-white/15 hover:bg-primary-gold text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 shadow-lg group-hover:bg-primary-gold"
                      >
                        <span>${dict.inspect_system || (isAr ? 'معاينة النظام' : 'Inspect System')}</span>
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>

      <!-- Mobile Natural Touch Scrolling Chapter Cards (Hidden on Desktop >= lg) -->
      <div class="flex flex-col gap-8 lg:hidden" id="mobileShowcaseChapters">
        ${list.map((p, idx) => {
          const isLocal = p.class_code === 'LOCAL';
          const tagBg = isLocal ? 'bg-primary-gold text-white' : 'bg-ulma-orange text-white';
          const name = isAr ? p.name_ar : p.name_en;
          const summary = isAr ? p.short_summary_ar : p.short_summary_en;
          const terms = (p.sales_available && p.rental_available) ? dict.sales_and_rental : dict.sales_only;
          const origin = isLocal ? (isAr ? 'تصنيع محلي بالرياض' : 'KSA Riyadh Yard') : (isAr ? 'هندسة أولما الأوروبية' : 'ULMA Europe');
          const classLabel = isLocal ? (isAr ? 'تصنيع محلي' : 'LOCAL MANUFACTURED') : (isAr ? 'أنظمة أوروبية' : 'EUROPEAN SYSTEMS');
          const imgSrc = p.main_image || p.hero_image;
          const padIndex = String(idx + 1).padStart(2, '0');
          const advantages = isAr 
            ? (Array.isArray(p.key_advantages_ar) ? p.key_advantages_ar : []) 
            : (Array.isArray(p.key_advantages_en) ? p.key_advantages_en : []);

          return `
            <article class="bg-card-surface border border-divider-color rounded-2xl overflow-hidden shadow-md flex flex-col">
              <!-- Top Chapter Header -->
              <div class="px-5 py-3.5 bg-desert-ivory/60 border-b border-divider-color flex items-center justify-between">
                <span class="font-mono text-xs font-bold text-primary-gold tracking-widest">
                  ${padIndex} / ${String(total).padStart(2, '0')}
                </span>
                <span class="px-2.5 py-0.5 rounded text-[10px] font-display font-bold uppercase tracking-wider ${tagBg}">
                  ${classLabel}
                </span>
              </div>

              <!-- Large Visual Photograph -->
              <div 
                onclick="navigateToProduct('${p.slug}')"
                class="relative h-64 sm:h-72 w-full overflow-hidden bg-charcoal cursor-pointer group"
              >
                <img 
                  src="${imgSrc}" 
                  alt="${name}" 
                  class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onerror="handleImageFallback(this, '${p.sku}', '${p.cat_slug}', '${name.replace(/'/g, "\\'")}')"
                  loading="lazy" decoding="async"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-black/30 pointer-events-none"></div>

                <!-- Top Ribbon -->
                <div class="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  <span class="px-2 py-0.5 rounded bg-black/65 backdrop-blur-xs text-white text-[10px] font-mono border border-white/15">
                    ${p.sku}
                  </span>
                  <span class="px-2 py-0.5 rounded bg-black/65 backdrop-blur-xs text-white text-[10px] font-display uppercase tracking-wider border border-white/15">
                    ${terms}
                  </span>
                </div>

                <!-- Bottom Telemetry -->
                <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
                  <span class="text-[11px] font-display font-bold uppercase text-primary-gold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary-gold"></span>
                    <span>${origin}</span>
                  </span>
                  <span class="text-[10px] font-display bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded text-white font-medium">
                    ${dict.inspect_system || (isAr ? 'معاينة' : 'Inspect')}
                  </span>
                </div>
              </div>

              <!-- Chapter Content -->
              <div class="p-5 flex flex-col gap-3.5">
                <div>
                  <h3 
                    onclick="navigateToProduct('${p.slug}')"
                    class="text-lg font-display font-bold text-charcoal uppercase leading-snug hover:text-primary-gold transition-colors cursor-pointer"
                  >
                    ${name}
                  </h3>
                  <p class="text-xs text-muted-brown font-body leading-relaxed mt-1 line-clamp-2">
                    ${summary}
                  </p>
                </div>

                <!-- Mini Advantages -->
                <ul class="space-y-1 text-xs text-charcoal">
                  ${advantages.slice(0, 2).map(adv => `
                    <li class="flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-sm text-primary-gold shrink-0">verified</span>
                      <span class="line-clamp-1">${adv}</span>
                    </li>
                  `).join('')}
                </ul>

                <!-- Action Button -->
                <div class="pt-2 border-t border-divider-color flex items-center gap-2">
                  <a 
                    href="/products/${p.slug}"
                    onclick="handleProductCtaClick(event, '${p.slug}')"
                    class="flex-1 py-2.5 px-4 bg-charcoal text-white rounded-lg font-display text-xs font-bold uppercase tracking-wider hover:bg-primary-gold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>${dict.view_details || (isAr ? 'تفاصيل النظام' : 'View Specifications')}</span>
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                  <button 
                    onclick="prefillRfq('${name.replace(/'/g, "\\'")}')"
                    class="py-2.5 px-3 bg-desert-ivory text-charcoal border border-divider-color rounded-lg font-display text-xs font-bold uppercase hover:bg-soft-sand transition-colors shrink-0"
                    title="${dict.quote_btn}"
                  >
                    <span class="material-symbols-outlined text-sm text-primary-gold">request_quote</span>
                  </button>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>

    </div>
  `;

  initShowcaseScrollObserver();
}

function initShowcaseScrollObserver() {
  if (showcaseObserver) {
    showcaseObserver.disconnect();
    showcaseObserver = null;
  }

  const chapters = document.querySelectorAll('.desktop-scroll-chapter');
  if (chapters.length === 0 || !('IntersectionObserver' in window)) return;

  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -25% 0px',
    threshold: [0.2, 0.4, 0.6]
  };

  showcaseObserver = new IntersectionObserver((entries) => {
    let topEntry = null;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!topEntry || entry.intersectionRatio > topEntry.intersectionRatio) {
          topEntry = entry;
        }
      }
    });

    if (topEntry && topEntry.target) {
      const idx = parseInt(topEntry.target.getAttribute('data-product-index'), 10);
      if (!isNaN(idx)) {
        updateActiveNarrative(idx);
      }
    }
  }, observerOptions);

  chapters.forEach(ch => showcaseObserver.observe(ch));
}

function updateActiveNarrative(idx) {
  if (activeShowcaseIndex === idx) return;
  activeShowcaseIndex = idx;

  const list = currentShowcaseProducts;
  if (!list || !list[idx]) return;

  const p = list[idx];
  const isAr = (currentLang === 'ar');
  const dict = i18n[currentLang];
  const total = list.length;
  const isLocal = p.class_code === 'LOCAL';
  const tagBg = isLocal ? 'bg-primary-gold text-white' : 'bg-ulma-orange text-white';
  const classLabel = isLocal ? (isAr ? 'تصنيع محلي' : 'LOCAL MANUFACTURED') : (isAr ? 'أنظمة أوروبية' : 'EUROPEAN SYSTEMS');
  const origin = isLocal ? (isAr ? 'تصنيع محلي بالرياض' : 'KSA Riyadh Yard') : (isAr ? 'هندسة أولما الأوروبية' : 'ULMA Europe');
  const name = isAr ? p.name_ar : p.name_en;
  const summary = isAr ? p.short_summary_ar : p.short_summary_en;
  const tagline = isAr ? (p.tagline_ar || '') : (p.tagline_en || '');
  const advantages = isAr 
    ? (Array.isArray(p.key_advantages_ar) ? p.key_advantages_ar : []) 
    : (Array.isArray(p.key_advantages_en) ? p.key_advantages_en : []);
  const padIndex = String(idx + 1).padStart(2, '0');

  const counter = document.getElementById('showcaseCounter');
  const bar = document.getElementById('showcaseProgressBar');
  if (counter) counter.innerText = `${padIndex} / ${String(total).padStart(2, '0')}`;
  if (bar) bar.style.width = `${Math.round(((idx + 1) / total) * 100)}%`;

  const card = document.getElementById('activeNarrativeCard');
  if (card) {
    card.style.opacity = '0.25';
    card.style.transform = 'translateY(4px)';

    setTimeout(() => {
      const classBadge = document.getElementById('activeClassBadge');
      const skuBadge = document.getElementById('activeSkuBadge');
      const originLabel = document.getElementById('activeOriginLabel');
      const titleEl = document.getElementById('activeTitle');
      const taglineEl = document.getElementById('activeTagline');
      const summaryEl = document.getElementById('activeSummary');
      const highlightsEl = document.getElementById('activeHighlights');
      const viewBtn = document.getElementById('activeViewBtn');

      if (classBadge) {
        classBadge.className = `px-2.5 py-1 rounded text-[11px] font-display font-bold uppercase tracking-wider ${tagBg} shadow-xs`;
        classBadge.innerText = classLabel;
      }
      if (skuBadge) skuBadge.innerText = p.sku || '';
      if (originLabel) {
        originLabel.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-primary-gold"></span><span>${origin}</span>`;
      }
      if (titleEl) {
        titleEl.innerText = name;
        titleEl.onclick = () => navigateToProduct(p.slug);
      }
      if (taglineEl) taglineEl.innerText = tagline;
      if (summaryEl) summaryEl.innerText = summary;
      if (highlightsEl) {
        highlightsEl.innerHTML = advantages.slice(0, 3).map(adv => `
          <li class="flex items-start gap-2 text-xs text-charcoal">
            <span class="material-symbols-outlined text-sm text-primary-gold shrink-0 mt-0.5">verified</span>
            <span class="leading-tight font-medium">${adv}</span>
          </li>
        `).join('');
      }
      if (viewBtn) {
        viewBtn.setAttribute('href', `/products/${p.slug}`);
        viewBtn.onclick = (e) => handleProductCtaClick(e, p.slug);
      }

      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 120);
  }
}

function handleProductCtaClick(e, slug) {
  if (e) e.preventDefault();
  navigateToProduct(slug);
}

function navigateToProduct(slug, updateHistory = true) {
  const db = window.DB_SNAPSHOT;
  if (!db || !db.products) return;

  const product = db.products.find(p => p.slug === slug || String(p.id) === String(slug) || (p.sku && p.sku.toLowerCase() === String(slug).toLowerCase()));
  if (!product) {
    console.warn('Product not found for slug:', slug);
    return;
  }

  if (updateHistory) {
    history.pushState({ slug: product.slug }, '', `/products/${product.slug}`);
  }

  const landing = document.getElementById('landingView');
  const detail = document.getElementById('productDetailView');
  if (landing) landing.classList.add('hidden');
  if (detail) {
    detail.classList.remove('hidden');
    renderProductDetailPage(product);
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
}

function navigateBackToShowcase(targetAnchor) {
  const landing = document.getElementById('landingView');
  const detail = document.getElementById('productDetailView');
  if (detail) detail.classList.add('hidden');
  if (landing) landing.classList.remove('hidden');

  history.pushState(null, '', '/' + (targetAnchor || '#systems-matrix'));

  if (targetAnchor) {
    const el = document.querySelector(targetAnchor);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }
  }
  const matrix = document.getElementById('systems-matrix');
  if (matrix) {
    setTimeout(() => matrix.scrollIntoView({ behavior: 'smooth' }), 50);
  }
}

function prefillRfqFromDetail(productName) {
  navigateBackToShowcase('#quote-terminal');
  setTimeout(() => prefillRfq(productName), 100);
}

function renderProductDetailPage(p) {
  const container = document.getElementById('productDetailContainer');
  if (!container) return;

  window.currentDetailPageProduct = p;
  const isAr = (currentLang === 'ar');
  const dict = i18n[currentLang];
  const isLocal = p.class_code === 'LOCAL';
  const tagBg = isLocal ? 'bg-primary-gold text-white' : 'bg-ulma-orange text-white';
  const classLabel = isLocal ? (isAr ? 'تصنيع محلي سعودي' : 'LOCAL MANUFACTURED') : (isAr ? 'هندسة أولما الأوروبية' : 'EUROPEAN SYSTEMS');
  const origin = isLocal ? (isAr ? 'مصنع الرياض المركزي - المملكة العربية السعودية' : 'Riyadh Central Yard, Kingdom of Saudi Arabia') : (isAr ? 'توريد وهندسة أولما الإسبانية الأوروبية' : 'ULMA European Engineering & Direct Site Supply');
  const name = isAr ? p.name_ar : p.name_en;
  const tagline = isAr ? (p.tagline_ar || '') : (p.tagline_en || '');
  const summary = isAr ? p.short_summary_ar : p.short_summary_en;
  const what = isAr ? (p.what_is_it_ar || summary) : (p.what_is_it_en || summary);
  const used = isAr ? (p.what_is_used_for_ar || '') : (p.what_is_used_for_en || '');
  const how = isAr ? (p.how_does_it_work_ar || '') : (p.how_does_it_work_en || '');
  const terms = (p.sales_available && p.rental_available) ? dict.sales_and_rental : dict.sales_only;
  const imgSrc = p.main_image || p.hero_image;
  const advantages = isAr ? (p.key_advantages_ar || []) : (p.key_advantages_en || []);
  const components = isAr ? (p.main_components_ar || []) : (p.main_components_en || []);

  // Technical Specs parsing
  let specsObj = p.technical_specs || {};
  if (typeof specsObj === 'string') {
    try { specsObj = JSON.parse(specsObj); } catch(e) {}
  }

  // Related products from db
  const allProds = window.DB_SNAPSHOT.products || [];
  const related = allProds.filter(x => x.id !== p.id && (x.class_code === p.class_code || x.cat_slug === p.cat_slug)).slice(0, 3);

  // Gallery items using real project images
  const galleryPhotos = [
    { src: 'images/projects/metropolitan-tower-erection.jpg', title: isAr ? 'برج العاصمة - صب النواة الخرسانية' : 'Metropolitan Core Concrete Pour' },
    { src: 'images/projects/infrastructure-bridge.jpg', title: isAr ? 'تدعيم جسر الطريق السريع الثقيل' : 'Highway Heavy Shoring Works' },
    { src: 'images/projects/stadium-canopy.jpg', title: isAr ? 'سقالات المظلة والمنشآت الضخمة' : 'Arena Canopy Spatial Access' }
  ];

  container.innerHTML = `
    <div class="flex flex-col gap-10" dir="${isAr ? 'rtl' : 'ltr'}">
      
      <!-- 1. Breadcrumbs Bar -->
      <nav class="flex items-center justify-between py-2 border-b border-divider-color">
        <button 
          onclick="navigateBackToShowcase()" 
          class="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-charcoal hover:text-primary-gold transition-colors cursor-pointer"
        >
          <span class="material-symbols-outlined text-sm rtl:rotate-180">arrow_back</span>
          <span>${dict.back_to_showcase || (isAr ? 'العودة لمعرض الأنظمة' : 'Back to Systems Showcase')}</span>
        </button>

        <div class="hidden sm:flex items-center gap-2 text-xs font-display text-muted-brown">
          <span>${dict.sec_engineered_systems || 'Engineered Systems'}</span>
          <span>/</span>
          <span class="text-charcoal font-semibold">${classLabel}</span>
          <span>/</span>
          <span class="text-primary-gold font-bold">${name}</span>
        </div>
      </nav>

      <!-- 2. Hero Presentation (2 Columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        <!-- Left: Hero Photographic Showcase with HUD telemetry -->
        <div class="lg:col-span-7 flex flex-col gap-4">
          <div class="relative h-80 sm:h-[480px] w-full rounded-2xl overflow-hidden bg-charcoal border border-divider-color shadow-2xl">
            <img 
              src="${imgSrc}" 
              alt="${name}" 
              class="w-full h-full object-cover"
              onerror="handleImageFallback(this, '${p.sku}', '${p.cat_slug}', '${name.replace(/'/g, "\\'")}')"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-black/30 pointer-events-none"></div>

            <!-- HUD Corners -->
            <div class="absolute top-3 left-3 text-xs font-mono text-primary-gold/70 pointer-events-none leading-none">┌</div>
            <div class="absolute top-3 right-3 text-xs font-mono text-primary-gold/70 pointer-events-none leading-none">┐</div>
            <div class="absolute bottom-3 left-3 text-xs font-mono text-primary-gold/70 pointer-events-none leading-none">└</div>
            <div class="absolute bottom-3 right-3 text-xs font-mono text-primary-gold/70 pointer-events-none leading-none">┘</div>

            <!-- Top HUD Tag -->
            <div class="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
              <span class="px-3 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider ${tagBg} shadow-xs">
                ${p.sku}
              </span>
              <span class="px-3 py-1 rounded-md bg-black/65 backdrop-blur-md text-white text-[11px] font-display uppercase tracking-wider font-semibold border border-white/15">
                ${terms}
              </span>
            </div>

            <!-- Bottom Telemetry HUD Ribbon -->
            <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-primary-gold animate-pulse"></span>
                <span class="text-xs font-display uppercase tracking-wider font-bold text-primary-gold drop-shadow-xs">
                  ${origin}
                </span>
              </div>
              <span class="text-xs font-mono bg-black/60 backdrop-blur-xs px-3 py-1 rounded border border-white/15">
                SASO 2874 / EN 12810 Verified
              </span>
            </div>
          </div>

          <!-- Micro Spec Strip -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-card-surface border border-divider-color rounded-xl p-3 text-center">
              <span class="text-[10px] font-display uppercase tracking-wider text-muted-brown block">${isAr ? 'الشركة المصنعة' : 'MANUFACTURER'}</span>
              <strong class="font-display font-bold text-xs text-charcoal">${p.brand_name}</strong>
            </div>
            <div class="bg-card-surface border border-divider-color rounded-xl p-3 text-center">
              <span class="text-[10px] font-display uppercase tracking-wider text-muted-brown block">${isAr ? 'طريقة التوريد' : 'PROCUREMENT'}</span>
              <strong class="font-display font-bold text-xs text-charcoal">${terms}</strong>
            </div>
            <div class="bg-card-surface border border-divider-color rounded-xl p-3 text-center">
              <span class="text-[10px] font-display uppercase tracking-wider text-muted-brown block">${isAr ? 'معيار الجودة' : 'COMPLIANCE'}</span>
              <strong class="font-display font-bold text-xs text-charcoal">SASO / EN 12810</strong>
            </div>
            <div class="bg-card-surface border border-divider-color rounded-xl p-3 text-center">
              <span class="text-[10px] font-display uppercase tracking-wider text-muted-brown block">${isAr ? 'زمن التجهيز' : 'DISPATCH'}</span>
              <strong class="font-display font-bold text-xs text-primary-gold">${isAr ? '24 - 48 ساعة' : '24 - 48 Hours'}</strong>
            </div>
          </div>
        </div>

        <!-- Right: System Specifications & Procurement Column -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-1 rounded text-[11px] font-display font-bold uppercase tracking-wider ${tagBg}">
                ${classLabel}
              </span>
              <span class="text-xs font-display text-muted-brown font-semibold">
                ${p.brand_name} Sovereign Alliance
              </span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-display font-bold text-charcoal uppercase leading-tight">
              ${name}
            </h1>
            ${tagline ? `<p class="text-sm font-display text-secondary-earth font-bold uppercase tracking-wide mt-2">${tagline}</p>` : ''}
            <p class="text-sm text-muted-brown font-body leading-relaxed mt-3">
              ${summary}
            </p>
          </div>

          <!-- Direct Inquiry CTAs -->
          <div class="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onclick="prefillRfqFromDetail('${p.name_en.replace(/'/g, "\\'")}')" 
              class="flex-1 py-4 px-6 bg-charcoal hover:bg-primary-gold text-white rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <span class="material-symbols-outlined text-base">send</span>
              <span>${dict.enquire_product || (isAr ? 'طلب تسعير لهذا النظام ←' : 'ENQUIRE ABOUT THIS PRODUCT →')}</span>
            </button>
            <a 
              href="${p.drawing_url || '#quote-terminal'}" 
              download
              class="py-4 px-5 border border-divider-color rounded-xl bg-card-surface hover:bg-soft-sand text-charcoal font-display text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-base text-secondary-earth">description</span>
              <span>${isAr ? 'تحميل المواصفات PDF' : 'Download Spec PDF'}</span>
            </a>
          </div>

          <!-- Highlight Key Advantages in Sidebar -->
          <div class="bg-card-surface border border-divider-color rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <h3 class="font-display font-bold text-xs uppercase tracking-wider text-charcoal flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-primary-gold">verified</span>
              <span>${dict.key_advantages_title || (isAr ? 'الميزات الهندسية التنافسية' : 'Key Engineering Advantages')}</span>
            </h3>
            <ul class="space-y-2 text-xs">
              ${advantages.map(adv => `
                <li class="flex items-start gap-2 text-muted-brown">
                  <span class="material-symbols-outlined text-sm text-primary-gold shrink-0 mt-0.5">check_circle</span>
                  <span class="leading-relaxed font-body text-charcoal">${adv}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

      </div>

      <!-- 3. What It Is & What It Is Used For (Deep Dive Cards) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-card-surface border border-divider-color rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-3">
          <div class="flex items-center gap-2 text-secondary-earth font-display font-bold text-xs uppercase tracking-wider">
            <span class="material-symbols-outlined text-lg text-primary-gold">layers</span>
            <span>${dict.what_is_it_title || (isAr ? 'ماهية النظام ومواصفاته' : 'What It Is')}</span>
          </div>
          <p class="text-sm text-muted-brown font-body leading-relaxed">
            ${what}
          </p>
        </div>

        <div class="bg-card-surface border border-divider-color rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-3">
          <div class="flex items-center gap-2 text-secondary-earth font-display font-bold text-xs uppercase tracking-wider">
            <span class="material-symbols-outlined text-lg text-secondary-earth">domain</span>
            <span>${dict.what_used_for_title || (isAr ? 'مجالات الاستخدام الإنشائي' : 'What It Is Used For')}</span>
          </div>
          <p class="text-sm text-muted-brown font-body leading-relaxed">
            ${used}
          </p>
        </div>
      </div>

      ${how ? `
        <!-- 4. Engineering Working Principle / How It Works -->
        <div class="bg-desert-ivory border border-divider-color rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-3">
          <div class="flex items-center gap-2 text-charcoal font-display font-bold text-xs uppercase tracking-wider">
            <span class="material-symbols-outlined text-lg text-primary-gold">settings_suggest</span>
            <span>${dict.how_works_title || (isAr ? 'آلية العمل والتركيب الميداني' : 'How It Works & Mechanism')}</span>
          </div>
          <p class="text-sm text-charcoal font-body leading-relaxed">
            ${how}
          </p>
        </div>
      ` : ''}

      <!-- 5. Technical Specifications Table -->
      <div class="bg-card-surface border border-divider-color rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-divider-color pb-3">
          <h3 class="font-display font-bold text-sm sm:text-base uppercase tracking-wider text-charcoal flex items-center gap-2">
            <span class="material-symbols-outlined text-base text-primary-gold">tune</span>
            <span>${dict.tech_specs_title || (isAr ? 'المواصفات الفنية وسعة التحمل' : 'Technical Features & Load Ratings')}</span>
          </h3>
          <span class="text-xs font-mono text-muted-brown">${p.sku}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${Object.entries(specsObj).map(([k, v]) => `
            <div class="p-3.5 bg-desert-ivory/60 border border-divider-color/60 rounded-xl flex flex-col gap-1">
              <span class="text-[10px] font-display uppercase tracking-widest text-muted-brown">${k.replace(/_/g, ' ')}</span>
              <strong class="font-display font-bold text-xs text-charcoal">${v}</strong>
            </div>
          `).join('')}
        </div>
      </div>

      ${components.length > 0 ? `
        <!-- 6. Main System Components -->
        <div class="bg-card-surface border border-divider-color rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
          <h3 class="font-display font-bold text-sm uppercase tracking-wider text-charcoal flex items-center gap-2">
            <span class="material-symbols-outlined text-base text-secondary-earth">view_in_ar</span>
            <span>${isAr ? 'المكونات الأساسية للنظام' : 'Main System Components'}</span>
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            ${components.map((comp, ci) => `
              <div class="p-3 bg-desert-ivory/70 border border-divider-color rounded-xl flex flex-col gap-1 text-center">
                <span class="font-mono text-[10px] text-primary-gold font-bold">#0${ci + 1}</span>
                <span class="font-display font-semibold text-xs text-charcoal leading-tight">${comp}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 7. Real Project Application Gallery -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h3 class="font-display font-bold text-lg uppercase text-charcoal flex items-center gap-2">
            <span class="material-symbols-outlined text-base text-primary-gold">photo_library</span>
            <span>${dict.product_gallery_title || (isAr ? 'معرض الصور والتطبيقات الميدانية' : 'Project & Application Gallery')}</span>
          </h3>
          <span class="text-xs font-display text-muted-brown font-semibold">${isAr ? 'مشاريع المملكة الكبرى' : 'Kingdom Deployments'}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          ${galleryPhotos.map((gp, gidx) => `
            <div class="relative h-60 rounded-xl overflow-hidden bg-charcoal border border-divider-color shadow-sm group">
              <img 
                src="${gp.src}" 
                alt="${gp.title}" 
                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                onerror="handleImageFallback(this, 'GAL-0${gidx+1}', 'gallery', '${gp.title.replace(/'/g, "\\'")}')"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-transparent to-transparent pointer-events-none"></div>
              <div class="absolute bottom-3 left-3 right-3 pointer-events-none">
                <span class="text-xs font-display font-bold text-white uppercase drop-shadow-xs">${gp.title}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 8. Complementary Systems -->
      ${related.length > 0 ? `
        <div class="flex flex-col gap-4 pt-6 border-t border-divider-color">
          <h3 class="font-display font-bold text-lg uppercase text-charcoal">
            ${dict.related_products_title || (isAr ? 'أنظمة هندسية مكملة' : 'Complementary Systems')}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            ${related.map(rel => {
              const relName = isAr ? rel.name_ar : rel.name_en;
              const relImg = rel.main_image || rel.hero_image;
              const relIsLocal = rel.class_code === 'LOCAL';
              const relBadge = relIsLocal ? 'bg-primary-gold text-white' : 'bg-ulma-orange text-white';

              return `
                <div 
                  onclick="navigateToProduct('${rel.slug}')"
                  class="bg-card-surface border border-divider-color hover:border-primary-gold rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  <div class="relative h-44 w-full overflow-hidden bg-charcoal">
                    <img 
                      src="${relImg}" 
                      alt="${relName}" 
                      class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onerror="handleImageFallback(this, '${rel.sku}', '${rel.cat_slug}', '${relName.replace(/'/g, "\\'")}')"
                      loading="lazy"
                    />
                    <div class="absolute top-2.5 left-2.5">
                      <span class="px-2 py-0.5 rounded text-[10px] font-display font-bold uppercase ${relBadge}">
                        ${rel.sku}
                      </span>
                    </div>
                  </div>
                  <div class="p-4 flex flex-col gap-1.5 flex-1 justify-between">
                    <div>
                      <h4 class="font-display font-bold text-sm text-charcoal uppercase group-hover:text-primary-gold transition-colors">${relName}</h4>
                      <p class="text-xs text-muted-brown line-clamp-2 mt-1 font-body">${isAr ? rel.short_summary_ar : rel.short_summary_en}</p>
                    </div>
                    <span class="text-xs font-display font-bold text-primary-gold flex items-center gap-1 mt-2">
                      <span>${isAr ? 'استكشف النظام' : 'Inspect System'}</span>
                      <span class="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 9. Sticky / Prominent Bottom Inquiry Banner -->
      <div class="bg-charcoal text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-primary-gold/30">
        <div>
          <span class="text-xs font-display text-primary-gold uppercase tracking-widest font-bold block mb-1">
            ${isAr ? 'استشارة هندسية فورية' : 'DIRECT ENGINEERING DESK'}
          </span>
          <h3 class="text-xl sm:text-2xl font-display font-bold uppercase">
            ${dict.enquiry_box_title || (isAr ? 'هل تحتاج هذا النظام لمشروعك القادم؟' : 'Need this system for your project?')}
          </h3>
          <p class="text-xs sm:text-sm text-soft-sand/80 max-w-xl mt-1 font-body">
            ${dict.enquiry_box_desc || (isAr ? 'تواصل مباشرة مع كبير المهندسين بالرياض للحصول على مخططات CAD تفصيلية، وحسابات الإجهاد FEA، وتأكيد التوريد.' : 'Speak directly with our Chief Structural Engineer in Riyadh for custom CAD drawings, FEA calculations, and project supply schedules.')}
          </p>
        </div>

        <button 
          onclick="prefillRfqFromDetail('${p.name_en.replace(/'/g, "\\'")}')" 
          class="px-8 py-4 bg-primary-gold hover:bg-secondary-earth text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shrink-0"
        >
          <span class="material-symbols-outlined text-base">request_quote</span>
          <span>${dict.enquire_product || (isAr ? 'طلب دراسة وتسعير ←' : 'REQUEST TECHNICAL RFQ →')}</span>
        </button>
      </div>

    </div>
  `;
}

function openProductDetailModal(id) {
  const db = window.DB_SNAPSHOT;
  if (!db || !db.products) return;
  const p = db.products.find(x => x.id === id);
  if (p) navigateToProduct(p.slug);
}

function closeProductDetailModal() {
  const m = document.getElementById('productDetailModal');
  if (m) m.remove();
}

function checkRouteOnLoad() {
  const path = window.location.pathname;
  if (path.startsWith('/products/')) {
    const slug = path.replace(/^\/products\//, '').replace(/\/$/, '');
    if (slug) {
      navigateToProduct(slug, false);
      return;
    }
  }
  const landing = document.getElementById('landingView');
  const detail = document.getElementById('productDetailView');
  if (landing && detail && landing.classList.contains('hidden')) {
    landing.classList.remove('hidden');
    detail.classList.add('hidden');
  }
}

// Router Event Listeners
window.addEventListener('popstate', () => {
  checkRouteOnLoad();
});

// Intercept clicks on hash navigation links so they work seamlessly from product detail page
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (a) {
    const hash = a.getAttribute('href');
    const landing = document.getElementById('landingView');
    const detail = document.getElementById('productDetailView');
    if (detail && !detail.classList.contains('hidden')) {
      e.preventDefault();
      navigateBackToShowcase(hash);
    }
  }
});

let activeGeomIndex = 0;

function renderGeometry() {
  const bContainer = document.getElementById('geometryButtons');
  const track = document.getElementById('geometryTrack');
  if (!track) return;

  const isAr = (currentLang === 'ar');
  const dict = i18n[currentLang] || i18n.en;
  let list = (Array.isArray(geometries) && geometries.length > 0)
    ? geometries
    : ((window.DB_SNAPSHOT && Array.isArray(window.DB_SNAPSHOT.geometries) && window.DB_SNAPSHOT.geometries.length > 0) ? window.DB_SNAPSHOT.geometries : []);

  if (list.length === 0 && window.DB_SNAPSHOT && window.DB_SNAPSHOT.geometries) {
    list = window.DB_SNAPSHOT.geometries;
  }
  if (list.length === 0) return;
  if (activeGeomIndex >= list.length) activeGeomIndex = 0;

  // Render clickable pills
  if (bContainer) {
    bContainer.innerHTML = list.map((g, idx) => `
      <button onclick="selectGeometryIndex(${idx})" class="px-4 py-2 rounded-full border border-divider-color font-display text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${idx === activeGeomIndex ? 'bg-charcoal text-white shadow-xs' : 'bg-card-surface text-charcoal hover:bg-soft-sand'}">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full ${idx === activeGeomIndex ? 'bg-primary-gold' : 'bg-divider-color'}"></span>
          <span>${isAr ? g.name_ar : g.name_en}</span>
        </span>
      </button>
    `).join('');
  }

  // Render all 6 horizontal slides inside the track
  track.innerHTML = list.map((g, idx) => {
    const gTitle = (isAr ? g.title_ar : (g.title_en || '')).replace(/['"]/g, '');
    return `
      <div class="w-full min-w-full shrink-0 p-6 sm:p-8" data-geom-index="${idx}">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <!-- Left Column: Visual Representation & Engineering Tag -->
          <div class="lg:col-span-6 relative rounded-xl overflow-hidden bg-charcoal min-h-[280px] sm:min-h-[340px] flex flex-col justify-between p-5 group border border-divider-color shadow-inner">
            <img 
              src="${g.image}" 
              alt="${isAr ? g.title_ar : g.title_en}" 
              class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
              onerror="handleImageFallback(this, '${g.id}', 'geometry', '${gTitle}')"
              loading="lazy" decoding="async"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-black/20 pointer-events-none"></div>

            <!-- Top Status Tags -->
            <div class="relative z-10 flex items-center justify-between gap-2">
              <span class="font-display text-[11px] px-3 py-1 rounded-full bg-primary-gold text-white font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs">architecture</span>
                <span>${isAr ? g.name_ar : g.name_en}</span>
              </span>
              <span class="font-display text-[10px] px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-soft-sand font-semibold uppercase tracking-wider border border-white/10">
                ${g.type_tag}
              </span>
            </div>

            <!-- Bottom Graphic Overlay -->
            <div class="relative z-10 pt-8">
              <span class="text-[11px] font-display uppercase tracking-widest text-primary-gold font-bold block mb-1">
                ${g.code}
              </span>
              <p class="text-sm font-display font-bold text-white uppercase drop-shadow-md">
                ${isAr ? g.title_ar : g.title_en}
              </p>
            </div>
          </div>

          <!-- Right Column: Engineering Specs & Action -->
          <div class="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between border-b border-divider-color pb-2 mb-3">
                <span class="font-display text-xs text-secondary-earth font-bold uppercase tracking-wider">
                  ${isAr ? 'المواصفات الإنشائية والتطبيق' : 'Structural Specification & Application'}
                </span>
                <span class="text-xs font-mono text-muted-brown uppercase tracking-wider font-semibold">${g.code}</span>
              </div>

              <h3 class="text-xl sm:text-2xl font-display font-bold text-charcoal mb-2 uppercase leading-snug">
                ${isAr ? g.title_ar : g.title_en}
              </h3>

              <p class="text-xs sm:text-sm text-muted-brown leading-relaxed mb-5 font-body">
                ${isAr ? g.desc_ar : g.desc_en}
              </p>

              <div class="grid grid-cols-2 gap-3 p-4 bg-desert-ivory border border-divider-color rounded-xl mb-6">
                <div>
                  <span class="text-[10px] font-display uppercase text-muted-brown block font-semibold">${isAr ? g.p1_label_ar : g.p1_label_en}</span>
                  <strong class="font-display font-bold text-base text-charcoal">${g.p1_val}</strong>
                </div>
                <div>
                  <span class="text-[10px] font-display uppercase text-muted-brown block font-semibold">${isAr ? g.p2_label_ar : g.p2_label_en}</span>
                  <strong class="font-display font-bold text-base text-primary-gold">${g.p2_val}</strong>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button onclick="prefillRfq('${isAr ? g.title_ar : g.title_en}')" class="flex-1 py-3 bg-charcoal text-content-offwhite rounded-xl font-display text-xs font-bold uppercase tracking-wider hover:bg-primary-gold transition-colors flex items-center justify-center gap-2 shadow-xs">
                <span class="material-symbols-outlined text-base">architecture</span>
                <span>${isAr ? 'طلب تسعير هذا الشكل الهندسي' : 'Quote This Geometry'}</span>
                <span class="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateGeometrySlide(activeGeomIndex, false);
}

function updateGeometrySlide(idx, animateScroll = true) {
  const list = (Array.isArray(geometries) && geometries.length > 0)
    ? geometries
    : ((window.DB_SNAPSHOT && Array.isArray(window.DB_SNAPSHOT.geometries) && window.DB_SNAPSHOT.geometries.length > 0) ? window.DB_SNAPSHOT.geometries : []);

  if (idx < 0) idx = 0;
  if (idx >= list.length) idx = list.length - 1;
  activeGeomIndex = idx;

  const track = document.getElementById('geometryTrack');
  const isAr = (currentLang === 'ar');
  if (track) {
    const offset = idx * 100;
    // For RTL horizontal sliding
    track.style.transform = isAr ? `translateX(${offset}%)` : `translateX(-${offset}%)`;
  }

  // Update counter badge
  const counter = document.getElementById('geometryCounterBadge');
  if (counter) {
    counter.innerText = `${String(idx + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`;
  }

  // Update buttons
  const bContainer = document.getElementById('geometryButtons');
  if (bContainer) {
    const btns = bContainer.querySelectorAll('button');
    btns.forEach((btn, bIdx) => {
      if (bIdx === idx) {
        btn.className = 'px-4 py-2 rounded-full border border-divider-color font-display text-xs font-bold uppercase tracking-wider shrink-0 transition-all bg-charcoal text-white shadow-xs';
      } else {
        btn.className = 'px-4 py-2 rounded-full border border-divider-color font-display text-xs font-bold uppercase tracking-wider shrink-0 transition-all bg-card-surface text-charcoal hover:bg-soft-sand';
      }
    });
  }
}

function selectGeometryIndex(idx) {
  updateGeometrySlide(idx, true);
}

function prevGeometrySlide() {
  updateGeometrySlide(activeGeomIndex - 1, true);
}

function nextGeometrySlide() {
  updateGeometrySlide(activeGeomIndex + 1, true);
}

function selectGeometry(id) {
  const list = (Array.isArray(geometries) && geometries.length > 0) ? geometries : window.DB_SNAPSHOT.geometries;
  const idx = list.findIndex(x => x.id === id);
  if (idx !== -1) selectGeometryIndex(idx);
}

function renderAssemblyStep() {
  const track = document.getElementById('assemblyTrack');
  const db = window.DB_SNAPSHOT;
  if (!track || !db || !Array.isArray(db.assembly) || db.assembly.length === 0) return;

  const isAr = (currentLang === 'ar');
  const total = db.assembly.length;
  if (currentAssemblyStepIndex >= total) currentAssemblyStepIndex = 0;

  // Render all 7 horizontal step slides inside the track
  track.innerHTML = db.assembly.map((s, idx) => {
    const sTitle = (isAr ? s.title_ar : (s.title_en || '')).replace(/['"]/g, '');
    return `
      <div class="w-full min-w-full shrink-0" data-assembly-step="${idx}">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div class="lg:col-span-6 relative rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[340px] flex flex-col justify-between p-6 sm:p-8 text-white border border-divider-color shadow-sm group bg-charcoal">
            <img 
              src="${s.image_url}" 
              alt="${sTitle}" 
              class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 ease-out"
              onerror="handleImageFallback(this, 'STEP-0${s.step_number || (idx + 1)}', 'assembly', '${sTitle}')"
              loading="lazy" decoding="async"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-black/30 pointer-events-none"></div>

            <div class="relative z-10 flex items-center justify-between">
              <span class="px-3 py-1 rounded-full bg-primary-gold font-display text-xs font-bold text-white shadow-xs">
                ${isAr ? `المرحلة 0${s.step_number || (idx + 1)} من 0${total}` : `STEP 0${s.step_number || (idx + 1)} / 0${total}`}
              </span>
              <span class="text-xs font-display uppercase tracking-widest text-soft-sand bg-black/50 px-2.5 py-1 rounded backdrop-blur-xs border border-white/10">ULMA BRIO / Cuplock</span>
            </div>

            <div class="relative z-10 my-6">
              <span class="text-[10px] font-display uppercase tracking-widest text-primary-gold font-bold block">${isAr ? 'مرحلة التركيب الميداني' : 'Erection Phase'}</span>
              <h3 class="font-display font-bold text-xl sm:text-2xl text-white uppercase mt-1 drop-shadow-md">${isAr ? s.title_ar : s.title_en}</h3>
            </div>

            <div class="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-display">
              <span class="text-soft-sand/90 font-medium">${isAr ? 'حد التفاوت المسموح' : 'Plumb Deviation Tolerance'}</span>
              <span class="text-primary-gold font-bold font-mono">< 1.5mm / 2m</span>
            </div>
          </div>

          <div class="lg:col-span-6 flex flex-col justify-between gap-4">
            <p class="text-sm sm:text-base text-charcoal leading-relaxed font-body">
              ${isAr ? s.description_ar : s.description_en}
            </p>

            <div class="grid grid-cols-2 gap-3 mt-2">
              <div class="p-3.5 bg-desert-ivory border border-divider-color rounded-xl">
                <span class="block text-[10px] uppercase font-display text-muted-brown font-semibold">${s.spec_a_label || 'Base Spindle Capacity'}</span>
                <span class="font-display font-bold text-sm text-charcoal">${s.spec_a_value || '45 kN Load Rating'}</span>
              </div>
              <div class="p-3.5 bg-desert-ivory border border-divider-color rounded-xl">
                <span class="block text-[10px] uppercase font-display text-muted-brown font-semibold">${s.spec_b_label || 'Compliance Check'}</span>
                <span class="font-display font-bold text-sm text-primary-gold">${s.spec_b_value || 'SASO ISO 3834-2'}</span>
              </div>
            </div>

            <div class="p-4 bg-desert-ivory/60 border border-divider-color rounded-xl flex items-center justify-between text-xs text-muted-brown">
              <span class="flex items-center gap-1.5 font-display font-semibold">
                <span class="material-symbols-outlined text-base text-primary-gold">verified_user</span>
                <span>${isAr ? 'معايير أمان معتمدة من الدفاع المدني' : 'Civil Defense & SASO Certified Safety'}</span>
              </span>
              <span class="font-mono text-charcoal font-bold">100% Zero Drop</span>
            </div>
          </div>

        </div>
      </div>
    `;
  }).join('');

  updateAssemblySlide(currentAssemblyStepIndex);
}

function updateAssemblySlide(idx) {
  const db = window.DB_SNAPSHOT;
  if (!db || !Array.isArray(db.assembly) || db.assembly.length === 0) return;

  const total = db.assembly.length;
  if (idx < 0) idx = 0;
  if (idx >= total) idx = total - 1;
  currentAssemblyStepIndex = idx;

  const track = document.getElementById('assemblyTrack');
  const isAr = (currentLang === 'ar');
  if (track) {
    const offset = idx * 100;
    track.style.transform = isAr ? `translateX(${offset}%)` : `translateX(-${offset}%)`;
  }

  const counter = document.getElementById('assemblyStepCounter');
  if (counter) {
    counter.innerText = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  }

  const dots = document.getElementById('stepperDots');
  if (dots) {
    dots.innerHTML = db.assembly.map((_, i) => `
      <button onclick="setAssemblyStep(${i})" class="h-2.5 rounded-full transition-all ${i === currentAssemblyStepIndex ? 'bg-primary-gold w-6' : 'bg-divider-color hover:bg-muted-brown w-2.5'}" title="Step 0${i + 1}"></button>
    `).join('');
  }
}

function nextAssemblyStep() {
  const db = window.DB_SNAPSHOT;
  if (db && currentAssemblyStepIndex < db.assembly.length - 1) {
    updateAssemblySlide(currentAssemblyStepIndex + 1);
  }
}

function prevAssemblyStep() {
  if (currentAssemblyStepIndex > 0) {
    updateAssemblySlide(currentAssemblyStepIndex - 1);
  }
}

function setAssemblyStep(i) {
  updateAssemblySlide(i);
}

function renderServices() {
  const c = document.getElementById('servicesCards');
  const db = window.DB_SNAPSHOT;
  if (!c || !db || !db.services) return;

  const isAr = (currentLang === 'ar');
  c.innerHTML = db.services.map((s, idx) => `
    <div class="bg-card-surface border border-divider-color rounded-xl p-5 shadow-sm flex flex-col justify-between gap-4">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="w-8 h-8 rounded bg-charcoal text-white font-display font-bold text-xs flex items-center justify-center">0${idx+1}</span>
          <span class="material-symbols-outlined text-primary-gold">${s.icon_name}</span>
        </div>
        <h3 class="font-display font-bold text-sm uppercase text-charcoal mt-1">${isAr ? s.name_ar : s.name_en}</h3>
        <p class="text-xs text-muted-brown leading-relaxed">${isAr ? s.summary_ar : s.summary_en}</p>
      </div>
      <button onclick="prefillRfq('${isAr ? s.name_ar : s.name_en}')" class="text-xs font-display font-bold text-secondary-earth hover:text-charcoal uppercase flex items-center gap-1">
        <span>${isAr ? 'استفسار عن الخدمة' : 'Inquire'}</span>
        <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </div>
  `).join('');
}

function renderManufacturing() {
  const c = document.getElementById('manufacturingStepsGrid');
  const db = window.DB_SNAPSHOT;
  if (!c || !db || !db.processes) return;

  const isAr = (currentLang === 'ar');
  c.innerHTML = db.processes.map(p => `
    <div class="bg-card-surface border border-divider-color rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-primary-gold transition-all duration-300">
      <div class="relative h-44 w-full overflow-hidden bg-charcoal">
        <img 
          src="${p.hero_image || 'images/industries/industrial-logistics.jpg'}" 
          alt="${isAr ? p.name_ar : p.name_en}" 
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onerror="handleImageFallback(this, 'MFG-0${p.step_number}', 'manufacturing', '${p.name_en.replace(/'/g, "\\'")}')"
          loading="lazy" decoding="async"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent pointer-events-none"></div>
        <div class="absolute top-3 left-3 pointer-events-none">
          <span class="px-2.5 py-1 rounded bg-black/60 backdrop-blur-xs text-[10px] font-display uppercase tracking-wider text-primary-gold font-bold border border-white/10 shadow-xs">
            ${isAr ? `المرحلة 0${p.step_number}` : p.step_tag}
          </span>
        </div>
        <div class="absolute bottom-3 left-3 right-3 pointer-events-none">
          <h4 class="font-display font-bold text-base uppercase text-white drop-shadow-xs">${isAr ? p.name_ar : p.name_en}</h4>
        </div>
      </div>
      <div class="p-4">
        <p class="text-xs text-muted-brown leading-relaxed font-body">${isAr ? p.summary_ar : p.summary_en}</p>
      </div>
    </div>
  `).join('');
}

function renderProjects() {
  const c = document.getElementById('projectsGrid');
  const db = window.DB_SNAPSHOT;
  if (!c || !db || !db.projects) return;

  const isAr = (currentLang === 'ar');
  c.innerHTML = db.projects.map(p => `
    <div class="bg-card-surface border border-divider-color rounded-xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md hover:border-primary-gold transition-all duration-300">
      <div class="relative h-48 w-full overflow-hidden bg-charcoal">
        <img 
          src="${p.hero_image || 'images/projects/metropolitan-tower.jpg'}" 
          alt="${isAr ? p.name_ar : p.name_en}" 
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onerror="handleImageFallback(this, 'PRJ-0${p.id}', 'project', '${p.name_en.replace(/'/g, "\\'")}')"
          loading="lazy" decoding="async"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent pointer-events-none"></div>
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span class="px-2.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-soft-sand text-[10px] font-display uppercase tracking-wider font-semibold border border-white/10">
            ${isAr ? p.industry_ar : p.industry_en}
          </span>
          <span class="text-[10px] font-display text-primary-gold uppercase tracking-wider font-bold drop-shadow-xs">
            ${isAr ? p.location_ar : p.location_en}
          </span>
        </div>
        <div class="absolute bottom-3 left-3 right-3 pointer-events-none">
          <h3 class="font-display font-bold text-lg text-white uppercase drop-shadow-xs">${isAr ? p.name_ar : p.name_en}</h3>
        </div>
      </div>

      <div class="p-5 flex flex-col gap-3">
        <p class="text-xs text-muted-brown leading-relaxed font-body">${isAr ? p.summary_ar : p.summary_en}</p>
        
        <div class="grid grid-cols-3 gap-2 p-2.5 bg-desert-ivory border border-divider-color rounded-lg text-center text-xs">
          ${(p.metrics || []).map(m => `
            <div>
              <span class="text-[10px] font-display text-muted-brown block uppercase">${m.label}</span>
              <strong class="font-display font-bold text-xs text-charcoal">${m.value}</strong>
            </div>
          `).join('')}
        </div>

        <div class="p-3 bg-card-surface border border-divider-color rounded-lg flex flex-col gap-1 text-xs">
          <strong class="text-charcoal uppercase tracking-wider text-[10px] font-display">${isAr ? 'الحل الهندسي المنفذ:' : 'Engineering Solution:'}</strong>
          <span class="text-muted-brown font-body">${isAr ? p.solution_ar : p.solution_en}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function prefillRfq(name) {
  const s = document.getElementById('rfq_system');
  if (s) {
    for (let i = 0; i < s.options.length; i++) {
      if (s.options[i].text.includes(name) || s.options[i].value.includes(name)) {
        s.selectedIndex = i; break;
      }
    }
  }
  document.getElementById('quote-terminal').scrollIntoView({ behavior: 'smooth' });
}

function handleRfqSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('rfqSubmitBtn');
  const box = document.getElementById('rfqSuccessToast');
  const msg = document.getElementById('rfqSuccessMsg');
  const isAr = (currentLang === 'ar');

  btn.disabled = true;
  btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">refresh</span><span>${isAr ? 'جاري الإرسال للمكتب الفني بالرياض...' : 'Transmitting to Technical Desk...'}</span>`;

  setTimeout(() => {
    const ticket = 'ULMA-KSA-' + Math.floor(100000 + Math.random() * 900000);
    msg.innerText = isAr
      ? `تم تسجيل دراسة الشدات بنجاح! تم إصدار التذكرة رقم #${ticket} وتحويلها لكبير المهندسين بالرياض.`
      : `Calculation Spec Registered! Ticket #${ticket} assigned to Chief Structural Engineer.`;
    box.classList.remove('hidden');
    btn.disabled = false;
    btn.innerHTML = `<span>${isAr ? 'تم الإرسال بنجاح' : 'Dispatched Successfully'}</span><span class="material-symbols-outlined text-sm">check</span>`;
  }, 900);
}
