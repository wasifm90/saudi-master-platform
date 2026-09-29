import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ContentRepository } from '../../core/services/content.repository';
import { ProductRepository } from '../../core/services/product.repository';
import { SeoService } from '../../core/services/seo.service';
@Component({
  selector: 'sm-contact',
  imports: [ReactiveFormsModule],
  template: ` <section class="section shell">
    <div class="page-intro">
      <p class="eyebrow">{{ labels.contactEyebrow }}</p>
      <h1>{{ labels.contactTitle }}</h1>
      <p class="lead">{{ labels.contactIntro }}</p>
    </div>
    <div class="contact-grid">
      <div>
        <h2>{{ labels.contactTeam }}</h2>
        <p>
          <a [href]="'tel:' + company.phone">{{ company.phone }}</a>
        </p>
        <p>
          <a [href]="'mailto:' + company.email">{{ company.email }}</a>
        </p>
        <p>{{ company.address }}</p>
        <p class="form-note">
          {{ labels.contactPrivacy }}
        </p>
      </div>
      <form [formGroup]="form" (ngSubmit)="prepare()">
        <label for="name">Full name *</label
        ><input
          id="name"
          autocomplete="name"
          formControlName="name"
          [attr.aria-invalid]="invalid('name')"
          required
        />
        <label for="company">Company *</label
        ><input
          id="company"
          autocomplete="organization"
          formControlName="company"
          [attr.aria-invalid]="invalid('company')"
          required
        />
        <label for="email">Email *</label
        ><input
          id="email"
          type="email"
          autocomplete="email"
          formControlName="email"
          [attr.aria-invalid]="invalid('email')"
          required
        />
        <label for="phone">Phone</label
        ><input id="phone" type="tel" autocomplete="tel" formControlName="phone" />
        <label for="product">System requirement</label
        ><select id="product" formControlName="product">
          <option value="">Project engineering enquiry</option>
          @for (product of products(); track product.slug) {
            <option [value]="product.slug">{{ product.name }}</option>
          }
        </select>
        <label for="message">Project requirements *</label
        ><textarea
          id="message"
          rows="5"
          formControlName="message"
          [attr.aria-invalid]="invalid('message')"
          required
        ></textarea>
        @if (attempted() && form.invalid) {
          <p role="alert" class="form-error">
            Enter your name, company, a valid email and project requirements (at least 10
            characters).
          </p>
        }
        <button type="submit" class="button">Prepare enquiry →</button>
        @if (emailHref()) {
          <div class="email-preview" role="status">
            <h2>Enquiry ready to review</h2>
            <p>
              No message has been sent. Open the draft in your email application, review it, then
              send.
            </p>
            <a class="button secondary" [href]="emailHref()">Open email draft ↗</a>
          </div>
        }
      </form>
    </div>
  </section>`,
  styles: `
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 70px;
    }
    .contact-grid h2 {
      font-size: 26px;
    }
    .contact-grid p {
      line-height: 1.8;
    }
    .form-note {
      max-width: 360px;
      font-size: 13px;
      color: var(--muted);
    }
    form {
      display: grid;
      gap: 10px;
      background: #fff;
      border: 1px solid var(--line);
      padding: 28px;
      border-radius: 14px;
    }
    label {
      font: 600 11px var(--display);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 8px;
    }
    input,
    select,
    textarea {
      width: 100%;
      min-height: 48px;
      border: 1px solid #a8a095;
      background: var(--paper);
      border-radius: 6px;
      padding: 12px;
      font: inherit;
      color: var(--ink);
    }
    textarea {
      resize: vertical;
    }
    form .button {
      margin-top: 12px;
      justify-self: start;
    }
    .form-error {
      color: #a02416;
      font-size: 13px;
    }
    .email-preview {
      border-top: 1px solid var(--line);
      margin-top: 16px;
      padding-top: 20px;
    }
    .email-preview p {
      font-size: 13px;
    }
    @media (max-width: 800px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      form {
        padding: 20px;
      }
    }
  `,
})
export class ContactComponent {
  private readonly content = inject(ContentRepository);
  get company() {
    return this.content.company;
  }
  get labels() {
    return this.content.labels;
  }
  readonly products = inject(ProductRepository).products;
  readonly attempted = signal(false);
  readonly emailHref = signal('');
  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    company: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    product: [inject(ActivatedRoute).snapshot.queryParamMap.get('product') ?? ''],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });
  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.emailHref.set(''));
    inject(SeoService).set(
      'Contact',
      'Discuss your formwork, scaffolding and engineering project with Saudi Master.',
      '/contact',
    );
  }
  invalid(control: 'name' | 'company' | 'email' | 'message'): boolean {
    return this.attempted() && this.form.controls[control].invalid;
  }
  prepare(): void {
    this.attempted.set(true);
    this.emailHref.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const product =
      this.products().find((p) => p.slug === value.product)?.name ?? 'Project engineering';
    const body = `Name: ${value.name}\nCompany: ${value.company}\nEmail: ${value.email}\nPhone: ${value.phone}\nSystem: ${product}\n\n${value.message}`;
    this.emailHref.set(
      `mailto:${this.company.email}?subject=${encodeURIComponent('Project enquiry: ' + product)}&body=${encodeURIComponent(body)}`,
    );
  }
}
