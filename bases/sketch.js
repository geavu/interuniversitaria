// Variables para el sketch
let canvas;
let particles = [];
const NUM_PARTICLES = 150; // Ajustado a 100

// Colores de Alto Contraste y Configuración HSB
const BG_COLOR = 0;        
const ACCENT_COLOR = [0, 255, 0]; // Verde (RGB para scanlines)
const PARTICLE_SATURATION = 255;
const PARTICLE_BRIGHTNESS = 255;

// Variables de interacción y física
const MOUSE_ATTRACTION = 0.1; 
const MOUSE_REPULSION_RADIUS = 30; 
const PARTICLE_COLLISION_RADIUS = 8; // Ajustado a 8
const PARTICLE_SPEED_LIMIT = 4; // Ajustado a 4

// --- Configuración Inicial ---
function setup() {
    // Configura el canvas y el modo de color HSB
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-canvas-container'); 
    colorMode(HSB, 360, 255, 255, 255); // HSB para colores cíclicos
    
    // Inicializar partículas
    for (let i = 0; i < NUM_PARTICLES; i++) { 
        particles.push(new Particle(random(width), random(height), i));
    }
}

// --- Bucle de Dibujo ---
function draw() {
    // FIX CRÍTICO: Fondo Negro con transparencia (H=0, S=0, B=0, Alpha=50) para el efecto de rastro
    background(0, 0, 0, 50); 
    
    // 1. Check de Colisiones, Actualización y Dibujo de Partículas
    for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];

        // Chequeo de colisión con otras partículas
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            
            // ACCESO CORREGIDO: Accediendo a p2.pos.x/y directamente
            let d = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y); 
            
            if (d < PARTICLE_COLLISION_RADIUS) {
                // Colisión: Mueren y Renacen
                p1.rebirth();
                p2.rebirth();
            }
        }
        
        // Actualizar posición (incluyendo interacción con el ratón)
        p1.update();
        p1.display();
    }
    
    // 2. Efecto de Barrido (Scanlines)
    stroke(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2], 120); 
    for(let y = 0; y < height; y += 8) { 
        line(0, y, width, y);
    }
    
    // 3. Glitch Sutil (Filtro)
    if (random() < 0.005) { 
        filter(POSTERIZE, 2 + floor(random(3)));
    }
}

// --- Clase para la partícula ---
class Particle {
    constructor(x, y, index) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D().mult(random(1, PARTICLE_SPEED_LIMIT));
        this.acc = createVector(0, 0);
        this.size = random(3, 7); 
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
        // 1. Interacción con el Ratón (Órbita a 30px)
        let mousePos = createVector(mouseX, mouseY);
        let direction = p5.Vector.sub(mousePos, this.pos);
        let distance = direction.mag();

        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            if (distance > MOUSE_REPULSION_RADIUS) {
                // Atracción
                direction.setMag(MOUSE_ATTRACTION);
                this.applyForce(direction);
            } else if (distance > 0) {
                // Repulsión (para mantener la distancia constante)
                direction.setMag(MOUSE_ATTRACTION * -1.5); 
                this.applyForce(direction);
            }
        }
        
        // 2. Integración de Física
        this.vel.add(this.acc);
        this.vel.limit(PARTICLE_SPEED_LIMIT);
        this.pos.add(this.vel);
        this.acc.mult(0); 

        // 3. Borde (Wrap Around Edges)
        this.pos.x = (this.pos.x + width) % width;
        this.pos.y = (this.pos.y + height) % height;
    }
    
    display() {
        // Ciclo de color (Screensaver style)
        let currentHue = (this.baseHue + frameCount * this.hueOffset * 0.1) % 360; 

        noStroke();
        fill(currentHue, PARTICLE_SATURATION, PARTICLE_BRIGHTNESS); 
        
        rect(this.pos.x, this.pos.y, this.size, this.size); 
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


// --- Generador de Gráficas RRSS (Se mantiene estático) ---
function generateAndDownloadGraphic() {
    let g = createGraphics(1080, 1080);
    
    g.background(0); 
    g.textFont('Montserrat'); 
    
    g.fill(0, 255, 0); 
    g.textSize(90); 
    g.textAlign(CENTER, CENTER);
    g.text("ANALOG ROOT", g.width / 2, 350); 

    g.textSize(55); 
    g.text("Latencias y redes emergentes", g.width / 2, 450); 
    
    g.stroke(255, 0, 255); 
    g.strokeWeight(5);
    g.line(100, 600, 980, 600);
    g.line(100, 605, 980, 605);
    
    g.textFont('Inter'); 
    g.textSize(50);
    g.fill(255); 
    g.text("EJECUTAR FORMULARIO.EXE", g.width / 2, 750);
    
    g.textSize(40);
    g.fill(255, 0, 255); 
    g.text("ERROR: Postulación Expira 15/01/2026", g.width / 2, 850);
    
    g.save('ANALOG_ROOT_Contraste_Convocatoria.png');
}