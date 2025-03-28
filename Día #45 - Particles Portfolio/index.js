particlesJS("background", {

    particles: {
        number: {
            value: 15, // Número de partículas (cantidad)
            density: {
                enable: true,
                value_area: 300, // Área donde se distribuirán las partículas
            },
        },

        color: {
            value: "#ffffff", // Color de las partículas
        },
        shape: {
            type: "triangle", // Tipo de forma
        },
        opacity: {
            value: 0.8, // Opacidad base de las partículas
            random: true,
            anum: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false,
            },
        },
        size: {
            value: 5, // Tamaño base de las partículas
            random: true,
            anim: {
                enable: true,
                speed: 4,
                size_min: 0.3,
                sync: false,
            },
        },

        // Líneas de conexión
        line_linked: {
            enable: true,
            distance: 150, // Distancia máxima entre partículas conectadas
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
        },

        // Movimiento de partículas
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "bounce", // Comportamiento cuando las partículas salen del canvas
            bounce: false,
        },
    },
    // Configuración de interactividad
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true, // Habilitar interactividad al pasar el mouse
                mode: "repulse",
            },
            onclick: {
                enable: true, // Habilitar para clic
                mode: "push", // Empujar partículas al hacer clic
            },
            resize: true, // Redimensionar animación de partículas al cambiar tamaño de ventana
        },
    },

    // Detectar pantallas retina
    retina_detect: true,

});