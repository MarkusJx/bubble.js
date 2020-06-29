class Bubble {
    /**
     * The Bubble constructor
     * 
     * @param {HTMLDivElement} element the bubble element to bind to
     */
    constructor(element) {
        this.root = element;

        let heading_list = element.getElementsByClassName("bubble-heading");
        if (heading_list.length != 1) throw new Error("Invalid bubble element");

        this.headingElement = heading_list[0];

        let text_list = element.getElementsByClassName("bubble-text");
        if (text_list.length != 1) throw new Error("Invalid bubble element");

        this.textElement = text_list[0];

        this.buttonElements = element.getElementsByClassName("bubble-button");
        if (this.buttonElements.length < 1) throw new Error("Invalid bubble element");

        for (let i = 0; i < this.buttonElements.length; i++) {
            new mdc.ripple.MDCRipple(this.buttonElements[i]);
            this.buttonElements[i].addEventListener('click', (e) => {
                let res = { value: this.buttonElements[i].innerText, event: e };

                this.root.style.opacity = "0";
                this.closeListeners.forEach(fn => {
                    fn(res);
                });
            });
        }

        let pointer_list = element.getElementsByClassName("bubble-pointer");
        if (pointer_list.length != 1) throw new Error("Invalid bubble element");

        this.pointerElement = pointer_list[0];

        this.closeListeners = [];
        this.openListeners = [];
    }

    /**
     * Set the ehading
     * 
     * @param {string} text the new heading text
     */
    setHeading(text) {
        this.headingElement.innerHTML = text;
        this.pointerElement.style.top = root.offsetHeight + "px";
        this.pointerElement.style.left = (root.offsetWidth - this.pointerElement.offsetWidth) / 2 + "px";
    }

    /**
     * Set the inner tetx
     * 
     * @param {string} text the new inner text
     */
    setText(text) {
        this.textElement.innerHTML = text;
        this.pointerElement.style.top = root.offsetHeight + "px";
        this.pointerElement.style.left = (root.offsetWidth - this.pointerElement.offsetWidth) / 2 + "px";
    }

    /**
     * Listen for an open or close event
     * 
     * @param {string} event the event to listen for, may be Bubble:closed or Bubble:opened
     * @param {function({value: string, event: Event}?): void} callback the callback function
     */
    listen(event, callback) {
        if (event === "Bubble:closed") {
            this.closeListeners.push(callback);
        } else if (event == "Bubble:opened") {
            this.openListeners.push(callback);
        } else {
            throw new Error("Unknown event");
        }
    }

    /**
     * Unlisten for an open or close event
     * 
     * @param {string} event the event to unlisten from 
     * @param {function({value: string, event: Event}?): void} callback the callback function
     */
    unlisten(event, callback) {
        if (event === "Bubble:closed") {
            let index = this.closeListeners.indexOf(callback);
            if (index === -1) throw new Error("Unknown callback function");
            this.closeListeners.splice(index, 1);
        } else if (event == "Bubble:opened") {
            let index = this.openListeners.indexOf(callback);
            if (index === -1) throw new Error("Unknown callback function");
            this.openListeners.splice(index, 1);
        } else {
            throw new Error("Unknown event");
        }
    }

    /**
     * Show the Bubble
     * 
     * @param {HTMLElement} element the element to place the bubble next to
     * @param {string} offsetLeft a left offset, may be negative
     */
    show(element, offsetLeft = 0) {
        let root = this.root;

        // Get real offset left and top. Source: https://stackoverflow.com/a/5598797
        function getOffsetLeft(elem) {
            let offsetLeft = 0;
            do {
                if (!isNaN(elem.offsetLeft)) {
                    offsetLeft += elem.offsetLeft;
                }
            } while (elem = elem.offsetParent);
            return offsetLeft;
        }

        function getOffsetTop(elem) {
            let offsetTop = 0;
            do {
                if (!isNaN(elem.offsetTop)) {
                    offsetTop += elem.offsetTop;
                }
            } while (elem = elem.offsetParent);
            return offsetTop;
        }

        let elem_left = getOffsetLeft(element);
        let elem_top = getOffsetTop(element);

        function canPlaceAbove() {
            return elem_top > root.offsetHeight;
        }

        function canPlaceBelow() {
            let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
            return (vh - (elem_top + element.offsetHeight)) > root.offsetHeight;
        }

        function canPlaceLeft() {
            return elem_left > root.offsetWidth;
        }

        function canPlaceRight() {
            let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            return (vw - (elem_left + element.offsetWidth)) > root.offsetWidth;
        }

        this.pointerElement.className = "bubble-pointer";
        if (canPlaceAbove()) {
            console.debug("Placing above");
            root.style.top = elem_top - root.offsetHeight - 20 + "px";
            root.style.left = (element.offsetWidth - root.offsetWidth) / 2 + elem_left + offsetLeft + "px";

            this.pointerElement.classList.add("bottom");
            this.pointerElement.style.top = root.offsetHeight + "px";
            this.pointerElement.style.left = (root.offsetWidth - this.pointerElement.offsetWidth) / 2 - offsetLeft + "px";
        } else if (canPlaceBelow()) {
            console.debug("Placing below");
            root.style.top = elem_top + element.offsetHeight + 20 + "px";
            root.style.left = (element.offsetWidth - root.offsetWidth) / 2 + elem_left + offsetLeft + "px";

            this.pointerElement.style.top = root.offsetHeight + "px";
            this.pointerElement.style.left = (root.offsetWidth - this.pointerElement.offsetWidth) / 2 - offsetLeft + "px";
        } else if (canPlaceLeft()) {
            console.debug("Placing left");
            root.style.top = elem_top + "px"; // Place at the same height as the element to place next to
            root.style.left = elem_left - root.offsetWidth - 20 + "px";

            this.pointerElement.classList.add("right");
            this.pointerElement.style.top = (root.offsetHeight - this.pointerElement.offsetHeight) / 2 + "px";
            this.pointerElement.style.left = "0px";
        } else if (canPlaceRight()) {
            console.debug("Placing right");
            root.style.top = elem_top + "px"; // Place at the same height as the element to place next to
            root.style.left = elem_left - root.offsetWidth - 20 + "px";

            this.pointerElement.classList.add("right");
            this.pointerElement.style.top = elem_left + element.offsetWidth + 20 + "px";
            this.pointerElement.style.left = root.offsetWidth + "px";
        } else {
            throw new Error("Could not find a suitable location to put element");
        }

        root.style.opacity = "1";
        this.openListeners.forEach(fn => {
            fn();
        });
    }
}