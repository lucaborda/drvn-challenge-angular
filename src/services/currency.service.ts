// services/currency.service.ts
import { Injectable, Inject, PLATFORM_ID, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Currency = 'USD' | 'EUR';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly CURRENCY_KEY = 'selectedCurrency';
  private exchangeRates = { USD: 1, EUR: 1.08 };
  private isBrowser: boolean;

  selectedCurrency = signal<Currency>('USD');

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.selectedCurrency.set(this.getStoredCurrency());

      effect(() => {
        localStorage.setItem(this.CURRENCY_KEY, this.selectedCurrency());
      });
    }
  }

  private getStoredCurrency(): Currency {
    try {
      return (localStorage.getItem(this.CURRENCY_KEY) as Currency) || 'USD';
    } catch (e) {
      return 'USD';
    }
  }

  convert(price: number): number {
    const rate = this.exchangeRates[this.selectedCurrency()];
    return price * rate;
  }

  setCurrency(currency: Currency) {
    this.selectedCurrency.set(currency);
  }
}
