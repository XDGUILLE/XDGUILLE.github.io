// URL base de la API
const API_URL = 'http://localhost:3000/api';

// Elementos del DOM
const seriesGrid = document.getElementById('series-grid');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close');

// Cargar series al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarSeries();
});

// Función para cargar todas las series
async function cargarSeries() {
    try {
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        
        const response = await fetch(`${API_URL}/series`);
        
        if (!response.ok) {
            throw new Error('Error al cargar las series');
        }
        
        const series = await response.json();
        mostrarSeries(series);
        
        loading.style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        errorDiv.textContent = 'Error al cargar las series. Verifica que el servidor esté corriendo.';
        errorDiv.style.display = 'block';
    }
}

// Función para mostrar las series
function mostrarSeries(series) {
    seriesGrid.innerHTML = '';
    
    if (series.length === 0) {
        seriesGrid.innerHTML = '<p style="text-align: center; color: #999;">No hay series disponibles.</p>';
        return;
    }
    
    series.forEach(serie => {
        const card = crearTarjetaSerie(serie);
        seriesGrid.appendChild(card);
    });
}

// Función para crear tarjeta
function crearTarjetaSerie(serie) {
    const card = document.createElement('div');
    card.className = 'serie-card';
    card.onclick = () => mostrarDetalles(serie.serie_id);
    
    card.innerHTML = `
        <div class="serie-card-body">
            <h2>${serie.titulo}</h2>
            <div class="serie-info">
                Año: ${serie.año_lanzamiento || 'N/A'}
            </div>
            ${serie.genero ? `<span class="serie-genero">${serie.genero}</span>` : ''}
            <p class="serie-descripcion">
                ${serie.descripcion || 'Sin descripción disponible'}
            </p>
        </div>
    `;
    
    return card;
}

// Función para mostrar detalles
async function mostrarDetalles(serieId) {
    try {
        const [serieResponse, actoresResponse] = await Promise.all([
            fetch(`${API_URL}/series/${serieId}`), //http://localhost:3000/api/series/2
            fetch(`${API_URL}/series/${serieId}/actores`) //http://localhost:3000/api/series/2/actores
        ]);
        
        if (!serieResponse.ok || !actoresResponse.ok) {
            throw new Error('Error al cargar los detalles');
        }
        
        const serieData = await serieResponse.json();
        const actores = await actoresResponse.json();
        
        if (serieData.length === 0) {
            modalBody.innerHTML = '<p>No se encontró información.</p>';
        } else {
            const serie = serieData[0];
            const episodios = serieData.filter(item => item.episodio_id !== null);
            
            modalBody.innerHTML = generarContenidoModal(serie, episodios, actores);
        }
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        modalBody.innerHTML = '<p style="color: #e50914;">Error al cargar detalles.</p>';
        modal.style.display = 'block';
    }
}

// Generar contenido del modal
function generarContenidoModal(serie, episodios, actores) {
    let html = `
        <div class="modal-header">
            <h2>${serie.titulo}</h2>
        </div>
        <div class="modal-info">
            <strong>Año:</strong> ${serie.año_lanzamiento || 'N/A'} | 
            <strong>Género:</strong> ${serie.genero || 'N/A'}
        </div>
        <div class="modal-descripcion">
            ${serie.descripcion || 'Sin descripción'}
        </div>
    `;
    
    // Actores
    if (actores.length > 0) {
        html += `<div class="actores-section"><h3>Reparto</h3>`;
        actores.forEach(actor => {
            html += `
                <div class="actor-item">
                    <span class="actor-nombre">${actor.nombre}</span>
                    <span class="actor-personaje">${actor.personaje || 'Personaje desconocido'}</span>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    // Episodios
    if (episodios.length > 0) {
        html += `<div class="episodios-section"><h3>Episodios (${episodios.length})</h3>`;
        episodios.forEach(ep => {
            html += `
                <div class="episodio-item">
                    <div class="episodio-titulo">
                        ${ep.temporada ? `T${ep.temporada} - ` : ''}${ep.episodio_titulo}
                    </div>
                    <div class="episodio-info">
                        ${ep.duracion ? `Duración: ${ep.duracion} min` : ''} 
                        ${ep.rating_imdb ? `| Rating: ⭐ ${ep.rating_imdb}` : ''}
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    return html;
}

// Cerrar modal
closeBtn.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};