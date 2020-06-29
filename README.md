# bubble.js
A small js library to create google-style speech bubbles

## Usage
To use this library via a CDN, add this to your HTML:
```html
<link rel="stylesheet" href="https://raw.githack.com/MarkusJx/bubble.js/master/bubble.min.css">
<script src="https://raw.githack.com/MarkusJx/bubble.js/master/bubble.min.js"></script>

<!-- You will also need Material.io elements: -->
<link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
<script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js" type="text/javascript"></script>
```

 To start, add a bubble element to your HTML:
 ```html
<div class="bubble" id="bubble">
    <h1 class="bubble-heading">Heading</h1>
    <p class="bubble-text">Text</p>
    <div class="bubble-actions">
        <button class="mdc-button bubble-button">  <span class="mdc-button__ripple"></span> Ok</button>
    </div>

    <div class="bubble-pointer"></div>
</div>
```

Create the bubble element and show it next to a HTML element:
```js
const bubble = new Bubble(document.getElementById("bubble"));

// Show it
bubble.show(document.getElementById("some-elements-id"));
```
