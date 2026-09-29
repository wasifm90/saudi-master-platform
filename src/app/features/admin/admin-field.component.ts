import { Component, forwardRef, inject, input, output, signal } from '@angular/core';
import { CmsAdminService } from '../../core/services/cms-admin.service';

export interface FieldChange {
  path: string;
  value: unknown;
}

@Component({
  selector: 'sm-admin-field',
  imports: [forwardRef(() => AdminFieldComponent)],
  template: `
    <div class="field" [class.field-group]="isObject() || isArray()">
      @if (label()) {
        <span class="field-label">{{ pretty(label()) }}</span>
      }
      @if (isObject()) {
        <div class="children">
          @for (entry of entries(); track entry[0]) {
            <sm-admin-field
              [label]="entry[0]"
              [path]="path() + '.' + entry[0]"
              [value]="entry[1]"
              (changed)="changed.emit($event)"
            />
          }
        </div>
      } @else if (isArray()) {
        <div class="array-children">
          @for (entry of array(); track $index; let index = $index) {
            <div class="array-item">
              <sm-admin-field
                [label]="'Item ' + (index + 1)"
                [path]="path() + '.' + index"
                [value]="entry"
                (changed)="changed.emit($event)"
              />
              <button type="button" class="field-remove" (click)="remove(index)">
                Remove item
              </button>
            </div>
          }
          <button type="button" class="field-add" (click)="add()">+ Add item</button>
        </div>
      } @else if (isBoolean()) {
        <input type="checkbox" [checked]="value() === true" (change)="setBoolean($event)" />
      } @else if (isNumber()) {
        <input type="number" [value]="value()" (input)="setNumber($event)" />
      } @else {
        @if (multiline()) {
          <textarea rows="4" [value]="stringValue()" (input)="setString($event)"></textarea>
        } @else {
          <input type="text" [value]="stringValue()" (input)="setString($event)" />
        }
        @if (mediaField()) {
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
            (change)="upload($event)"
            aria-label="Upload replacement media"
          />
          @if (uploading()) {
            <small>Uploading…</small>
          }
          @if (error()) {
            <small class="error">{{ error() }}</small>
          }
          @if (stringValue().startsWith('/assets/') && !stringValue().includes('/video/')) {
            <img class="media-preview" [src]="stringValue()" alt="Current media" />
          }
        }
      }
    </div>
  `,
  styles: `
    .field {
      display: grid;
      gap: 7px;
      min-width: 0;
    }
    .field-label {
      color: #455365;
      font: 700 11px var(--display);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .field-group {
      padding: 16px;
      border: 1px solid #d9e2e9;
      border-radius: 16px;
      background: #fff;
    }
    .children {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    }
    .array-children {
      display: grid;
      gap: 12px;
    }
    .array-item {
      display: grid;
      gap: 8px;
      padding: 12px;
      border: 1px solid #e2e8ee;
      border-radius: 12px;
    }
    input:not([type='file']):not([type='checkbox']),
    textarea {
      width: 100%;
      padding: 11px 12px;
      border: 1px solid #c9d5df;
      border-radius: 10px;
      background: #f8fbff;
      color: var(--ink);
    }
    textarea {
      resize: vertical;
      min-height: 100px;
    }
    input[type='file'] {
      width: 100%;
      font-size: 12px;
    }
    input[type='checkbox'] {
      width: 22px;
      height: 22px;
      accent-color: var(--earth);
    }
    button {
      justify-self: start;
      padding: 8px 13px;
      border-radius: 9px;
      border: 1px solid #c9d5df;
      background: #fff;
      color: #37485a;
      font-weight: 700;
    }
    .field-remove {
      color: #a43c25;
    }
    .field-add {
      color: #155b8f;
    }
    .media-preview {
      width: 150px;
      max-height: 105px;
      object-fit: cover;
      border-radius: 9px;
    }
    .error {
      color: #af3624;
    }
  `,
})
export class AdminFieldComponent {
  readonly value = input.required<unknown>();
  readonly path = input.required<string>();
  readonly label = input('');
  readonly changed = output<FieldChange>();
  readonly uploading = signal(false);
  readonly error = signal('');
  private readonly api = inject(CmsAdminService);
  isArray(): boolean {
    return Array.isArray(this.value());
  }
  isObject(): boolean {
    return !!this.value() && typeof this.value() === 'object' && !Array.isArray(this.value());
  }
  isBoolean(): boolean {
    return typeof this.value() === 'boolean';
  }
  isNumber(): boolean {
    return typeof this.value() === 'number';
  }
  entries(): [string, unknown][] {
    return this.isObject() ? Object.entries(this.value() as Record<string, unknown>) : [];
  }
  array(): unknown[] {
    return this.isArray() ? (this.value() as unknown[]) : [];
  }
  stringValue(): string {
    return typeof this.value() === 'string' ? (this.value() as string) : '';
  }
  multiline(): boolean {
    return /description|body|information|tagline|message|benefit|application|content/i.test(
      this.label(),
    );
  }
  mediaField(): boolean {
    return (
      /image|video|poster|gallery/i.test(this.label()) || /^\/assets\//.test(this.stringValue())
    );
  }
  pretty(label: string): string {
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/[-_]/g, ' ')
      .trim();
  }
  setString(event: Event): void {
    this.changed.emit({ path: this.path(), value: (event.target as HTMLInputElement).value });
  }
  setBoolean(event: Event): void {
    this.changed.emit({ path: this.path(), value: (event.target as HTMLInputElement).checked });
  }
  setNumber(event: Event): void {
    this.changed.emit({
      path: this.path(),
      value: Number((event.target as HTMLInputElement).value),
    });
  }
  remove(index: number): void {
    const next = [...this.array()];
    next.splice(index, 1);
    this.changed.emit({ path: this.path(), value: next });
  }
  add(): void {
    const next = [...this.array()];
    const sample = next[0];
    let item: unknown = '';
    if (typeof sample === 'number') item = 0;
    else if (sample && typeof sample === 'object') item = structuredClone(sample);
    else if (/(technicalFeatures|metrics|specifications)$/.test(this.path()))
      item = { label: 'New metric', value: '' };
    next.push(item);
    this.changed.emit({ path: this.path(), value: next });
  }
  async upload(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploading.set(true);
    this.error.set('');
    try {
      this.changed.emit({ path: this.path(), value: await this.api.upload(file) });
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      this.uploading.set(false);
    }
  }
}
