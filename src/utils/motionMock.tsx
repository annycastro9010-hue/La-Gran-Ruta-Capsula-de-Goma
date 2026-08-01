import React from 'react';

// Lightweight, crash-proof proxy component that converts motion.div, motion.span, motion.rect, etc.
// into native HTML/SVG elements, eliminating Framer Motion DOM removeChild race conditions completely.
export const motion: any = new Proxy(
  {},
  {
    get(_target, prop: string) {
      return React.forwardRef<any, any>(({ initial, animate, exit, transition, ...props }, ref) => {
        const Tag = prop as any;
        return <Tag ref={ref} {...props} />;
      });
    },
  }
);

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
