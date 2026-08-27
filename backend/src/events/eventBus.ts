export type ERPEventType =
  | 'GRN_POSTED'
  | 'WORK_ORDER_COMPLETED'
  | 'SALES_DISPATCH_CONFIRMED'
  | 'VENDOR_INVOICE_RECEIVED'
  | 'PAYROLL_APPROVED'
  | 'QUALITY_NCR_RAISED'
  | 'ASSET_BREAKDOWN_LOGGED'
  | 'INTERCOMPANY_TRANSACTION_INITIATED';

export interface ERPEventPayload<T = any> {
  eventId: string;
  eventType: ERPEventType;
  tenantId: string;
  actorUserId?: string;
  timestamp: Date;
  data: T;
}

export type ERPEventHandler<T = any> = (event: ERPEventPayload<T>) => Promise<void>;

export class ERPEventBus {
  private static handlers: Map<ERPEventType, ERPEventHandler[]> = new Map();

  /**
   * Registers a subscriber for a specific domain event
   */
  static subscribe<T = any>(eventType: ERPEventType, handler: ERPEventHandler<T>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  /**
   * Dispatches an event to all registered reactive handlers
   */
  static async publish<T = any>(eventType: ERPEventType, tenantId: string, data: T, actorUserId?: string): Promise<void> {
    const payload: ERPEventPayload<T> = {
      eventId: `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      eventType,
      tenantId,
      actorUserId,
      timestamp: new Date(),
      data,
    };

    const subscribers = this.handlers.get(eventType) || [];
    for (const handler of subscribers) {
      try {
        await handler(payload);
      } catch (err) {
        console.error(`[EventBus Error] Failed handler for ${eventType}:`, err);
      }
    }
  }

  /**
   * Clears all event subscribers (used primarily for test isolation)
   */
  static clear(): void {
    this.handlers.clear();
  }
}
