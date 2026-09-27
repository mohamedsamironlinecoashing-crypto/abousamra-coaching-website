import { ChangeDetectionStrategy, Component, Inject, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Navbar, RouterOutlet, Footer],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly languageService = inject(LanguageService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    effect(() => {
      const labels = this.languageService.labels();
      this.titleService.setTitle(labels.seo.title);
      this.metaService.updateTag({ name: 'description', content: labels.seo.description });
      this.metaService.updateTag({ property: 'og:title', content: labels.seo.title });
      this.metaService.updateTag({ property: 'og:description', content: labels.seo.description });
      this.metaService.updateTag({ name: 'twitter:title', content: labels.seo.title });
      this.metaService.updateTag({ name: 'twitter:description', content: labels.seo.description });
      this.updateCanonicalUrl();
      this.updateStructuredData(labels.seo.description);
    });
  }

  private updateCanonicalUrl(): void {
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    if (typeof window !== 'undefined') {
      link.setAttribute('href', window.location.origin + window.location.pathname);
    } else {
      link.setAttribute('href', 'https://abousamracoaching.me/');
    }
  }

  private updateStructuredData(description: string): void {
    let script = this.document.getElementById('json-ld-schema') as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'Coach Abou Samra',
      'jobTitle': 'Certified Fitness Coach & Nutritionist',
      'description': description,
      'url': typeof window !== 'undefined' ? window.location.origin : 'https://abousamracoaching.me',
      'telephone': '+201224251147',
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+201224251147',
        'contactType': 'customer service',
        'availableLanguage': ['English', 'Arabic']
      },
      'sameAs': [
        'https://www.instagram.com/mohamedsamir.coaching/',
        'https://www.tiktok.com/@mohamedsamir.coaching',
        'https://www.youtube.com/@mohamedsamir.coaching'
      ],
      'knowsAbout': [
        'Fitness Coaching',
        'Nutrition Science',
        'Fat Loss',
        'Muscle Building',
        'Bariatric Nutrition',
        'Sports Science'
      ]
    };

    script.text = JSON.stringify(schema);
  }
}
