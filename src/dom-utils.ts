export { ElementBindings, bindElements, bindButtons };

function bindButtons(handlers: Map<string, () => void>) {
  for (let [id, fn] of handlers) {
      console.log(`Binding button id: ${id}`);
      document.getElementById(id)!.addEventListener('click', fn);
  }
}

type ElementBindings = { [key: string]: HTMLElement };

function bindElements(...eltNames: string[]): ElementBindings {
  let results: { [key: string]: HTMLElement } = {};
  for (let eltName of eltNames) {
    results[eltName] = document.getElementById(eltName)!;
  }
  return results;
}
