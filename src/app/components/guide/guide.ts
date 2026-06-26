import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

interface FaqItem {
  title: string;
  description?: string;
  points?: string[];
  isOpen: boolean;
}

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guide.html',
  styleUrls: ['./guide.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Guide implements OnInit {
  private readonly languageService = inject(LanguageService);
  readonly labels = this.languageService.labels;
  readonly faqItems = computed<FaqItem[]>(() => {
    const openStates = this.openStates();
    return this.labels().guide.items.map((item, index) => ({
      ...item,
      isOpen: openStates[index] ?? false,
    }));
  });
  private openStates = signal<boolean[]>([]);

  ngOnInit(): void {
    this.openStates.set(new Array(this.labels().guide.items.length).fill(false));
  }

  toggle(index: number): void {
    this.openStates.update((states) =>
      states.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  }

  trackFaq(_index: number, item: FaqItem): string {
    return item.title;
  }

  trackPoint(_index: number, point: string): string {
    return point;
  }
}
