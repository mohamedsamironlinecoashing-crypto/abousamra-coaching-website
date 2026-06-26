import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { LanguageService } from '../../services/language.service';

interface TransformationCard {
  id: string;
  beforeImage: string;
  afterImage: string;
  stats: Array<{
    icon: string;
    iconClass: 'clock' | 'down';
    value: string;
    unitKey?: 'months' | 'weeks';
    labelKey: 'duration' | 'weight';
  }>;
}

@Component({
  selector: 'app-transformations',
  imports: [CommonModule],
  templateUrl: './transformations.html',
  styleUrl: './transformations.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Transformations implements OnDestroy {
  private readonly languageService = inject(LanguageService);
  readonly labels = this.languageService.labels;

  readonly cards: TransformationCard[] = [
    {
      id: 'card1',
      beforeImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782190970/88eb9101-b01e-4f95-99ea-b91375131049.png',
      afterImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782190929/3b1720d5-53f2-4dd0-aec8-5a9571a5fc9f.png',
      stats: [
        { icon: '⏱', iconClass: 'clock', value: '9', unitKey: 'months', labelKey: 'duration' },
        { icon: '↘', iconClass: 'down', value: '-15kg', labelKey: 'weight' },
      ],
    },
    {
      id: 'card3',
      beforeImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782191369/7afbdccc-01e4-4053-aefc-1bbbff8465e5.png',
      afterImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782191376/dda248e8-9891-4b51-96ba-d082dcb321c5.png',
      stats: [
        { icon: '↘', iconClass: 'down', value: '-80kg', labelKey: 'weight' },
        { icon: '⏱', iconClass: 'clock', value: '14', unitKey: 'months', labelKey: 'duration' },
      ],
    },
    {
      id: 'card2',
      beforeImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782478598/03c8c880-2c1c-4187-8d8a-d1f2b7833f00.png',
      afterImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782478575/83705d69-4329-4aa6-9412-a45bd6c724d5.png',
      stats: [
        { icon: '↘', iconClass: 'down', value: '-25kg', labelKey: 'weight' },
        { icon: '⏱', iconClass: 'clock', value: '6', unitKey: 'months', labelKey: 'duration' },
      ],
    },
    {
      id: 'card4',
      beforeImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782313403/e730211b-be57-4fb5-89b1-0742c8d569fd.png',
      afterImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782313391/3967c688-f147-4bb6-869a-0abf08f4b1c7.png',
      stats: [
        { icon: '↘', iconClass: 'down', value: '-20kg', labelKey: 'weight' },
        { icon: '⏱', iconClass: 'clock', value: '5', unitKey: 'months', labelKey: 'duration' },
      ],
    },
    {
      id: 'card5',
      beforeImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782478710/92bc7936-2700-47d5-9a0b-c7cb7f1ad358.png',
      afterImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782478772/79e66ccd-ce1a-4088-b07a-587bbc0c9419.png',
      stats: [
        { icon: '↘', iconClass: 'down', value: '-40kg', labelKey: 'weight' },
        { icon: '⏱', iconClass: 'clock', value: '9', unitKey: 'months', labelKey: 'duration' },
      ],
    },
    {
      id: 'card6',
      beforeImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782478858/ab7b7a43-580c-4818-9ffa-3f644dc894c4.png',
      afterImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782478829/9111978a-f834-4f37-bbb2-a922781d9602.png',
      stats: [
        { icon: '↘', iconClass: 'down', value: '-30kg', labelKey: 'weight' },
        { icon: '⏱', iconClass: 'clock', value: '8', unitKey: 'months', labelKey: 'duration' },
      ],
    },
    {
      id: 'card7',
      beforeImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782478943/8f8778c8-d0e6-499a-8b05-f54107fc4b32.png',
      afterImage:
        'https://res.cloudinary.com/dliuncsot/image/upload/v1782478905/ca48ac4d-92a7-4259-8a75-40f64e142e8d.png',
      stats: [
        { icon: '↗', iconClass: 'down', value: '+10kg', labelKey: 'weight' },
        { icon: '⏱', iconClass: 'clock', value: '3', unitKey: 'months', labelKey: 'duration' },
      ],
    },
  ];

  private readonly interval = 5000;
  private current = 0;
  private startTime = 0;
  private paused = false;
  private autoTimer: ReturnType<typeof setInterval> | null = null;
  private rafId: number | null = null;
  private cleanup: Array<() => void> = [];

  private track: HTMLElement | null = null;
  private progress: HTMLElement | null = null;
  private dots: HTMLElement[] = [];
  private cardsElements: HTMLElement[] = [];

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      this.initComponent();
    });
  }

  ngOnDestroy(): void {
    this.stopAuto();
    this.cleanup.forEach((removeListener) => removeListener());
    this.cleanup = [];
  }

  trackCard(_index: number, card: TransformationCard): string {
    return card.id;
  }

  trackStat(_index: number, stat: TransformationCard['stats'][number]): string {
    return `${stat.value}-${stat.labelKey}`;
  }

  private initComponent(): void {
    const host = this.elementRef.nativeElement;

    this.track = host.querySelector<HTMLElement>('#sliderTrack');
    this.progress = host.querySelector<HTMLElement>('#progressBar');

    if (!this.track) {
      return;
    }

    this.cardsElements = Array.from(this.track.querySelectorAll<HTMLElement>('.transform-card'));
    this.dots = Array.from(host.querySelectorAll<HTMLElement>('.dot'));

    const prevBtn = host.querySelector<HTMLElement>('#prevBtn');
    const nextBtn = host.querySelector<HTMLElement>('#nextBtn');
    const imageSliders = Array.from(host.querySelectorAll<HTMLElement>('.img-slider'));
    const toggleButtons = Array.from(host.querySelectorAll<HTMLElement>('.btn-toggle'));

    const { track, dots } = this;

    this.listen(track, 'mouseenter', () => {
      this.paused = true;
      this.stopAuto();
    });

    this.listen(track, 'mouseleave', () => {
      this.paused = false;
      this.startAuto();
    });

    this.listen(
      track,
      'touchstart',
      () => {
        this.paused = true;
        this.stopAuto();
      },
      { passive: true },
    );

    this.listen(
      track,
      'touchend',
      () => {
        this.paused = false;
        this.startAuto();
      },
      { passive: true },
    );

    if (prevBtn) {
      this.listen(prevBtn, 'click', () => this.scrollToCard(this.current - 1));
    }

    if (nextBtn) {
      this.listen(nextBtn, 'click', () => this.scrollToCard(this.current + 1));
    }

    dots.forEach((dot) => {
      this.listen(dot, 'click', () => {
        const index = Number(dot.dataset['index'] ?? 0);
        this.scrollToCard(index);
      });
    });

    toggleButtons.forEach((button) => {
      this.listen(button, 'click', () => this.toggleBeforeAfter(host, button));
    });

    imageSliders.forEach((slider) => {
      const throttledMove = this.throttle(
        (event: Event) => this.previewSideFromPointer(slider, event),
        16,
      );
      this.listen(slider, 'mouseenter', (event) => this.previewSideFromPointer(slider, event));
      this.listen(slider, 'mousemove', throttledMove as EventListener);
      this.listen(slider, 'mouseleave', () => this.clearHoverPreview(slider));
    });

    const handleVisibility = () => {
      if (document.hidden) {
        this.stopAuto();
      } else if (!this.paused) {
        this.startAuto();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    this.cleanup.push(() => document.removeEventListener('visibilitychange', handleVisibility));

    this.startAuto();
  }

  private scrollToCard(index: number, resetAuto = true): void {
    if (!this.track || !this.cardsElements.length) {
      return;
    }

    const target =
      ((index % this.cardsElements.length) + this.cardsElements.length) % this.cardsElements.length;

    this.track.scrollTo({ left: this.cardsElements[target].offsetLeft - 24, behavior: 'smooth' });

    this.dots.forEach((dot) => dot.classList.remove('active'));
    this.dots[target]?.classList.add('active');
    this.current = target;

    if (resetAuto) {
      this.startAuto();
    }
  }

  private animateProgress(): void {
    if (this.paused) {
      return;
    }

    const elapsed = performance.now() - this.startTime;
    const percent = Math.min((elapsed / this.interval) * 100, 100);

    if (this.progress && document.body.contains(this.progress)) {
      const currentWidth = parseFloat(this.progress.style.width) || 0;
      if (percent - currentWidth >= 0.1) {
        this.progress.style.width = `${percent}%`;
      }
    }

    if (percent < 100) {
      this.rafId = requestAnimationFrame(() => this.animateProgress());
    }
  }

  private startAuto(): void {
    this.stopAuto();
    this.startTime = performance.now();

    if (this.progress && document.body.contains(this.progress)) {
      this.progress.style.transition = 'none';
      this.progress.style.width = '0%';
      requestAnimationFrame(() => {
        if (this.progress) {
          this.progress.style.transition = '';
        }
      });
    }

    this.rafId = requestAnimationFrame(() => this.animateProgress());

    this.autoTimer = setInterval(() => {
      this.scrollToCard(this.current + 1, false);
      this.startTime = performance.now();

      if (this.progress && document.body.contains(this.progress)) {
        this.progress.style.width = '0%';
      }

      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }
      this.rafId = requestAnimationFrame(() => this.animateProgress());
    }, this.interval);
  }

  private stopAuto(): void {
    if (this.autoTimer !== null) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private toggleBeforeAfter(host: HTMLElement, button: HTMLElement): void {
    const cardId = button.dataset['card'];
    const show = button.dataset['show'];

    if (!cardId || !show) {
      return;
    }

    const slider = host.querySelector<HTMLElement>(`#${cardId}`);
    if (!slider) {
      return;
    }

    const siblings = Array.from(host.querySelectorAll<HTMLElement>(`[data-card="${cardId}"]`));

    if (slider.dataset['state'] === show) {
      slider.dataset['state'] = 'default';
      slider.classList.remove('show-before', 'show-after');
      siblings.forEach((sibling) => sibling.classList.remove('active-before', 'active-after'));
      return;
    }

    slider.dataset['state'] = show;
    slider.classList.toggle('show-before', show === 'before');
    slider.classList.toggle('show-after', show === 'after');

    siblings.forEach((sibling) => {
      sibling.classList.remove('active-before', 'active-after');
      if (sibling.dataset['show'] === show) {
        sibling.classList.add(show === 'before' ? 'active-before' : 'active-after');
      }
    });
  }

  private previewSideFromPointer(slider: HTMLElement, event: Event): void {
    if (!(event instanceof MouseEvent)) {
      return;
    }

    if (slider.dataset['state'] !== 'default') {
      this.clearHoverPreview(slider);
      return;
    }

    const rect = slider.getBoundingClientRect();
    const isBeforeSide = event.clientX - rect.left < rect.width / 2;

    slider.classList.toggle('hover-before', isBeforeSide);
    slider.classList.toggle('hover-after', !isBeforeSide);
  }

  private clearHoverPreview(slider: HTMLElement): void {
    slider.classList.remove('hover-before', 'hover-after');
  }

  private listen(
    element: HTMLElement | Document,
    eventName: string,
    listener: EventListener,
    options?: AddEventListenerOptions,
  ): void {
    element.addEventListener(eventName, listener, options);
    this.cleanup.push(() => element.removeEventListener(eventName, listener, options));
  }

  private throttle<T extends unknown[]>(
    fn: (...args: T) => void,
    limitMs: number,
  ): (...args: T) => void {
    let lastCall = 0;
    return (...args: T) => {
      const now = performance.now();
      if (now - lastCall >= limitMs) {
        lastCall = now;
        fn(...args);
      }
    };
  }
}
