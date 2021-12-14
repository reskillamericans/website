export { Tabs };

// Tabbed pages.
// <div>
// <div class="menu">...</div>
// <div class="content">...</div>
class Tabs {
  parent: HTMLDivElement;
  content: HTMLDivElement;
  buttons: Map<string, HTMLInputElement> = new Map();
  pages: Map<string, HTMLElement> = new Map();
  activeId = '';

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.content = this.parent.querySelector('.content')! as HTMLDivElement;

    const buttons = parent.querySelectorAll('.menu input[type=radio]') as Iterable<HTMLInputElement>;

    let activeId = '';

    for (let button of buttons) {
      this.buttons.set(button.id, button);
      if (button.checked) {
        activeId = button.id;
      }
    }

    const pages = parent.querySelectorAll('.content [data-tab]') as Iterable<HTMLElement>;
    let height = 0;
    for (let page of pages) {
      this.pages.set(page.dataset.tab!, page as HTMLElement);
      height = Math.max(height, page.clientHeight);
    }

    this.content.style.height = `${height}px`;

    parent.addEventListener('change', (event) => {
      let target = event.target as HTMLInputElement;
      this.setActivePage(target!.id);
    });

    this.setActivePage(activeId);
  }

  setActivePage(id: string) {
    console.log(`Activating ${id}`);

    if (this.activeId === id) {
      return;
    }

    if (this.activeId) {
      this.pages.get(this.activeId)!.dataset.tabActive = 'false';
    }

    if (this.pages.has(id)) {
      this.pages.get(id)!.dataset.tabActive = 'true';
      this.activeId = id;
    } else {
      console.warn(`Missing page ${id} - selecting none.`);
      this.activeId = '';
    }
  }
}
