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

    for (const name of names) {
      if (!data.has(name) || data.get(name) == '') {
        // Ignore disabled controls.
        if (controls.get(name)!.getAttribute('disabled') == 'true') {
          continue;
        }
        console.log(`Missing value for ${name}`);
        controls.get(name)!.focus();
        listElements.get(name)!.scrollIntoView();
        return false;
      }
    }

    for (const [key, value] of data.entries()) {
      json[key] = value;
      console.log(`${key}: type {${typeof value}} value {${value}}`);
    }
    console.log(json);
  }
});
