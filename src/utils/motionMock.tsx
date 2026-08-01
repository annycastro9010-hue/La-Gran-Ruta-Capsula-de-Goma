import React from 'react';

// Stable component cache for React reconciliation
const componentCache: Record<string, React.FC<any>> = {};

function getMotionComponent(tag: string) {
  if (!componentCache[tag]) {
    const Component = ({ initial, animate, exit, transition, style, ...props }: any) => {
      const Tag = tag as any;
      const newStyle = { ...style };

      if (animate) {
        let transformStr = '';
        
        // Handle translate x/y positioning used for characters & enemies
        const xVal = animate.x !== undefined ? (Array.isArray(animate.x) ? animate.x[0] : animate.x) : undefined;
        const yVal = animate.y !== undefined ? (Array.isArray(animate.y) ? animate.y[0] : animate.y) : undefined;
        
        if (xVal !== undefined || yVal !== undefined) {
          const tx = xVal !== undefined ? (typeof xVal === 'number' ? `${xVal}px` : xVal) : xVal;
          const ty = yVal !== undefined ? (typeof yVal === 'number' ? `${yVal}px` : yVal) : yVal;
          transformStr += `translate(${tx || '0%'}, ${ty || '0%'}) `;
        }

        // Handle scale
        const scaleVal = animate.scale !== undefined ? (Array.isArray(animate.scale) ? animate.scale[0] : animate.scale) : undefined;
        if (scaleVal !== undefined) {
          transformStr += `scale(${scaleVal}) `;
        }

        // Handle rotation angles
        const rotateVal = animate.rotate !== undefined ? (Array.isArray(animate.rotate) ? animate.rotate[0] : animate.rotate) : undefined;
        if (rotateVal !== undefined) {
          transformStr += `rotate(${rotateVal}deg) `;
        }

        if (transformStr) {
          newStyle.transform = transformStr.trim();
          
          // Apply a fast, ultra-responsive spring-like CSS transition
          newStyle.transition = 'transform 0.14s cubic-bezier(0.2, 1.1, 0.4, 1.15)';
        }
      }

      return <Tag style={newStyle} {...props} />;
    };
    Component.displayName = `MotionMock(${tag})`;
    componentCache[tag] = Component;
  }
  return componentCache[tag];
}

export const motion: any = new Proxy(
  {},
  {
    get(_target, prop: string) {
      return getMotionComponent(prop);
    },
  }
);

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
