// Capturando elementos comúnmente utilizados para minimizar consultas al DOM
const vistaPrevia = document.getElementById('live-preview');
const editorHTML = document.getElementById('html');
const editorCSS = document.getElementById('css');
const editorJS = document.getElementById('js');

// Función para configurar el iframe de vista previa en vivo e incluir scripts necesarios
function inicializarVistaPrevia() {
    vistaPrevia.contentWindow.document.body.innerHTML = '';
    const elementoEstilo = document.createElement('style');
    elementoEstilo.setAttribute('id', 'live-preview-style');
    vistaPrevia.contentWindow.document.head.appendChild(elementoEstilo);

    const scriptPaginacion = document.createElement('script');
    scriptPaginacion.src = 'https://unpkg.com/pagedjs/dist/paged.legacy.polyfill.js';
    vistaPrevia.contentWindow.document.head.appendChild(scriptPaginacion);
}

// Función para actualizar el iframe de vista previa con el código HTML del editor
function actualizarVistaHTML(editores) {
    vistaPrevia.contentWindow.document.body.innerHTML = editores.html.getValue();
}

// Función para actualizar el iframe de vista previa con el código CSS del editor
function actualizarVistaCSS(editores) {
    const elementoEstilo = vistaPrevia.contentWindow.document.getElementById('live-preview-style');
    elementoEstilo.innerHTML = editores.css.getValue();
}

// Función para actualizar el iframe de vista previa con el código JS del editor
function actualizarVistaJS(editores) {
    const elementoScript = document.createElement('script');
    elementoScript.innerHTML = editores.js.getValue();
    vistaPrevia.contentWindow.document.body.appendChild(elementoScript);
}

// Función para inicializar los editores CodeMirror para HTML, CSS y JavaScript
function inicializarEditores() {
    function obtenerOpcionesDefault(objeto) {
        const opcionesDefault = {
            lineNumbers: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            theme: 'panda-syntax'
        };
        if (objeto) {
            const claves = Object.keys(objeto);
            for (const clave of claves) {
                opcionesDefault[clave] = objeto[clave];
            }
        }
        return opcionesDefault;
    }

    const editores = {
        html: CodeMirror(editorHTML, obtenerOpcionesDefault({
            mode: 'text/html',
            value: '',
        })),
        css: CodeMirror(editorCSS, obtenerOpcionesDefault({
            mode: 'css',
            value: '',
            extraKeys: { 'Ctrl-Space': 'autocomplete' },
            hintOptions: {
                completeSingle: false,
                closeOnUnfocus: false
            }
        })),
        js: CodeMirror(editorJS, obtenerOpcionesDefault({
            mode: 'javascript',
            value: ''
        })),
    };
    return editores;
}

// Función para configurar el estudio de vista previa en vivo con editores CodeMirror y escuchadores de eventos
function configurarEstudioVistaPrevia() {
    const editores = inicializarEditores();

    // Escuchador de eventos para cambios en el editor HTML
    CodeMirror.on(editores.html, 'change', () => {
        actualizarVistaHTML(editores);
    });

    // Escuchador de eventos para cambios en el editor CSS
    CodeMirror.on(editores.css, 'change', () => {
        actualizarVistaCSS(editores);
    });

    // Escuchador de eventos para cambios en el editor JavaScript
    CodeMirror.on(editores.js, 'change', () => {
        actualizarVistaJS(editores);
    });
}

// Escuchador de eventos para configurar el estudio de vista previa cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    inicializarVistaPrevia();
    configurarEstudioVistaPrevia();
});