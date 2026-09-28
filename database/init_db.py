import sqlite3
import json
import os
import sys

db_path = os.path.join(os.path.dirname(__file__), 'saudi_master.db')
if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 1. Users
cursor.execute('''
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'ADMIN',
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

# 2. Site Settings
cursor.execute('''
CREATE TABLE site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

# 3. Product Classifications
cursor.execute('''
CREATE TABLE product_classifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_en TEXT,
    description_ar TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

# 4. Brands
cursor.execute('''
CREATE TABLE brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    country_of_origin TEXT NOT NULL,
    logo_url TEXT,
    website TEXT,
    description_en TEXT,
    description_ar TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

# 5. Categories
cursor.execute('''
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_en TEXT,
    description_ar TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

# 6. Products
cursor.execute('''
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    classification_id INTEGER NOT NULL,
    brand_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    sku TEXT,
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    tagline_en TEXT,
    tagline_ar TEXT,
    short_summary_en TEXT NOT NULL,
    short_summary_ar TEXT NOT NULL,
    what_is_it_en TEXT NOT NULL,
    what_is_it_ar TEXT NOT NULL,
    what_is_used_for_en TEXT NOT NULL,
    what_is_used_for_ar TEXT NOT NULL,
    how_does_it_work_en TEXT NOT NULL,
    how_does_it_work_ar TEXT NOT NULL,
    key_advantages_en TEXT,
    key_advantages_ar TEXT,
    main_components_en TEXT,
    main_components_ar TEXT,
    technical_specs TEXT NOT NULL,
    sales_available INTEGER DEFAULT 1,
    rental_available INTEGER DEFAULT 1,
    regional_availability TEXT,
    hero_image TEXT NOT NULL,
    main_image TEXT NOT NULL,
    drawing_url TEXT,
    brochure_url TEXT,
    video_url TEXT,
    status TEXT DEFAULT 'PUBLISHED',
    featured INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    meta_title_en TEXT,
    meta_title_ar TEXT,
    meta_desc_en TEXT,
    meta_desc_ar TEXT,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classification_id) REFERENCES product_classifications(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
''')

# 7. Applications
cursor.execute('''
CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_en TEXT,
    description_ar TEXT,
    icon_name TEXT DEFAULT 'architecture',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

cursor.execute('''
CREATE TABLE product_applications (
    product_id INTEGER NOT NULL,
    application_id INTEGER NOT NULL,
    PRIMARY KEY (product_id, application_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);
''')

# 8. Assembly Sequences & Steps
cursor.execute('''
CREATE TABLE assembly_sequences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
''')

cursor.execute('''
CREATE TABLE assembly_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sequence_id INTEGER NOT NULL,
    step_number INTEGER NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    image_url TEXT NOT NULL,
    spec_a_label TEXT,
    spec_a_value TEXT,
    spec_b_label TEXT,
    spec_b_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sequence_id) REFERENCES assembly_sequences(id) ON DELETE CASCADE
);
''')

# 9. Hotspots
cursor.execute('''
CREATE TABLE hotspots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    target_identifier TEXT NOT NULL,
    node_number INTEGER NOT NULL,
    x_percent REAL NOT NULL,
    y_percent REAL NOT NULL,
    category_en TEXT NOT NULL,
    category_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    rating TEXT,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    specifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

# 10. Regions
cursor.execute('''
CREATE TABLE regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    sales_allowed INTEGER DEFAULT 1,
    rental_allowed INTEGER DEFAULT 0,
    supervision_allowed INTEGER DEFAULT 1,
    description_en TEXT,
    description_ar TEXT,
    hub_locations TEXT,
    is_active INTEGER DEFAULT 1
);
''')

# 11. Services
cursor.execute('''
CREATE TABLE services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    summary_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
);
''')

# 12. Projects
cursor.execute('''
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    location_en TEXT NOT NULL,
    location_ar TEXT NOT NULL,
    region_code TEXT NOT NULL,
    industry_en TEXT NOT NULL,
    industry_ar TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    summary_ar TEXT NOT NULL,
    challenge_en TEXT NOT NULL,
    challenge_ar TEXT NOT NULL,
    solution_en TEXT NOT NULL,
    solution_ar TEXT NOT NULL,
    execution_en TEXT NOT NULL,
    execution_ar TEXT NOT NULL,
    results_en TEXT NOT NULL,
    results_ar TEXT NOT NULL,
    key_metrics TEXT,
    gallery TEXT,
    status TEXT DEFAULT 'PUBLISHED',
    featured INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

cursor.execute('''
CREATE TABLE project_products (
    project_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, product_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
''')

# 13. Manufacturing Facilities & Processes
cursor.execute('''
CREATE TABLE manufacturing_facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    location_en TEXT NOT NULL,
    location_ar TEXT NOT NULL,
    iktva_score TEXT DEFAULT '85%',
    overview_en TEXT NOT NULL,
    overview_ar TEXT NOT NULL,
    capabilities TEXT NOT NULL,
    hero_image TEXT NOT NULL
);
''')

cursor.execute('''
CREATE TABLE manufacturing_processes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    step_number INTEGER NOT NULL,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    summary_ar TEXT NOT NULL,
    details_en TEXT NOT NULL,
    details_ar TEXT NOT NULL,
    image_url TEXT NOT NULL,
    step_tag TEXT NOT NULL
);
''')

# 14. Pages & Sections
cursor.execute('''
CREATE TABLE pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    meta_title_en TEXT,
    meta_title_ar TEXT,
    meta_desc_en TEXT,
    meta_desc_ar TEXT,
    status TEXT DEFAULT 'PUBLISHED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

cursor.execute('''
CREATE TABLE page_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id INTEGER NOT NULL,
    section_type TEXT NOT NULL,
    section_key TEXT NOT NULL,
    title_en TEXT,
    title_ar TEXT,
    subtitle_en TEXT,
    subtitle_ar TEXT,
    body_en TEXT,
    body_ar TEXT,
    cta_label_en TEXT,
    cta_label_ar TEXT,
    cta_url TEXT,
    custom_config TEXT,
    display_order INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);
''')

# 15. Leads & RFQ
cursor.execute('''
CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_number TEXT NOT NULL UNIQUE,
    lead_type TEXT DEFAULT 'RFQ',
    full_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    project_name TEXT,
    project_location TEXT,
    system_interest TEXT,
    transaction_type TEXT DEFAULT 'UNSPECIFIED',
    quantity_estimate TEXT,
    rental_duration TEXT,
    message TEXT,
    attachment_name TEXT,
    attachment_url TEXT,
    region_code TEXT DEFAULT 'KSA',
    language TEXT DEFAULT 'en',
    status TEXT DEFAULT 'NEW',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

# 16. Audit Logs
cursor.execute('''
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id INTEGER,
    old_values TEXT,
    new_values TEXT,
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

print("Database schema successfully generated.")

# ==============================================================================
# SEEDING DATA
# ==============================================================================

# Seed User
cursor.execute('''
INSERT INTO users (name, email, password, role)
VALUES ('Wasif Mukadam (Lead Architect)', 'admin@saudimaster.com', 'admin_secret_2025', 'SUPER_ADMIN');
''')

# Seed Site Settings
site_config = {
    "company_name_en": "Saudi Master Company",
    "company_name_ar": "شركة الماستر السعودي",
    "alliance_name_en": "Saudi Master × ULMA Construction Alliance",
    "alliance_name_ar": "تحالف الماستر السعودي مع أولما العالمية",
    "tagline_en": "Local Manufacturing. European Engineering. One Construction Partner.",
    "tagline_ar": "تصنيع سعودي محلي وهندسة أوروبية متقدمة من أولما",
    "phone": "+966 11 400 9800",
    "whatsapp": "+966500000000",
    "email": "engineering@saudimaster.com",
    "address_en": "Al-Malaz District, Industrial Corridor, PO Box 41293, Riyadh, KSA",
    "address_ar": "حي الملز، المنطقة الصناعية، ص.ب 41293، الرياض، المملكة العربية السعودية",
    "primary_accent": "#B58A52",
    "secondary_accent": "#B66E3C",
    "ulma_orange": "#E2882A",
    "vision_2030_partner": True,
    "license_no": "SM-ULMA-966-KSA",
    "social_links": {
        "linkedin": "https://linkedin.com/company/saudi-master-ulma",
        "twitter": "https://x.com/saudi_master",
        "youtube": "https://youtube.com/@saudimaster_ulma"
    },
    "default_seo": {
        "meta_title": "Saudi Master ULMA | Sovereign Formwork & Scaffolding Engineering KSA",
        "meta_description": "Saudi manufacturer & European ULMA engineering provider for formwork, scaffolding, heavy shoring, sales, rental, and supervision across Saudi Arabia."
    }
}
cursor.execute('''
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES ('general', ?, 'Global corporate settings and brand configuration');
''', (json.dumps(site_config),))

# Seed Classifications
classifications = [
    ('LOCAL', 'Local Made (KSA)', 'تصنيع محلي سعودي', 'local', 'Manufactured in Saudi Arabia with local steel and high IKTVA score', 'تصنيع عالي الجودة بالمملكة العربية السعودية بمعايير ساسو ومحتوى محلي مرتفع', 1),
    ('EUROPEAN', 'European / ULMA', 'أوروبي / أولما', 'european', 'Premium European engineered systems certified to EN 12810/12811 standards', 'أنظمة أوروبية هندسية معتمدة بأعلى معايير السلامة والجودة العالمية EN 12810', 2),
    ('OTHER', 'Specialized Systems', 'أنظمة هندسية مخصصة', 'specialized', 'Specialized and joint-venture bespoke temporary works', 'حلول الشدات والركائز المصممة خصيصاً للمشاريع العملاقة', 3)
]
cursor.executemany('''
INSERT INTO product_classifications (code, name_en, name_ar, slug, description_en, description_ar, display_order)
VALUES (?, ?, ?, ?, ?, ?, ?);
''', classifications)

# Seed Brands
brands = [
    ('Saudi Master', 'saudi-master', 'Saudi Arabia', '/assets/brands/saudi-master-logo.svg', 'https://saudimaster.com', 'Sovereign Saudi manufacturer of modular formwork, steel shutters, and scaffolding systems.', 'الشركة الوطنية السعودية الرائدة في تصنيع الشدات المعدنية وقوالب الصب.', 1),
    ('ULMA Construction', 'ulma-construction', 'Spain', '/assets/brands/ulma-logo.svg', 'https://ulmaconstruction.com', 'Centennial European leader in high-performance formwork, climbing systems, and ringlock scaffolding.', 'الشركة الأوروبية العالمية المتخصصة في الشدات الهندسية وأنظمة التسلق الذاتي.', 2)
]
cursor.executemany('''
INSERT INTO brands (name, slug, country_of_origin, logo_url, website, description_en, description_ar, display_order)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
''', brands)

# Seed Categories
categories = [
    (None, 'Scaffolding Systems', 'أنظمة السقالات المعدنية', 'scaffolding', 'Modular facade, access towers, and spatial scaffolding systems.', 'سقالات الواجهات وأبراج الوصول وأنظمة الربط السريع.', 1),
    (None, 'Formwork Systems', 'أنظمة الشدات وقوالب الخرسانة', 'formwork', 'Heavy wall, column, slab, and retaining formwork systems.', 'شدات الجدران والأعمدة والأسقف المستوية وشدات الأساسات.', 2),
    (None, 'Heavy Shoring Towers', 'أبراج التدعيم الثقيل', 'heavy-shoring', 'High-capacity bridge falsework and mega-slab support towers.', 'أبراج تدعيم الجسور والأسقف العالية والمنشآت الضخمة.', 3),
    (None, 'Specialized & Climbing', 'أنظمة التسلق والحلول المتخصصة', 'specialized-climbing', 'Hydraulic self-climbing cores and organic geometry solutions.', 'شدات التسلق الهيدروليكي الآلي لأبراج السحاب والمنشآت المعقدة.', 4),
    (None, 'Precast & Custom Moulds', 'قوالب الخرسانة مسبقة الصب والمخصصة', 'precast-custom', 'Factory-controlled tilting beds, manholes, and pier moulds.', 'قوالب صب المناهل والأعمدة الدائرية وبطاريات الصب المسبق.', 5)
]
cursor.executemany('''
INSERT INTO categories (parent_id, name_en, name_ar, slug, description_en, description_ar, display_order)
VALUES (?, ?, ?, ?, ?, ?, ?);
''', categories)

# Seed Applications
apps = [
    ('High-Rise Commercial Towers', 'الأبراج والمباني الشاهقة', 'high-rise', 'apartment'),
    ('Bridges & Viaducts', 'الجسور والتقاطعات المرورية', 'bridges', 'bridge'),
    ('Facade & Exterior Access', 'أعمال الواجهات والتشطيبات', 'facades', 'view_quilt'),
    ('Heavy Infrastructure & Metros', 'مشاريع البنية التحتية والقطارات', 'infrastructure', 'subway'),
    ('Industrial, Petrochemical & LNG', 'المجمعات الصناعية والنفط والغاز', 'industrial', 'factory'),
    ('Water Reservoirs & Tanks', 'خزانات المياه الدائرية ومحطات التحلية', 'tanks-circular', 'water_drop'),
    ('Precast Boundary & Modular', 'الأسوار الأمنية والخرسانة مسبقة الصنع', 'precast', 'foundation')
]
cursor.executemany('''
INSERT INTO applications (name_en, name_ar, slug, icon_name)
VALUES (?, ?, ?, ?);
''', apps)

# Seed Products (6 Initial Local Products + 6 European / ULMA Products)
products = [
    # 1. Cuplock Scaffolding (Local)
    (
        1, 1, 1, 'SMC-CP-01', 'cuplock-scaffolding',
        'Cuplock Scaffolding System', 'نظام سقالات الكابلوك المعياري',
        'The Kingdom’s Proven Modular Access & Shoring Backbone', 'العمود الفقري المعتمد للسقالات المعمارية والتدعيم بالمملكة',
        'A modular steel scaffolding system using cup-type locking connections between standards and ledgers, fabricated in Riyadh according to SASO standards.',
        'نظام سقالات فولاذي تركيبي يعتمد على آلية أقفال الأكواب الدائرية المتينة لربط القوائم والأذرع الأفقية، مصنع بالرياض وفق معايير الهيئة السعودية للمواصفات.',
        'A heavy-duty, fast-erecting multi-point node scaffolding system manufactured from high-yield structural steel tubes.',
        'نظام سقالات عالي التحمل يعتمد على عقد التثبيت بالأكواب السريعة، مصنع من أنابيب الفولاذ الإنشائي عالي المقاومة.',
        'Temporary access, safe working platforms, facade maintenance, and medium-to-heavy structural falsework support during concrete casting.',
        'توفير منصات عمل آمنة، صيانة الواجهات، والتدعيم الإنشائي الموثوق خلال مراحل صب الخرسانة المسلحة.',
        'Standards incorporate fixed bottom cups welded at 500mm intervals. Loose top cups slide down and rotate over ledger blade ends, locking up to four horizontal components with a single hammer blow.',
        'تتضمن القوائم أكواباً سفلية ملحومة كل 500 مم، وينزلق كوب علوي متحرك فوق نهايات العوارض ليقفل حتى 4 اتجاهات بضربة مطرقة واحدة.',
        json.dumps(["Rapid hammer-strike node locking without loose bolts", "High yield S355 steel with hot-dip galvanizing", "Zero maintenance wear nodes tested to SASO 2874", "High local inventory available for 24-hr site delivery"]),
        json.dumps(["إغلاق سريع بضربة مطرقة دون مسامير مفقودة", "فولاذ عالي المقاومة مجلفن بالغمس الساخن", "عقد مقاومة للاهتراء معتمدة ومختبرة وفق ساسو", "مخزون ضخم جاهز للتوريد الفوري خلال 24 ساعة"]),
        json.dumps(["Standard (Vertical)", "Ledger (Horizontal)", "Transom", "Base Jack", "Swivel Face Brace", "Steel Walkway Planks"]),
        json.dumps(["قائم رأسي", "ذراع أفقي", "عارضة أرضية", "قاعدة لولبية قابلة للضبط", "مقص تثبيت قطري", "ألواح مشاية فولاذية"]),
        json.dumps({"tube_diameter": "48.3 mm", "wall_thickness": "3.2 mm / 3.6 mm", "steel_grade": "S275J2H / S355JR", "node_capacity": "58 kN vertical load", "coating": "Hot-Dip Galvanized ≥ 65 µm", "saso_norm": "SASO 2874 / BS 1139"}),
        1, 1, json.dumps(["KSA", "GCC", "MENA", "AFRICA"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAK86M6MuuAJy4gzOqYKqV9iT2-XutMwbYgGDKinXR2Lc1VDSYKP3O1a-Xk_XmUGLAzlN87_CMJyNzOI1DpeqIX-Fnbz6hHuf4LRDyomFRX1ZkoJWasu32WqNZlEFMthG-rHc86VnPptcbAeGEuV0R4qpFiEAqxHDU1d739wfB8OfSx04FWmdeXMiDCrCYIdak38mI6T9KbxgmvUcKtWlaSyTKWaTXXgCkGxFBplLyH-83p9JdA05Ka',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAK86M6MuuAJy4gzOqYKqV9iT2-XutMwbYgGDKinXR2Lc1VDSYKP3O1a-Xk_XmUGLAzlN87_CMJyNzOI1DpeqIX-Fnbz6hHuf4LRDyomFRX1ZkoJWasu32WqNZlEFMthG-rHc86VnPptcbAeGEuV0R4qpFiEAqxHDU1d739wfB8OfSx04FWmdeXMiDCrCYIdak38mI6T9KbxgmvUcKtWlaSyTKWaTXXgCkGxFBplLyH-83p9JdA05Ka',
        '/assets/drawings/cuplock-technical.pdf', '/assets/brochures/sm-cuplock.pdf', 'PUBLISHED', 1, 1
    ),
    # 2. Manhole Systems (Local)
    (
        1, 1, 5, 'SMC-MH-02', 'manhole-systems',
        'Manhole Formwork Systems', 'نظام قوالب المناهل وغرف التفتيش',
        'Engineered Reusable Steel Moulds for Underground Infrastructure', 'قوالب فولاذية متطورة قابلة لإعادة الاستخدام لغرف الخدمات والسيول',
        'A reusable forming and construction solution manufactured in KSA for pouring square, rectangular, and round concrete manhole structures.',
        'حل متكامل مصنع محلياً لصب غرف التفتيش وخطوط الخدمات الخرسانية بالأشكال المربعة والدائرية بأعلى دقة.',
        'Rigid external steel shuttering panels paired with a proprietary collapsible internal core mechanism for high-frequency municipal utility casting.',
        'ألواح فولاذية خارجية عالية الصلابة مع قلب داخلي قابل للانكماش السريع لصب غرف الخدمات البلدية المتكررة.',
        'Underground municipal stormwater drainage, electrical cable vaults, sanitary sewer chambers, and telecom duct banks.',
        'شبكات تصريف مياه الأمطار والسيول، غرف سحب الكابلات الكهربائية، شبكات الصرف الصحي، ومسارات الاتصالات.',
        'Inner core contracts inward via corner toggle hinges or central turnbuckles once concrete reaches initial set, allowing the assembly to be stripped and craned in minutes.',
        'ينكمش القلب الداخلي نحو المركز بواسطة مفصلات ركنية ومشدات ميكانيكية فور تصلب الخرسانة الأولي، مما يتيح فك القالب ورفعه بالرافعة خلال دقائق.',
        json.dumps(["Zero plywood waste across 200+ pours", "Collapsible corner keys for 15-minute striking", "Hydrostatic concrete pressure capacity up to 60 kN/m²", "Bespoke dimensions matching MOMRA & NWC specs"]),
        json.dumps(["انعدام هدر الخشب عبر أكثر من 200 صبة متتالية", "زوايا مفصلية تنكمش للفك خلال 15 دقيقة فقط", "تحمل ضغط خرسانة هيدروستاتيكي حتى 60 كيلو نيوتن/م²", "أبعاد تفصيلية معتمدة من وزارة الشؤون البلدية وشركة المياه الوطنية"]),
        json.dumps(["Collapsible Core Panels", "Rigid Outer Corner Units", "Walers & Alignment Braces", "Tie-Rod Assemblies", "Lifting Eyes"]),
        json.dumps(["ألواح القلب الداخلي المنكمش", "وحدات الزوايا الخارجية", "كمرات تدعيم وأذرع موازنة", "مسامير الشد والربط", "نقاط الرفع المعيارية"]),
        json.dumps({"steel_face_thickness": "5.0 mm plate", "frame_profile": "100x50 mm boxed channel", "max_pour_height": "4.5 m single lift", "permissible_pressure": "60 kN/m²", "striking_mechanism": "Mechanical ratchet toggle"}),
        1, 1, json.dumps(["KSA", "GCC", "MENA"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC2kfWsTqf3RyrcXtZqDqklJXF7zN7Qh8Tdb7Gp2Wb0TUv6-bHKkxmqSivCjXt1UAd-Gza3Nyr78s5ceC-X2Mig-8eaAygnApLm7APDQ-StkPmfKMSCvtLjQ7MK-51Vfz3YTnrmWcML70CnBekhmSlfkm6U-zLDEaeaOlnceNVgjNfQXP4rztE0SlYUFqd6pe8H3CokK2elWKkIB_890g7qgHzuaT1isnTZZ7KCwxRAD1-GD-V0ZJ4M',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC2kfWsTqf3RyrcXtZqDqklJXF7zN7Qh8Tdb7Gp2Wb0TUv6-bHKkxmqSivCjXt1UAd-Gza3Nyr78s5ceC-X2Mig-8eaAygnApLm7APDQ-StkPmfKMSCvtLjQ7MK-51Vfz3YTnrmWcML70CnBekhmSlfkm6U-zLDEaeaOlnceNVgjNfQXP4rztE0SlYUFqd6pe8H3CokK2elWKkIB_890g7qgHzuaT1isnTZZ7KCwxRAD1-GD-V0ZJ4M',
        '/assets/drawings/manhole-formwork.pdf', '/assets/brochures/sm-manhole.pdf', 'PUBLISHED', 1, 2
    ),
    # 3. Circular Column Systems (Local)
    (
        1, 1, 2, 'SMC-CC-03', 'circular-column-systems',
        'Circular Column Systems', 'نظام قوالب الأعمدة الدائرية',
        'Precision Rolled Steel Halves for Flawless Fair-Faced Geometry', 'أنصاف قوالب فولاذية مدرفلة للأعمدة الخرسانية الدائرية الصقيلة',
        'Precision rolled two-half steel shuttering systems manufactured in Saudi Arabia for casting smooth, fair-faced circular columns.',
        'نظام شدات فولاذية نصف دائرية مصنعة محلياً بأعلى دقة لصب الأعمدة الأسطوانية بأسطح معمارية ناعمة.',
        'Heavy cylindrical steel shells with integrated perimeter connection flanges and alignment wedges, handling rapid vertical concrete placement.',
        'قوالب أسطوانية مسبوكة من صفائح فولاذية ثقيلة ذات حواف ربط محيطية ومفاتيح إسفينية تضمن إحكام الإغلاق.',
        'Commercial tower entrance columns, metro viaduct piers, high-ceiling architectural atriums, and infrastructure bridge supports.',
        'أعمدة مداخل الأبراج التجارية، ركائز جسور المترو، الردهات المعمارية الشاهقة، وأعمدة الجسور العلوية.',
        'Two pre-curved steel half-shells bolt or wedge together securely. Concrete is placed in a single continuous lift, producing uniform fair-faced results without tie holes across the face.',
        'يتم جمع نصفي القالب بروابط إسفينية أو براغي محيطية سريعة. تصب الخرسانة دفعة واحدة وتنتج سطحاً صقيلاً خالياً من ثقوب مسامير الزرجينة.',
        json.dumps(["Architectural Class A mirror-smooth concrete surface", "No internal through-ties required across column diameter", "Integrated pouring funnel and working platform brackets", "Available in stock from Ø300mm to Ø2000mm"]),
        json.dumps(["أسطح خرسانية فائقة النعومة Class A دون تشطيب إضافي", "لا تتطلب زراجين داخلية عبر جسم العمود إطلاقاً", "منصات صب مدمجة وقمع توجيه الخرسانة بأعلى معايير السلامة", "متوفرة بمخازننا من قطر 300 مم حتى 2000 مم"]),
        json.dumps(["Rolled Semi-Cylindrical Shells", "Quick-Connect Wedge Clamps", "Push-Pull Plumbing Struts", "Integrated Access Ladder & Platform"]),
        json.dumps(["أنصاف أسطوانية مدرفلة", "قمطات إسفينية سريعة الإغلاق", "دعامات ضبط الرأسية ثنائية الاتجاه", "سلم ومنصة عمل معتمدة"]),
        json.dumps({"diameter_range": "300 mm – 2000 mm", "standard_heights": "0.5m, 1.0m, 1.5m, 2.0m, 3.0m", "max_pour_pressure": "100 kN/m² hydrostatic", "shell_thickness": "4.0 mm – 6.0 mm S355 steel"}),
        1, 1, json.dumps(["KSA", "GCC", "MENA"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCPpPRvsaITexi7WjXXcodbcZ31DnzhTHP1Di_o0IALlPuTnm7Io9XGNemJM5f8ZNqJ5LqtIN1ZVMtgpspOqHRxzqmJJp9p1yLXOWlQDnSMwnFfX0gtphSIYIraAHcteDk1JLY8tu2JkyZMNA8kIJmzRbsJNHcyCaRW8-dXsE52lk6WB1nuAhIPLtJt6VzFT_yTMXoDK1deQ35KITXQMpe7yUWft2EIAKbaWrwdl22jhL-YhmI-gt44',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCPpPRvsaITexi7WjXXcodbcZ31DnzhTHP1Di_o0IALlPuTnm7Io9XGNemJM5f8ZNqJ5LqtIN1ZVMtgpspOqHRxzqmJJp9p1yLXOWlQDnSMwnFfX0gtphSIYIraAHcteDk1JLY8tu2JkyZMNA8kIJmzRbsJNHcyCaRW8-dXsE52lk6WB1nuAhIPLtJt6VzFT_yTMXoDK1deQ35KITXQMpe7yUWft2EIAKbaWrwdl22jhL-YhmI-gt44',
        '/assets/drawings/circular-column.pdf', '/assets/brochures/sm-circular.pdf', 'PUBLISHED', 1, 3
    ),
    # 4. Precast Panels Moulds (Local)
    (
        1, 1, 5, 'SMC-PC-04', 'precast-panels',
        'Precast Concrete Panel Moulds', 'قوالب الألواح الخرسانية مسبقة الصب',
        'Industrial Tilting Tables and Battery Moulds Built for Off-Site Speed', 'طاولات قلابة وقوالب بطاريات صناعية للتصنيع الخرساني المسبق',
        'Factory-produced heavy industrial moulds and tilting beds engineered in KSA for repetitive precast concrete wall elements and boundary enclosures.',
        'قوالب وطاولات هيدروليكية قلابة مصنعة بالكامل بالمملكة لإنتاج عناصر الحوائط والأسوار الخرسانية مسبقة الصب.',
        'Machined steel casting beds with integrated magnetic side formers, heating pipe conduits, and hydraulic tilt mechanisms.',
        'أسرة صب فولاذية دقيقة التشغيل مجهزة بحواجز مغناطيسية وتمديدات تسخين ومكابس هيدروليكية لرفع الألواح دون إجهاد.',
        'National border security walls, modular housing panels, warehouse tilt-up panels, and civil retaining walls.',
        'الأسوار الأمنية الحدودية، الوحدات السكنية المعيارية، حوائط المستودعات، وحوائط الاستناد مسبقة الصنع.',
        'Rebar cages are placed onto the polished steel deck. Concrete is poured, vibrated via integral high-frequency vibrators, cured, and tilted up to 80° for safe crane demoulding.',
        'يوضع حديد التسليح على السطح الفولاذي المصقول وتصب الخرسانة مع هزازات ترددية مدمجة، ثم تمال الطاولة هيدروليكياً حتى 80 درجة لتفريغ اللوح بسلاسة.',
        json.dumps(["Sub-millimeter flatness tolerances across 14-meter table lengths", "Hydraulic tilting up to 80° preventing green-concrete cracking", "Adaptable magnetic edge shutters for infinite panel widths", "Fabricated with domestic high-grade steel"]),
        json.dumps(["استواء سطحي دقيق بأقل من ملليمتر على امتداد 14 متراً", "إمالة هيدروليكية سلسة حتى 80 درجة تمنع تشقق الخرسانة الطرية", "حواجز جانبية مغناطيسية تتيح تعديل سماكة وعرض اللوح بحرية", "تصنيع وطني بأجود أنواع الفولاذ الإنشائي"]),
        json.dumps(["Polished Steel Decking Table", "Hydraulic Lift Cylinders", "Magnetic Side Rails", "Compaction Vibration System", "Thermal Curing Tubes"]),
        json.dumps(["طاولة الصب الفولاذية المصقولة", "اسطوانات الرفع الهيدروليكية", "حواجز التثبيت المغناطيسية", "منظومة الهز الترددي", "مواسير الإنضاج الحراري"]),
        json.dumps({"standard_table_width": "3.5 m – 4.5 m", "standard_length": "12 m – 100 m", "max_capacity": "1,000 kg/m²", "tilting_angle": "0° to 83° hydraulic", "deck_plate": "8.0 mm machined plate"}),
        1, 1, json.dumps(["KSA", "GCC"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB7xYSm6a37qzLw7gSZUoDkLBnFJaMULEpxWgThuS7wnt_qnGc8Xmoxv1UiZ6wac6o38Xl7ATSX-mN0Ay2DYX8G75uYjLWPSvbIqJJL_b73TmBUtp72_a_jZTNfOW409KV20R_5FOuXDsdJumsTMrurGg51fcvcxEHnc_oQ73EfYotAU89PJ9CiAoHCjSl5o8tPfZRK_xNkPgtzDXKmXT6BcYJ9EbjSWwPFliSeMvTIJVMD49bm-zz3',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB7xYSm6a37qzLw7gSZUoDkLBnFJaMULEpxWgThuS7wnt_qnGc8Xmoxv1UiZ6wac6o38Xl7ATSX-mN0Ay2DYX8G75uYjLWPSvbIqJJL_b73TmBUtp72_a_jZTNfOW409KV20R_5FOuXDsdJumsTMrurGg51fcvcxEHnc_oQ73EfYotAU89PJ9CiAoHCjSl5o8tPfZRK_xNkPgtzDXKmXT6BcYJ9EbjSWwPFliSeMvTIJVMD49bm-zz3',
        '/assets/drawings/precast-table.pdf', '/assets/brochures/sm-precast.pdf', 'PUBLISHED', 0, 4
    ),
    # 5. Grinder Steel Shutter (Local)
    (
        1, 1, 2, 'SMC-GS-05', 'grinder-steel-shutter',
        'Grinder Steel Shutter', 'شدات جريندر الفولاذية الثقيلة',
        'Heavy-Duty Structural Steel Shuttering for Massive Repetitive Casting', 'شدات معدنية فائقة الصلابة مصممة لمئات التكرارات في المنشآت الضخمة',
        'An extra-heavy duty fabricated steel shutter and formwork system engineered for non-deflecting repetitive casting in major Saudi civil works.',
        'نظام شدات فولاذية متينة مصنعة للأعمال الشاقة تتحمل دورات صب متكررة لمئات المرات دون أي انحناء.',
        'High-moment steel walers welded directly to 5mm faceplates with robust external taper-tie connection points.',
        'كمرات فولاذية جسيمة ملحومة مباشرة بصفائح 5 مم مع نقاط شد خارجية تضمن مقاومة الضغوط القصوى.',
        'Massive retaining walls, deep basement perimeters, strategic water storage reservoirs, and power plant substations.',
        'الجدران الاستنادية الضخمة، جدران الأقبية العميقة، خزانات المياه الاستراتيجية، ومحطات تحويل الطاقة.',
        'Large modular crane-handled gangs are coupled together with high-shear pins. Concrete is placed in high-velocity lifts without risk of face bulge.',
        'تجمع الألواح في مجموعات كبيرة ترفع بالرافعة وتثبت بمسامير قص متينة لتتحمل سرعات صب خرساني عالية بأمان تام.',
        json.dumps(["Over 300 successful pour reuses with minimal maintenance", "Eliminates surface plywood replacement costs", "Engineered for 90 kN/m² hydrostatic concrete pressure", "Complete local parts availability in Riyadh and Dammam"]),
        json.dumps(["أكثر من 300 صبة متكررة مع صيانة دورية ميسرة", "إلغاء تكاليف تغيير الخشب الرقائقي التالف نهائياً", "مصممة لتحمل ضغط خرسانة هائل حتى 90 كيلو نيوتن/م²", "قطع الغيار متوفرة فوراً في مستودعات الرياض والدمام"]),
        json.dumps(["All-Steel Shutter Panels", "Integrated Stiffener Walers", "Heavy-Duty Tie Wedges", "Crane Lifting Hooks"]),
        json.dumps(["ألواح الشدات الفولاذية بالكامل", "كمرات التقوية المدمجة", "أوتاد الشد والتثبيت القوي", "خطافات الرفع الآمن بالرافعة"]),
        json.dumps({"faceplate_steel": "5.0 mm S355 Structural Steel", "frame_depth": "150 mm welded profile", "max_permissible_pressure": "90 kN/m²", "crane_handling": "Integrated 2.5t lift lugs"}),
        1, 1, json.dumps(["KSA", "GCC", "MENA"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAljqfGaiddD4t-soTJzOxaMeoVQM-HQhgH9rj_1FFK0jYVsir_Vylbkhofb4OYLb0ix9hsmsDK0bez8DP2d7D8E5YXS9kL1qciCqbYHQAnwfPiqYY3zXKHozjJY8uc0Oq95NxHnUoQMUgXp9Kc0BlpRCYtNxY43iVr0rvONEU_DFCX325PZh1DH8veI4InJ25vMxqZWnKAH-nB8d0Z0UI3ZkQdQIIRdJfS6k6muaqLlwI2NKO52Wif',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAljqfGaiddD4t-soTJzOxaMeoVQM-HQhgH9rj_1FFK0jYVsir_Vylbkhofb4OYLb0ix9hsmsDK0bez8DP2d7D8E5YXS9kL1qciCqbYHQAnwfPiqYY3zXKHozjJY8uc0Oq95NxHnUoQMUgXp9Kc0BlpRCYtNxY43iVr0rvONEU_DFCX325PZh1DH8veI4InJ25vMxqZWnKAH-nB8d0Z0UI3ZkQdQIIRdJfS6k6muaqLlwI2NKO52Wif',
        '/assets/drawings/grinder-shutter.pdf', '/assets/brochures/sm-grinder.pdf', 'PUBLISHED', 0, 5
    ),
    # 6. Piers Formwork Solutions (Local)
    (
        1, 1, 2, 'SMC-PF-06', 'piers-formwork',
        'Bespoke Highway Pier Systems', 'نظام قوالب ركائز الجسور والهامات',
        'Bespoke Heavy-Gauge Steel Shuttering for Bridges and Interchange Pylons', 'قوالب فولاذية ثقيلة مصممة خصيصاً لأعمدة الجسور العلوية وتقاطعات الطرق',
        'A customized structural steel shuttering system manufactured for casting reinforced-concrete bridge piers, viaduct columns, and flared hammerhead caps.',
        'نظام شدات فولاذية متخصصة مصممة لصب أعمدة الجسور وركائز التقاطعات العلوية وهامات التحميل المعقدة.',
        'Multi-segment modular steel forms engineered to match project-specific geometric curvature and cross-sectional tapers.',
        'قوالب فولاذية مجزأة تصنع هندسياً لتطابق المنحنيات المعمارية وزوايا الانحدار الخاصة بكل جسر.',
        'High-speed rail viaducts, highway interchange flyovers, marine bridge pylons, and heavy infrastructure overpasses.',
        'جسور قطارات النقل السريع، تقاطعات الطرق السريعة العلوية، ركائز الجسور البحرية، والأنفاق المعلقة.',
        'Curved panels are rigged into place around heavy reinforcing cages. Anchor ties and integral working access brackets enable safe, monolithic casting in 4m to 8m vertical segments.',
        'تثبت الألواح حول قفص التسليح وتغلق بنقاط ربط جسيمة ومنصات عمل محيطية متكاملة لصب قطاعات بارتفاعات تصل إلى 8 أمتار.',
        json.dumps(["Engineered FEA stress analysis for severe desert wind gust dynamics", "Full pre-assembly verification at Riyadh plant prior to dispatch", "Self-supporting tie-free options for signature architectural bridge piers", "Seamless compatibility with heavy shoring falsework"]),
        json.dumps(["تحليل إجهادات هندسي متقدم لمقاومة العواصف والرياح الشديدة", "تجميع تجريبي واختبار مسبق في مصنع الرياض قبل الشحن للموقع", "خيارات تدعيم ذاتي بدون زراجين نافذة للأعمدة الأيقونية", "توافق تام مع أبراج التدعيم الثقيل وأنظمة أولما"]),
        json.dumps(["Tapered Steel Pier Shells", "Hammerhead Soffit Brackets", "Heavy Tie Rods & Walers", "Perimeter Working Deck", "Access Ladderway"]),
        json.dumps(["ألواح الركيزة الفولاذية المتدرجة", "كوابيل هامات الجسور السفلية", "مسامير الشد والكمرات المقواة", "منصة عمل محيطية", "مسار سلم آمن"]),
        json.dumps({"steel_specification": "S355JR high-yield steel", "pier_height_supported": "Up to 40 m segmented", "lateral_pressure": "120 kN/m² hydrostatic", "fabrication_tolerance": "± 1.5 mm laser verified"}),
        1, 1, json.dumps(["KSA", "GCC", "MENA"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAYbBvHKzpzGtxXsGspX7V3COYTh6u6-b1AokcupmhauNxYf05P2ksd_2CUKv8ibQOjnpSqbzIFGpvxW8TydjfV5r08lYX6QKUQJBDFLMWAjUK9uQgamb4cJNEnuQvoIhO8tfbdyjkOVEgbQDtnwhGFGEKhkE1MjM7BPYD1qzuzdJRn7ETh1Tb8UvTVZICrP1qWwO7YKoXNajuoAn46_yO1jja8Y7K_wg0-LkRL_RG899IRZSdT5Aaz',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAYbBvHKzpzGtxXsGspX7V3COYTh6u6-b1AokcupmhauNxYf05P2ksd_2CUKv8ibQOjnpSqbzIFGpvxW8TydjfV5r08lYX6QKUQJBDFLMWAjUK9uQgamb4cJNEnuQvoIhO8tfbdyjkOVEgbQDtnwhGFGEKhkE1MjM7BPYD1qzuzdJRn7ETh1Tb8UvTVZICrP1qWwO7YKoXNajuoAn46_yO1jja8Y7K_wg0-LkRL_RG899IRZSdT5Aaz',
        '/assets/drawings/pier-formwork.pdf', '/assets/brochures/sm-piers.pdf', 'PUBLISHED', 1, 6
    ),

    # 7. ULMA ORMA Modular Formwork (European)
    (
        2, 2, 2, 'ULM-ORM-01', 'ulma-formwork',
        'ULMA ORMA Modular Formwork', 'نظام شدات أولما أورما المعيارية للحوائط',
        'European Benchmark for High-Efficiency Concrete Wall & Column Construction', 'المعيار الأوروبي الرائد لشدات الحوائط والأعمدة الخرسانية عالية الكفاءة',
        'An engineered modular panel formwork system developed by ULMA in Spain, designed for rapid crane-handled forming of large concrete wall surfaces.',
        'نظام شدات معيارية أوروبي متقدم من شركة أولما الإسبانية مخصص لصب الحوائط الكبيرة والأعمدة ورفعها بالرافعة بأقصى سرعة.',
        'High-strength perimeter steel frame with reinforced corners enclosing 21mm Finnish birch phenolic plywood face, joined by a single-strike BFD clamp.',
        'إطار فولاذي عالي المقاومة بزوايا مقواة يحيط بخشب فنلندي فينولي 21 مم، يتم ربطه برابط BFD السريع بضربة واحدة.',
        'High-rise building cores, shear walls, retaining structures, bridge abutments, and underground infrastructure.',
        'أبراج المباني الشاهقة، حوائط القص، الجدران الاستنادية، دعامات الجسور، ومشاريع الأنفاق والبنية التحتية.',
        'Panels join rapidly with the multi-function BFD clamp which aligns, stiffens, and tightly locks adjacent panels in a single motion, handling 80 kN/m² concrete pressure.',
        'ترتبط الألواح برابط BFD متعدد الوظائف الذي يضبط المحاذاة ويشد الوصلة بحركة واحدة لتقاوم ضغط خرسانة حتى 80 كيلو نيوتن/م².',
        json.dumps(["Certified to EN 12812 European temporary works norms", "Only 2 tie rods required for 3.3m high panels", "BFD clamp achieves panel connection and flush alignment simultaneously", "Extensive rental stock available across KSA"]),
        json.dumps(["معتمد ومطابق للمعايير الأوروبية للشدات EN 12812", "يتطلب مربطين فقط للارتفاع الكامل 3.3 متراً", "رابط BFD يحقق التوصيل والمحاذاة التامة بضغطة واحدة", "أسطول تأجير ضخم متاح بجميع مستودعات المملكة"]),
        json.dumps(["ORMA Panel Elements (3.3m & 2.7m)", "BFD Quick Coupling Clamps", "DW15 / DW20 Tie Systems", "Push-Pull Plumbing Props", "Pouring Platform Brackets"]),
        json.dumps(["ألواح أورما الأساسية (3.3م و 2.7م)", "قمطات الربط السريع BFD", "مجموعة زراجين الربط DW15/20", "دعامات ضبط الشاقولية", "كوابيل منصات الصب الآمنة"]),
        json.dumps({"max_concrete_pressure": "80 kN/m²", "plywood_spec": "21 mm 100% Birch Plywood 220 g/m² film", "panel_heights": "3.3 m, 2.7 m, 1.2 m", "panel_widths": "0.3 m to 2.4 m", "euro_code": "EN 12812 / DIN 18218"}),
        1, 1, json.dumps(["KSA", "GCC", "MENA", "AFRICA"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCcmLnQUw-ETsqO-WY8RhKH4bBo-nVJWxFXw-4gIcW_XsMx3TpUqOP0mIXif70KMJlEv0Rs3vK6ow4QDJRdoyG9CSZrfQYRd2_8AW88PwtIcO161T6iGyeklXtiQFt78LHtsKtiH3p37JbHuhDOmax4O_1lPcBWbs6JN4j9ISdqjhjDrOEVJP-xX8R0t7ZInw1ZGonjDpgcZDXn_cY0bbj7G0RoJjsAwSAPFrm0bI7LaXsc7oz9IrpB',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCcmLnQUw-ETsqO-WY8RhKH4bBo-nVJWxFXw-4gIcW_XsMx3TpUqOP0mIXif70KMJlEv0Rs3vK6ow4QDJRdoyG9CSZrfQYRd2_8AW88PwtIcO161T6iGyeklXtiQFt78LHtsKtiH3p37JbHuhDOmax4O_1lPcBWbs6JN4j9ISdqjhjDrOEVJP-xX8R0t7ZInw1ZGonjDpgcZDXn_cY0bbj7G0RoJjsAwSAPFrm0bI7LaXsc7oz9IrpB',
        '/assets/drawings/ulma-orma.pdf', '/assets/brochures/ulma-orma.pdf', 'PUBLISHED', 1, 7
    ),
    # 8. ULMA BRIO Ringlock (European)
    (
        2, 2, 1, 'ULM-BRIO-02', 'ulma-brio-ringlock',
        'ULMA BRIO Ringlock Scaffolding', 'نظام سقالات أولما بريو رينج لوك متعددة الاتجاهات',
        'Gold Standard European Multidirectional Scaffolding for Access & Shoring', 'المعيار الذهبي الأوروبي للسقالات متعددة الاتجاهات للواجهات وأبراج التدعيم',
        'A certified multidirectional ringlock scaffolding system designed and certified according to European standards EN 12810-1/2 and EN 12811-1/2/3.',
        'نظام سقالات متطور معتمد وفق أعلى المعايير الأوروبية EN 12810/12811 يوفر حلول الوصول والتدعيم الأكثر أماناً في العالم.',
        'Standards equipped with patented 8-hole connection rosettes at 500mm spacing, accepting ledger and diagonal brace heads with captive wedge locks.',
        'قوائم مجهزة بقرص الوردة الحاصل على براءة اختراع بثمانية ثقوب ربط كل 500 مم، تستقبل رؤوس العوارض والمقصات بإسفين قفل ذاتي.',
        'Architectural facades, petrochemical refineries, industrial boiler maintenance, complex curved structures, and public temporary pedestrian bridges.',
        'واجهات المباني المعقدة، مصافي البتروكيماويات، صيانة الغلايات الصناعية، المنشآت المنحنية، والجسور المؤقتة للمشاة.',
        'Ledger cast ends slide over the rosette disc. The integrated captive steel wedge is driven through the matching opening and secured with a single hammer blow.',
        'تنزلق رؤوس العوارض فوق فتحات قرص الوردة، ويتم تثبيت الإسفين الفولاذي المدمج بضربة مطرقة محكمة تمنع الاهتزاز تحت أي أحمال.',
        json.dumps(["Certified under AENOR Product Certification according to EN 12810/11", "Supports up to 8 connections at a single node without geometric interference", "High leg capacity up to 75 kN when configured as heavy shoring", "Anti-tilt non-slip perforated steel decking"]),
        json.dumps(["حاصل على شهادة الجودة الإسبانية والأوروبية AENOR وفق EN 12810/11", "ربط حتى 8 عناصر في النقطة الواحدة بزوايا متعددة بحرية تامة", "قدرة تحمل تصل إلى 75 كيلو نيوتن للقائم عند استخدامه كبرج تدعيم", "ألواح معدنية مثقبة مانعة للانزلاق ومقاومة للرياح"]),
        json.dumps(["BRIO Standard with Rosette", "BRIO Ledger with Wedge", "Diagonal Brace", "Steel Walkway Deck", "Aluminum Access Trapdoor Ladder", "Toe Boards"]),
        json.dumps(["قائم بريو بقرص الوردة", "ذراع بريو بالإسفين المدمج", "مقص قطري", "ألواح مشايات فولاذية", "سلم ألومنيوم مع فتحة عبور", "حواجز حماية سفلية"]),
        json.dumps({"tube_specs": "Ø 48.3 mm x 3.2 mm S355 steel", "rosette_spacing": "500 mm regular interval", "hot_dip_galv": "≥ 75 µm thickness", "load_class": "Class 6 heavy industrial (6.0 kN/m²)", "certification": "AENOR / EN 12810 / EN 12811"}),
        1, 1, json.dumps(["KSA", "GCC", "MENA", "AFRICA"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBJeJEHhwIFGYpFcSTKzIf3nbzTOuTh2JuQU5LP2sTWLLG4bVvIKK2OT7cRCKg-0LPRHHrJaa5qX-hPrSGRCmdSdzUTHlGvualr9rAidWtBhBL2MvDMxeDB4EnxO5ygbgoWpvbPK6FvjonWupnuija9YWvyurp-zHImBn6TfdXViDh9JXWpG6Dt7OZyvjyMMsK5-iwOprAeMr3-rpAFhHl99kwhsdx4rj5LtvhI98qk_RTnia7_wP-Q',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBJeJEHhwIFGYpFcSTKzIf3nbzTOuTh2JuQU5LP2sTWLLG4bVvIKK2OT7cRCKg-0LPRHHrJaa5qX-hPrSGRCmdSdzUTHlGvualr9rAidWtBhBL2MvDMxeDB4EnxO5ygbgoWpvbPK6FvjonWupnuija9YWvyurp-zHImBn6TfdXViDh9JXWpG6Dt7OZyvjyMMsK5-iwOprAeMr3-rpAFhHl99kwhsdx4rj5LtvhI98qk_RTnia7_wP-Q',
        '/assets/drawings/ulma-brio.pdf', '/assets/brochures/ulma-brio.pdf', 'PUBLISHED', 1, 8
    ),
    # 9. ULMA Heavy Shoring MK & T-500 (European)
    (
        2, 2, 3, 'ULM-MK-03', 'ulma-heavy-shoring',
        'ULMA Heavy Shoring Systems (MK / T-500)', 'أبراج التدعيم الثقيل أولما إم كيه و تي-500',
        'Extreme-Capacity Structural Falsework Towers Supporting Up to 500 kN Per Leg', 'أبراج تدعيم إنشائية جبارة تتحمل حتى 500 كيلو نيوتن لكل قائم للجسور الكبرى',
        'A high-load modular shoring and truss falsework system engineered for heavy civil concrete structures, viaduct spans, and deep transfer slabs.',
        'نظام أبراج تدعيم ثقيل فائق القدرة مصمم للأعمال الإنشائية الكبرى وأسقف الجسور والبحور الخرسانية الضخمة.',
        'Modular MK structural steel walers combined into independent towers, gantry falsework frames, or launching carriages.',
        'كمرات فولاذية إنشائية متعددة الاستخدامات تشكل أبراجاً مستقلة أو بوابات تدعيم مفتوحة لحركة المرور السفلية.',
        'Balanced cantilever bridges, post-tensioned flyover spans, mega-transfer beam supports, and tunnel portal casting.',
        'جسور الكابول المتوازن، أسقف التقاطعات مسبقة الإجهاد، كمرات التحويل الخرسانية العملاقة، وبوابات الأنفاق.',
        'MK walers bolt together via standardized high-tensile connection plates. Hydraulic jacks at base or head allow controlled pre-loading and millimeter-accurate post-pour release.',
        'ترتبط كمرات MK بصفائح براغي عالية المقاومة، وتتيح المكابس الهيدروليكية التحكم الدقيق في الشد المسبق والفك السلس للشدة.',
        json.dumps(["Enormous load capacity from 250 kN up to 500 kN per shoring column", "Allows large traffic clearance spans underneath without closing live roads", "Complete structural calculation package signed by European and Saudi PEs", "Fully compatible with ULMA formwork decks"]),
        json.dumps(["قدرة تحمل فائقة تبدأ من 250 إلى 500 كيلو نيوتن للقائم الواحد", "تتيح فتح بحور عريضة لمرور السيارات أثناء الصب دون إغلاق الطرق", "حسابات إنشائية متكاملة معتمدة من مهندسين معتمدين بأوروبا والسعودية", "توافق هندسي كامل مع أنظمة شدات أسطح أولما"]),
        json.dumps(["MK Heavy Waler Beams", "Spindle Screw Jacks", "High-Load Base Plates", "Diagonal Bracing Trusses", "Hydraulic Lowering Units"]),
        json.dumps(["كمرات تدعيم MK الإنشائية", "روافع لولبية ثقيلة", "قواعد ارتكاز عالية التحمل", "جمالونات تثبيت قطرية", "وحدات تخفيض هيدروليكية"]),
        json.dumps({"leg_load_capacity": "Up to 500 kN / leg", "waler_profile": "Double UPN rolled channels back-to-back", "steel_quality": "S355 Structural Steel", "certifications": "EN 12812 / Eurocode 3"}),
        1, 1, json.dumps(["KSA", "GCC", "MENA"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCib-oPW7AQMKVvnIpwf0FGT3a-8m8c0n7u75hLBvGup5fvCR8mZpG9FAYdY9y4st9Z59Moq-fnR0oFIwoybJKjqjOyU1ZsevjvLIHLanyB_8en_W4T9y9h5mJk0PWyGNCvI17UJuuMrYGBElQ7kH31UCB2MJA3nbOqPW7WaMeVwoMsulq6utIh9oDMf3gC35VCw7KBeAz9-FEu9eTDLRFDN3pA_konwVklxntCDcd9sbnmco1D6BtC',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCib-oPW7AQMKVvnIpwf0FGT3a-8m8c0n7u75hLBvGup5fvCR8mZpG9FAYdY9y4st9Z59Moq-fnR0oFIwoybJKjqjOyU1ZsevjvLIHLanyB_8en_W4T9y9h5mJk0PWyGNCvI17UJuuMrYGBElQ7kH31UCB2MJA3nbOqPW7WaMeVwoMsulq6utIh9oDMf3gC35VCw7KBeAz9-FEu9eTDLRFDN3pA_konwVklxntCDcd9sbnmco1D6BtC',
        '/assets/drawings/ulma-mk.pdf', '/assets/brochures/ulma-mk.pdf', 'PUBLISHED', 1, 9
    ),
    # 10. Specialized Formwork (European)
    (
        2, 2, 4, 'ULM-CLB-04', 'specialized-formwork',
        'Specialized Climbing & Hydraulic Systems (ATR)', 'أنظمة الشدات المتخصصة والتسلق الهيدروليكي الآلي',
        'Crane-Independent Hydraulic Self-Climbing Formwork for Mega-Tower Cores', 'شدات تسلق ذاتي هيدروليكية مستقلة عن الرافعة البرجية للأبراج الشاهقة',
        'Crane-free hydraulic climbing systems and rail-guided perimeter safety screens designed for ultra-tall skyscraper towers and suspension pylons.',
        'منظومة تسلق ذاتية هيدروليكية بالكامل وشاشات حماية محيطية موجهة بمسارات سكك مصممة للأبراج شاهقة الارتفاع وأعمدة الجسور.',
        'Continuous mast rails anchored to cast concrete sleeves with synchronized hydraulic climbing cylinders moving multi-story platforms simultaneously.',
        'سكك توجيه مستمرة مثبتة بالخرسانة المتصلبة مع مكابس هيدروليكية متزامنة ترفع منصات متعددة الطوابق بلمسة زر واحدة.',
        'Skyscrapers exceeding 40 floors, high-wind airport control towers, telecommunications obelisks, and deep dam pylons.',
        'ناطحات السحاب التي تتجاوز 40 طابقاً، أبراج المراقبة الجوية، الصوامع الشاهقة، وركائز السدود الضخمة.',
        'Hydraulic power units advance the climbing rails upward into fresh anchor shoes, followed by the entire platform assembly in an automated cycle.',
        'تقوم المحطات الهيدروليكية برفع سكك التوجيه نحو مرابط التثبيت الجديدة، تليها المنصة والشدات كاملة في دورة رفع منتظمة لا تتعدى 20 دقيقة.',
        json.dumps(["Operates independently of tower crane availability, saving critical crane time", "Full weather and wind enclosure protecting crews up to extreme elevations", "Heavy concrete placing boom can be mounted directly onto the climbing mast", "Zero drop hazard with continuous mechanical pawl locking"]),
        json.dumps(["استقلالية تامة عن الرافعات البرجية مما يوفر ساعات تشغيل الرافعة الحيوية", "حماية محيطية كاملة من الرياح والأتربة تضمن سلامة العمال في الارتفاعات", "إمكانية تثبيت مضخة صب الخرسانة الذراعية مباشرة على صاري التسلق", "انعدام مخاطر السقوط بفضل سقاطات القفل الميكانيكي المستمر"]),
        json.dumps(["ATR Hydraulic Cylinders", "Guide Climbing Rails", "Anchor Cone Receptacles", "Multi-Tiered Work Platforms", "HWS Wind Protection Screens"]),
        json.dumps(["اسطوانات التسلق الهيدروليكية ATR", "سكك التوجيه الرأسية", "مخاريط التثبيت في الخرسانة", "منصات العمل متعددة المستويات", "شاشات حماية الرياح HWS"]),
        json.dumps({"cylinder_capacity": "100 kN lifting force", "stroke_length": "4.0 m single push", "wind_resistance": "Operational up to 72 km/h wind speeds", "enclosure": "Corrugated steel or perforated mesh"}),
        1, 1, json.dumps(["KSA", "GCC"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDxCllShrlx_Samv3YXsQ26ZWHeb0GzYj4HUHrJG9F5wbESvTr1pDjAPqqRgnMiDV1J0V5uIzFLJ_OXyAFi6G08d1sexletQ67DxTOEAH8Ug8maKl_U-JDkNmTCPf_UAZbZo5Bb4vixyg-v_LcKnkDnlEb86PNOTGYfrg3n9cWHFryRLihNJHzed6QhFVXu8D1ZY_cqkoHiGt4IWkSRc7_8yEZBqQJ_W-DFEZyfYv0BCtAlWSneZrKl',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDxCllShrlx_Samv3YXsQ26ZWHeb0GzYj4HUHrJG9F5wbESvTr1pDjAPqqRgnMiDV1J0V5uIzFLJ_OXyAFi6G08d1sexletQ67DxTOEAH8Ug8maKl_U-JDkNmTCPf_UAZbZo5Bb4vixyg-v_LcKnkDnlEb86PNOTGYfrg3n9cWHFryRLihNJHzed6QhFVXu8D1ZY_cqkoHiGt4IWkSRc7_8yEZBqQJ_W-DFEZyfYv0BCtAlWSneZrKl',
        '/assets/drawings/ulma-atr.pdf', '/assets/brochures/ulma-atr.pdf', 'PUBLISHED', 0, 10
    ),
    # 11. Project-Specific Engineering (European)
    (
        2, 2, 4, 'ULM-ENG-05', 'project-specific-engineering',
        'Project-Specific Engineered Solutions', 'الحلول الهندسية المخصصة للمشاريع الكبرى',
        'Turnkey Finite Element Analysis, BIM Coordination, and Custom Structural Weldments', 'دراسات إجهادات العناصر المحدودة FEA ونمذجة BIM وقطع تصنيع فولاذية مخصصة',
        'A comprehensive temporary works engineering service integrating 3D BIM clash detection, structural static calculations, and hybrid European-Saudi equipment assemblies.',
        'خدمة هندسية متكاملة للشدات المؤقتة تجمع بين النمذجة ثلاثية الأبعاد وفحص التعارضات والحسابات الإنشائية للحلول الهجينة.',
        'High-density structural calculations paired with custom fabricated transition brackets that bridge standard ULMA systems with site-specific architectural geometry.',
        'حسابات إجهادات دقيقة مع وصلات تصنيع فولاذية خاصة تدمج أنظمة أولما القياسية مع الأشكال المعمارية المعقدة للمشروع.',
        'Iconic cultural pavilions, stadium cantilevered canopies, tunnel carriage shuttering, and deep station cut-and-cover excavations.',
        'المتاحف والمراكز الثقافية الأيقونية، مظلات الملاعب الرياضية، عربات صب الأنفاق، ومحطات المترو العميقة.',
        'Engineers analyze structural drawings, build parametric 3D models in Navisworks/Revit, run FEA load simulations, and fabricate custom connection nodes at our Riyadh center.',
        'يقوم مهندسونا بتحليل المخططات، بناء نماذج ثلاثية الأبعاد ومحاكاة الأحمال بدقة، وتصنيع وصلات الربط الخاصة في مجمع الرياض.',
        json.dumps(["Full compliance with Saudi Building Code (SBC) and European Eurocodes", "Zero-clash digital twin submittals for tier-1 consultants", "PE-stamped calculation books accepted across NEOM, Red Sea, and Qiddiya", "On-site resident engineer supervision during erection"]),
        json.dumps(["مطابقة تامة لكود البناء السعودي (SBC) والكود الأوروبي Eurocodes", "مخططات توأمة رقمية معتمدة خالية من التعارضات للاستشاريين", "دفاتر حسابات إنشائية معتمدة في نيوم والبحر الأحمر والقدية", "تواجد مهندس مقيم للإشراف الميداني أثناء التركيب"]),
        json.dumps(["FEA Stress Calculation Book", "3D BIM LOD 400 Erection Model", "Custom Steel Transition Welds", "Step-by-Step Method Statement"]),
        json.dumps(["دفتر حسابات الإجهادات FEA", "نموذج تركيب BIM LOD 400", "وصلات تحويل فولاذية مخصصة", "دليل تسلسل التركيب التفصيلي"]),
        json.dumps({"software_suite": "Autodesk Revit, Navisworks, RSTAB, Dlubal FEA", "bim_standard": "ISO 19650 / LOD 400", "pe_stamp": "Licensed Saudi Council of Engineers (SCE)", "wind_analysis": "Desert dynamic wind load simulation"}),
        1, 0, json.dumps(["KSA", "GCC", "MENA", "AFRICA"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDwiprWpFyrS39XSM17S9IRpCEAShkeKN6bydLvw2DqthTpOoBw0oL8yRKx1YzPYx8Ir7cBBo_tyCm0j60bTrK7XWApvQ2nXZjLvh3gPwNVrus2cq4Ih5F7Rc43PwiROcw-0AZlKWV9zfcPemiJTq0tdz4WReDNIXgESHuNyauzFA93dAlnQtN99tjtETYXaGDz2GB_80ErSPmuYpKSL4LpXwNz5TgJHs-OQqJyKxJneTp28_3DHdqs',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDwiprWpFyrS39XSM17S9IRpCEAShkeKN6bydLvw2DqthTpOoBw0oL8yRKx1YzPYx8Ir7cBBo_tyCm0j60bTrK7XWApvQ2nXZjLvh3gPwNVrus2cq4Ih5F7Rc43PwiROcw-0AZlKWV9zfcPemiJTq0tdz4WReDNIXgESHuNyauzFA93dAlnQtN99tjtETYXaGDz2GB_80ErSPmuYpKSL4LpXwNz5TgJHs-OQqJyKxJneTp28_3DHdqs',
        '/assets/drawings/custom-engineering.pdf', '/assets/brochures/custom-engineering.pdf', 'PUBLISHED', 0, 11
    ),
    # 12. Working Platforms & Tank Access (European)
    (
        2, 2, 1, 'ULM-WPF-06', 'circular-working-platforms',
        'Working Platforms & Circular Access (SGF / KSP)', 'منصات العمل المحيطية والوصول للمنشآت الدائرية',
        'High-Security Perimeter Staging and Suspended Brackets for Silos and Storage Tanks', 'منصات محيطية معلقة عالية الأمان لخزانات التخزين والصوامع والأعمدة العالية',
        'Modular perimeter brackets and suspended staging platforms designed to wrap circular storage tanks, flared bridge piers, and silo perimeters with zero fall hazard.',
        'كوابيل ومنصات عمل محيطية معلقة مصممة لتطويق الخزانات الدائرية والصوامع وأعمدة الجسور بأقصى درجات الأمان.',
        'Heavy-duty cantilevered brackets anchoring directly into prior pour tie-rod cones with fully integrated perimeter mesh screens and toe boards.',
        'كوابيل كابولية تثبت مباشرة في ثقوب زراجين الصبة السابقة مع شباك حماية محيطية وألواح حماية القدمين.',
        'Wastewater clarifier tanks, cryogenic LNG spherical storage, grain silos, and stepped bridge pylon pours.',
        'خزانات محطات معالجة المياه، خزانات الغاز المسال، صوامع الغلال، والأعمدة الخرسانية المتدرجة.',
        'Brackets hang from anchor cones placed in previous concrete lifts. Workers assemble safe continuous circular walkways that follow the structure radius smoothly.',
        'تعلق الكوابيل بمخاريط التثبيت في الخرسانة السابقة، وتكون ممرات مشاة دائرية مستمرة تطابق نصف قطر المنشأة بدون فجوات خطرة.',
        json.dumps(["Completely enclosed work zones with fall arrest anchor rings", "Adjustable bracket inclination compensates for batter angles up to 20°", "Hot-dip galvanized components withstand harsh coastal and industrial environments", "OSHA and Saudi Civil Defense safety compliance"]),
        json.dumps(["مناطق عمل مغلقة بالكامل مع نقاط تثبيت معتمدة لأحزمة الأمان", "زاوية ميلان قابلة للتعديل حتى 20 درجة للحوائط المائلة", "جلفنة بالغمس الساخن تقاوم التآكل في البيئات الساحلية والصناعية", "مطابقة تامة لاشتراطات أوشا والدفاع المدني السعودي"]),
        json.dumps(["SGF Climbing Brackets", "Heavy Anchor Cones", "Perimeter Safety Handrails", "Non-Slip Circular Deck Infill", "Integrated Hoist Arm"]),
        json.dumps(["كوابيل التسلق SGF", "مخاريط التثبيت الثقيلة", "درابزينات حماية محيطية", "ألواح خشبية/معدنية مخصصة للمنحنيات", "ذراع رفع مواد يدوي"]),
        json.dumps({"permissible_live_load": "Class 4 (3.0 kN/m²)", "platform_width": "1.8 m to 2.2 m wide deck", "max_angle_inclination": "± 20° vertical slope", "safety_standard": "EN 12811-1 / OSHA 1926"}),
        1, 1, json.dumps(["KSA", "GCC", "MENA"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDVGuQwJ0miQqKsbbuErmhcCiN0ZgpGZWFmuZqCIsKXnd7Sg1I2maJI_rzDYc4xKEzADUPpDg1G4ybkRWJuLiDef6l9CFDUnohHO1CIiElZuzIy0k-LKOUwNi5pySXB6lObmvK_mk0KA7qAjzkvBzYn48XLCYcACa6Z_GIG8651dcPwTqgKqcLtLTSwoz826lz1nBZRmJQ7fJSKQOhaDIdkUuVJM0JYvlnx3wYZHAMWVfDNXsO9wO5W',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDVGuQwJ0miQqKsbbuErmhcCiN0ZgpGZWFmuZqCIsKXnd7Sg1I2maJI_rzDYc4xKEzADUPpDg1G4ybkRWJuLiDef6l9CFDUnohHO1CIiElZuzIy0k-LKOUwNi5pySXB6lObmvK_mk0KA7qAjzkvBzYn48XLCYcACa6Z_GIG8651dcPwTqgKqcLtLTSwoz826lz1nBZRmJQ7fJSKQOhaDIdkUuVJM0JYvlnx3wYZHAMWVfDNXsO9wO5W',
        '/assets/drawings/ulma-platforms.pdf', '/assets/brochures/ulma-platforms.pdf', 'PUBLISHED', 0, 12
    )
]

cursor.executemany('''
INSERT INTO products (
    classification_id, brand_id, category_id, sku, slug,
    name_en, name_ar, tagline_en, tagline_ar,
    short_summary_en, short_summary_ar, what_is_it_en, what_is_it_ar,
    what_is_used_for_en, what_is_used_for_ar, how_does_it_work_en, how_does_it_work_ar,
    key_advantages_en, key_advantages_ar, main_components_en, main_components_ar,
    technical_specs, sales_available, rental_available, regional_availability,
    hero_image, main_image, drawing_url, brochure_url, status, featured, display_order
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
''', products)

# Map Applications to Products
product_apps = [
    (1, 3), (1, 4), (1, 5), # Cuplock -> Facades, Infra, Industrial
    (2, 4), (2, 7),         # Manhole -> Infra, Precast
    (3, 1), (3, 2), (3, 4), # Circular Column -> High-rise, Bridges, Infra
    (4, 5), (4, 7),         # Precast -> Industrial, Precast
    (5, 4), (5, 5), (5, 6), # Grinder Shutter -> Infra, Industrial, Tanks
    (6, 2), (6, 4),         # Piers -> Bridges, Infra
    (7, 1), (7, 4),         # ULMA ORMA -> High-rise, Infra
    (8, 3), (8, 5), (8, 6), # ULMA BRIO -> Facades, Industrial, Tanks
    (9, 2), (9, 4),         # ULMA Heavy Shoring -> Bridges, Infra
    (10, 1),                # Specialized ATR -> High-rise
    (11, 1), (11, 2), (11, 4), # Project-Specific -> High-rise, Bridges, Infra
    (12, 5), (12, 6)        # Platforms -> Industrial, Tanks
]
cursor.executemany('INSERT INTO product_applications (product_id, application_id) VALUES (?, ?);', product_apps)

# Seed Assembly Sequences & Steps
# BRIO Ringlock Sequence
cursor.execute('''
INSERT INTO assembly_sequences (product_id, title_en, title_ar, description_en, description_ar)
VALUES (8, 'BRIO Ringlock 7-Step Assembly Protocol', 'تسلسل تركيب سقالات بريو المعتمد في 7 خطوات',
'Standardised erection sequence according to European safety norm EN 12810-3D', 'تسلسل التركيب الآمن المعياري طبقاً للمواصفة الأوروبية للسلامة EN 12810-3D');
''')
brio_seq_id = cursor.lastrowid

brio_steps = [
    (brio_seq_id, 1, 'Base Jack & Collar Alignment', 'تثبيت وضبط القواعد اللولبية والأطواق',
     'Heavy-duty base jacks anchored to engineered ground footings. Initial spindle adjustment guarantees 0.1° plumb line tolerance across irregular terrain.',
     'تثبيت القواعد اللولبية على أرضية مهيأة وضبط الارتفاع بمرونة ودقة لضمان استواء السقالة التام.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuDAjqli8slcfGI7fTi9vtWStiOeNp4oKaf3l8JQ3tiieslh4sTp-P2yiiNitohnT1taAR_5DdZzUJ1vxcs92UkkFwrb82HU2FEo3JyktiZFznTY1_NGb0y66zV2CXRXLhucvVNRNkZ8x2CwJqtiewGy3puCzCoPILOvS-xtN_L6n16cOd9R7GkMfaatRLlUhEyuRB3xypagj2PoouIaGNIqt7556fGCgju13tuj1vku9MZzYnwV1I9L',
     'Base Spindle Capacity', '45 kN Load Rating', 'Compliance Check', 'SASO ISO 3834-2'),
    (brio_seq_id, 2, 'Vertical Standard Insertion', 'تركيب القوائم الرأسية في الأطواق',
     'Vertical standards fitted into base collars. Patented 8-hole rosette discs position at exact 500mm vertical increments.',
     'إسقاط القوائم الرأسية داخل أطواق القواعد مع توجيه أقراص الوردة الثمانية على ارتفاعات منتظمة بدقة 500 مم.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuDHhAII_WNIhsmbgCtOIy6-PQ33OP4OdIue8hwRIuajnFIEt9zYbQ6kA0fitc8ivJVP7ZN4t9qusWdCLJ3tM18RyXBSgeAU-AR_-jxRKIQMR_hhCMygR5ntqiLjN2DXIRrc1qsNVFueWSgf9ybUfuZmE-XLY8BbZwd0qqPhkMadG_aaqYjVpTnKAJWXHFrpxhjHmFP9ZZMeySkbAk5jjijrU3_NmwjEJU7R4FvxgyAL4hnU-vBBC6kx',
     'Post Wall Thickness', '3.2 mm S355 Steel', 'Standard Plumb', 'Max 1.5mm / 2m deviation'),
    (brio_seq_id, 3, 'Ledger Placement & Wedge Lock', 'ربط العوارض الأفقية وإغلاق الإسفين',
     'Horizontal ledgers connected at 90° intervals. Hammer blow engages captive wedge into rosette disc, securing rigid unyielding joint.',
     'ربط العوارض الأفقية على زوايا 90 درجة مع طرق الإسفين المدمج لإنشاء هيكل متين ومقاوم للالتواء.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuBJeJEHhwIFGYpFcSTKzIf3nbzTOuTh2JuQU5LP2sTWLLG4bVvIKK2OT7cRCKg-0LPRHHrJaa5qX-hPrSGRCmdSdzUTHlGvualr9rAidWtBhBL2MvDMxeDB4EnxO5ygbgoWpvbPK6FvjonWupnuija9YWvyurp-zHImBn6TfdXViDh9JXWpG6Dt7OZyvjyMMsK5-iwOprAeMr3-rpAFhHl99kwhsdx4rj5LtvhI98qk_RTnia7_wP-Q',
     'Wedge Engagement', '500 g Hammer Blow', 'Node Joint Rigidity', 'Over 14 kN·m resistance'),
    (brio_seq_id, 4, 'Diagonal Spatial Bracing', 'تثبيت المقصات القطرية للثبات الفراغي',
     'Diagonal braces attached across alternate bays to establish triangulation and eliminate sway during high-elevation loads.',
     'تركيب المقصات القطرية لربط الباكيات بنظام المثلثات الهندسي لمنع أي اهتزاز أو انزياح تحت ضغط الرياح.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuDHhAII_WNIhsmbgCtOIy6-PQ33OP4OdIue8hwRIuajnFIEt9zYbQ6kA0fitc8ivJVP7ZN4t9qusWdCLJ3tM18RyXBSgeAU-AR_-jxRKIQMR_hhCMygR5ntqiLjN2DXIRrc1qsNVFueWSgf9ybUfuZmE-XLY8BbZwd0qqPhkMadG_aaqYjVpTnKAJWXHFrpxhjHmFP9ZZMeySkbAk5jjijrU3_NmwjEJU7R4FvxgyAL4hnU-vBBC6kx',
     'Brace Angle', '45° Ideal Triangulation', 'Sway Resistance', 'Class A Seismic Rating'),
    (brio_seq_id, 5, 'Anti-Tilt Steel Planks', 'تركيب ألواح المشايات الفولاذية المانعة للانزلاق',
     'Perforated galvanized steel decks locked directly onto ledger profiles with integrated wind-lift security catches.',
     'إسقاط ألواح المشايات المجلفنة المثقبة وتثبيتها بمشابك أمان سفلية تمنع تطايرها بفعل الرياح الشديدة.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuDAjqli8slcfGI7fTi9vtWStiOeNp4oKaf3l8JQ3tiieslh4sTp-P2yiiNitohnT1taAR_5DdZzUJ1vxcs92UkkFwrb82HU2FEo3JyktiZFznTY1_NGb0y66zV2CXRXLhucvVNRNkZ8x2CwJqtiewGy3puCzCoPILOvS-xtN_L6n16cOd9R7GkMfaatRLlUhEyuRB3xypagj2PoouIaGNIqt7556fGCgju13tuj1vku9MZzYnwV1I9L',
     'Uniform Load Rating', 'Class 6 (6.0 kN/m²)', 'Slip Resistance', 'R11 Anti-Slip Surface'),
    (brio_seq_id, 6, 'Internal Access Trapdoors & Ladders', 'تركيب السلالم الداخلية وبوابات العبور',
     'Integrated aluminum inclined stairways or trapdoor decks installed to guarantee safe internal operative passage.',
     'تثبيت سلالم صعود ألومنيوم داخلية وبوابات أمان لضمان تنقل العمال دون تعريضهم لخطر الحواف المفتوحة.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuBJeJEHhwIFGYpFcSTKzIf3nbzTOuTh2JuQU5LP2sTWLLG4bVvIKK2OT7cRCKg-0LPRHHrJaa5qX-hPrSGRCmdSdzUTHlGvualr9rAidWtBhBL2MvDMxeDB4EnxO5ygbgoWpvbPK6FvjonWupnuija9YWvyurp-zHImBn6TfdXViDh9JXWpG6Dt7OZyvjyMMsK5-iwOprAeMr3-rpAFhHl99kwhsdx4rj5LtvhI98qk_RTnia7_wP-Q',
     'Hatch Auto-Close', 'Gravity Spring Return', 'Ladder Capacity', '150 kg Single User'),
    (brio_seq_id, 7, 'Advanced Guardrails & Toe Boards', 'درابزينات الحماية المتقدمة وحواجز القدمين',
     'Dual-tier guardrails and perimeter steel toe boards mounted before operatives step onto upper levels, achieving zero-fall risk.',
     'تركيب درابزينات الحماية المزدوجة وحواجز أطراف المشاية لحماية العمال والمعدات من السقوط بنسبة 100%.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuDAjqli8slcfGI7fTi9vtWStiOeNp4oKaf3l8JQ3tiieslh4sTp-P2yiiNitohnT1taAR_5DdZzUJ1vxcs92UkkFwrb82HU2FEo3JyktiZFznTY1_NGb0y66zV2CXRXLhucvVNRNkZ8x2CwJqtiewGy3puCzCoPILOvS-xtN_L6n16cOd9R7GkMfaatRLlUhEyuRB3xypagj2PoouIaGNIqt7556fGCgju13tuj1vku9MZzYnwV1I9L',
     'Guardrail Height', '1.10 m Nominal Height', 'Certification', 'EN 12810 Full Compliance')
]
cursor.executemany('''
INSERT INTO assembly_steps (sequence_id, step_number, title_en, title_ar, description_en, description_ar, image_url, spec_a_label, spec_a_value, spec_b_label, spec_b_value)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
''', brio_steps)

# Seed Hotspots (for Circular Scaffolding / Working Platforms)
hotspots_data = [
    (12, 'circular-silo', 1, 28.0, 28.0, 'Working Deck', 'منصة العمل الرئيسية', 'Perimeter Non-Slip Steel Decks', 'ألواح المشايات الفولاذية المحيطية', 'Class 4 Heavy (3.0 kN/m²)',
     'Perforated hot-dip galvanized steel planks with wind-lock security clips conforming seamlessly to curved silo profiles without trip thresholds.',
     'ألواح فولاذية مجلفنة مثقبة مع مشابك أمان سفلية تتطابق بسلاسة مع انحناءات الصوامع دون عوائق لحركة العمال.',
     json.dumps({"clearance": "150 mm", "deflection": "< L/300", "standard": "EN 12811 Compliant"})),

    (12, 'circular-silo', 2, 68.0, 20.0, 'Anchorage Node', 'نقطة التثبيت الإنشائي', 'M24 High-Tensile Tie Cones', 'مخاريط التثبيت الإنشائية M24', '110 kN Shear Rating',
     'Anchor brackets engineered to fasten directly into previous concrete tie sleeves, eliminating the need for ground-up shoring towers.',
     'مرابط تثبيت مصممة للربط في مخاريط الزراجين السابقة بالجدار، مما يلغي الحاجة لبناء أبراج أرضية شاهقة التكلفة.',
     json.dumps({"cone_thread": "DW15 / DW20", "safety_factor": "2.5x Eurocode", "tested_pull": "85 kN Proof Load"})),

    (12, 'circular-silo', 3, 78.0, 52.0, 'Perimeter Enclosure', 'شاشات الحماية المحيطية', 'High-Density Catch Mesh Panels', 'شباك احتواء الرياح والأجسام المتساقطة', 'EN 13374 Class C',
     'Full-height fine-wire mesh screens retaining tools and debris while dampening desert crosswinds by up to 60%.',
     'شاشات شبكية كاملة الارتفاع تمنع سقوط الأدوات وتخفف سرعة الرياح الصحراوية بنسبة تصل إلى 60%.',
     json.dumps({"wind_reduction": "60%", "mesh_aperture": "20 mm x 20 mm", "fire_rating": "Class 1 Flame Retardant"})),

    (12, 'circular-silo', 4, 32.0, 70.0, 'Cantilever Bracket', 'كابول التحميل السفلي', 'Reinforced Cantilever Knee Brace', 'دعامة الكابول المائلة المقواة', '40 kN Design Moment',
     'Triangulated structural steel bracket redistributing vertical live load back into the hardened tank shell.',
     'هيكل كابولي مثلث من الفولاذ الإنشائي ينقل الأحمال الحية مباشرة إلى الجدار الخرساني المتصلب بأمان.',
     json.dumps({"steel_spec": "S355 Structural Steel", "coating": "HDG 85 µm", "bracket_spacing": "1.5 m max"}))
]
cursor.executemany('''
INSERT INTO hotspots (product_id, target_identifier, node_number, x_percent, y_percent, category_en, category_ar, title_en, title_ar, rating, description_en, description_ar, specifications)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
''', hotspots_data)

# Seed Regions & Capability Matrix
regions = [
    ('KSA', 'Kingdom of Saudi Arabia', 'المملكة العربية السعودية', 1, 1, 1,
     'Complete sovereign capabilities: local manufacturing, massive sales and rental fleet, site engineering supervision, and fast mobilization within 24-48 hours.',
     'قدرات وطنية شاملة: تصنيع محلي، أسطول ضخم للبيع والتأجير، إشراف هندسي ميداني وتوريد فوري خلال 24 إلى 48 ساعة.',
     json.dumps(["Riyadh HQ (Central Yard)", "Dammam 2nd Industrial (Eastern Yard)", "Jeddah Maritime Hub (Western Yard)", "NEOM Forward Tactical Base (Tabuk)"])),

    ('GCC', 'GCC Sovereign Markets', 'دول مجلس التعاون الخليجي', 1, 0, 1,
     'Certified equipment direct sales and engineering design packages across Kuwait, UAE, Qatar, Bahrain, and Oman with bonded shipping.',
     'مبيعات مباشرة معتمدة وحزم دراسات وتصاميم هندسية لكافة دول مجلس التعاون الخليجي مع شحن لوجستي موثوق.',
     json.dumps(["Kuwait Trade Office", "UAE Logistics Channel", "Qatar Infrastructure Desk", "Oman Port Hub"])),

    ('MENA', 'Middle East & Levant Corridor', 'الشرق الأوسط وبلاد الشام', 1, 0, 1,
     'Direct sales of heavy shoring systems, custom bridge pier moulds, and PE-stamped calculation packages.',
     'مبيعات مباشرة لمعدات التدعيم الثقيل وقوالب الجسور وحسابات هندسية إنشائية معتمدة.',
     json.dumps(["Jordan Project Hub", "Iraq Reconstruction Desk", "Egypt Regional Office"])),

    ('AFRICA', 'West & North Africa Hub', 'غرب وشمال أفريقيا', 1, 0, 0,
     'Export containerized sales programs for civil infrastructure and mining projects requiring multi-year reusable steel formwork.',
     'برامج تصدير حاويات متكاملة لمشاريع البنية التحتية والتعدين التي تتطلب شدات فولاذية تدوم لسنوات.',
     json.dumps(["Casablanca Logistics Desk", "Abidjan Maritime Channel", "Dakar Distribution Point"]))
]
cursor.executemany('''
INSERT INTO regions (code, name_en, name_ar, sales_allowed, rental_allowed, supervision_allowed, description_en, description_ar, hub_locations)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
''', regions)

# Seed Services (5 Core Services)
services = [
    ('design', 'Engineering & Structural Design', 'التصميم الهندسي والحسابات الإنشائية',
     'Certified structural calculations, FEA load analysis, and 3D BIM coordination strictly adhering to the Saudi Building Code (SBC).',
     'حسابات إنشائية معتمدة، تحليل إجهادات العناصر المحدودة FEA، ونمذجة ثلاثية الأبعاد BIM مطابقة لكود البناء السعودي.',
     'Our Riyadh-based engineering department delivers turnkey temporary works solutions: from preliminary concept sketches through PE-stamped calculation books, LOD 400 erection models, and clash-detection audits accepted by tier-1 gigaproject consultants.',
     'يقدم فريقنا الهندسي بالرياض حلولاً متكاملة للشدات المؤقتة: من المخططات الأولية حتى دفاتر الحسابات المعتمدة ونماذج LOD 400 المقبولة في أكبر المشاريع.',
     'architecture', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwiprWpFyrS39XSM17S9IRpCEAShkeKN6bydLvw2DqthTpOoBw0oL8yRKx1YzPYx8Ir7cBBo_tyCm0j60bTrK7XWApvQ2nXZjLvh3gPwNVrus2cq4Ih5F7Rc43PwiROcw-0AZlKWV9zfcPemiJTq0tdz4WReDNIXgESHuNyauzFA93dAlnQtN99tjtETYXaGDz2GB_80ErSPmuYpKSL4LpXwNz5TgJHs-OQqJyKxJneTp28_3DHdqs', 1),

    ('supply', 'Material Supply & Logistics', 'التوريد اللوجستي وإدارة المخزون',
     'Rapid mobilization from massive stockyards in Riyadh, Jeddah, and Dammam with flatbed fleet delivery within 24 to 48 hours.',
     'توريد فوري من مستودعاتنا بالرياض وجدة والدمام عبر أسطولنا اللوجستي خلال 24 إلى 48 ساعة.',
     'With over 120,000 meters of vertical scaffolding and 60,000 m² of certified formwork in reserve, Saudi Master guarantees zero site delay. All shipments are barcode-staged and batch-tracked.',
     'بفضل مخزون ضخم يتجاوز 120 ألف متر من السقالات و60 ألف متر مربع من الشدات المعتمدة، نضمن عدم تعطل الموقع وسرعة التوريد.',
     'local_shipping', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlZbe6XUV6P44jdi6MTbMLeHTPxurhUTOF7ppht-iV4EaibXuFgRvd8OLLAmX11wVknfMOgpu8MCoB4hCslrD7eiUFjS3CGV5LNoncnhT0caQCXZLsyyWLWAFPUTdHrd8WrdmfWIC4YkbDDF0jEsvQdp3hdClA0o1FZwg27WSgDpdWgtWM7wnBmwzIF4nzJqZ-uEUfNorOaz3xKo61JGXvAsX8iU63-3qBqcYYz2liAODJibHZexxr', 2),

    ('supervision', 'On-Site Technical Supervision', 'الإشراف الفني الميداني واعتماد الصب',
     'Certified SCE temporary works field engineers conducting pre-pour audits, plumb checks, and early striking milestones.',
     'مهندسون معتمدون من هيئة المهندسين السعوديين للتفتيش الميداني قبل كل صبة واعتماد الشدات ومتابعة مراحل الفك المبكر.',
     'Safety is non-negotiable. Our resident site engineers inspect bolt torques, prop plumbing, anchor embedment, and wind tie-backs before signing digital pour permits.',
     'السلامة أولاً وأخيراً. يراجع مهندسونا عزم شد البراغي وشاقولية الدعامات ورسوخ المثبتات قبل التوقيع على تصاريح صب الخرسانة.',
     'supervisor_account', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzHBkIl8LNsrgB7GnP-WsWR6TkJgIW5DkE89xhBCgFHZXrFn8V3BytfXvwN5DFWwVtbS_IcEQ1WHqtT28TGkELq_UcKgrR6zCLEGFHsVYdjervnU31SGSxzgPJirDpp9AmSHiUhpmpcn2KDvRF-99iemPRzhGgHQy3pM-iVTMXLS80D60GYxQUSLWVm9VvaDYBWENlDSMX5gz9RaqWCiOtIyixq8yFR4nFMfeoM_t70IaM_kPdpa3u', 3),

    ('sales', 'Equipment Sales & Custom Fabrication', 'المبيعات وتصنيع القوالب الخاصة',
     'Direct acquisition of Saudi-manufactured steel moulds or certified ULMA systems with warranty, buyback options, and life tracking.',
     'شراء مباشر للشدات المصنعة محلياً أو أنظمة أولما الأوروبية مع الضمان وخيارات إعادة الشراء وتتبع العمر الافتراضي.',
     'Contractors seeking high-repetition assets can purchase bespoke steel shutters built in Riyadh or standard ULMA modular systems with technical warranties and refurbishment support.',
     'نوفر للمقاولين إمكانية التملك المباشر للقوالب والشدات المصنعة بمصنعنا بالرياض أو أنظمة أولما مع الصيانة والدعم الفني.',
     'shopping_cart', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAShdqDqHTeB9TgKcFbtfJTji1908qeQfB8ZTxp1CtGBmuWmRQjEOk70vHTAaNh8KP9Q4yicLH_mczfLpBWFUS4rbg2QZbFhJ6tCrleWdEdZaKAmVklGqDBMxv0Vtsd3Dbzww4oOXr8yQiAuVEZO1IYf_faE0IfSQh0lPejh4K5jueimpbDtYilfpYMyGuI_vq_EEY0osmdM5sbZdIHmVEWwV-Uo3_6c3iOJHvsqOu4gwtcXSGI3i8Q', 4),

    ('rental', 'Rental Fleet & Operations', 'أسطول التأجير التشغيلي',
     'The Kingdom’s premier certified scaffolding and slab shoring rental fleet with flexible monthly terms aligned with project cash flows.',
     'أكبر أسطول تأجير معتمد لسقالات وشدات الخرسانة بالمملكة بعقود شهرية مرنة تتناسب مع التدفقات المالية للمشروع.',
     'Our massive rental pool lowers contractor capital expenditure while ensuring equipment meets strict SASO and European load benchmarks.',
     'يقلل أسطول التأجير من الأعباء الرأسمالية للمقاول مع ضمان خضوع كل قطعة لصيانة دورية صارمة وفحص جودة قبل كل تسليم.',
     'key', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeMFpWVHTX00p20u3lymcsoWcdH1h_kIisUz5tyaSIYSFhwM4tpXKZ9y-A_e8w_zxgxMcmZJoCtKPhqgi8ZztFPy55WawqiqZBNMw4BzqniMbbV9oxoi5nSmGDkQ77GjA9ytYXuMm_XpaxTF4Up9kxwdOOAoxZ0iNz3xGasf_7Z55KSk-pATkc25KHT2d4WHeiBSukM1MVpoTZG7YQtnxSyK_GnjS16MJFaadzfeEsWs44mBq_jWA8', 5)
]
cursor.executemany('''
INSERT INTO services (slug, name_en, name_ar, summary_en, summary_ar, description_en, description_ar, icon_name, image_url, display_order)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
''', services)

# Seed Projects (4 High-Profile Case Studies)
projects = [
    (
        'NEOM Spine Rail High-Speed Viaduct', 'جسر قطار نيوم فائق السرعة', 'neom-spine-rail-viaduct',
        'NEOM (The Line Sector 04), Saudi Arabia', 'نيوم (قطاع ذا لاين 04)، المملكة العربية السعودية', 'KSA',
        'Rail & High-Speed Transit', 'قطارات النقل السريع والبنية التحتية',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAeMFpWVHTX00p20u3lymcsoWcdH1h_kIisUz5tyaSIYSFhwM4tpXKZ9y-A_e8w_zxgxMcmZJoCtKPhqgi8ZztFPy55WawqiqZBNMw4BzqniMbbV9oxoi5nSmGDkQ77GjA9ytYXuMm_XpaxTF4Up9kxwdOOAoxZ0iNz3xGasf_7Z55KSk-pATkc25KHT2d4WHeiBSukM1MVpoTZG7YQtnxSyK_GnjS16MJFaadzfeEsWs44mBq_jWA8',
        'Turnkey falsework and pier formwork package for monumental 32m high bridge supports in extreme desert canyon topography.',
        'حزمة متكاملة للتدعيم الثقيل وشدات الأعمدة لجسور بارتفاع 32 متراً في التضاريس الجبلية الوعرة بنيوم.',
        'Contractor required monolithic casting of 1,400 kN hammerhead caps while resisting 85 km/h desert crosswinds without crane availability delays.',
        'طلب المقاول صب هامات الجسور العملاقة بكتلة 1400 كيلو نيوتن ومقاومة رياح شديدة تصل لـ 85 كم/ساعة دون تأخير الرافعات.',
        'Saudi Master engineered a hybrid assembly pairing locally fabricated steel pier shutters with ULMA MK heavy shoring towers.',
        'قامت شركة الماستر السعودي بتصميم حل هجين يجمع قوالب الأعمدة المصنعة محلياً مع أبراج التدعيم الثقيل ULMA MK.',
        'Continuous 24/7 on-site technical supervision ensured all 24 bridge spans were placed on time with 0-clash Navisworks verification.',
        'إشراف هندسي متواصل على مدار الساعة مكن من إنجاز 24 بحراً بنجاح وبأعلى معايير الدقة والسلامة.',
        'Zero safety incidents recorded across 180,000 man-hours; pour cycle accelerated by 4 days per segment.',
        'صفر حوادث سلامة عبر 180,000 ساعة عمل، مع تسريع دورة الصب بـ 4 أيام لكل قطاع.',
        json.dumps([{"label": "Total Pier Height", "value": "32 meters"}, {"label": "Concrete Volume", "value": "45,000 m³"}, {"label": "Cycle Speed", "value": "6 days/pier"}]),
        json.dumps(["https://lh3.googleusercontent.com/aida-public/AB6AXuAYbBvHKzpzGtxXsGspX7V3COYTh6u6-b1AokcupmhauNxYf05P2ksd_2CUKv8ibQOjnpSqbzIFGpvxW8TydjfV5r08lYX6QKUQJBDFLMWAjUK9uQgamb4cJNEnuQvoIhO8tfbdyjkOVEgbQDtnwhGFGEKhkE1MjM7BPYD1qzuzdJRn7ETh1Tb8UvTVZICrP1qWwO7YKoXNajuoAn46_yO1jja8Y7K_wg0-LkRL_RG899IRZSdT5Aaz"])
    ),
    (
        'Riyadh Metro Line 03 Elevated Interchange', 'محطة تقاطع مترو الرياض المسار 3', 'riyadh-metro-line-03',
        'Riyadh, Saudi Arabia', 'الرياض، المملكة العربية السعودية', 'KSA',
        'Urban Transit & Metros', 'قطارات النقل الحضري والمترو',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVKCj2WddgH0Snv7o94YspWNYWqclglj65qflpXP6t0tHAHbK4avH7jsbiU_xT0PskDsvE1j7evI5DPaP9H6eemuXQ6KuSbF9JsQweVdQ_YV61dJjxGHDpUbnX6A1C-KNGS9emQ2i3ZKYKuzpNt0ZmXFHrmJ2n5t6eGeinCNG3irDIGJiY1l6hRfmCRei57dGl2NvKgFgqsYQI9cjOy7Dxr_574fhyNtfxKEViomd_itSTuLAsyfC',
        'Heavy Cuplock shoring and bespoke steel circular column formwork across central Riyadh urban corridors.',
        'سقالات تدعيم كابلوك ثقيلة وقوالب أعمدة دائرية مخصصة لمسارات التقاطعات الحيوية بمترو الرياض.',
        'High-density vehicular traffic below required zero ground deflection and immediate clearance opening.',
        'حركة المرور الكثيفة أسفل الجسر تطلبت فتح مسارات الطريق دون أي إغلاق مع ثبات هندسي مطلق.',
        'Supplied 35,000 m² of Cuplock rental falsework with calibrated drop-heads enabling early stripping in 72 hours.',
        'توريد 35 ألف متر مربع من سقالات الكابلوك مع رؤوس إسقاط سريعة أتاحت فك الشدة خلال 72 ساعة فقط.',
        'Delivered from our Riyadh central yard in night shifts with zero traffic disruption.',
        'تم التوريد عبر فترات ليلية من مستودع الرياض لتفادي أي ازدحام مروري.',
        'Completed 2 weeks ahead of target schedule; client awarded follow-up substation contracts.',
        'اكتمل العمل قبل أسبوعين من الموعد المحدد واعتمدت الهيئة أنظمتنا للمشاريع اللاحقة.',
        json.dumps([{"label": "Shoring Fleet", "value": "35,000 m²"}, {"label": "Columns Cast", "value": "180 circular"}, {"label": "Striking Time", "value": "72 hours"}]),
        json.dumps([])
    ),
    (
        'The Red Sea Coastal Resort & Marine Gateway', 'منتجع البحر الأحمر وبوابة المارينا', 'red-sea-coastal-resort',
        'Red Sea Destination, Saudi Arabia', 'وجهة البحر الأحمر، المملكة العربية السعودية', 'KSA',
        'Luxury Hospitality & Marine', 'الضيافة الفاخرة والمنشآت البحرية',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCcmLnQUw-ETsqO-WY8RhKH4bBo-nVJWxFXw-4gIcW_XsMx3TpUqOP0mIXif70KMJlEv0Rs3vK6ow4QDJRdoyG9CSZrfQYRd2_8AW88PwtIcO161T6iGyeklXtiQFt78LHtsKtiH3p37JbHuhDOmax4O_1lPcBWbs6JN4j9ISdqjhjDrOEVJP-xX8R0t7ZInw1ZGonjDpgcZDXn_cY0bbj7G0RoJjsAwSAPFrm0bI7LaXsc7oz9IrpB',
        'Architectural Fair-Faced Concrete Wall Formwork using ULMA ORMA and coastal-grade galvanized BRIO access.',
        'صب حوائط معمارية فائقة النعومة باستخدام شدات أولما أورما وسقالات بريو المقاومة للملوحة البحرية.',
        'Ultra-strict architectural finish criteria requiring zero bubble defects and marine corrosion protection.',
        'معايير معمارية صارمة جداً لأسطح الخرسانة الظاهرة ومقاومة عالية للتآكل في البيئة البحرية الرطبة.',
        'Deployed ULMA ORMA with premium birch plywood and SASO-certified hot-dip galvanized BRIO platforms.',
        'استخدام ألواح أورما بخشب فنلندي نخب أول وسقالات بريو مجلفنة بالغمس الساخن ≥ 75 ميكرون.',
        'Field engineers audited plywood face sealing and tie-rod alignments before every pour.',
        'فحص دقيق لمفاصل الألواح ومسامير التثبيت لضمان مظهر معماري متناسق وبراق.',
        'Received Architectural Excellence commendation from the development authority.',
        'حصل المشروع على إشادة هيئة تطوير البحر الأحمر للتميز في جودة الخرسانة الظاهرة.',
        json.dumps([{"label": "Surface Finish", "value": "Architectural Class A"}, {"label": "Marine HDG", "value": "≥ 75 µm"}, {"label": "Rebar Coverage", "value": "100% Plumb"}]),
        json.dumps([])
    ),
    (
        'Qiddiya Speed Park Viaduct & Retaining Complex', 'مجمع جسور وحوائط حلبة السرعة بالقدية', 'qiddiya-speed-park',
        'Qiddiya Entertainment City, Riyadh, KSA', 'مدينة القدية الترفيهية، الرياض، المملكة العربية السعودية', 'KSA',
        'Heavy Civil & Sports Mega-Infrastructure', 'المنشآت الرياضية الكبرى والهندسة المدنية',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAljqfGaiddD4t-soTJzOxaMeoVQM-HQhgH9rj_1FFK0jYVsir_Vylbkhofb4OYLb0ix9hsmsDK0bez8DP2d7D8E5YXS9kL1qciCqbYHQAnwfPiqYY3zXKHozjJY8uc0Oq95NxHnUoQMUgXp9Kc0BlpRCYtNxY43iVr0rvONEU_DFCX325PZh1DH8veI4InJ25vMxqZWnKAH-nB8d0Z0UI3ZkQdQIIRdJfS6k6muaqLlwI2NKO52Wif',
        'Heavy fabricated Grinder steel shutters and heavy MK falsework for massive 18m retaining walls.',
        'شدات جريندر الفولاذية الثقيلة وأبراج MK لجدران استنادية عملاقة بارتفاع 18 متراً.',
        'High retaining forces in mountainous terrain with extreme thermal fluctuations from 5°C to 48°C.',
        'ضغوط استنادية هائلة في جبال القدية مع فروقات حرارية صحراوية حادة بين الصيف والشتاء.',
        'Fabricated extra-rigid all-steel waler shutters in our Riyadh plant coupled with MK structural braces.',
        'تصنيع شدات فولاذية جسيمة بمصنعنا بالرياض لتقاوم الضغوط دون تمدد أو انحناء.',
        'Night-time continuous concrete placing executed under direct supervision of our technical team.',
        'صب ليلي مستمر تحت إشراف مهندسينا لضمان استقرار الخرسانة تحت درجات الحرارة المثالية.',
        'Wall poured to exact millimeter line; zero remediations or grinding required.',
        'تحقيق استقامة تامة للجدار بدون الحاجة لأي معالجات لاحقة، وتسليم المشروع وفق الجدول المعتمد.',
        json.dumps([{"label": "Retaining Height", "value": "18 meters"}, {"label": "Hydrostatic Load", "value": "90 kN/m²"}, {"label": "Wall Length", "value": "1.2 km"}]),
        json.dumps([])
    )
]
cursor.executemany('''
INSERT INTO projects (
    name_en, name_ar, slug, location_en, location_ar, region_code, industry_en, industry_ar,
    hero_image, summary_en, summary_ar, challenge_en, challenge_ar, solution_en, solution_ar,
    execution_en, execution_ar, results_en, results_ar, key_metrics, gallery
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
''', projects)

# Map Projects to Products
project_products = [
    (1, 6), (1, 9),  # NEOM -> Piers, ULMA MK
    (2, 1), (2, 3),  # Riyadh Metro -> Cuplock, Circular Columns
    (3, 7), (3, 8),  # Red Sea -> ORMA, BRIO
    (4, 5), (4, 9)   # Qiddiya -> Grinder Shutter, ULMA MK
]
cursor.executemany('INSERT INTO project_products (project_id, product_id) VALUES (?, ?);', project_products)

# Seed Manufacturing Facility & Processes
cursor.execute('''
INSERT INTO manufacturing_facilities (name_en, name_ar, location_en, location_ar, iktva_score, overview_en, overview_ar, capabilities, hero_image)
VALUES (
'Saudi Master Advanced Fabrication Center', 'مجمع الماستر السعودي المتقدم للتصنيع المعدني',
'Industrial City 2, Riyadh & Dammam Industrial, KSA', 'المدينة الصناعية الثانية بالرياض والدمام، المملكة العربية السعودية',
'85%',
'Our sovereign manufacturing complex encompasses precision CNC tube laser cutting, robotic welding cells, calibrated hydraulic test rigs, and automated dipping lines.',
'مجمع تصنيعي وطني متكامل يضم أحدث أجهزة الليزر الرقمية CNC، خلايا اللحام الروبوتية، ومنصات فحص الأحمال الهيدروليكية المعتمدة.',
'["CNC High-Tension Steel Profiling", "Multi-Axis Robotic Seam Welding", "Hot-Dip Galvanizing & Polymer Coating", "Calibrated FEA Proof-Loading Rigs", "Digital Barcoded Yard Logistics"]',
'https://lh3.googleusercontent.com/aida-public/AB6AXuAShdqDqHTeB9TgKcFbtfJTji1908qeQfB8ZTxp1CtGBmuWmRQjEOk70vHTAaNh8KP9Q4yicLH_mczfLpBWFUS4rbg2QZbFhJ6tCrleWdEdZaKAmVklGqDBMxv0Vtsd3Dbzww4oOXr8yQiAuVEZO1IYf_faE0IfSQh0lPejh4K5jueimpbDtYilfpYMyGuI_vq_EEY0osmdM5sbZdIHmVEWwV-Uo3_6c3iOJHvsqOu4gwtcXSGI3i8Q'
);
''')

processes = [
    (1, 'Material Receiving & Spectro QA', 'فحص واختبار المواد الخام',
     'Certified structural steel tubes (S275/S355) undergo optical spectrometry and tensile stress testing upon arrival.',
     'تخضع أنابيب وصفائح الفولاذ الإنشائي لاختبارات التحليل الطيفي ومقاومة الشد فور وصولها للتأكد من مطابقتها التامة.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuCzHBkIl8LNsrgB7GnP-WsWR6TkJgIW5DkE89xhBCgFHZXrFn8V3BytfXvwN5DFWwVtbS_IcEQ1WHqtT28TGkELq_UcKgrR6zCLEGFHsVYdjervnU31SGSxzgPJirDpp9AmSHiUhpmpcn2KDvRF-99iemPRzhGgHQy3pM-iVTMXLS80D60GYxQUSLWVm9VvaDYBWENlDSMX5gz9RaqWCiOtIyixq8yFR4nFMfeoM_t70IaM_kPdpa3u', 'Step 01: Raw Materials'),

    (2, 'CNC High-Tension Profiling', 'القص والتشكيل الرقمي CNC',
     'Sub-millimeter automated laser and rotary tube cutting ensuring accurate cuplock node placements and clean bevel angles.',
     'قص ليزري رقمي دقيق للأنابيب والصفائح يضمن تمركز عقد التثبيت بدقة متناهية وزوايا لحام مثالية.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuAShdqDqHTeB9TgKcFbtfJTji1908qeQfB8ZTxp1CtGBmuWmRQjEOk70vHTAaNh8KP9Q4yicLH_mczfLpBWFUS4rbg2QZbFhJ6tCrleWdEdZaKAmVklGqDBMxv0Vtsd3Dbzww4oOXr8yQiAuVEZO1IYf_faE0IfSQh0lPejh4K5jueimpbDtYilfpYMyGuI_vq_EEY0osmdM5sbZdIHmVEWwV-Uo3_6c3iOJHvsqOu4gwtcXSGI3i8Q', 'Step 02: CNC Profiling'),

    (3, 'Multi-Axis Robotic Welding', 'اللحام الآلي الروبوتي المتطور',
     'Automated welding cells delivering full-penetration seams tested against cyclic vibration and extreme load concentrations.',
     'محطات لحام روبوتية متعددة المحاور تضمن درزات لحام متجانسة وعميقة ومقاومة للاهتزازات والأحمال العالية.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuBu8nIqKzfD147M3mzg_rQDD8-ZdqjzmVrM4be5gTzpNVlxvv3UIoe8NTh4ZiWEs_wmfj5m2YhdTHSwbCOAziAkaOfZ5wEr4_SXi_vBg-aXAiXvWjsyK_l9nSHwE-Wq6TROJzolt-xnjhKt5SbpyO4c0rgA7HGiobQBEgo7MEamJA6DJKkDL0OmatgJk8kN-W4Rszvu8ofQ8kP8iC0J9AlqTuceQuRtkNxMLNNA3ZC7oAUsGJT4cIe-', 'Step 03: Robotic Welding'),

    (4, 'Thermal Dip Galvanizing & Coating', 'الجلفنة بالغمس الساخن والطلاء',
     'Immersion in molten zinc baths (≥ 65-85 µm) providing decades of corrosion resistance in aggressive desert and marine environments.',
     'غمس القطع في أحواض الزنك المنصهر لتوفير طبقة جلفنة متينة تقاوم التآكل في البيئات البحرية والصحراوية القاسية.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuAK86M6MuuAJy4gzOqYKqV9iT2-XutMwbYgGDKinXR2Lc1VDSYKP3O1a-Xk_XmUGLAzlN87_CMJyNzOI1DpeqIX-Fnbz6hHuf4LRDyomFRX1ZkoJWasu32WqNZlEFMthG-rHc86VnPptcbAeGEuV0R4qpFiEAqxHDU1d739wfB8OfSx04FWmdeXMiDCrCYIdak38mI6T9KbxgmvUcKtWlaSyTKWaTXXgCkGxFBplLyH-83p9JdA05Ka', 'Step 04: Hot-Dip Galvanizing'),

    (5, 'Hydraulic Load Proof Testing', 'اختبار التحميل الهيدروليكي والمعايرة',
     'Calibrated hydraulic rigs perform destructive and non-destructive load tests ensuring compliance with SASO and European norms.',
     'منصات هيدروليكية متطورة تجري اختبارات التحميل الميكانيكية وإثبات مقاومة التشوه لضمان السلامة الميدانية 100%.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuCzHBkIl8LNsrgB7GnP-WsWR6TkJgIW5DkE89xhBCgFHZXrFn8V3BytfXvwN5DFWwVtbS_IcEQ1WHqtT28TGkELq_UcKgrR6zCLEGFHsVYdjervnU31SGSxzgPJirDpp9AmSHiUhpmpcn2KDvRF-99iemPRzhGgHQy3pM-iVTMXLS80D60GYxQUSLWVm9VvaDYBWENlDSMX5gz9RaqWCiOtIyixq8yFR4nFMfeoM_t70IaM_kPdpa3u', 'Step 05: Proof Loading'),

    (6, 'Barcoded Staging & Rapid Dispatch', 'التجهيز الرقمي والشحن الفوري',
     'Individual batches are barcoded, certified, strapped, and dispatched directly onto dedicated heavy logistics flatbeds.',
     'ترميز الشحنات بباركود رقمي يتيح التتبع اللوجستي وشحنها الفوري على أسطول الشاحنات للمشاريع في غضون ساعات.',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuBlZbe6XUV6P44jdi6MTbMLeHTPxurhUTOF7ppht-iV4EaibXuFgRvd8OLLAmX11wVknfMOgpu8MCoB4hCslrD7eiUFjS3CGV5LNoncnhT0caQCXZLsyyWLWAFPUTdHrd8WrdmfWIC4YkbDDF0jEsvQdp3hdClA0o1FZwg27WSgDpdWgtWM7wnBmwzIF4nzJqZ-uEUfNorOaz3xKo61JGXvAsX8iU63-3qBqcYYz2liAODJibHZexxr', 'Step 06: Rapid Dispatch')
]
cursor.executemany('''
INSERT INTO manufacturing_processes (step_number, name_en, name_ar, summary_en, summary_ar, image_url, step_tag, details_en, details_ar)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
''', [(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[3], p[4]) for p in processes])

# Seed Initial Pages & Sections
cursor.execute('''
INSERT INTO pages (slug, title_en, title_ar, meta_title_en, meta_title_ar, meta_desc_en, meta_desc_ar)
VALUES (
'home', 'Home - Saudi Master × ULMA Construction', 'الرئيسية - الماستر السعودي مع أولما',
'Saudi Master ULMA | Formwork & Scaffolding Engineering KSA', 'الماستر السعودي وأولما | هندسة وتصنيع الشدات والسقالات بالمملكة',
'Local manufacturing and European ULMA engineering for formwork, scaffolding, heavy shoring, sales, and rental in Saudi Arabia.',
'تصنيع سعودي محلي وهندسة أوروبية متقدمة من أولما للشدات المعدنية والسقالات والتدعيم الثقيل والبيع والتأجير.'
);
''')
home_page_id = cursor.lastrowid

sections = [
    (home_page_id, 'HERO', 'hero_main', 'Local Manufacturing. European Engineering. One Construction Partner.', 'تصنيع سعودي محلي وهندسة أوروبية متقدمة من أولما', 'Alliance • Saudi Master × ULMA', 'تحالف استراتيجي معتمد', 'Formwork, scaffolding and engineered construction systems for Saudi and regional projects.', 'حلول الشدات والسقالات والأنظمة الإنشائية المتطورة لكبرى مشاريع المملكة والمنطقة.', 'Explore Systems', 'استكشف الأنظمة', '#systems-matrix', 1, 1),
    (home_page_id, 'SHORT_POSITIONING', 'positioning_dual', 'The Saudi Master Advantage', 'ميزة الماستر السعودي', 'Sovereign Synergy', 'تكامل وطني وعالمي', 'Uniting national industrial autonomy with centennial European temporary works engineering.', 'الجمع بين استقلالية التصنيع الوطني السعودي والخبرة الهندسية الأوروبية العريقة لأولما.', 'Our Facilities', 'مصانعنا ومستودعاتنا', '/manufacturing', 2, 1),
    (home_page_id, 'PRODUCT_TABS', 'systems_matrix', 'Engineered Systems', 'الأنظمة والحلول الهندسية', 'Technical Inventory Matrix', 'مصفوفة المعدات والأنظمة', 'Seamlessly switch between locally manufactured systems and European ULMA engineering.', 'تصفح الأنظمة المصنعة محلياً في المملكة أو أنظمة أولما الأوروبية المعتمدة.', 'View All Products', 'عرض جميع الأنظمة', '/products', 3, 1),
    (home_page_id, 'GEOMETRY_EXPLORER', 'geometry_section', 'Formwork for Every Geometry', 'شدات لجميع الأشكال الهندسية', 'Architectural Versatility', 'مرونة معمارية مطلقة', 'Select a structural geometry to inspect the optimal pairing between Saudi Master steel and ULMA systems.', 'اختر الشكل الإنشائي للاطلاع على الحلول الهندسية المطابقة من أولما والتصنيع المحلي.', 'Quote Geometry', 'طلب تسعير هذا الشكل', '#quote-terminal', 4, 1),
    (home_page_id, 'SYSTEMS_IN_MOTION', 'assembly_motion', 'Systems in Motion', 'الأنظمة أثناء التركيب', 'Protocol Sequence', 'تسلسل التركيب الميداني', 'Explore interactive 6-7 stage assembly sequencing and torque specifications.', 'استكشف خطوات التركيب التفصيلية والضوابط الفنية الميدانية.', 'Learn More', 'المزيد', '/assembly', 5, 1),
    (home_page_id, 'SERVICE_FLOW', 'service_journey', 'From Design to Site', 'من التصميم إلى موقع العمل', 'Full Lifecycle Protocol', 'دورة العمل الهندسية الشاملة', 'A 5-stage sovereign engineering chain: Design, Supply, Supervision, Sales, and Rental.', 'سلسلة عمل هندسية متكاملة: التصميم، التوريد، الإشراف، البيع، والتأجير.', 'Talk to Engineer', 'استشر مهندساً', 'tel:+966114009800', 6, 1),
    (home_page_id, 'REGIONAL_MAP', 'regional_coverage', 'From Saudi Arabia to Regional Projects', 'من المملكة العربية السعودية إلى المشاريع الإقليمية', 'Strategic Logistics', 'شبكة الإمداد الاستراتيجية', 'Serving domestic megaprojects with end-to-end sales and rental, backed by certified export sales across the GCC and Africa.', 'خدمة المشاريع الكبرى بالمملكة بالبيع والتأجير، مع التصدير المباشر لدول الخليج والشرق الأوسط وأفريقيا.', 'View Logistics Hubs', 'مراكزنا اللوجستية', '/regional', 7, 1),
    (home_page_id, 'FINAL_CTA', 'quote_terminal', 'Bring Us The Structure. We Will Engineer The System.', 'أحضر المخطط المعماري.. وسنتولى الهندسة والتنفيذ.', 'Engineering Consultation', 'استشارة هندسية فورية', 'Upload your structural drawings or CAD files for instant temporary works analysis and quotation.', 'ارفع ملفات الأوتوكاد أو المخططات الإنشائية للحصول على دراسة فورية وعرض سعر معتمد.', 'Submit for Review', 'إرسال للمكتب الفني بالرياض', '#quote-terminal', 8, 1)
]
cursor.executemany('''
INSERT INTO page_sections (
    page_id, section_type, section_key, title_en, title_ar, subtitle_en, subtitle_ar,
    body_en, body_ar, cta_label_en, cta_label_ar, cta_url, display_order, is_visible
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
''', sections)

# Seed Sample Leads
leads = [
    ('ULMA-KSA-9402', 'RFQ', 'Eng. Fahad Al-Otaibi', 'Al Bawani Contracting Co.', 'f.otaibi@albawani.net', '+966 50 123 4567',
     'Riyadh Metro Extension Line 7', 'Riyadh Central', 'ULMA Heavy Shoring MK & BRIO', 'RENTAL', '4,500 m²', '8 Months',
     'Urgent requirement for heavy bridge shoring falsework over high-traffic junction. Need drawings reviewed by chief engineer.',
     'riyadh-metro-ext-dwg.pdf', '/storage/leads/sample-drawing.pdf', 'KSA', 'en', 'IN_REVIEW', 'Reviewed by Chief Structural Engineer. Quote dispatched.'),
    ('ULMA-KSA-8831', 'RENTAL', 'Eng. Tariq Al-Ghamdi', 'Nesma & Partners', 'tariq.g@nesma.com', '+966 55 987 6543',
     'NEOM Mountain Tunnel Portals', 'NEOM Sector 04', 'Saudi Master Piers & Manhole Systems', 'RENTAL', '12 Custom Pier Sets', '14 Months',
     'Looking for heavy custom steel pier moulds for fast cycle casting. Requesting on-site supervision package.',
     'neom-tunnel-portal.dwg', '/storage/leads/neom-portal.dwg', 'KSA', 'en', 'CONTACTED', 'Initial technical meeting conducted via Teams.'),
    ('ULMA-KSA-7712', 'SALES', 'Mr. Robert Van Dijk', 'Red Sea Global JV', 'robert.v@redseaglobal.com', '+966 54 321 0987',
     'Shura Island Coastal Bridge', 'Red Sea Destination', 'ULMA ORMA Wall Formwork & BRIO', 'PURCHASE', '1,800 m²', 'Outright Sale',
     'Direct purchase of hot-dip galvanized marine-spec BRIO ringlock and ORMA panel formwork for island bridge abutments.',
     'shura-island-spec.pdf', '/storage/leads/shura-spec.pdf', 'KSA', 'en', 'NEW', 'Assigned to commercial sales desk.')
]
cursor.executemany('''
INSERT INTO leads (
    ticket_number, lead_type, full_name, company_name, email, phone,
    project_name, project_location, system_interest, transaction_type, quantity_estimate, rental_duration,
    message, attachment_name, attachment_url, region_code, language, status, notes
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
''', leads)

# Commit and close
conn.commit()
conn.close()
print("Database seeding completed successfully with all models, products, and configurations.")
