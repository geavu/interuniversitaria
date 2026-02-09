// Variables para el sketch
let canvas;
let particles = [];
const NUM_PARTICLES = 150; 

// --- Configuración de Color HSB para fondo #669933 ---
const BG_HUE = 90;
const BG_SAT = 170;
const BG_BRIGHT = 153;

// Configuración de las partículas
const PARTICLE_SATURATION = 255;
const PARTICLE_BRIGHTNESS = 255;

// Variables de interacción y física
const MOUSE_ATTRACTION = 0.1; 
const MOUSE_REPULSION_RADIUS = 30; 
const PARTICLE_COLLISION_RADIUS = 8; 
const PARTICLE_SPEED_LIMIT = 4; 

// --- Configuración Inicial ---
function setup() {
    // Crea el lienzo al tamaño de la ventana
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-canvas-container'); 
    
    // Usamos HSB para que las partículas tengan colores vibrantes que rotan
    colorMode(HSB, 360, 255, 255, 255); 
    
    // Inicializar el arreglo de partículas
    for (let i = 0; i < NUM_PARTICLES; i++) { 
        particles.push(new Particle(random(width), random(height), i));
    }
}

// --- Bucle de Dibujo ---
function draw() {
    // Fondo verde oliva con transparencia (50) para crear el efecto de estela/rastro
    background(BG_HUE, BG_SAT, BG_BRIGHT, 50); 
    
    // 1. Lógica de las Partículas
    for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];

        // Chequeo de colisión con otras partículas para que "reboten" o renazcan
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let d = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y); 
            
            if (d < PARTICLE_COLLISION_RADIUS) {
                p1.rebirth();
                p2.rebirth();
            }
        }
        
        // Actualizar posición y dibujar
        p1.update();
        p1.display();
    }
    
    // NOTA: Se eliminaron las Scanlines (líneas) y el Filtro Posterize (estallidos)
}

// --- Clase para la partícula ---
class Particle {
    constructor(x, y, index) {
        this.pos = createVector(x, y);
        // Velocidad inicial aleatoria
        this.vel = p5.Vector.random2D().mult(random(1, PARTICLE_SPEED_LIMIT));
        this.acc = createVector(0, 0);
        this.size = random(3, 7); 
        // Color base único para cada partícula
        this.baseHue = (index * (360 / NUM_PARTICLES) + random(360)) % 360; 
        this.hueOffset = random(0.5, 1); 
    }
    
    rebirth() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D().mult(random(1, PARTICLE_SPEED_LIMIT));
        this.acc.mult(0); 
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        // Interacción con el Ratón
        let mousePos = createVector(mouseX, mouseY);
        let direction = p5.Vector.sub(mousePos, this.pos);
        let distance = direction.mag();

        // Si el mouse está dentro del canvas, las partículas reaccionan
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            if (distance > MOUSE_REPULSION_RADIUS) {
                // Atracción hacia el puntero
                direction.setMag(MOUSE_ATTRACTION);
                this.applyForce(direction);
            } else if (distance > 0) {
                // Repulsión si están muy cerca del puntero
                direction.setMag(MOUSE_ATTRACTION * -1.5); 
                this.applyForce(direction);
            }
        }
        
        // Integración de Física básica
        this.vel.add(this.acc);
        this.vel.limit(PARTICLE_SPEED_LIMIT);
        this.pos.add(this.vel);
        this.acc.mult(0); 

        // Borde infinito (aparecen por el otro lado)
        this.pos.x = (this.pos.x + width) % width;
        this.pos.y = (this.pos.y + height) % height;
    }
    
    display() {
        // Ciclo de color suave basado en el tiempo
        let currentHue = (this.baseHue + frameCount * this.hueOffset * 0.1) % 360; 

        noStroke();
        fill(currentHue, PARTICLE_SATURATION, PARTICLE_BRIGHTNESS); 
        // Dibujamos cuadraditos para mantener la estética pixel/digital
        rect(this.pos.x, this.pos.y, this.size, this.size); 
    }
}

// Ajustar el canvas si se cambia el tamaño de la ventana del navegador
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}