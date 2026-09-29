import { Injectable, signal } from '@angular/core';
import { SiteContent } from './site-content.store';

async function responseJson(response: Response): Promise<Record<string, unknown>> {
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) throw new Error(String(data['error'] ?? `Request failed (${response.status})`));
  return data;
}

@Injectable({ providedIn: 'root' })
export class CmsAdminService {
  readonly authenticated = signal(false);
  readonly configured = signal(true);
  private readonly csrf = signal('');

  async status(): Promise<void> {
    const data = await responseJson(
      await fetch('/api/admin.php', { credentials: 'same-origin', cache: 'no-store' }),
    );
    this.authenticated.set(Boolean(data['authenticated']));
    this.configured.set(Boolean(data['configured']));
    this.csrf.set(String(data['csrf'] ?? ''));
  }

  async login(password: string): Promise<void> {
    const data = await responseJson(
      await fetch('/api/admin.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password }),
      }),
    );
    this.authenticated.set(Boolean(data['authenticated']));
    this.csrf.set(String(data['csrf'] ?? ''));
  }

  async logout(): Promise<void> {
    await responseJson(
      await fetch('/api/admin.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': this.csrf() },
        body: JSON.stringify({ action: 'logout' }),
      }),
    );
    this.authenticated.set(false);
    this.csrf.set('');
  }

  async publish(content: SiteContent, revision: number): Promise<number> {
    const data = await responseJson(
      await fetch('/api/content.php', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': this.csrf() },
        body: JSON.stringify({ content, revision }),
      }),
    );
    return Number(data['revision']);
  }

  async upload(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    const data = await responseJson(
      await fetch('/api/upload.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-CSRF-Token': this.csrf() },
        body: form,
      }),
    );
    return String(data['url']);
  }
}
