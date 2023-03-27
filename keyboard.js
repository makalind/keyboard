const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capslock: false
    },


    init() {
        // create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".key");

        // add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // automatically use keyboard for elements with use-keyboard-input class
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },


    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "?", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "æ", "ø",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".",
            "space"
        ];



        // create HTML for an icon
        const createIconHtml = (icon) => {
            return `<i class="material-icons">${icon}</i>`;
        };



        // loop through keyLayout and create an element for each key
        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");

            // should there be a line break?
            const insertLineBreak = ["backspace", "å", "ø", "."].indexOf(key) !== -1;


            keyElement.setAttribute("type", "button");
            keyElement.classList.add("key");

            switch(key) {
                case "backspace":
                    keyElement.classList.add("key--wide");
                    keyElement.innerHTML = createIconHtml("backspace");

                    // onclick event for space bar
                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;


                case "caps":
                    keyElement.classList.add("key--wide", "key--activatable");
                    keyElement.innerHTML = createIconHtml("keyboard_capslock");

                    // onclick event for space bar
                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("key--active", this.properties.capslock);
                    });

                    break;
                

                case "enter":
                    keyElement.classList.add("key--wide");
                    keyElement.innerHTML = createIconHtml("keyboard_return");

                    // onclick event for space bar
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;


                case "space":
                    keyElement.classList.add("key--extra-wide");
                    keyElement.innerHTML = createIconHtml("space_bar");

                    // onclick event for space bar
                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;


                case "done":
                    keyElement.classList.add("key--wide", "key--dark");
                    keyElement.innerHTML = createIconHtml("check_circle");

                    // onclick event for space bar
                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;


                default:
                    keyElement.textContent = key.toLowerCase()

                    // onclick event for space bar
                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capslock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if(insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },




    _triggerEvent(handlerName) {
        if(typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capslock = !this.properties.capslock;

        for(const key of this.elements.keys) {
            if(key.childElementCount === 0) {
                key.textContent = this.properties.capslock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
}


window.addEventListener("DOMContentLoaded", () => {
    Keyboard.init();


    // get the position of the caret
    // var input = document.querySelectorAll(".use-keyboard-input");
        
    //     input[0].addEventListener ("keydown", function () {
    //       alert ("Caret position: " + this.selectionStart);
    //     });

    // How to implement keyboard
    // Keyboard.open("dcode", (currentValue) => {
    //     console.log(currentValue);
    // }, (currentValue) => {
    //     console.log("Keyboard closed! finished value: " + currentValue);
    // }
    // );
});