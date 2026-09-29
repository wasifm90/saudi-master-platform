import { afterNextRender, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CmsAdminService } from '../../core/services/cms-admin.service';
import {
  DEFAULT_CONTENT,
  SiteContent,
  SiteContentStore,
} from '../../core/services/site-content.store';
import { AdminFieldComponent, FieldChange } from './admin-field.component';
import { SeoService } from '../../core/services/seo.service';

type SectionKey = keyof SiteContent;
const SECTION_NAMES: { key: SectionKey; label: string }[] = [
  { key: 'visibility', label: 'Homepage sections' },
  { key: 'home', label: 'Homepage text' },
  { key: 'media', label: 'Hero images & videos' },
  { key: 'labels', label: 'Buttons & labels' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'products', label: 'Products' },
  { key: 'geometries', label: 'Geometry panels' },
  { key: 'assembly', label: 'Assembly stages' },
  { key: 'services', label: 'Services' },
  { key: 'processes', label: 'Manufacturing' },
  { key: 'projects', label: 'Projects' },
  { key: 'industries', label: 'Industries' },
  { key: 'articles', label: 'Insights' },
  { key: 'jobs', label: 'Careers' },
  { key: 'pages', label: 'Page content' },
  { key: 'collectionCopy', label: 'Collection headings' },
  { key: 'company', label: 'Company & contact' },
];

@Component({
  selector: 'sm-admin',
  imports: [FormsModule, RouterLink, AdminFieldComponent],
  template: `
    <section class="admin-shell shell" aria-labelledby="admin-title">
      <div class="admin-heading">
        <div>
          <p class="eyebrow">Saudi Master / Content operations</p>
          <h1 id="admin-title">Site control</h1>
          <p>Edit copy, media and collections, then publish the full site document.</p>
        </div>
        <a routerLink="/" class="button secondary">View website ↗</a>
      </div>
      @if (loading()) {
        <p class="notice">Checking administrator session…</p>
      } @else if (!api.authenticated()) {
        <form class="login-card" (ngSubmit)="login()">
          <h2>Administrator sign in</h2>
          @if (!api.configured()) {
            <p class="error">
              Set CMS_ADMIN_PASSWORD_HASH in your PHP hosting environment to enable publishing.
            </p>
          }
          <label for="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            name="password"
            autocomplete="current-password"
            [(ngModel)]="password"
            required
          />
          <button class="button" type="submit" [disabled]="busy() || !password">
            {{ busy() ? 'Signing in…' : 'Sign in' }}
          </button>
          @if (message()) {
            <p class="error" role="alert">{{ message() }}</p>
          }
        </form>
      } @else {
        <div class="admin-toolbar">
          <span
            >Revision {{ revision() }} ·
            {{ dirty() ? 'Unpublished edits' : 'Published content loaded' }}</span
          >
          <div class="admin-actions">
            <button type="button" (click)="exportJson()">Export backup</button>
            <label class="import-label"
              >Import JSON
              <input type="file" accept="application/json,.json" (change)="importJson($event)"
            /></label>
            <button type="button" (click)="reload()" [disabled]="busy()">Reload published</button>
            <button type="button" (click)="logout()">Sign out</button>
            <button
              type="button"
              class="publish"
              (click)="publish()"
              [disabled]="busy() || !dirty()"
            >
              {{ busy() ? 'Publishing…' : 'Publish changes' }}
            </button>
          </div>
        </div>
        @if (message()) {
          <p class="notice" role="status">{{ message() }}</p>
        }
        <div class="admin-layout">
          <nav class="admin-nav" aria-label="Content sections">
            @for (section of sections; track section.key) {
              <button
                type="button"
                [class.active]="selected() === section.key"
                (click)="choose(section.key)"
              >
                <span>{{ section.label }}</span
                ><span>{{ count(section.key) }}</span>
              </button>
            }
          </nav>
          <div class="admin-editor">
            <div class="editor-heading">
              <div>
                <p class="eyebrow">Content section</p>
                <h2>{{ sectionLabel() }}</h2>
              </div>
              @if (isCollection()) {
                <button type="button" class="add-record" (click)="addRecord()">+ Add record</button>
              }
            </div>
            @if (isCollection()) {
              <div class="record-list" role="group" [attr.aria-label]="sectionLabel() + ' records'">
                @for (item of collection(); track $index; let index = $index) {
                  <button
                    type="button"
                    [class.active]="selectedIndex() === index"
                    (click)="selectedIndex.set(index)"
                  >
                    {{ recordLabel(item, index) }}
                  </button>
                }
              </div>
              @if (collection().length) {
                <div class="record-top">
                  <strong>Record {{ selectedIndex() + 1 }} of {{ collection().length }}</strong
                  ><button type="button" class="remove-record" (click)="removeRecord()">
                    Remove record
                  </button>
                </div>
                <sm-admin-field
                  [label]="sectionLabel()"
                  [path]="selected() + '.' + selectedIndex()"
                  [value]="selectedValue()"
                  (changed)="apply($event)"
                />
              } @else {
                <p class="notice">No records. Add one to publish this section.</p>
              }
            } @else {
              <sm-admin-field
                [label]="sectionLabel()"
                [path]="selected()"
                [value]="selectedValue()"
                (changed)="apply($event)"
              />
            }
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    .admin-shell {
      padding-block: 44px 100px;
    }
    .admin-heading {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 24px;
      margin-bottom: 28px;
    }
    .admin-heading h1 {
      margin: 5px 0;
    }
    .admin-heading p:last-child {
      color: var(--muted);
      margin: 0;
    }
    .login-card {
      max-width: 480px;
      display: grid;
      gap: 15px;
      padding: 30px;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 22px;
      box-shadow: 0 18px 42px #243b5515;
    }
    .login-card h2 {
      margin: 0;
    }
    .login-card label {
      font-weight: 700;
    }
    .login-card input {
      min-height: 48px;
      padding: 12px;
      border: 1px solid #ccd9e2;
      border-radius: 10px;
    }
    .login-card button {
      justify-self: start;
    }
    .error {
      color: #a33928;
    }
    .notice {
      padding: 14px 18px;
      border: 1px solid #c7dae9;
      background: #eff7fd;
      border-radius: 12px;
      color: #23506c;
    }
    .admin-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      padding: 15px 18px;
      margin-bottom: 20px;
      border: 1px solid #d4e0e9;
      border-radius: 16px;
      background: #fff;
    }
    .admin-toolbar > span {
      color: #596a77;
      font: 700 12px var(--display);
    }
    .admin-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    .admin-actions button,
    .import-label,
    .add-record,
    .remove-record {
      min-height: 40px;
      padding: 9px 13px;
      border: 1px solid #cedce6;
      border-radius: 10px;
      background: #f7fbfe;
      color: #30495b;
      font: 700 11px var(--display);
    }
    .import-label {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
    }
    .import-label input {
      position: absolute;
      opacity: 0;
      width: 1px;
    }
    .admin-actions .publish {
      background: #0f5b8d;
      border-color: #0f5b8d;
      color: #fff;
    }
    .admin-layout {
      display: grid;
      grid-template-columns: 230px minmax(0, 1fr);
      align-items: start;
      gap: 22px;
    }
    .admin-nav {
      position: sticky;
      top: 105px;
      display: grid;
      max-height: calc(100vh - 120px);
      overflow: auto;
      padding: 8px;
      border: 1px solid #d7e2e9;
      border-radius: 18px;
      background: #fff;
    }
    .admin-nav button {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      width: 100%;
      padding: 11px 12px;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: #405165;
      text-align: left;
      font: 700 12px var(--display);
    }
    .admin-nav button.active {
      background: #eaf5fd;
      color: #075a92;
    }
    .admin-editor {
      min-width: 0;
      padding: 23px;
      border: 1px solid #d7e2e9;
      border-radius: 20px;
      background: #f7fafc;
    }
    .editor-heading,
    .record-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
    }
    .editor-heading h2 {
      margin: 0 0 18px;
    }
    .add-record {
      background: #e6f3fb;
      color: #075a92;
    }
    .record-list {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 15px;
      margin-bottom: 15px;
      border-bottom: 1px solid #d7e2e9;
    }
    .record-list button {
      flex: none;
      max-width: 230px;
      padding: 9px 13px;
      border: 1px solid #d2dfe8;
      border-radius: 99px;
      background: #fff;
      color: #44586a;
      font: 700 11px var(--display);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .record-list button.active {
      background: #0f5b8d;
      border-color: #0f5b8d;
      color: white;
    }
    .record-top {
      margin-bottom: 12px;
      color: #546678;
      font: 700 11px var(--display);
    }
    .remove-record {
      color: #a43c25;
    }
    @media (max-width: 800px) {
      .admin-layout {
        grid-template-columns: 1fr;
      }
      .admin-nav {
        position: static;
        display: flex;
        overflow-x: auto;
        max-height: none;
      }
      .admin-nav button {
        white-space: nowrap;
        width: auto;
      }
      .admin-heading {
        align-items: start;
        flex-direction: column;
      }
      .admin-editor {
        padding: 15px;
      }
    }
  `,
})
export class AdminComponent {
  readonly api = inject(CmsAdminService);
  private readonly store = inject(SiteContentStore);
  readonly sections = SECTION_NAMES;
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly dirty = signal(false);
  readonly message = signal('');
  readonly selected = signal<SectionKey>('products');
  readonly selectedIndex = signal(0);
  readonly revision = signal(0);
  readonly draft = signal<SiteContent>(structuredClone(DEFAULT_CONTENT));
  password = '';

  constructor() {
    inject(SeoService).set(
      'Site control',
      'Administrator content management.',
      '/admin',
      undefined,
      true,
    );
    afterNextRender(() => void this.initialize());
  }

  private async initialize(): Promise<void> {
    try {
      await this.api.status();
      if (this.api.authenticated()) await this.reload();
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Admin API is unavailable.');
    } finally {
      this.loading.set(false);
    }
  }
  async login(): Promise<void> {
    this.busy.set(true);
    this.message.set('');
    try {
      await this.api.login(this.password);
      this.password = '';
      await this.reload();
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Sign in failed.');
    } finally {
      this.busy.set(false);
    }
  }
  async logout(): Promise<void> {
    try {
      await this.api.logout();
      this.message.set('');
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Sign out failed.');
    }
  }
  async reload(): Promise<void> {
    this.busy.set(true);
    try {
      if (!(await this.store.load()))
        throw new Error('Could not load published content from the PHP/MySQL API.');
      this.draft.set(structuredClone(this.store.content()));
      this.revision.set(this.store.revision());
      this.dirty.set(false);
      this.message.set('Published content loaded.');
    } catch (error) {
      this.message.set(
        error instanceof Error ? error.message : 'Could not load published content.',
      );
    } finally {
      this.busy.set(false);
    }
  }
  async publish(): Promise<void> {
    this.busy.set(true);
    this.message.set('');
    try {
      const next = await this.api.publish(this.draft(), this.revision());
      this.revision.set(next);
      this.store.revision.set(next);
      this.store.content.set(structuredClone(this.draft()));
      this.dirty.set(false);
      this.message.set('Published. Refresh the website to view the changes.');
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Publish failed.');
    } finally {
      this.busy.set(false);
    }
  }
  choose(key: SectionKey): void {
    this.selected.set(key);
    this.selectedIndex.set(0);
    this.message.set('');
  }
  sectionLabel(): string {
    return (
      this.sections.find((section) => section.key === this.selected())?.label ?? this.selected()
    );
  }
  isCollection(): boolean {
    return Array.isArray(this.draft()[this.selected()]);
  }
  collection(): unknown[] {
    const value = this.draft()[this.selected()];
    return Array.isArray(value) ? value : [];
  }
  selectedValue(): unknown {
    return this.isCollection()
      ? this.collection()[this.selectedIndex()]
      : this.draft()[this.selected()];
  }
  count(key: SectionKey): string {
    const value = this.draft()[key];
    return Array.isArray(value) ? String(value.length) : '';
  }
  recordLabel(value: unknown, index: number): string {
    if (typeof value !== 'object' || !value) return `Item ${index + 1}`;
    const record = value as Record<string, unknown>;
    return String(record['name'] ?? record['title'] ?? record['label'] ?? `Item ${index + 1}`);
  }
  apply(change: FieldChange): void {
    const next = structuredClone(this.draft()) as unknown as Record<string, unknown>;
    const parts = change.path.split('.');
    let current: Record<string, unknown> | unknown[] = next;
    for (const part of parts.slice(0, -1))
      current = (current as Record<string, unknown>)[part] as Record<string, unknown>;
    (current as Record<string, unknown>)[parts[parts.length - 1]!] = change.value;
    this.draft.set(next as unknown as SiteContent);
    this.dirty.set(true);
  }
  addRecord(): void {
    const key = this.selected();
    const items = [...this.collection()];
    let item = items.length
      ? (structuredClone(items[0]) as Record<string, unknown>)
      : this.emptyRecord(key);
    const id = item['id'];
    if (typeof id === 'number')
      item['id'] =
        Math.max(
          0,
          ...items.map((value) => Number((value as Record<string, unknown>)['id']) || 0),
        ) + 1;
    else if (typeof id === 'string') item['id'] = `new-${Date.now()}`;
    if ('slug' in item) item['slug'] = `new-${Date.now()}`;
    if ('name' in item) item['name'] = 'New item';
    if ('title' in item) item['title'] = 'New item';
    if ('label' in item) item['label'] = 'New item';
    for (const mediaKey of ['image', 'featuredImage', 'video']) {
      if (mediaKey in item) item[mediaKey] = '';
    }
    if ('gallery' in item) item['gallery'] = [];
    items.push(item);
    this.apply({ path: key, value: items });
    this.selectedIndex.set(items.length - 1);
  }
  private emptyRecord(key: SectionKey): Record<string, unknown> {
    switch (key) {
      case 'articles':
        return {
          id: `new-${Date.now()}`,
          slug: `new-${Date.now()}`,
          name: 'New article',
          description: '',
          image: '',
          body: [],
          displayOrder: 0,
          publishedAt: new Date().toISOString().slice(0, 10),
        };
      case 'jobs':
        return { id: `new-${Date.now()}`, title: 'New role', location: '', description: '' };
      case 'navigation':
        return { label: 'New link', path: '/' };
      default:
        return { id: `new-${Date.now()}`, name: 'New item', description: '', image: '' };
    }
  }
  removeRecord(): void {
    const items = [...this.collection()];
    items.splice(this.selectedIndex(), 1);
    this.apply({ path: this.selected(), value: items });
    this.selectedIndex.set(Math.max(0, Math.min(this.selectedIndex(), items.length - 1)));
  }
  exportJson(): void {
    const blob = new Blob([JSON.stringify(this.draft(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `saudi-master-content-r${this.revision()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
  async importJson(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as SiteContent;
      if (!Array.isArray(parsed.products) || !parsed.company || !parsed.home)
        throw new Error('This is not a site content export.');
      this.draft.set(parsed);
      this.dirty.set(true);
      this.message.set('Import loaded. Review it before publishing.');
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Import failed.');
    }
  }
}
