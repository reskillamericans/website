export { carousel };

// Carousel has one child that is a horizantal band of "cards".
function carousel(id: string) {
    let curPos = 0;
    let curChild = 0;

    const divParent = document.getElementById(id)!;
    const divScroller = divParent.children[0] as HTMLDivElement;
    const numChildren = divScroller.children.length;

    const divLeft = document.createElement('div');
    divLeft.classList.add('directional', 'left');

    const divRight = document.createElement('div');
    divRight.classList.add('directional', 'right');

    divParent.appendChild(divLeft);
    divParent.appendChild(divRight);

    centerCard(curChild);

    divLeft.addEventListener('click', () => {
        if (curChild === 0) {
            return;
        }
        centerCard(--curChild);
    });

    divRight.addEventListener('click', () => {
        if (curChild === numChildren - 1) {
            return;
        }
        centerCard(++curChild);
    });

    function centerCard(child: number) {
        let card = divScroller.children[child] as HTMLDivElement;
        const cardRect = card.getBoundingClientRect();
        const parentRect = divParent.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const center = (parentRect.left + parentRect.right) / 2;
        const target = center - cardWidth / 2;
        const offset = target - cardRect.left;
        curPos += offset;
        divScroller.style.transform = `translateX(${curPos}px)`;
    }
}
