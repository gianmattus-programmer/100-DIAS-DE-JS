function parseAndDisplayJson() {
    const jsonInput = document.getElementById('jsonInput').value;
    try {
        const jsonObj = JSON.parse(jsonInput);
        document.getElementById('jsonViewer').innerHTML = '';
        buildTree(jsonObj, document.getElementById('jsonViewer'), 'raíz');
    } catch (e) {
        document.getElementById('jsonViewer').innerHTML = '<p style="color: red;">JSON Inválido</p>';
    }
}

function buildTree(obj, parentElement, key) {
    const item = document.createElement('div');
    parentElement.appendChild(item);

    if (typeof obj === 'object' && obj !== null) {
        const keySpan = document.createElement('span');
        keySpan.className = 'clave desplegable';
        keySpan.textContent = key + ': ';
        item.appendChild(keySpan);

        const childContainer = document.createElement('div');
        childContainer.className = 'oculto ' + (Array.isArray(obj) ? 'arreglo' : 'objeto');
        item.appendChild(childContainer);

        for (const childKey in obj) {
            buildTree(obj[childKey], childContainer, childKey);
        }

        keySpan.onclick = function (event) {
            event.stopPropagation();
            const childDiv = this.parentElement.querySelector('.oculto');
            if (childDiv.style.display === 'block') {
                childDiv.style.display = 'none';
                this.classList.remove('colapsado');
            } else {
                childDiv.style.display = 'block';
                this.classList.add('colapsado');
            }
        };
    } else {
        item.innerHTML = '<span class="clave">' + key + ': </span>' + '<span class="' + getTipo(obj) + '">' + obj + '</span>';
    }
}

function getTipo(value) {
    if (typeof value === 'string') return 'texto';
    if (typeof value === 'number') return 'numero';
    if (Array.isArray(value)) return 'arreglo';
    if (typeof value === 'object' && value !== null) return 'objeto';
    return 'desconocido';
}

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    let reader = new FileReader();
    reader.onload = function (event) {
        const fileContent = event.target.result;
        document.getElementById('jsonInput').value = fileContent;
        parseAndDisplayJson();
    };
    reader.readAsText(file);
});