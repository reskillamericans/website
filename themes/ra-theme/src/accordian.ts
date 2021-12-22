import { register } from './process.js';

type AccordianOptions = {
  name: string;
  target: string;
}

// Apply syling to all option.target elements to turn them into
// buttons to accordian all the following p-tags.
register('accordian', (options: any) => {
  const selector = options['selector'];
  const stopSelector = options['stop'];
  let currentOpen: HTMLElement | null = null;
  let currentDiv: HTMLElement | null = null;

  function closeCurrent() {
    if (currentOpen === null) {
      return;
    }
    currentOpen.classList.remove('open');
    currentDiv!.style.maxHeight = '0px';
    currentOpen = null;
    currentDiv = null;
  }

  for (let section of document.querySelectorAll('section')) {
    if (section.classList.contains('footer') || section.classList.contains('header')) {
      continue;
    }

    for (const elt of section.querySelectorAll(selector)) {
      elt.classList.add('accordian-control');

      const div = document.createElement('div');
      div.classList.add('accordian-content');

      // Move all following content up until the next accordian-control
      // into the newly created div.
      let child = elt.nextElementSibling;
      while (child !== null) {
        if (child.matches(selector) || child.matches(stopSelector)) {
          break;
        }
        const next = child.nextElementSibling;
        div.appendChild(child);
        child = next;
      }

      elt.after(div);

      elt.addEventListener('click', () => {
        if (currentOpen === elt) {
          closeCurrent();
          return;
        }
        closeCurrent();
        div.style.maxHeight = div.scrollHeight + 'px';
        elt.classList.add('open');
        currentOpen = elt;
        currentDiv = div;
      });
    }
  }
});
