import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  readonly labels = this.languageService.labels;
  readonly whatsappLink = 'https://wa.me/201224251147';
  readonly email = 'MohamedSamircoaching@outlook.com';
  readonly instagram = 'mohamedsamir.coaching';
  readonly instagramLink = 'https://www.instagram.com/mohamedsamir.coaching/';
  readonly tiktokLink = 'https://www.tiktok.com/@mohamedsamir.coaching';
  readonly youtubeLink = 'https://www.youtube.com/@mohamedsamir.coaching';
  readonly year = new Date().getFullYear();

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  trackLink(_index: number, link: { label: string; id: string }): string {
    return `${link.label}-${link.id}`;
  }

  scrollTo(id: string | null): void {
    if (!id || !this.isBrowser) return;

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

  scrollToContact(): void {
    this.scrollTo('contact');
  }
}
