import { register } from './process.js';

type AccordianOptions = {
  name: string;
  target: string;
}

register('form', (options: any) => {
  // Assume only one form per page.
  const names: string[] = [];
  const listElements: Map<string, Element> = new Map();
  const controls: Map<string, HTMLElement> = new Map();
  const errors: Set<HTMLElement> = new Set();

  const form = document.querySelector('form')!;
  const elements = form.querySelectorAll('input, select, textarea');
  for (const elt of elements) {
      const name = elt.getAttribute('name');
      if (name === null) {
        continue;
      }
      if (name.endsWith('-other')) {
        elt.setAttribute('disabled', 'true');
      }
      if (name && !names.includes(name)) {
        names.push(name);
        controls.set(name, elt as HTMLElement);
        let listElt = elt.parentElement!;
        while (listElt.tagName != 'LI') {
          listElt = listElt.parentElement!;
        }
        listElements.set(name, listElt);
      }
      console.log(name);
  }

  form.onsubmit = submitForm;

  // Focus the first form element.
  controls.get(names[0])!.focus();

  function submitForm(e: Event) {
    e.preventDefault();
    const data = new FormData(form);
    const json: {[key: string]: FormDataEntryValue} = {};

    for (const error of errors) {
      error.remove();
    }
    errors.clear();

    let firstError = false;

    for (const name of names) {
      if (!data.has(name) || data.get(name) == '') {
        // Ignore disabled controls.
        if (controls.get(name)!.getAttribute('disabled') == 'true') {
          continue;
        }
        const li = listElements.get(name)!;
        console.log(`Missing value for ${name}`);
        const error = makeError();
        errors.add(error);
        li.after(error);
        if (!firstError) {
          firstError = true;
          controls.get(name)!.focus();
          li.scrollIntoView();
        }
      }
    }

    if (firstError) {
      return false;
    }

    for (const [key, value] of data.entries()) {
      json[key] = value;
      console.log(`${key}: type {${typeof value}} value {${value}}`);
    }
    console.log(json);
  }
});

function makeError(): HTMLElement {
  const required = document.createElement('p');
  required.classList.add('form-error');
  required.textContent = 'This field is required.';
  return required;
}