import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-us.html',
  styleUrls: ['./contact-us.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactUs {
  private readonly languageService = inject(LanguageService);
  readonly labels = this.languageService.labels;

  // ══════════════════════════════════════════════════
  //  ✏️  CONTACT INFO DATA
  // ══════════════════════════════════════════════════

  instapayNumber = '+20 122 425 1147';
  fawryNumber = '+20 122 425 1147';
  vodafoneNumber = '+20 10 10190767';
  phoneNumber = '+20 10 10190767';

  whatsappLink = 'https://wa.me/message/LN26RHKV6S23E1';
  instapayLink = 'https://ipn.eg/S/01224251147';

  // ══════════════════════════════════════════════════

  fawryCopied = false;
  vodafoneCopied = false;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /** Copy Fawry number on click */
  copyFawry(): void {
    this.copyToClipboard(this.fawryNumber.replace(/\s/g, ''), () => {
      this.fawryCopied = true;
      this.cdr.markForCheck();
      setTimeout(() => {
        this.fawryCopied = false;
        this.cdr.markForCheck();
      }, 2500);
    });
  }

  /** Copy Vodafone number on click */
  copyVodafone(): void {
    this.copyToClipboard(this.vodafoneNumber.replace(/\s/g, ''), () => {
      this.vodafoneCopied = true;
      this.cdr.markForCheck();
      setTimeout(() => {
        this.vodafoneCopied = false;
        this.cdr.markForCheck();
      }, 2500);
    });
  }

  private copyToClipboard(text: string, onSuccess?: () => void): void {
    if (!this.isBrowser) return;

    navigator.clipboard
      .writeText(text)
      .then(() => onSuccess?.())
      .catch((err) => console.error('Failed to copy text: ', err));
  }
}
