import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, computed, signal } from '@angular/core';
import { TranslationLanguage, translations } from './translations';

export type Language = TranslationLanguage;

const STORAGE_KEY = 'selectedLanguage';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly isBrowser: boolean;
  private readonly currentLanguage = signal<Language>('en');

  readonly language = this.currentLanguage.asReadonly();
  readonly labels = computed(() => translations[this.currentLanguage()]);
  readonly navbarLabels = computed(() => this.labels().navbar);
  readonly isRtl = computed(() => this.currentLanguage() === 'ar');

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    const storedLanguage = this.getStoredLanguage();

    this.setLanguage(storedLanguage);
  }

  toggleLanguage(): void {
    this.setLanguage(this.currentLanguage() === 'en' ? 'ar' : 'en');
  }

  setLanguage(language: Language): void {
    this.currentLanguage.set(language);
    this.applyDocumentLanguage(language);

    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }

  private getStoredLanguage(): Language {
    if (!this.isBrowser) {
      return 'en';
    }

    return localStorage.getItem(STORAGE_KEY) === 'ar' ? 'ar' : 'en';
  }

  private applyDocumentLanguage(language: Language): void {
    this.document.documentElement.lang = language;
    this.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }
}
