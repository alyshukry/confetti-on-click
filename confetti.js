import {Vector} from "./vectors.js"

const acceleration = new Vector(0, .25)
const maxVel = new Vector(1.5, 10)
const drag = new Vector(.98, 1)

class Confetti {
    constructor() {
        this.batchId = batchId // Batch ID to allow removal of some confetti without removing all of them

        this.color = getRandomColor()
        this.pos = new Vector(0, 0)
        this.rotation = Math.random() * 5
        this.lifetime = 0 // Lifetime to delete confetti after a while

        this.vel = new Vector((Math.random() * 7.5) * (Math.random() < 0.5 ? -1 : 1), Math.random() * -8)        
        this.angularVel = Math.random() * 15 + 2 // Rotational velocity

        this.displayElement() // Creating and displaying the confetti particle

    }   update() {
        if (this.vel.y <= maxVel.y) this.vel.y += acceleration.y

        // If velocity less than .01 make it 0, else apply drag
        this.vel.magnitude() > .01 ? this.vel.x *= drag.x : this.vel.x = 0
        // Update particle position
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y
        // Display particle position
        this.element.style.left = `${this.pos.x}`
        this.element.style.top = `${this.pos.y}`

        // Rotating the particle
        this.rotation += this.angularVel
        this.element.style.transform = `rotate(${this.rotation % 360}deg)` // % 360 keeps it between 0 and 360

        this.lifetime += 1
        if (this.lifetime > 300) this.element.remove() // Delete particle when it reaches a lifetime of 300

    }   displayElement() {
            // Creating confetti particle
            this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            // Setting confetti particle's attributes
            this.element.setAttribute("xmlns", "http://www.w3.org/2000/svg")
            this.element.setAttribute("width", `14px`)
            this.element.setAttribute("height", `14px`)
            this.element.setAttribute("viewBox", "0 0 18 18")
            this.element.style.position = "absolute"
            this.element.classList.add("confetti-particle")

            // Giving the confetti particle a random shape
            const shapes = [
                `<rect x="5" y="0" width="6" height="16" fill="${this.color}"/>`, // Rectangle
                `<path width="16" height="16" d="M0,12 Q4,4 8,12 Q12,20 16,12" stroke="${this.color}" stroke-width="5" fill="none"/>`, // Squigly line
                `<circle cx="9" cy="9" r="5.5" fill="${this.color}"/>`, // Circle
                `<polygon points="9,2.072 17,15.928 1,15.928" fill="${this.color}" />` // Triangle
            ]   
            this.element.innerHTML = shapes[Math.floor(Math.random() * shapes.length)] // Pick a random shape

            confettiContainer.appendChild(this.element) // Add the confetti particle to the container
    }
}

function getRandomColor() { // Returns a random confetti color
    const colors = ["#f44a4a", "#fb8f23", "#fee440", "#7aff60", "#00f5d4", "#00bbf9", "#9b5de5", "#f15bb5"] // Array of colors
    return colors[Math.floor(Math.random() * colors.length)] // Pick a random color
}

// Getting the mouse position and storing it to spawn the confetti at its location
let mouseX = 0, mouseY = 0
document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
})

const confettiContainer = document.createElement("div") // Creating a container for the confetti
const confettiParticles = [] // Creating an array for all the confetti
let batchId = 0 // Initializing batch ID
function spawnConfetti(amount) {
    // Setting the confetti container attributes
    confettiContainer.style.position = "fixed"
    confettiContainer.style.top = "0"
    confettiContainer.style.width = "100%"
    confettiContainer.style.height = "100%"
    confettiContainer.style.zIndex = "99999"
    confettiContainer.style.pointerEvents = "none"
    confettiContainer.style.overflow = "hidden"
    confettiContainer.classList.add("confetti-container")
    
    document.body.appendChild(confettiContainer)
    
    batchId++ // Incrementing the batch ID for next batch of confetti
    for (let i = 0; i < amount; i++) { // Creating confetti
        const particle = new Confetti()
        confettiParticles.push(particle)  // Add to array
    }

    confettiParticles.forEach((particle) => { // Moving the confetti particles to the mouse
        if (particle.batchId === batchId) particle.pos.set(mouseX, mouseY)

    })
}   export {spawnConfetti}; window.spawnConfetti = spawnConfetti // Exporting the function

// Animate one frame
function animate() {
    confettiParticles.forEach((particle) => {
        particle.update()
    }) // Update each particle position and rotation
    requestAnimationFrame(animate)
}   animate()