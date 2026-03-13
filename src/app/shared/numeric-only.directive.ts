import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericOnly]',
  standalone: true
})
export class NumericOnlyDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): boolean {
    const allowedKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

    if (allowedKeys.includes(event.key)) {
      return true;
    }

    if (event.key === '.' && (event.target as HTMLInputElement).value.includes('.')) {
      event.preventDefault();
      return false;
    }

    if (!/^\d$/.test(event.key) && event.key !== '.') {
      event.preventDefault();
      return false;
    }

    return true;
  }
}
