import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `<div class="toast" id="toast" [class.show]="toast.visible()" [class.success]="toast.visible() && toast.type() === 'success'" [class.error]="toast.visible() && toast.type() === 'error'">@if (toast.message()) {@if (toast.type() === 'success') {<i class="fas fa-check-circle"></i>}@if (toast.type() === 'error') {<i class="fas fa-exclamation-circle"></i>}{{ ' ' + toast.message() }}}</div>`,
  styles: [`:host { display: contents; }`]
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
