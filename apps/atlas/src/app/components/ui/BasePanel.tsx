'use client';
import { animated, useSpring } from '@react-spring/web';

type Props = {
  children: React.ReactNode;
  open: boolean;
  style?: string;
  className?: string;
};

export const BasePanel = (props: Props) => {
  const animation = useSpring({
    // opacity: props.open ? 1 : 0,
    from: { opacity: 0, transform: 'translateY(5%)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    // transform: props.open ? `translateY(0)` : `translateY(5%)`,
    delay: 150,
  });

  return (
    <animated.div
      className={`absolute top-0 left-0 w-full h-full z-10 ${props.className}`}
      style={animation}
    >
      <div
        className={`h-full overflow-y-scroll w-full relative  bg-gray-1100/90 ${props.style}`}
      >
        {props.children}
      </div>
    </animated.div>
  );
};
