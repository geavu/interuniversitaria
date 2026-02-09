// Variables para el sketch
let canvas;
let particles = [];
const NUM_PARTICLES = 100; // Un poco menos para que el llenado sea gradual y estético

// --- Configuración de Color ---
const BG_HUE = 90;
const BG_SAT = 170;
const BG_BRIGHT = 153;

const PARTICLE_SATURATION = 255;
const PARTICLE_BRIGHTNESS = 255;

// Variables de física (suavizadas para que el trazo sea fluido)
const MOUSE_ATTRACTION = 0.05; 
const MOUSE_REPULSION_RADIUS = 40; 
const PARTICLE_SPEED_LIMIT = 3; 

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-canvas-container'); 
    colorMode(HSB, 360, 255, 255, 255); 
    
    // DIBUJAMOS EL FONDO SOLO UNA VEZ AQUÍ
    // Esto permite que todo lo que se dibuje después se quede "pegado"
    background(BG_HUE, BG_SAT, BG_BRIGHT); 
    
    for (let i = 0; i < NUM_PARTICLES; i++) { 
        particles.push(new Particle(random(width), random(height), i));
    }
}

function draw() {
    // IMPORTANTE: No hay background() aquí.
    
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        
        // Eliminamos el chequeo de colisiones y el rebirth() 
        // para que las partículas nunca desaparezcan ni salten.
        
        p.update();
        p.display();
    }
}

class Particle {
    constructor(x, y, index) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D().mult(random(1, PARTICLE_SPEED_LIMIT));
        this.acc = createVector(0, 0);
        this.size = random(2, 5); // Un poco más pequeñas para trazos más finos
        this.baseHue = (index * (360 / NUM_PARTICLES) + random(360)) % 360; 
        this.hueOffset = random(0.2, 0.5); 
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        let mousePos = createVector(mouseX, mouseY);
        let direction = p5.Vector.sub(mousePos, this.pos);
        let distance = direction.mag();

        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            if (distance > MOUSE_REPULSION_RADIUS) {
                direction.setMag(MOUSE_ATTRACTION);
                this.applyForce(direction);
            } else {
                direction.setMag(MOUSE_ATTRACTION * -2); 
                this.applyForce(direction);
            }
        }
        
        this.vel.add(this.acc);
        this.vel.limit(PARTICLE_SPEED_LIMIT);
        this.pos.add(this.vel);
        this.acc.mult(0); 

        // Rebote sutil en los bordes en lugar de aparecer al otro lado
        // Esto crea una composición más contenida
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    }
    
    display() {
        let currentHue = (this.baseHue + frameCount * this.hueOffset) % 360; 

        noStroke();
        // Usamos una opacidad baja (alpha) para que el color se construya por capas
        fill(currentHue, PARTICLE_SATURATION, PARTICLE_BRIGHTNESS, 150); 
        
        // Dibujamos el rastro
        rect(this.pos.x, this.pos.y, this.size, this.size); 
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(BG_HUE, BG_SAT, BG_BRIGHT); // Se limpia si cambian el tamaño de la ventana
}