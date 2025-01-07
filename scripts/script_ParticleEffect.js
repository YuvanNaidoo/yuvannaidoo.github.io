document.addEventListener("DOMContentLoaded", () => {
    const particleBlock = document.getElementById("particleBlock");
    const particleCanvas = document.getElementById("particleCanvas");

    // Set up the canvas context
    const ctx = particleCanvas.getContext("2d");

    // Particle configuration
    let particles = []; // Array to store particle data
    const particleSize = 5; // Radius of each particle
    const particleDensity = 10000; // 1 particle per 100px x 100px
    const minSpeed = 0.1; // Minimum speed for particles
    const maxSpeed = 1; // Maximum speed for particles
    const baseConnectionRadius = 200; // Default connection radius

    let mouse = { x: null, y: null, connectionRadius: baseConnectionRadius };

    // Track mouse movement
    document.addEventListener("mousemove", (e) => {
        const rect = particleCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    document.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Function to calculate the number of particles and generate them
    const calculateParticles = () => {
        const particleCount = Math.floor(
            (particleCanvas.width * particleCanvas.height) / particleDensity
        );

        const connectionRadius = Math.sqrt(particleDensity) * 2;

        particles = [];
        for (let i = 0; i < particleCount; i++) {
            const speedX = Math.random() * (maxSpeed - minSpeed) + minSpeed;
            const speedY = Math.random() * (maxSpeed - minSpeed) + minSpeed;

            particles.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                radius: particleSize,
                speedX: Math.random() > 0.5 ? speedX : -speedX,
                speedY: Math.random() > 0.5 ? speedY : -speedY,
                connectionRadius,
            });
        }
    };

    // Adjust canvas size to match the container
    const resizeCanvas = () => {
        particleCanvas.width = particleBlock.offsetWidth;
        particleCanvas.height = particleBlock.offsetHeight;
        calculateParticles();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Function to update particle positions
    const updateParticles = () => {
        particles.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x - particle.radius < 0 || particle.x + particle.radius > particleCanvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y - particle.radius < 0 || particle.y + particle.radius > particleCanvas.height) {
                particle.speedY *= -1;
            }
        });
    };

    // Function to draw particles and lines
    const drawParticlesAndLines = () => {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        particles.forEach((particle) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        });

        // Draw the mouse particle
        if (mouse.x !== null && mouse.y !== null) {
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, particleSize, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        }

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < particles[i].connectionRadius) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / particles[i].connectionRadius})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.connectionRadius) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / mouse.connectionRadius})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    };

    // Animation loop
    const animate = () => {
        updateParticles();
        drawParticlesAndLines();
        requestAnimationFrame(animate);
    };

    // Initialize
    animate();
});
