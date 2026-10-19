import { Injectable, signal } from '@angular/core';

/** Équivalent de showToast() du JavaScript d'origine (affiché 4 secondes). */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal('');
  readonly type = signal('');
  readonly visible = signal(false);

  show(msg: string, type = ''): void {
    this.message.set(msg);
    this.type.set(type);
    this.visible.set(true);
    setTimeout(() => this.visible.set(false), 4000);
  }
}
