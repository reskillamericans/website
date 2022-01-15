import { register } from './process.js';

// Apply styling to all option.target elements to turn them into
// buttons to accordion all the following p-tags.
register('accordion', (options) => {
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

  function openElt(elt: Element) {
    closeCurrent();
    const div = elt.nextElementSibling as HTMLElement;
    div.style.maxHeight = div.scrollHeight + 'px';
    elt.classList.add('open');
    currentOpen = elt as HTMLElement;
    currentDiv = div;
  }

  function showHash() {
    const hash = window.location.hash;
    const elt = document.querySelector(hash);
    if (elt) {
      openElt(elt);
      // The CSS animation seems to sometime scroll to the wrong location
      // perhaps because of a prior element collapsing.  So, this
      // ensures the URL-targeted section is visible - it waits 1/2 second
      // for the prior animation to complete.
      // We don't do this for the on-click case in order to avoid the site
      // feeling sluggish.
      window.setTimeout(() => {
        console.log("scrolling");
        elt.scrollIntoView();
      }, 500);
    }
  }

  // Open up a group who's id matches the current hash in the URL.
  window.addEventListener('load', showHash);
  window.addEventListener('hashchange', showHash);

  for (let section of document.querySelectorAll('section')) {
    if (section.classList.contains('footer') || section.classList.contains('header')) {
      continue;
    }

    for (const elt of section.querySelectorAll(selector)) {
      elt.classList.add('accordion-control');

      const div = document.createElement('div');
      div.classList.add('accordion-content');

      // Move all following content up until the next accordion-control
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
        openElt(elt);
      });
    }
  }
});
