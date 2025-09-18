import { useEffect, useRef } from 'react';

interface TouchHandlers {
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onDoubleTap?: () => void;
  onTap?: () => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  onPinch?: (scale: number) => void;
}

interface TouchOptions {
  swipeThreshold?: number;
  doubleTapThreshold?: number;
  enableSwipe?: boolean;
  enableDoubleTap?: boolean;
  enableTap?: boolean;
  enablePan?: boolean;
  enablePinch?: boolean;
}

export const useTouchGestures = (
  ref: React.RefObject<HTMLElement>,
  handlers: TouchHandlers,
  options: TouchOptions = {}
) => {
  const {
    swipeThreshold = 50,
    doubleTapThreshold = 300,
    enableSwipe = true,
    enableDoubleTap = true,
    enableTap = true,
    enablePan = false,
    enablePinch = false,
  } = options;

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTap = useRef<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;

      if (enableSwipe && Math.abs(deltaX) > swipeThreshold && deltaTime < 500) {
        handlers.onSwipe?.(deltaX > 0 ? 'right' : 'left');
      } else if (enableSwipe && Math.abs(deltaY) > swipeThreshold && deltaTime < 500) {
        handlers.onSwipe?.(deltaY > 0 ? 'down' : 'up');
      } else {
        const now = Date.now();
        if (enableDoubleTap && now - lastTap.current < doubleTapThreshold) {
          handlers.onDoubleTap?.();
        } else if (enableTap) {
          handlers.onTap?.();
        }
        lastTap.current = now;
      }

      touchStart.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, handlers, swipeThreshold, doubleTapThreshold, enableSwipe, enableDoubleTap, enableTap]);
};
