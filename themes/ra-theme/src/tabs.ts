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

    this.initPages();

    // Page radio button clicked - select the page
    parent.addEventListener('change', (event) => {
      let target = event.target as HTMLInputElement;
      this.setActivePage(target!.id);
    });

    window.addEventListener('resize', () => {
      this.calcHeight();
    });

    this.setActivePage(activeId);
  }

  initPages() {
    const pages = this.parent.querySelectorAll('.content [data-tab]') as Iterable<HTMLElement>;
    for (let page of pages) {
      this.pages.set(page.dataset.tab!, page as HTMLElement);
    }
  }

  calcHeight() {
    if (this.activeId) {
      const page = this.pages.get(this.activeId)!;
      this.content.style.height = `${page.offsetHeight}px`;
    }
  }

  setActivePage(id: string) {
    if (this.activeId === id) {
      return;
    }

    if (this.activeId) {
      this.pages.get(this.activeId)!.dataset.tabActive = 'false';
    }

    if (this.pages.has(id)) {
      const page =  this.pages.get(id)!;
      page.dataset.tabActive = 'true';
      this.activeId = id;
      this.calcHeight();
    } else {
      console.warn(`Missing page ${id} - selecting none.`);
      this.activeId = '';
    }
  }
}
