import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-transmission-live',
  imports: [],
  templateUrl: './transmission-live.html',
  styleUrl: './transmission-live.css',
  encapsulation: ViewEncapsulation.None,
})
export class TransmissionLive implements OnInit, OnDestroy {
  slides: string[] = [
    'https://nyc.cloud.appwrite.io/v1/storage/buckets/6a1b362c001c1a0b1a89/files/6a1de103000cf1ad4ab2/view?project=6a1b3601001d67a45096&mode=admin',
    'https://nyc.cloud.appwrite.io/v1/storage/buckets/6a1b362c001c1a0b1a89/files/6a1de103000cfdfbfd7a/view?project=6a1b3601001d67a45096&mode=admin',
    'https://nyc.cloud.appwrite.io/v1/storage/buckets/6a1b362c001c1a0b1a89/files/6a1de103000cf44cd80d/view?project=6a1b3601001d67a45096&mode=admin',
    'https://nyc.cloud.appwrite.io/v1/storage/buckets/6a1b362c001c1a0b1a89/files/6a1de103000cf8e13145/view?project=6a1b3601001d67a45096&mode=admin',
    'https://nyc.cloud.appwrite.io/v1/storage/buckets/6a1b362c001c1a0b1a89/files/6a1de103000cf006e06d/view?project=6a1b3601001d67a45096&mode=admin',
    'https://nyc.cloud.appwrite.io/v1/storage/buckets/6a1b362c001c1a0b1a89/files/6a1de103000cfebd3911/view?project=6a1b3601001d67a45096&mode=admin',
    'https://nyc.cloud.appwrite.io/v1/storage/buckets/6a1b362c001c1a0b1a89/files/6a1de103000cf0d6b2db/view?project=6a1b3601001d67a45096&mode=admin',
    'https://nyc.cloud.appwrite.io/v1/storage/buckets/6a1b362c001c1a0b1a89/files/6a1de103000cf4db11be/view?project=6a1b3601001d67a45096&mode=admin',
    'https://nyc.cloud.appwrite.io/v1/storage/buckets/6a1b362c001c1a0b1a89/files/6a1de103000cf16ed0a5/view?project=6a1b3601001d67a45096&mode=admin',
    'https://nyc.cloud.appwrite.io/v1/storage/buckets/6a1b362c001c1a0b1a89/files/6a1de103000cf09f70ba/view?project=6a1b3601001d67a45096&mode=admin'
  ];

  currentSlideIndex: number = 0;
  espectadoresCount: number = 32;

  constructor(
    private router: Router,
    private uiService: UiService,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      const cambio = Math.floor(Math.random() * 3) - 1; // -1, 0, o 1
      this.espectadoresCount = Math.max(10, this.espectadoresCount + cambio);
    }, 8000);

    const container = document.querySelector('.view-container');
    if (container) {
      this.renderer.setStyle(container, 'padding', '0');
    }

    setTimeout(() => {
      this.uiService.setNavigationVisibility(false);
    });
  }

  ngOnDestroy(): void {
    const container = document.querySelector('.view-container');
    if (container) {
      this.renderer.setStyle(container, 'padding', '20px');
    }
    this.uiService.setNavigationVisibility(true);
  }

  nextSlide(): void {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.currentSlideIndex++;
    }
  }

  prevSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === ' ') {
      this.nextSlide();
    } else if (event.key === 'ArrowLeft') {
      this.prevSlide();
    }
  }

  salirDeTransmision(): void {
    if (confirm('¿Deseas salir de la transmisión en vivo?')) {
      this.router.navigate(['/transmission-lobby']);
    }
  }
}
