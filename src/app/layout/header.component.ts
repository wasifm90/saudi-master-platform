import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NAVIGATION } from '../data/catalog';
@Component({
  selector: 'sm-header',
  imports: [RouterLink, RouterLinkActive],
  template: ` <header class="site-header">
      <div class="header-inner">
        <a routerLink="/" class="brand"
          ><span class="monogram">SM</span
          ><span>Saudi Master <b>× ULMA</b><small>Formwork & Scaffolding Alliance</small></span></a
        >
        <nav class="desktop-nav" aria-label="Main navigation">
          @for (item of navigation; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="active">{{ item.label }}</a>
          }
        </nav>
        <a routerLink="/contact" class="button header-cta"
          >Start a project <span aria-hidden="true">↗</span></a
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
          Menu <span aria-hidden="true">☰</span>
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
        <span class="eyebrow">Saudi Master × ULMA</span
        ><button type="button" (click)="closeMenu()" aria-label="Close navigation" autofocus>
          Close ×
        </button>
      </div>
      <nav aria-label="Mobile navigation">
        @for (item of navigation; track item.path) {
          <a [routerLink]="item.path" (click)="closeMenu()"
            >{{ item.label }} <span aria-hidden="true">↗</span></a
          >
        }
      </nav>
      <a routerLink="/contact" class="button" (click)="closeMenu()">Start a project →</a>
    </dialog>`,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly navigation = NAVIGATION;
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
