export type Cleanup = () => void;
export function attachPressRipple(element: HTMLElement | null, options?: { duration?: number }): Cleanup;
export function attachHoldConfirm(element: HTMLElement | null, options?: { duration?: number; onConfirm?: (element: HTMLElement) => void }): Cleanup;
export function attachCommandAck(element: HTMLElement | null, options?: { duration?: number }): Cleanup;
