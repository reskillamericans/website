import Hammer from 'hammerjs';

export { carousel };

// Carousel has one child that is a horizontal band of "cards".
function carousel(id: string, curChild=0) {
    const divParent = document.getElementById(id)!;
    const hammer = new Hammer(divParent);
    const divScroller = divParent.children[0] as HTMLDivElement;
    const numChildren = divScroller.children.length;
    const windowSize = window.screen.width;

    const divLeft = document.createElement('div');
    divLeft.classList.add('directional', 'left');

    const divRight = document.createElement('div');
    divRight.classList.add('directional', 'right');

    divParent.appendChild(divLeft);
    divParent.appendChild(divRight);

    centerCard(curChild);
    showControls();

    window.addEventListener('resize', () => {
        centerCard(curChild);
    });


    //Enable Swipe on mobile/tablet devices only
    hammer.set({enable: windowSize <= 1024 ? true : false});
    //Detect swipe left or right on divParent
    hammer.on("swipeleft swiperight", (e) => {
        const {type, isFinal} = e;

        //Event listener fires mutiple times. Waits until events are done.
        if (isFinal){
            //Check if user swipes right (image moves right)
            if (type === 'swiperight') scrollBy(-1);
            //Check if user swipes left (image moves left)
            if (type === 'swipeleft') scrollBy(1);
        }
      });

    divLeft.addEventListener('click', () => scrollBy(-1));

    divRight.addEventListener('click', () => scrollBy(1));

    function centerCard(child: number) {
        let card = divScroller.children[child] as HTMLDivElement;
        const cardRect = card.getBoundingClientRect();
        const scrollerRect = divScroller.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const center = (scrollerRect.left + scrollerRect.right) / 2;
        const target = center - cardWidth / 2;
        const offset = target - cardRect.left;
        divScroller.style.transform = `translateX(${offset}px)`;
    }

    function showControls() {
        divLeft.style.visibility = curChild === 0 ? 'hidden' : 'visible';
        divRight.style.visibility = curChild === numChildren - 1 ? 'hidden' : 'visible';
    }

    function scrollBy(n: number){
        const nextChild = curChild + n;
        console.log("nuChildren:", numChildren);
        console.log("nextChild:", nextChild);
        if (nextChild < 0 || nextChild >= numChildren){
            return;
        }
        curChild = nextChild;
        centerCard(curChild);
        showControls();
    }
}
