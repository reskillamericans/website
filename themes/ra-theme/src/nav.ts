export { main };

function main() {
  const nav = document.querySelector('header > nav > ul')!
  const toggle = document.querySelector('#menu-toggle')!;

  toggle.addEventListener('click', () => {
    console.log("Toggle menu");
    const pop = nav.getAttribute('data-popout');
    nav.setAttribute('data-popout', pop === 'true' ? 'false' : 'true');
    toggle.setAttribute('data-popout', pop === 'true' ? 'false' : 'true');
  });
}
