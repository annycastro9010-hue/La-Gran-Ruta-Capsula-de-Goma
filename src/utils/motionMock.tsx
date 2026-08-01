import React from 'react';

// Lightweight, crash-proof proxy component that converts motion.div, motion.span, motion.rect, motion.svg, motion.g, etc.
// into native HTML/SVG elements, eliminating Framer Motion DOM removeChild race conditions completely.
export const motion: any = new Proxy(
  {},
  {
    get(_target, prop: string) {
      const Component = ({ initial, animate, exit, transition, ...props }: any) => {
        const Tag = prop as any;
        return <Tag {...props} />;
      };
      Component.displayName = `MotionMock(${prop})`;
      return Component;
    },
  }
);

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
