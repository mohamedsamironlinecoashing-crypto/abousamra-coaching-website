import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  private readonly isBrowser: boolean;
  private readonly languageService = inject(LanguageService);
  readonly labels = this.languageService.labels;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  onStartJourney(): void {
    if (!this.isBrowser) return;
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  }

  onViewResults(): void {
    if (!this.isBrowser) return;
    document.getElementById('transformations')?.scrollIntoView({ behavior: 'smooth' });
  }
}
