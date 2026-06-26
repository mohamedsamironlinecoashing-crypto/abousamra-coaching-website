import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-not-found',
  imports: [],
  standalone: true,
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  private readonly isBrowser: boolean;
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  readonly labels = this.languageService.labels;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  goHome(): void {
    if (!this.isBrowser) return;
    void this.router.navigate(['/'], { fragment: 'about' });
  }

  viewPlans(): void {
    if (!this.isBrowser) return;
    void this.router.navigate(['/'], { fragment: 'plans' });
  }
}
