import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContentRepository } from '../core/services/content.repository';
@Component({
  selector: 'sm-header',
  imports: [RouterLink, RouterLinkActive],
  template: ` <header class="site-header">
      <div class="header-inner">
        <a routerLink="/" class="brand"
          ><span class="monogram">{{ labels.headerMonogram }}</span
          ><span
            >{{ company.name }} <b>{{ labels.headerPartner }}</b
            ><small>{{ labels.headerTagline }}</small></span
          ></a
        >
        <nav class="desktop-nav" aria-label="Main navigation">
          @for (item of navigation; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="active"
              ><span>{{ item.label }}</span
              ><span class="nav-arrow" aria-hidden="true">↗</span></a
            >
          }
        </nav>
        <a routerLink="/contact" class="button header-cta"
          >{{ labels.headerCta }} <span aria-hidden="true">↗</span></a
        >
        <button
          #menuButton
          type="button"
          class="menu-button"
          (click)="openMenu()"
          aria-label="Open menu"
          [attr.aria-expanded]="open()"
          aria-controls="mobile-menu"
        >
          <span>{{ labels.headerMenu }}</span
          ><span class="menu-icon" aria-hidden="true"></span>
        </button>
      </div>
    </header>
    <dialog
      #menuDialog
      id="mobile-menu"
      class="mobile-menu"
      aria-label="Navigation"
      (close)="open.set(false)"
      (cancel)="closeMenu()"
    >
      <div class="mobile-top">
        <span class="eyebrow">{{ labels.contentEyebrow }}</span
        ><button type="button" (click)="closeMenu()" aria-label="Close navigation" autofocus>
          {{ labels.headerMenuClose }} ×
        </button>
      </div>
      <nav aria-label="Mobile navigation">
        @for (item of navigation; track item.path) {
          <a [routerLink]="item.path" (click)="closeMenu()">{{ item.label }}</a>
        }
      </nav>
      <a routerLink="/contact" class="button" (click)="closeMenu()">{{ labels.headerCta }}</a>
    </dialog>`,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly content = inject(ContentRepository);
  get navigation() {
    return this.content.navigation;
  }
  get company() {
    return this.content.company;
  }
  get labels() {
    return this.content.labels;
  }
  readonly open = signal(false);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('menuDialog');
  private readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');
  constructor() {
    inject(Router)
      .events.pipe(takeUntilDestroyed())
      .subscribe((event) => {
        if (event instanceof NavigationEnd && this.open()) this.closeMenu();
      });
  }
  openMenu(): void {
    this.open.set(true);
    this.dialog().nativeElement.showModal();
  }
  closeMenu(): void {
    this.dialog().nativeElement.close();
    this.open.set(false);
    this.button().nativeElement.focus();
  }
}
