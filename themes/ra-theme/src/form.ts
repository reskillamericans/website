import { register } from './process.js';

type AccordianOptions = {
  name: string;
  target: string;
}

register('form', (options: any) => {
  // Assume only one form per page.
  const names: string[] = [];
  const listElements: Map<string, Element> = new Map();
  const controls: Map<string, HTMLInputElement> = new Map();
  const errors: Set<HTMLElement> = new Set();

  const form = document.querySelector('form')!;
  const elements = form.querySelectorAll('input, select, textarea');
  for (const elt of elements) {
      const name = elt.getAttribute('name');

      if (name === null) {
        if (elt.getAttribute('type') !== 'submit') {
          console.error(`Form element ${elt} has no name attribute - and will not be submitted.`, elt);
        }
        continue;
      }

      if (elt.getAttribute('value') === 'other') {
        handleOtherControl(elt as HTMLInputElement);
      }

      if (name && !names.includes(name)) {
        names.push(name);
        controls.set(name, elt as HTMLInputElement);
        let listElt = parentListElement(elt);
        if (listElt) {
          listElements.set(name, listElt);
        }
      }
  }

  // Focus the first form element.
  controls.get(names[0])!.focus();

  form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const data = new FormData(form);
    const json: {[key: string]: FormDataEntryValue} = {};

    for (const error of errors) {
      error.remove();
    }
    errors.clear();

    let hasError = false;

    // All form fields are "required".
    for (const name of names) {
      if (!data.has(name) || data.get(name) === '') {
        const li = listElements.get(name)!;
        // Empty other text is FINE as long as the other control is not selected.
        if (name.endsWith('-other') && data.get(name.slice(0, -6)) !== 'other') {
          continue;
        }
        console.log(`Missing value for ${name}`);
        const error = makeError();
        errors.add(error);
        li.after(error);
        if (!hasError) {
          hasError = true;
          controls.get(name)!.focus();
          li.scrollIntoView();
        }
      }
    }

    if (hasError) {
      return;
    }

    for (let name of names) {
      const value = data.get(name);
      if (value === null || value == '') {
        continue;
      }
      if (name.endsWith('-other')) {
        name = name.slice(0, -6);
      }
      json[name] = value;
    }

    console.log("Form submitting:", json);
    const evt = new CustomEvent('form-submit', {detail: json});
    form.dispatchEvent(evt);
  });
});

function makeError(): HTMLElement {
  const required = document.createElement('p');
  required.classList.add('form-error');
  required.textContent = 'This field is required.';
  return required;
}

// Find the parent list element of a form element.
function parentListElement(elt: Element): Element | null {
  let listElt = elt.parentElement!;
  while (listElt !== null && listElt.tagName !== 'LI') {
    listElt = listElt.parentElement!;
  }
  return listElt;
}

// Other type radio button.  There is a linked input field that should
// be disabled or enabled based on the state of the radio button.
// Note that we need to use change event on a parent element, since
// deselecting the Other button by clicking a sibling sends no event to itself.
function handleOtherControl(other: HTMLInputElement) {
  const name = other.getAttribute('name')!;
  let li = parentListElement(other)!;
  const otherText = li.querySelector(`[name="${name}-other"]`) as HTMLInputElement;

  if (!otherText) {
    console.log(`No linked text input for other ${name}.`);
    return;
  }

  // Clicks in text field should select the "other" option.
  otherText.addEventListener('click', (e: Event) => {
      console.log(`Clicked other ${name}.`);
      other.checked = true;
  });

  li.addEventListener('change', (evt) => {
    const radio = evt.target as HTMLInputElement;
    if (radio.tagName !== 'INPUT' || radio.type !== 'radio') {
      return;
    }

    if (radio.value === 'other') {
      otherText.focus();
    } else {
      otherText.value = '';
    }
  });
}
