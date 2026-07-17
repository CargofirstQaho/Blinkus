const React = require('react');

function createMotionComponent(tag) {
  const Component = React.forwardRef(function MotionComponent(
    { children, initial, animate, exit, transition, whileHover, whileTap, ...props },
    ref
  ) {
    return React.createElement(tag, { ...props, ref }, children);
  });
  Component.displayName = `motion.${tag}`;
  return Component;
}

const motion = new Proxy(
  {},
  {
    get(_, tag) {
      return createMotionComponent(tag);
    },
  }
);

function AnimatePresence({ children }) {
  return React.createElement(React.Fragment, null, children);
}

module.exports = { motion, AnimatePresence };
