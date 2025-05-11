class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }   set(x, y) {
        if (x instanceof Vector) {
            this.x = x.x
            this.y = x.y
        }   else {
            this.x = x
            this.y = y
        }   return this
    }   magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }
}

class Confetti {
    // Configurable settings
    static acceleration = new Vector(0, .25)
    static maxVel = new Vector(1.5, 10)
    static drag = new Vector(.98, 1)
    static colors = ["#f44a4a", "#fb8f23", "#fee440", "#7aff60", "#00f5d4", "#00bbf9", "#9b5de5", "#f15bb5"]
    static shapes = [
        `<rect x="5" y="0" width="6" height="16"/>`, // Rectangle
        `<path width="16" height="16" d="M0,12 Q4,4 8,12 Q12,20 16,12" stroke-width="5" fill="none"/>`, // Squigly line
        `<circle cx="9" cy="9" r="5.5"/>`, // Circle
        `<polygon points="9,2.072 17,15.928 1,15.928"/>` // Triangle
    ]
    static fadeOut = true

    constructor(lifetime) {
        this.batchId = batchId // Batch ID to allow removal of some confetti without removing all of them

        this.color = Confetti.colors[Math.floor(Math.random() * Confetti.colors.length)] // Random color
        this.pos = new Vector(0, 0)
        this.rotation = new Vector(0, Math.random() * 360)

        lifetime === undefined || lifetime === "default" ? this.lifetime = 2000 : this.lifetime = lifetime // Lifetime to delete confetti after a while

        this.vel = new Vector(0, 0)        
        this.angVel = new Vector(0, 0) // Rotational velocity

        this.displayElement() // Creating and displaying the confetti particle

    }   update() {
        if (this.vel.y <= Confetti.maxVel.y) this.vel.y += Confetti.acceleration.y

        // If velocity less than .01 make it 0, else apply Confetti.drag
        this.vel.magnitude() > .01 ? this.vel.x *= Confetti.drag.x : this.vel.x = 0
        // Update particle position
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y
        // Display particle position
        this.element.style.left = `${this.pos.x}`
        this.element.style.top = `${this.pos.y}`

        // Rotating the particle
        this.rotation.x += this.angVel.x
        this.rotation.y += this.angVel.y
        this.element.style.transform = `rotateX(${this.rotation.x % 360}deg) rotate(${this.rotation.y % 360}deg)` // % 360 keeps it between 0 and 360

        const now = performance.now(); // Get the current timestamp
        if (!this.startTime) this.startTime = now; // Initialize the start time if not already set
    
        const elapsedTime = now - this.startTime;
        if (elapsedTime > this.lifetime) this.element.remove(); // Delete particle after lifetime
        // Fade out when particle reaches 3 / 4 of its lifetime (if enabled in configs)
        if (Confetti.fadeOut) this.element.style.opacity = elapsedTime > this.lifetime * 3 / 4 // Has particle passed more than 4/5 of its lifetime?
            ? (1 - (elapsedTime - this.lifetime * 3 / 4) / (this.lifetime / 4)) // Start fading out
            : 1 // Don't change opacity

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
            this.element.innerHTML = Confetti.shapes[Math.floor(Math.random() * Confetti.shapes.length)] // Pick a random shape
            // Giving the confetti particle a random color
            if (this.element.firstChild.getAttribute('fill') === "none") this.element.firstChild.setAttribute('stroke', Confetti.colors[Math.floor(Math.random() * Confetti.colors.length)]) // Change the stroke only if fill="none", this is for path shapes (adding stroke to non-path shapes ruins them)
            this.element.firstChild.setAttribute('fill', Confetti.colors[Math.floor(Math.random() * Confetti.colors.length)])

            confettiContainer.appendChild(this.element) // Add the confetti particle to the container
    }
}   export {Confetti}; window.Confetti = Confetti

// Getting the mouse position and storing it to spawn the confetti at its location
let mouseX = 0, mouseY = 0
document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
})

const confettiContainer = document.createElement("div") // Creating a container for the confetti
const confettiParticles = [] // Creating an array for all the confetti
let batchId = 0 // Initializing batch ID
function spawnConfetti(amount, x, y, velX, velY, angVelX, angVelZ, lifetime) {
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
        const particle = new Confetti(lifetime)
        confettiParticles.push(particle)  // Add to array
    }

    // Check "mouse" pos keyword for x and y params
    if (x === "mouse") x = mouseX
    if (y === "mouse") y = mouseY
    // Check "center" pos keyword for x and y params
    if (x === "center") x = window.innerWidth / 2
    if (y === "center") y = window.innerHeight / 2
    // Check "max" pos keyword for x and y params
    if (x === "max") x = window.innerWidth
    if (y === "max") y = window.innerHeight


    confettiParticles.forEach((particle) => { // Moving the confetti particles to the mouse
        if (particle.batchId === batchId) {
            particle.pos.set(x === undefined || x === "default" ? mouseX : x, y === undefined || y === "default" ? mouseY : y) // Use mouse position if not defined by user or user defined "default"
            particle.vel.set(velX === undefined || velX === "default" ? (Math.random() * 7.5) * (Math.random() < 0.5 ? -1 : 1) : velX, velY === undefined || velY === "default" ? Math.random() * -8 : velY) // Use random velocity if not defined by user or user defined "default"         
            particle.angVel.set(angVelX === undefined || angVelX === "default" ? 0 : angVelX, angVelZ === undefined || angVelZ === "default" ? Math.random() * 12 + 6 : angVelZ) // Use random angular velocity if not defined by user or user defined "default"
        }

    })
}   export {spawnConfetti}; window.spawnConfetti = spawnConfetti // Exporting the function

// function spawnConfettiWithDelay(i) {
//     if (i < 500) {
//       spawnConfetti(2, 'max', 'center', 'default', 'default', 'default', 'default', 750);
//       spawnConfetti(2, 0, 'center', 'default', 'default', 'default', 'default', 750);
  
//       // Set the delay for the next iteration (100 ms)
//       setTimeout(() => spawnConfettiWithDelay(i + 1), 10);
//     }
//   }
  
//   spawnConfettiWithDelay(0);
  

// Animate one frame
function animate() {
    confettiParticles.forEach((particle) => {
        particle.update()
    }) // Update each particle position and rotation
    requestAnimationFrame(animate)
}   animate()