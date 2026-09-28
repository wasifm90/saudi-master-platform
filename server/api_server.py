#!/usr/bin/env python3
import http.server
import socketserver
import json
import sqlite3
import os
import re
import urllib.parse
from datetime import datetime

PORT = 8080
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'database', 'saudi_master.db')
PUBLIC_HTML = os.path.join(BASE_DIR, 'public_html')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

class SaudiMasterHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_HTML, **kwargs)

    def end_headers(self):
        if not self.path.startswith('/api/'):
            if any(self.path.endswith(ext) for ext in ['.js', '.css', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.woff2', '.mp4']):
                self.send_header('Cache-Control', 'public, max-age=86400')
            else:
                self.send_header('Cache-Control', 'no-cache, must-revalidate')
        self.send_header('Connection', 'keep-alive')
        super().end_headers()

    def _send_json(self, status_code, data, meta=None, links=None, errors=None):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Language')
        self.end_headers()
        payload = {
            'data': data,
            'meta': meta or {'timestamp': datetime.utcnow().isoformat() + 'Z', 'api_version': 'v1.0'},
            'links': links or {},
            'errors': errors
        }
        self.wfile.write(json.dumps(payload, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Language')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)
        lang = self.headers.get('X-Language', query.get('lang', ['en'])[0])

        if path.startswith('/api/'):
            self.handle_api_get(path, query, lang)
        else:
            # SPA Routing: If request doesn't match a static file, serve index.html
            file_path = os.path.join(PUBLIC_HTML, path.lstrip('/'))
            if os.path.exists(file_path) and not os.path.isdir(file_path):
                super().do_GET()
            else:
                self.path = '/index.html'
                super().do_GET()

    def handle_api_get(self, path, query, lang):
        conn = get_db()
        c = conn.cursor()
        is_ar = (lang == 'ar')

        try:
            # 1. Site Settings
            if path == '/api/public/site':
                c.execute("SELECT setting_value FROM site_settings WHERE setting_key = 'general'")
                row = c.fetchone()
                settings = json.loads(row['setting_value']) if row else {}
                self._send_json(200, settings)
                return

            # 2. Classifications
            elif path == '/api/public/classifications':
                c.execute("SELECT * FROM product_classifications WHERE is_active = 1 ORDER BY display_order")
                rows = c.fetchall()
                data = []
                for r in rows:
                    data.append({
                        'id': r['id'],
                        'code': r['code'],
                        'name': r['name_ar'] if is_ar else r['name_en'],
                        'slug': r['slug'],
                        'description': r['description_ar'] if is_ar else r['description_en'],
                        'display_order': r['display_order']
                    })
                self._send_json(200, data)
                return

            # 3. Brands
            elif path == '/api/public/brands':
                c.execute("SELECT * FROM brands WHERE is_active = 1 ORDER BY display_order")
                rows = c.fetchall()
                data = [{
                    'id': r['id'],
                    'name': r['name'],
                    'slug': r['slug'],
                    'origin': r['country_of_origin'],
                    'logo': r['logo_url'],
                    'website': r['website'],
                    'description': r['description_ar'] if is_ar else r['description_en']
                } for r in rows]
                self._send_json(200, data)
                return

            # 4. Categories
            elif path == '/api/public/categories':
                c.execute("SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order")
                rows = c.fetchall()
                data = [{
                    'id': r['id'],
                    'name': r['name_ar'] if is_ar else r['name_en'],
                    'slug': r['slug'],
                    'description': r['description_ar'] if is_ar else r['description_en']
                } for r in rows]
                self._send_json(200, data)
                return

            # 5. Products (List)
            elif path == '/api/public/products':
                classification = query.get('classification', [None])[0]
                category = query.get('category', [None])[0]
                search = query.get('q', [None])[0]

                sql = """
                    SELECT p.*, pc.code as class_code, pc.name_en as class_name_en, pc.name_ar as class_name_ar,
                           b.name as brand_name, b.slug as brand_slug, b.country_of_origin as brand_origin,
                           cat.name_en as cat_name_en, cat.name_ar as cat_name_ar, cat.slug as cat_slug
                    FROM products p
                    JOIN product_classifications pc ON p.classification_id = pc.id
                    JOIN brands b ON p.brand_id = b.id
                    JOIN categories cat ON p.category_id = cat.id
                    WHERE p.status = 'PUBLISHED'
                """
                params = []
                if classification:
                    sql += " AND pc.code = ?"
                    params.append(classification.upper())
                if category:
                    sql += " AND cat.slug = ?"
                    params.append(category)
                if search:
                    sql += " AND (p.name_en LIKE ? OR p.name_ar LIKE ? OR p.short_summary_en LIKE ?)"
                    term = f"%{search}%"
                    params.extend([term, term, term])

                sql += " ORDER BY p.display_order ASC"
                c.execute(sql, params)
                rows = c.fetchall()

                data = []
                for r in rows:
                    p_id = r['id']
                    # Fetch applications for product
                    c.execute("""
                        SELECT a.* FROM applications a
                        JOIN product_applications pa ON a.id = pa.application_id
                        WHERE pa.product_id = ?
                    """, (p_id,))
                    app_rows = c.fetchall()
                    apps = [{
                        'id': a['id'],
                        'name': a['name_ar'] if is_ar else a['name_en'],
                        'slug': a['slug'],
                        'icon': a['icon_name']
                    } for a in app_rows]

                    data.append({
                        'id': r['id'],
                        'sku': r['sku'],
                        'slug': r['slug'],
                        'name': r['name_ar'] if is_ar else r['name_en'],
                        'name_en': r['name_en'],
                        'name_ar': r['name_ar'],
                        'tagline': r['tagline_ar'] if is_ar else r['tagline_en'],
                        'classification': {
                            'code': r['class_code'],
                            'name': r['class_name_ar'] if is_ar else r['class_name_en']
                        },
                        'brand': {
                            'name': r['brand_name'],
                            'slug': r['brand_slug'],
                            'origin': r['brand_origin']
                        },
                        'category': {
                            'name': r['cat_name_ar'] if is_ar else r['cat_name_en'],
                            'slug': r['cat_slug']
                        },
                        'short_summary': r['short_summary_ar'] if is_ar else r['short_summary_en'],
                        'what_is_it': r['what_is_it_ar'] if is_ar else r['what_is_it_en'],
                        'what_is_used_for': r['what_is_used_for_ar'] if is_ar else r['what_is_used_for_en'],
                        'how_does_it_work': r['how_does_it_work_ar'] if is_ar else r['how_does_it_work_en'],
                        'key_advantages': json.loads(r['key_advantages_ar'] if is_ar else r['key_advantages_en'] or '[]'),
                        'main_components': json.loads(r['main_components_ar'] if is_ar else r['main_components_en'] or '[]'),
                        'technical_specs': json.loads(r['technical_specs'] or '{}'),
                        'commercial_terms': {
                            'sales_available': bool(r['sales_available']),
                            'rental_available': bool(r['rental_available']),
                            'regional_scope': json.loads(r['regional_availability'] or '[]')
                        },
                        'media': {
                            'hero_image': r['hero_image'],
                            'main_image': r['main_image'],
                            'drawing_url': r['drawing_url'],
                            'brochure_url': r['brochure_url']
                        },
                        'applications': apps,
                        'featured': bool(r['featured']),
                        'status': r['status']
                    })

                self._send_json(200, data, meta={'count': len(data), 'language': lang})
                return

            # 6. Single Product by Slug
            elif path.startswith('/api/public/products/'):
                slug = path.split('/')[-1]
                c.execute("""
                    SELECT p.*, pc.code as class_code, pc.name_en as class_name_en, pc.name_ar as class_name_ar,
                           b.name as brand_name, b.slug as brand_slug, b.country_of_origin as brand_origin,
                           cat.name_en as cat_name_en, cat.name_ar as cat_name_ar, cat.slug as cat_slug
                    FROM products p
                    JOIN product_classifications pc ON p.classification_id = pc.id
                    JOIN brands b ON p.brand_id = b.id
                    JOIN categories cat ON p.category_id = cat.id
                    WHERE p.slug = ? AND p.status = 'PUBLISHED'
                """, (slug,))
                r = c.fetchone()
                if not r:
                    self._send_json(404, None, errors=['Product not found'])
                    return

                p_id = r['id']
                c.execute("""
                    SELECT a.* FROM applications a
                    JOIN product_applications pa ON a.id = pa.application_id
                    WHERE pa.product_id = ?
                """, (p_id,))
                apps = [{
                    'id': a['id'],
                    'name': a['name_ar'] if is_ar else a['name_en'],
                    'slug': a['slug'],
                    'icon': a['icon_name']
                } for a in c.fetchall()]

                data = {
                    'id': r['id'],
                    'sku': r['sku'],
                    'slug': r['slug'],
                    'name': r['name_ar'] if is_ar else r['name_en'],
                    'name_en': r['name_en'],
                    'name_ar': r['name_ar'],
                    'tagline': r['tagline_ar'] if is_ar else r['tagline_en'],
                    'classification': {
                        'code': r['class_code'],
                        'name': r['class_name_ar'] if is_ar else r['class_name_en']
                    },
                    'brand': {
                        'name': r['brand_name'],
                        'slug': r['brand_slug'],
                        'origin': r['brand_origin']
                    },
                    'category': {
                        'name': r['cat_name_ar'] if is_ar else r['cat_name_en'],
                        'slug': r['cat_slug']
                    },
                    'short_summary': r['short_summary_ar'] if is_ar else r['short_summary_en'],
                    'what_is_it': r['what_is_it_ar'] if is_ar else r['what_is_it_en'],
                    'what_is_used_for': r['what_is_used_for_ar'] if is_ar else r['what_is_used_for_en'],
                    'how_does_it_work': r['how_does_it_work_ar'] if is_ar else r['how_does_it_work_en'],
                    'key_advantages': json.loads(r['key_advantages_ar'] if is_ar else r['key_advantages_en'] or '[]'),
                    'main_components': json.loads(r['main_components_ar'] if is_ar else r['main_components_en'] or '[]'),
                    'technical_specs': json.loads(r['technical_specs'] or '{}'),
                    'commercial_terms': {
                        'sales_available': bool(r['sales_available']),
                        'rental_available': bool(r['rental_available']),
                        'regional_scope': json.loads(r['regional_availability'] or '[]')
                    },
                    'media': {
                        'hero_image': r['hero_image'],
                        'main_image': r['main_image'],
                        'drawing_url': r['drawing_url'],
                        'brochure_url': r['brochure_url']
                    },
                    'applications': apps
                }
                self._send_json(200, data)
                return

            # 7. Assembly Sequence
            elif path.startswith('/api/public/assembly/'):
                seq_id = 1
                c.execute("SELECT * FROM assembly_steps WHERE sequence_id = ? ORDER BY step_number ASC", (seq_id,))
                rows = c.fetchall()
                steps = [{
                    'step': r['step_number'],
                    'title': r['title_ar'] if is_ar else r['title_en'],
                    'description': r['description_ar'] if is_ar else r['description_en'],
                    'image': r['image_url'],
                    'spec_a': {'label': r['spec_a_label'], 'value': r['spec_a_value']},
                    'spec_b': {'label': r['spec_b_label'], 'value': r['spec_b_value']}
                } for r in rows]
                self._send_json(200, steps)
                return

            # 8. Hotspots
            elif path.startswith('/api/public/hotspots'):
                c.execute("SELECT * FROM hotspots ORDER BY node_number ASC")
                rows = c.fetchall()
                data = [{
                    'node': r['node_number'],
                    'x': r['x_percent'],
                    'y': r['y_percent'],
                    'category': r['category_ar'] if is_ar else r['category_en'],
                    'title': r['title_ar'] if is_ar else r['title_en'],
                    'rating': r['rating'],
                    'description': r['description_ar'] if is_ar else r['description_en'],
                    'specs': json.loads(r['specifications'] or '{}')
                } for r in rows]
                self._send_json(200, data)
                return

            # 9. Services
            elif path == '/api/public/services':
                c.execute("SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC")
                rows = c.fetchall()
                data = [{
                    'id': r['id'],
                    'slug': r['slug'],
                    'name': r['name_ar'] if is_ar else r['name_en'],
                    'summary': r['summary_ar'] if is_ar else r['summary_en'],
                    'description': r['description_ar'] if is_ar else r['description_en'],
                    'icon': r['icon_name'],
                    'image': r['image_url']
                } for r in rows]
                self._send_json(200, data)
                return

            # 10. Regions & Capabilities
            elif path == '/api/public/regions':
                c.execute("SELECT * FROM regions WHERE is_active = 1")
                rows = c.fetchall()
                data = [{
                    'code': r['code'],
                    'name': r['name_ar'] if is_ar else r['name_en'],
                    'sales_allowed': bool(r['sales_allowed']),
                    'rental_allowed': bool(r['rental_allowed']),
                    'supervision_allowed': bool(r['supervision_allowed']),
                    'description': r['description_ar'] if is_ar else r['description_en'],
                    'hubs': json.loads(r['hub_locations'] or '[]')
                } for r in rows]
                self._send_json(200, data)
                return

            # 11. Projects
            elif path == '/api/public/projects':
                c.execute("SELECT * FROM projects WHERE status = 'PUBLISHED' ORDER BY display_order ASC")
                rows = c.fetchall()
                data = [{
                    'id': r['id'],
                    'slug': r['slug'],
                    'name': r['name_ar'] if is_ar else r['name_en'],
                    'location': r['location_ar'] if is_ar else r['location_en'],
                    'industry': r['industry_ar'] if is_ar else r['industry_en'],
                    'hero_image': r['hero_image'],
                    'summary': r['summary_ar'] if is_ar else r['summary_en'],
                    'challenge': r['challenge_ar'] if is_ar else r['challenge_en'],
                    'solution': r['solution_ar'] if is_ar else r['solution_en'],
                    'execution': r['execution_ar'] if is_ar else r['execution_en'],
                    'results': r['results_ar'] if is_ar else r['results_en'],
                    'metrics': json.loads(r['key_metrics'] or '[]')
                } for r in rows]
                self._send_json(200, data)
                return

            # 12. Manufacturing
            elif path == '/api/public/manufacturing':
                c.execute("SELECT * FROM manufacturing_facilities LIMIT 1")
                fac = c.fetchone()
                c.execute("SELECT * FROM manufacturing_processes ORDER BY step_number ASC")
                proc_rows = c.fetchall()

                data = {
                    'facility': {
                        'name': fac['name_ar'] if is_ar else fac['name_en'],
                        'location': fac['location_ar'] if is_ar else fac['location_en'],
                        'iktva_score': fac['iktva_score'],
                        'overview': fac['overview_ar'] if is_ar else fac['overview_en'],
                        'capabilities': json.loads(fac['capabilities']),
                        'hero_image': fac['hero_image']
                    },
                    'processes': [{
                        'step': p['step_number'],
                        'name': p['name_ar'] if is_ar else p['name_en'],
                        'summary': p['summary_ar'] if is_ar else p['summary_en'],
                        'image': p['image_url'],
                        'tag': p['step_tag']
                    } for p in proc_rows]
                }
                self._send_json(200, data)
                return

            # 13. Homepage Sections
            elif path == '/api/public/home/sections':
                c.execute("SELECT * FROM page_sections WHERE is_visible = 1 ORDER BY display_order ASC")
                rows = c.fetchall()
                data = [{
                    'id': r['id'],
                    'type': r['section_type'],
                    'key': r['section_key'],
                    'title': r['title_ar'] if is_ar else r['title_en'],
                    'subtitle': r['subtitle_ar'] if is_ar else r['subtitle_en'],
                    'body': r['body_ar'] if is_ar else r['body_en'],
                    'cta_label': r['cta_label_ar'] if is_ar else r['cta_label_en'],
                    'cta_url': r['cta_url'],
                    'order': r['display_order']
                } for r in rows]
                self._send_json(200, data)
                return

            # 14. ADMIN: All products (including DRAFT, PUBLISHED, ARCHIVED)
            elif path == '/api/admin/products':
                c.execute("""
                    SELECT p.*, pc.code as class_code, b.name as brand_name, cat.name_en as cat_name
                    FROM products p
                    JOIN product_classifications pc ON p.classification_id = pc.id
                    JOIN brands b ON p.brand_id = b.id
                    JOIN categories cat ON p.category_id = cat.id
                    ORDER BY p.id DESC
                """)
                rows = c.fetchall()
                data = [dict(r) for r in rows]
                self._send_json(200, data)
                return

            # 15. ADMIN: Leads
            elif path == '/api/admin/leads':
                c.execute("SELECT * FROM leads ORDER BY id DESC")
                rows = c.fetchall()
                data = [dict(r) for r in rows]
                self._send_json(200, data)
                return

            # 16. ADMIN: Page Sections
            elif path == '/api/admin/page-sections':
                c.execute("SELECT * FROM page_sections ORDER BY display_order ASC")
                rows = c.fetchall()
                data = [dict(r) for r in rows]
                self._send_json(200, data)
                return

            else:
                self._send_json(404, None, errors=['Endpoint not found'])
        finally:
            conn.close()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        try:
            payload = json.loads(body) if body else {}
        except Exception:
            payload = {}

        conn = get_db()
        c = conn.cursor()

        try:
            # 1. Lead / RFQ Submission
            if path == '/api/public/leads/rfq':
                ticket = f"ULMA-KSA-{int(datetime.utcnow().timestamp()) % 1000000:06d}"
                c.execute("""
                    INSERT INTO leads (
                        ticket_number, lead_type, full_name, company_name, email, phone,
                        project_name, project_location, system_interest, transaction_type,
                        quantity_estimate, rental_duration, message, attachment_name, region_code, language, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    ticket, payload.get('lead_type', 'RFQ'), payload.get('full_name', 'Anonymous'),
                    payload.get('company_name', ''), payload.get('email', 'not-provided@saudimaster.com'),
                    payload.get('phone', ''), payload.get('project_name', ''), payload.get('project_location', ''),
                    payload.get('system_interest', 'General Formwork Package'),
                    payload.get('transaction_type', 'UNSPECIFIED'), payload.get('quantity_estimate', ''),
                    payload.get('rental_duration', ''), payload.get('message', ''), payload.get('attachment_name', ''),
                    payload.get('region_code', 'KSA'), payload.get('language', 'en'), 'NEW'
                ))
                conn.commit()

                self._send_json(201, {
                    'ticket_number': ticket,
                    'status': 'NEW',
                    'message': 'Your RFQ specification has been safely registered and assigned to the Riyadh Engineering Desk.'
                })
                return

            # 2. ADMIN: Create Product
            elif path == '/api/admin/products':
                c.execute("""
                    INSERT INTO products (
                        classification_id, brand_id, category_id, sku, slug, name_en, name_ar,
                        short_summary_en, short_summary_ar, what_is_it_en, what_is_it_ar,
                        what_is_used_for_en, what_is_used_for_ar, how_does_it_work_en, how_does_it_work_ar,
                        technical_specs, hero_image, main_image, status, sales_available, rental_available
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    payload.get('classification_id', 1), payload.get('brand_id', 1), payload.get('category_id', 1),
                    payload.get('sku', 'SM-NEW-01'), payload.get('slug', f"product-{int(datetime.utcnow().timestamp())}"),
                    payload.get('name_en', 'New System'), payload.get('name_ar', 'نظام جديد'),
                    payload.get('short_summary_en', ''), payload.get('short_summary_ar', ''),
                    payload.get('what_is_it_en', ''), payload.get('what_is_it_ar', ''),
                    payload.get('what_is_used_for_en', ''), payload.get('what_is_used_for_ar', ''),
                    payload.get('how_does_it_work_en', ''), payload.get('how_does_it_work_ar', ''),
                    json.dumps(payload.get('technical_specs', {})),
                    payload.get('hero_image', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK86M6MuuAJy4gzOqYKqV9iT2-XutMwbYgGDKinXR2Lc1VDSYKP3O1a-Xk_XmUGLAzlN87_CMJyNzOI1DpeqIX-Fnbz6hHuf4LRDyomFRX1ZkoJWasu32WqNZlEFMthG-rHc86VnPptcbAeGEuV0R4qpFiEAqxHDU1d739wfB8OfSx04FWmdeXMiDCrCYIdak38mI6T9KbxgmvUcKtWlaSyTKWaTXXgCkGxFBplLyH-83p9JdA05Ka'),
                    payload.get('main_image', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK86M6MuuAJy4gzOqYKqV9iT2-XutMwbYgGDKinXR2Lc1VDSYKP3O1a-Xk_XmUGLAzlN87_CMJyNzOI1DpeqIX-Fnbz6hHuf4LRDyomFRX1ZkoJWasu32WqNZlEFMthG-rHc86VnPptcbAeGEuV0R4qpFiEAqxHDU1d739wfB8OfSx04FWmdeXMiDCrCYIdak38mI6T9KbxgmvUcKtWlaSyTKWaTXXgCkGxFBplLyH-83p9JdA05Ka'),
                    payload.get('status', 'DRAFT'), payload.get('sales_available', 1), payload.get('rental_available', 1)
                ))
                new_id = c.lastrowid
                conn.commit()
                self._send_json(201, {'id': new_id, 'message': 'Product created successfully'})
                return

            else:
                self._send_json(404, None, errors=['Action not supported'])
        finally:
            conn.close()

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        try:
            payload = json.loads(body) if body else {}
        except Exception:
            payload = {}

        conn = get_db()
        c = conn.cursor()

        try:
            # ADMIN: Update Product
            if path.startswith('/api/admin/products/'):
                product_id = int(path.split('/')[-1])
                fields = []
                values = []
                for k in ['sku', 'name_en', 'name_ar', 'short_summary_en', 'short_summary_ar', 'what_is_it_en', 'what_is_it_ar', 'what_is_used_for_en', 'what_is_used_for_ar', 'how_does_it_work_en', 'how_does_it_work_ar', 'main_image', 'hero_image', 'status', 'sales_available', 'rental_available']:
                    if k in payload:
                        fields.append(f"{k} = ?")
                        values.append(payload[k])

                if fields:
                    values.append(product_id)
                    c.execute(f"UPDATE products SET {', '.join(fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?", values)
                    conn.commit()
                self._send_json(200, {'message': f"Product {product_id} updated successfully in database."})
                return

            # ADMIN: Full DB Snapshot Sync
            elif path == '/api/admin/sync-full-db':
                # Sync products, hero, site settings directly into SQLite
                if 'products' in payload:
                    for p in payload['products']:
                        c.execute("""
                            UPDATE products SET
                                name_en = ?, name_ar = ?, short_summary_en = ?, short_summary_ar = ?,
                                what_is_it_en = ?, what_is_it_ar = ?, what_is_used_for_en = ?, what_is_used_for_ar = ?,
                                main_image = ?, hero_image = ?, sales_available = ?, rental_available = ?,
                                updated_at = CURRENT_TIMESTAMP
                            WHERE id = ? OR sku = ?
                        """, (
                            p.get('name_en'), p.get('name_ar'), p.get('short_summary_en'), p.get('short_summary_ar'),
                            p.get('what_is_it_en'), p.get('what_is_it_ar'), p.get('what_is_used_for_en'), p.get('what_is_used_for_ar'),
                            p.get('main_image'), p.get('hero_image'), p.get('sales_available', 1), p.get('rental_available', 1),
                            p.get('id'), p.get('sku')
                        ))
                if 'site' in payload:
                    c.execute("UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = 'general'", (json.dumps(payload['site']),))
                conn.commit()
                self._send_json(200, {'message': 'Full database snapshot synchronized successfully with SQLite backend.'})
                return

            # ADMIN: Update Site Settings
            elif path == '/api/admin/settings':
                c.execute("UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = 'general'", (json.dumps(payload),))
                conn.commit()
                self._send_json(200, {'message': 'Site settings updated successfully and public cache refreshed.'})
                return

            # ADMIN: Toggle Section Visibility or Order
            elif path.startswith('/api/admin/page-sections/'):
                section_id = int(path.split('/')[-1])
                if 'is_visible' in payload:
                    c.execute("UPDATE page_sections SET is_visible = ? WHERE id = ?", (payload['is_visible'], section_id))
                if 'display_order' in payload:
                    c.execute("UPDATE page_sections SET display_order = ? WHERE id = ?", (payload['display_order'], section_id))
                conn.commit()
                self._send_json(200, {'message': f"Page section {section_id} updated."})
                return

            else:
                self._send_json(404, None, errors=['Action not supported'])
        finally:
            conn.close()

    def do_PATCH(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        payload = json.loads(body) if body else {}

        conn = get_db()
        c = conn.cursor()

        try:
            # ADMIN: Update Lead Status
            if path.startswith('/api/admin/leads/') and path.endswith('/status'):
                lead_id = int(path.split('/')[-2])
                new_status = payload.get('status', 'IN_REVIEW')
                notes = payload.get('notes', None)
                if notes:
                    c.execute("UPDATE leads SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (new_status, notes, lead_id))
                else:
                    c.execute("UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (new_status, lead_id))
                conn.commit()
                self._send_json(200, {'message': f"Lead {lead_id} status updated to {new_status}."})
                return
            else:
                self._send_json(404, None, errors=['Action not supported'])
        finally:
            conn.close()

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

if __name__ == '__main__':
    httpd = ThreadedHTTPServer(("", PORT), SaudiMasterHandler)
    print(f"Saudi Master Multi-Threaded High-Performance Server listening on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()

