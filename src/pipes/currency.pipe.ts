// pipes/currency.pipe.ts
import { Pipe, PipeTransform, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CurrencyService } from '../services/currency.service';

@Pipe({
  name: 'currencyFormat',
  pure: false,
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  private isBrowser: boolean;

  constructor(
    private currencyService: CurrencyService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  transform(price: number): string {
    if (!this.isBrowser) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(price);
    }

    const converted = this.currencyService.convert(price);
    const currency = this.currencyService.selectedCurrency();

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(converted);
  }
}
