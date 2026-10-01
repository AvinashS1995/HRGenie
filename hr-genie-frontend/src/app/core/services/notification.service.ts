import { Injectable, signal, computed } from '@angular/core';
import { Notification } from '../models';
import { MOCK_NOTIFICATIONS } from '../mock/mock-data';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notifications = signal<Notification[]>(MOCK_NOTIFICATIONS);

  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = computed(() => this._notifications().filter(n => !n.read).length);

  markAsRead(id: string): void {
    this._notifications.update(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  }

  markAllRead(): void {
    this._notifications.update(ns => ns.map(n => ({ ...n, read: true })));
  }
}
