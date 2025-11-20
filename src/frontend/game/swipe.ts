// swipe.ts
export type SwipeType = 'tap' | 'hold' | 'swipe' | 'fling';
export type Direction = 'left'|'right'|'up'|'down'|'unknown';

export interface SwipeEvent {
    type: SwipeType;
    direction: Direction;
    dx: number;
    dy: number;
    distance: number;
    duration: number; // ms
    velocity: number; // px/ms
    originalEvent?: Event;
}

interface Options {
    minDistance?: number;     // px, minimale Distanz für Swipe
    maxTapTime?: number;      // ms, max Zeit für Tap
    holdTime?: number;        // ms, Zeit für Hold
    flingVelocity?: number;   // px/ms, min velocity für Fling
}

export class SwipeDetector {
    private el: HTMLElement;
    private opts: Required<Options>;
    private startX = 0;
    private startY = 0;
    private startTime = 0;
    private active = false;
    private holdTimer: number | null = null;

    constructor(el: HTMLElement, opts: Options = {}) {
        this.el = el;
        this.opts = {
            minDistance: 30,
            maxTapTime: 200,
            holdTime: 500,
            flingVelocity: 0.5,
            ...opts
        };
        this.bind();
    }

    private bind() {
        if (window.PointerEvent) {
            this.el.addEventListener('pointerdown', this.onStart);
            // pointermove/up/cancel on window to survive leaving the element
            window.addEventListener('pointermove', this.onMove);
            window.addEventListener('pointerup', this.onEnd);
            window.addEventListener('pointercancel', this.onCancel);
        } else {
            // Fallback: touch events
            this.el.addEventListener('touchstart', this.onStart, { passive: false });
            window.addEventListener('touchmove', this.onMove, { passive: false });
            window.addEventListener('touchend', this.onEnd);
            window.addEventListener('touchcancel', this.onCancel);
        }
    }

    destroy() {
        // remove listeners (left as exercise)
    }

    private getPointFromEvent = (e: any) => {
        if (e.touches && e.touches.length) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        if (e.clientX !== undefined) return { x: e.clientX, y: e.clientY };
        if (e.changedTouches && e.changedTouches.length) {
            return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        }
        return { x: 0, y: 0 };
    };

    private onStart = (e: PointerEvent | TouchEvent) => {
        // Wenn touch, verhindern, dass der Browser scrollt (nur wenn sinnvoll)
        if (!(e instanceof PointerEvent)) e.preventDefault();

        const p = this.getPointFromEvent(e);
        this.startX = p.x;
        this.startY = p.y;
        this.startTime = performance.now();
        this.active = true;

        if (this.holdTimer) window.clearTimeout(this.holdTimer);
        this.holdTimer = window.setTimeout(() => {
            if (this.active) {
                this.emit({
                    type: 'hold',
                    direction: 'unknown',
                    dx: 0, dy: 0, distance: 0, duration: performance.now() - this.startTime,
                    velocity: 0,
                    originalEvent: e
                });
            }
        }, this.opts.holdTime);
    };

    private onMove = (e: PointerEvent | TouchEvent) => {
        if (!this.active) return;
        // optional: streaming drag events for aiming — not implemented here
    };

    private onEnd = (e: PointerEvent | TouchEvent) => {
        if (!this.active) return;
        this.active = false;
        if (this.holdTimer) { window.clearTimeout(this.holdTimer); this.holdTimer = null; }

        const p = this.getPointFromEvent(e);
        const endTime = performance.now();
        const dx = p.x - this.startX;
        const dy = p.y - this.startY;
        const duration = endTime - this.startTime;
        const distance = Math.hypot(dx, dy);
        const velocity = distance / Math.max(1, duration); // px per ms

        let type: SwipeType = 'tap';
        if (distance >= this.opts.minDistance) {
            type = velocity >= this.opts.flingVelocity ? 'fling' : 'swipe';
        } else if (duration >= this.opts.holdTime) {
            type = 'hold';
        } else if (duration > this.opts.maxTapTime) {
            type = 'tap';
        }

        const direction = this.getDirection(dx, dy);

        this.emit({
            type, direction, dx, dy, distance, duration, velocity, originalEvent: e
        });
    };

    private onCancel = (e: Event) => {
        this.active = false;
        if (this.holdTimer) { window.clearTimeout(this.holdTimer); this.holdTimer = null; }
    };

    private getDirection(dx: number, dy: number): Direction {
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
        } else if (Math.abs(dy) > 0) {
            return dy > 0 ? 'down' : 'up';
        }
        return 'unknown';
    }

    // Hook: du ersetzt das mit einem Event-Emitter / Callback in deinem Input-Manager
    onSwipe?: (s: SwipeEvent) => void;

    private emit(ev: SwipeEvent) {
        if (this.onSwipe) this.onSwipe(ev);
        // console.debug(ev); // nützlich beim Testen
    }
}
