import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorks {
  private readonly languageService = inject(LanguageService);
  readonly labels = this.languageService.labels;
}
