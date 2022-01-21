import { register } from './process.js';

type JSONFormData = Record<string, string | string[]>;

register('form', (options) => {
  // Assume only one form per page.
  // Text fields with name like "*-other" are attached to a checkbox
  // or radio button with name like "*".

  // List of field names to be submitted by this form.
  const names: string[] = [];

  // Each field is surrounded by a containing <li>
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
        controls.set(name, elt as HTMLInputElement);

        // "Other" fields are not directly submitted - leave out of names list.
        if (!name.endsWith('-other')) {
          names.push(name);

          let listElt = parentListElement(elt);
          if (listElt) {
            listElements.set(name, listElt);
          }
        }
      }
  }

  const formState = localStorage.getItem(`${form.id}-state`);
  if (formState !== null) {
    restoreFormState(controls, listElements, JSON.parse(formState) as JSONFormData);
    localStorage.removeItem(`${form.id}-state`);
  }

  // Focus the first form element.
  controls.get(names[0])!.focus();

  // Save the form state
  window.addEventListener('beforeunload', () => {
    localStorage.setItem(`${form.id}-state`, JSON.stringify(getFormAsJSON()));
  });

  function getFormAsJSON(): JSONFormData {
    const data = new FormData(form);
    const json: Record<string, string | string[]> = {};

    // Extract the form data into a JSON object.
    for (let name of names) {
      let value: string | string[];

      const isMultiple = controls.get(name)!.type === 'checkbox';

      if (isMultiple) {
        value = data.getAll(name) as string[];

        // If other is checked - get the value from the "*-other" text field.
        const iOther = value.indexOf('other');
        if (iOther !== -1) {
          value.splice(iOther, 1);

          const otherValue = getOtherControlValue(name, controls);
          if (otherValue !== '') {
            value.push(otherValue);
          }
        }
      } else {
        // Single value - like text field or radio button.
        if (data.get(name) === null) {
          continue;
        }
        value = (data.get(name) as string).trim();
        if (value === 'other') {
          value = getOtherControlValue(name, controls);
        }
      }

      // String empty or empty array - no value recorded for the field.
      if (value.length !== 0) {
        json[name] = value;
      }
    }

    return json;
  }

  form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const json = getFormAsJSON();

    // Clear out any form errors display on the form initially
    // from a past submission.
    for (const error of errors) {
      error.remove();
    }
    errors.clear();

    console.log("Form data:", json);

    let hasError = false;

    // Make sure we have all the field values (every field is required,
    // unless it has a data-optional attribute).
    for (const name of names) {
      if (name.endsWith('-other')) {
        continue;
      }
      if (json[name] === undefined) {
        if (controls.get(name)?.getAttribute('data-optional') === 'true') {
          continue;
        }
        const li = listElements.get(name)!;
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

    console.log("Form submitting ...");
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

function getOtherControlValue(name: string, controls: Map<string, HTMLInputElement>): string {
  const otherControl = controls.get(`${name}-other`)!;
  if (otherControl === null) {
    console.error(`Form element ${name}-other is missing.`, otherControl);
    return '';
  }

  return otherControl.value.trim();
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
    console.error(`No linked text input for other ${name}.`);
    return;
  }

  otherText.addEventListener('blur', (evt) => {
    if (otherText.value === '') {
      other.checked = false;
    }
  });

  // Clicks in text field should select the "other" option.
  otherText.addEventListener('click', (e: Event) => {
      other.checked = true;
  });

  li.addEventListener('change', (evt) => {
    // Control will be either a radio or checkbox input element.
    const control = evt.target as HTMLInputElement;

    if (control.tagName !== 'INPUT') {
      return;
    }

    if (control.type === 'radio') {
      if (control.value === 'other') {
        otherText.focus();
      } else {
        otherText.value = '';
      }
    } else if (control.type === 'checkbox' && control.value === 'other') {
      if (control.checked) {
        otherText.focus();
      } else {
        otherText.value = '';
      }
    }
  });
}

function restoreFormState(controls: Map<string, HTMLInputElement>,
  listElements: Map<string, Element>, state: JSONFormData) {
  console.log("Restoring form state:", state);

  for (const [name, value] of Object.entries(state)) {
    if (value === undefined || value === '') {
      continue;
    }

    const control = controls.get(name)!;
    const li = listElements.get(name)!;

    console.log(`Restoring ${name} (a ${control.type}) to ${state[name]}`, control);

    switch (control.type) {
      case 'select-one':
      case 'text':
      case 'textarea':
        control.value = state[name] as string;
        break;

      case 'radio':
        const elt = li.querySelector(`input[value="${value}"`)! as HTMLInputElement;
        if (elt === null) {
          const otherRadio = li.querySelector(`input[value="other"]`)! as HTMLInputElement;
          otherRadio.checked = true;
          const other = li.querySelector(`input[name="${name}-other"]`)! as HTMLInputElement;
          other.value = value as string;
        } else {
          elt.checked = true;
        }
        break;

      case 'checkbox':
        const values = value as string[];
        const elts = li.querySelectorAll(`input[type="checkbox"]`) as NodeListOf<HTMLInputElement>;
        for (const elt of elts) {
          if (values.includes(elt.value)) {
            elt.checked = true;
            values.splice(value.indexOf(elt.value), 1);
          }
        }
        if (values.length > 0) {
          const otherCheck = li.querySelector(`input[value="other"]`)! as HTMLInputElement;
          otherCheck.checked = true;
          const other = li.querySelector(`input[name="${name}-other"]`)! as HTMLInputElement;
          other.value = values[0];
        }
      break;

      default:
        console.log(`Unknown control type ${control.type} for ${name}`);
        break;
    }
  }
}
