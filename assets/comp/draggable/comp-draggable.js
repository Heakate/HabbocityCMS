export class CompDraggable {
    static draggable(element, elementHead, onDrag) {
        let rareMouseDown = false;
        let raredSavedX = 0;
        let rareSavedY = 0;
        let rareElement = element;
        let upListener, moveListener;

        elementHead.onmousedown = function (e) {
            rareMouseDown = true;
            raredSavedX = e.pageX - parseInt(rareElement.offsetLeft);
            rareSavedY = e.pageY - parseInt(rareElement.offsetTop);
        }

        moveListener = (e) => {
            if (rareMouseDown) {
                document.body.contains(rareElement);
                rareElement.style.left = (e.pageX - raredSavedX) + "px";
                rareElement.style.top = (e.pageY - rareSavedY) + "px";
                onDrag((e.pageX - raredSavedX), (e.pageY - rareSavedY));
            }
        };

        upListener = () => {
            rareMouseDown = false;
        };


        window.addEventListener('mouseup', upListener);
        window.addEventListener('mousemove', moveListener);
    }
}