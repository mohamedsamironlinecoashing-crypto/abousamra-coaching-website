import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';

interface NavLink {
  labelKey: 'about' | 'plans' | 'transformations' | 'guide' | 'testimonials' | 'contact';
  id: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar implements OnInit {
  isScrolled = false;
  isMobileOpen = false;
  private readonly isBrowser: boolean;
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  readonly labels = this.languageService.navbarLabels;
  readonly currentLanguage = this.languageService.language;

  readonly navLinks: NavLink[] = [
    { labelKey: 'about', id: 'about' },
    { labelKey: 'plans', id: 'plans' },
    { labelKey: 'transformations', id: 'transformations' },
    { labelKey: 'guide', id: 'guide' },
    { labelKey: 'testimonials', id: 'feedbacks' },
    { labelKey: 'contact', id: 'contact' },
  ];

  trackLink(_index: number, link: NavLink): string {
    return link.id;
  }

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    if (!this.isBrowser) return;
    this.isScrolled = window.scrollY > 20;
  }

  scrollTo(id: string): void {
    if (!this.isBrowser) return;
    this.closeMobileMenu();

    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    void this.router.navigate(['/'], { fragment: id }).then(() => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  toggleMobileMenu(): void {
    this.isMobileOpen = !this.isMobileOpen;
  }

  closeMobileMenu(): void {
    this.isMobileOpen = false;
  }

  onJoinNow(): void {
    this.scrollTo('contact');
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
