import { Directive, ElementRef, input, effect } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  appHighlight = input<string>('');

  constructor(private el: ElementRef) {
    effect(() => {
      const color = this.appHighlight();
      this.el.nativeElement.style.backgroundColor = color || '';
    });
  }
}
