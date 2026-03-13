import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number, currencyCode = 'USD', decimals = 2): string {
    if (value === null || value === undefined) return '';

    const symbol = currencyCode === 'USD' ? '$' : currencyCode;
    return `${symbol}${value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
}
