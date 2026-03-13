import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceColor',
  standalone: true
})
export class PriceColorPipe implements PipeTransform {
  transform(value: number): string {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  }
}
