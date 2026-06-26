import { NgFor } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.html',
  styleUrls: ['./about-us.css'],
  standalone: true,
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUs implements AfterViewInit, OnDestroy {
  @ViewChild('viewport') viewportRef!: ElementRef<HTMLElement>;
  private readonly isBrowser: boolean;
  private readonly languageService = inject(LanguageService);
  readonly labels = this.languageService.labels;
  readonly isRtl = this.languageService.isRtl;

  certs = [
    { year: '2019', image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1779933508/10_gjc6jm.jpg' },
    { year: '2020', image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1779933508/9_jpb3uo.jpg' },
    { year: '2021', image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1779933508/8_ubz6h3.jpg' },
    { year: '2022', image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1779933507/3_bb3euu.jpg' },
    { year: '2022', image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1779933508/2_rfjfae.jpg' },
    { year: '2023', image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1779933507/1_p2gzbl.jpg' },
    { year: '2023', image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1779933508/5_mmpvfp.jpg' },
    { year: '2023', image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1779933508/4_gzeohr.jpg' },
    { year: '2024', image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1779933508/6_ucbpmo.jpg' },
    { year: '2024', image: 'https://res.cloudinary.com/dliuncsot/image/upload/v1779933508/7_ig9uul.jpg' },
  ];

  visible = 4;
  current = 0;
  offset = 0;
  private resizeObserver: ResizeObserver | null = null;

  get totalSlides(): number {
    return Math.max(this.certs.length - this.visible + 1, 1);
  }

  get slidesArray(): number[] {
    return Array.from({ length: this.totalSlides }, (_, i) => i);
  }

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.viewportRef?.nativeElement) return;
    this.updateVisibleCount();
    this.updateOffset();
    if (typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver(() => this.updateOffset());
    this.resizeObserver.observe(this.viewportRef.nativeElement);
  }

  trackCert(_index: number, cert: { year: string; image: string }): string {
    return `${cert.year}-${cert.image}`;
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private getCardWidth(): number {
    const vw = this.viewportRef.nativeElement.offsetWidth;
    const gap = 20;
    return (vw - gap * (this.visible - 1)) / this.visible + gap;
  }

  private updateOffset(): void {
    if (!this.isBrowser || !this.viewportRef?.nativeElement) return;
    this.updateVisibleCount();
    this.current = Math.min(this.current, this.totalSlides - 1);
    this.offset = this.current * this.getCardWidth();
  }

  private updateVisibleCount(): void {
    const vw = this.viewportRef.nativeElement.offsetWidth;
    if (vw <= 600) {
      this.visible = 1;
    } else if (vw <= 900) {
      this.visible = 2;
    } else {
      this.visible = 4;
    }
  }

  goTo(idx: number): void {
    this.current = Math.max(0, Math.min(idx, this.totalSlides - 1));
    this.updateOffset();
  }

  prev(): void {
    this.goTo(this.current - 1);
  }

  next(): void {
    this.goTo(this.current + 1);
  }

  onJoinNow(): void {
    if (!this.isBrowser) return;
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
