import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  computed,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LanguageService } from '../../services/language.service';

type PlanId = 'starter' | 'active' | 'plus' | 'vip';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Plans implements OnInit, OnDestroy {
  headerVisible = false;
  cardsVisible = [false, false, false, false];
  hoveredCard: number | null = null;
  private readonly isBrowser: boolean;
  private readonly languageService = inject(LanguageService);
  readonly labels = this.languageService.labels;
  readonly planCards = computed(() => this.labels().plans.cards);

  private timeouts: ReturnType<typeof setTimeout>[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  trackFeature(_index: number, feature: string): string {
    return feature;
  }

  trackPlan(_index: number, plan: { id: string }): string {
    return plan.id;
  }

  ngOnInit(): void {
    this.timeouts.push(
      setTimeout(() => {
        this.headerVisible = true;
        this.cdr.markForCheck();
      }, 20),
    );

    [0, 1, 2, 3].forEach((i) => {
      this.timeouts.push(
        setTimeout(
          () => {
            this.cardsVisible[i] = true;
            this.cdr.markForCheck();
          },
          500 + i * 160,
        ),
      );
    });
  }

  ngOnDestroy(): void {
    this.timeouts.forEach(clearTimeout);
  }

  onCardHover(index: number): void {
    this.hoveredCard = index;
  }

  onCardLeave(): void {
    this.hoveredCard = null;
  }

  onGetStarted(_plan: string): void {
    if (!this.isBrowser) return;
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
