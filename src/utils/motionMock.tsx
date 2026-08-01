import React from 'react';

// Component reference cache so React receives STABLE component references
// on every render. This prevents React from constantly unmounting/remounting
// sprites like Luffy, Koby, Alvida and enemies.
const componentCache: Record<string, React.FC<any>> = {};

function getMotionComponent(tag: string) {
  if (!componentCache[tag]) {
    const Component = ({ initial, animate, exit, transition, ...props }: any) => {
      const Tag = tag as any;
      return <Tag {...props} />;
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
