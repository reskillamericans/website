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


    //Enable Swipe on mobile devices only
    hammer.set({enable: windowSize <= 768 ? true : false})
    //Detect swipe left or right on divParent
    hammer.on("swipeleft swiperight", function(e: any) {
        const {type, isFinal} = e;

        //Event listener fires mutiple times. Waits until events are done.
        if(isFinal){
            //Check if user swipes right (image moves right)
            if(type === 'swiperight'){
                if(curChild === 0){
                    return;
                }
                centerCard(--curChild);
                showControls();
            }
            //Check if user swipes left (image moves left)
            if(type === 'swipeleft'){
                if(curChild === numChildren - 1){
                    return;
                }
                centerCard(++curChild);
                showControls();
            }
        }
      });

    divLeft.addEventListener('click', () => {
        if (curChild === 0) {
            return;
        }
        centerCard(--curChild);
        showControls();
    });

    divRight.addEventListener('click', () => {
        if (curChild === numChildren - 1) {
            return;
        }
        centerCard(++curChild);
        showControls();
    });

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
}
