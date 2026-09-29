"""One-time export: retain source copy and database application relationships.
Geometry taxonomy is curated from the existing product usage descriptions, never UI state.
"""
import json, sqlite3, pathlib, re
root=pathlib.Path(__file__).resolve().parent.parent
raw=(root/'archive/legacy/public_html/js/seed_data.js').read_text(); db=json.loads(raw[raw.index('{'):raw.rindex('}')+1])
conn=sqlite3.connect(root/'database/saudi_master.db')
apps={p['id']:[r[0] for r in conn.execute('SELECT a.slug FROM applications a JOIN product_applications pa ON pa.application_id=a.id WHERE pa.product_id=?',(p['id'],))] for p in db['products']}
geometry={
 'cuplock-scaffolding':['slab'],
 'manhole-systems':['circular'],
 'circular-column-systems':['column','circular','bridge'],
 'precast-panels':['wall'],
 'grinder-steel-shutter':['wall'],
 'piers-formwork':['column','bridge'],
 'ulma-formwork':['wall','high-rise'],
 'ulma-brio-ringlock':['circular'],
 'ulma-heavy-shoring':['slab','bridge'],
 'specialized-formwork':['high-rise'],
 'project-specific-engineering':['bridge'],
 'circular-working-platforms':['circular','column']
}
def asset(s): return '/assets/'+s.replace('.jpg','.webp') if s else ''
def slug(s): return re.sub('[^a-z0-9]+','-',s.lower()).strip('-')
def save(name,data): (root/f'src/app/data/{name}.json').write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
products=[]
for p in db['products']:
 products.append(dict(id=p['id'],slug=p['slug'],sku=p['sku'],name=p['name_en'],nameAr=p['name_ar'],classification=p['class_code'],manufacturer=p['brand_name'],tagline=p['tagline_en'],shortDescription=p['short_summary_en'],description=p['what_is_it_en'],systemInformation=p['how_does_it_work_en'],applicationDescription=p['what_is_used_for_en'],applications=apps[p['id']],geometryCategories=geometry[p['slug']],benefits=p['key_advantages_en'],components=p['main_components_en'],technicalFeatures=[dict(label=k.replace('_',' ').title(),value=str(v)) for k,v in p['technical_specs'].items()],featuredImage=asset(p['main_image']),gallery=list(dict.fromkeys([asset(p['main_image']),asset(p['hero_image'])])),video=p['video_url'],displayOrder=p['display_order'],active=p['status']=='PUBLISHED'))
save('products',products)
labels={'wall':'Wall & Shear','column':'Column & Pier','circular':'Circular & Curved','slab':'Slab & Shoring','high-rise':'High-Rise Climbing','bridge':'Bridge & Viaduct'}
save('geometries',[dict(id=g['id'],name=labels[g['id']],description=g['desc_en'],image=asset(g['image'])) for g in db['geometries']])
save('assembly',[dict(id=s['step_number'],title=s['title_en'],description=s['description_en'],image=asset(s['image_url']),technicalFeatures=[dict(label=s['spec_a_label'],value=s['spec_a_value']),dict(label=s['spec_b_label'],value=s['spec_b_value'])]) for s in db['assembly']])
save('projects',[dict(id=str(p['id']),slug=slug(p['name_en']),name=p['name_en'],description=p['summary_en'],image=asset(p['hero_image']),body=[p['solution_en']],displayOrder=i,location=p['location_en'],industry=p['industry_en'],metrics=p['metrics']) for i,p in enumerate(db['projects'])])
service_images=['design-build','general-contracting','construction-management','civil-structural','specialized-infrastructure']
save('services',[dict(id=str(s['id']),slug=slug(s['name_en']),name=s['name_en'],description=s['summary_en'],image='/assets/images/services/'+service_images[i]+'.webp',body=[s['summary_en']],displayOrder=i) for i,s in enumerate(db['services'])])
save('processes',[dict(id=p['id'],name=p['name_en'],description=p['summary_en'],image=asset(p['image_url'])) for p in db['processes']])
s=db['site'];save('company',dict(name=s['company_name_en'],tagline=s['tagline_en'],description='Engineering formwork, high-load shoring towers, and modular scaffolding across the Kingdom of Saudi Arabia.',phone=s['phone'],email=s['email'],address=s['address_en']))
