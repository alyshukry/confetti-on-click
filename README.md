# 🎉 Confetti Effect
A lightweight JavaScript library that spawns confetti at the mouse position on demand. Perfect for adding celebration effects to buttons, clicks, or custom triggers on your website.

![Demo](demo.gif)

## How to use:
### Option 1: npm
```bash
npm install confetti-on-click
```

### Option 2: Vanilla JS
1. Install `confetti.js` and add it to your project folder
2. In your HTML file, include the `confetti.js` script as a module
	```html
	<script src="path/to/confetti.js" type="module"></script>
	```
### Basic Usage
Spawn confetti at the mouse position
```js
// Spawn confetti with 30 particles at the current mouse position
spawnConfetti(30);
```
Example:
```js
document.querySelector('#celebration-button').addEventListener('click', function(event) {
  // Spawn 50 particles when the button is clicked
  spawnConfetti(50);
});
```
<br>

**License:** MIT
**Contributing:** Contributions welcome! Please feel free to submit a Pull Request.