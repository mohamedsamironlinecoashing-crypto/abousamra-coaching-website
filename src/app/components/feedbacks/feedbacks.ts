import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LanguageService } from '../../services/language.service';

interface Slide {
  image: string;
  alt: string;
}

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedbacks.html',
  styleUrl: './feedbacks.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Feedbacks implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sliderViewport') viewportRef!: ElementRef<HTMLDivElement>;
  private readonly languageService = inject(LanguageService);
  readonly labels = this.languageService.labels;
  readonly isRtl = this.languageService.isRtl;

  slides: Slide[] = [
    { image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1782205732/IMG_2559_cd33im.jpg', alt: '1' },
    { image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1782205731/instagram_square_v2_color_1080x1080_tklspl.jpg', alt: '2' },
    { image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1782205731/IMG_2555_oamt73.jpg', alt: '3' },
    { image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1782205731/IMG_2560_lx6k90.jpg', alt: '4' },
    { image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1782205731/IMG_2554_hnwkpz.jpg', alt: '5' },
    { image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1782205730/IMG_2549_lrjfhc.jpg', alt: '6' },
    { image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1782205730/IMG_2543_usoqg6.jpg', alt: '7' },
  ];

  activeIndex = 0;
  trackOffset = 0;

  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private cardWidth = 0;
  private gap = 20;
  private visibleCount = 5;
  private isBrowser: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startAutoPlay();
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.measureCard();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    if (this.isBrowser) {
      window.removeEventListener('resize', this.onResize);
    }
  }

  private measureCard(): void {
    if (!this.isBrowser) return;
    const viewport = this.viewportRef?.nativeElement;
    if (!viewport) return;

    const vw = viewport.clientWidth;
    if (vw <= 600) {
      this.visibleCount = 2;
    } else if (vw <= 900) {
      this.visibleCount = 3;
    } else {
      this.visibleCount = 5;
    }

    this.cardWidth = (vw - this.gap * (this.visibleCount - 1)) / this.visibleCount;
    this.updateOffset();
    this.cdr.detectChanges();
  }

  private onResize = (): void => {
    this.measureCard();
  };

  private updateOffset(): void {
    const clampedIndex = Math.min(Math.max(this.activeIndex, 0), this.maxIndex);
    this.activeIndex = clampedIndex;
    this.trackOffset = clampedIndex * (this.cardWidth + this.gap);
  }

  next(): void {
    const maxIndex = this.maxIndex;
    this.activeIndex = this.activeIndex >= maxIndex ? 0 : this.activeIndex + 1;
    this.updateOffset();
    this.resetAutoPlay();
  }

  prev(): void {
    const maxIndex = this.maxIndex;
    this.activeIndex = this.activeIndex <= 0 ? maxIndex : this.activeIndex - 1;
    this.updateOffset();
    this.resetAutoPlay();
  }

  goTo(index: number): void {
    this.activeIndex = Math.min(Math.max(index, 0), this.maxIndex);
    this.updateOffset();
    this.resetAutoPlay();
  }

  private startAutoPlay(): void {
    if (!this.isBrowser) return;
    this.autoPlayInterval = setInterval(() => {
      const maxIndex = this.maxIndex;
      this.activeIndex = this.activeIndex >= maxIndex ? 0 : this.activeIndex + 1;
      this.updateOffset();
      this.cdr.detectChanges();
    }, 3500);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  trackSlide(_index: number, slide: Slide): string {
    return slide.image;
  }

  get indicatorCount(): number[] {
    return Array.from({ length: this.maxIndex + 1 }, (_, index) => index);
  }

  private get maxIndex(): number {
    return Math.max(this.slides.length - this.visibleCount, 0);
  }
}
