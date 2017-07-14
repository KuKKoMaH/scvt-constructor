const el = document.createElement('div');

const transitions = {
  transition:       'transitionend',
  OTransition:      'oTransitionEnd',
  MozTransition:    'transitionend',
  WebkitTransition: 'webkitTransitionEnd',
};

let event = null;

for (let t in transitions) {
  if (el.style[t] !== undefined) event = transitions[t];
}

export default event;
