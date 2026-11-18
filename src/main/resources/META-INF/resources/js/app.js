
const URL_API = (window.MUSEO_API || (location.protocol === 'file:' || (location.port && location.port !== '8080') ? 'http://localhost:8080' : '')).replace(/\/$/, '');


async function consumirApi(ruta, metodo, datos) {
    let opciones = {
        method: metodo || 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };


    if (datos !== undefined && datos !== null) {
        opciones.headers['Content-Type'] = 'application/json';
        opciones.body = JSON.stringify(datos);
    }

    let respuesta = await fetch(URL_API + ruta, opciones).catch(function (error) {
        console.error('Error de conexión con ' + ruta + ':', error);
        return null;
    });

    if (!respuesta) {
        mostrarMensaje('No se pudo conectar con el servidor Quarkus. ¿Está encendido?', 'error');
        return null;
    }

    if (!respuesta.ok) {
        let textoError = await respuesta.text();
        let mensaje = textoError || ('Error ' + respuesta.status);
        mostrarMensaje(mensaje, 'error');
        console.error('Error en la petición a ' + ruta + ':', respuesta.status, mensaje);
        return null;
    }

  
    let textoRespuesta = await respuesta.text();

    if (!textoRespuesta || textoRespuesta.trim() === '') {
        return true;
    }

    return JSON.parse(textoRespuesta);
}

function mostrarMensaje(texto, tipo) {
    let contenedor = document.querySelector('.toasts');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.className = 'toasts';
        document.body.appendChild(contenedor);
    }

    let aviso = document.createElement('div');
    aviso.className = 'toast ' + (tipo === 'error' ? 'error' : 'ok');
    aviso.textContent = texto;
    contenedor.appendChild(aviso);

    setTimeout(function () {
        aviso.remove();
    }, 4000);
}

function abrirModal(titulo, htmlFormulario, funcionAlGuardar) {
    let dialogo = document.createElement('dialog');
    dialogo.innerHTML =
        '<form class="dlg-form">' +
            '<div class="dlg-head">' +
                '<h2>' + escaparTexto(titulo) + '</h2>' +
                '<button type="button" class="dlg-x" id="btn-cerrar-modal">&times;</button>' +
            '</div>' +
            '<div class="dlg-body">' +
                htmlFormulario +
                '<div id="error-modal" class="form-error" hidden></div>' +
            '</div>' +
            '<div class="dlg-foot">' +
                '<button type="button" class="btn ghost" id="btn-cancelar-modal">Cancelar</button>' +
                '<button type="submit" class="btn">Guardar</button>' +
            '</div>' +
        '</form>';

    document.body.appendChild(dialogo);
    dialogo.showModal();

    let formulario = dialogo.querySelector('form');
    let btnCerrar = dialogo.querySelector('#btn-cerrar-modal');
    let btnCancelar = dialogo.querySelector('#btn-cancelar-modal');
    let cajaError = dialogo.querySelector('#error-modal');

    function cerrar() {
        dialogo.close();
        dialogo.remove();
    }

    btnCerrar.addEventListener('click', cerrar);
    btnCancelar.addEventListener('click', cerrar);

    formulario.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        cajaError.hidden = true;

        let botonGuardar = formulario.querySelector('button[type="submit"]');
        if (botonGuardar) botonGuardar.disabled = true;

        let exito = await funcionAlGuardar(formulario);
        if (exito) {
            cerrar();
        } else {
            if (botonGuardar) botonGuardar.disabled = false;
            cajaError.textContent = 'Hubo un error al guardar. Revisa que el nombre no esté repetido o que la base de datos esté encendida.';
            cajaError.hidden = false;
        }
    });
}

function confirmarAccion(mensaje, funcionSiConfirma) {
    let respuesta = window.confirm(mensaje);
    if (respuesta) {
        funcionSiConfirma();
    }
}

function escaparTexto(texto) {
    if (texto === null || texto === undefined) return '';
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatearFecha(cadenaFecha, conHora) {
    if (!cadenaFecha) return '—';
    let fecha = new Date(cadenaFecha);
    if (isNaN(fecha.getTime())) return cadenaFecha;

    let opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    if (conHora) {
        opciones.hour = '2-digit';
        opciones.minute = '2-digit';
    }
    return fecha.toLocaleDateString('es-CO', opciones);
}

function convertirFechaAInput(cadenaFecha) {
    if (!cadenaFecha) return '';
    return String(cadenaFecha).slice(0, 16);
}

const ICONOS = {
    museo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9 12 4l9 5"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 20h18M4 18h16"/></svg>',
    sala: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V10a7 7 0 0 1 14 0v11"/><path d="M3 21h18M9 21v-7a3 3 0 0 1 6 0v7"/></svg>',
    obra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="1"/><rect x="6" y="7" width="12" height="10"/><path d="m7 15 3.5-4 3 3 2-2 2 3"/></svg>',
    categoria: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/></svg>',
    artista: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c5 0 9 3.6 9 8 0 3-2 4-4 4h-2c-1.5 0-2 1-1.4 2.2.6 1.2.2 2.8-1.6 2.8-5 0-9-3.6-9-8s4-9 9-9z"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="10" r="1"/></svg>',
    visita: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/></svg>'
};

function crearImagenTarjeta(urlImagen, altTexto, iconoDefecto) {
    let tieneUrl = urlImagen && urlImagen.trim() !== '';
    let html = '<div class="card-media">';
    html += '<div class="ph">' + (iconoDefecto || ICONOS.obra) + '</div>';
    if (tieneUrl) {
        html += '<img src="' + escaparTexto(urlImagen) + '" alt="' + escaparTexto(altTexto) + '" onerror="this.remove()">';
    }
    html += '</div>';
    return html;
}

function crearBarraConservacion(porcentaje) {
    if (porcentaje === null || porcentaje === undefined) return '—';
    let claseColor = porcentaje >= 70 ? '' : (porcentaje >= 40 ? 'mid' : 'low');
    return '<span style="flex:1"><b style="color:var(--wine-800)">' + porcentaje + '%</b>' +
           '<span class="bar"><i class="' + claseColor + '" style="--v:' + porcentaje + '%"></i></span></span>';
}

function cargarCabeceraYPie() {
    let paginaActual = document.body.dataset.page || 'inicio';

    let header = document.getElementById('site-header');
    if (header) {
        header.innerHTML =
            '<header class="site-header">' +
                '<div class="container header-bar">' +
                    '<a class="brand" href="index.html">' +
                        '<svg viewBox="0 0 48 48" fill="none" stroke="#c8a251" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M24 3 45 24 24 45 3 24Z"/><path d="M24 11 37 24 24 37 11 24Z"/><path d="M24 17v14M17 24h14"/><circle cx="24" cy="24" r="2.2" fill="#c8a251"/></svg>' +
                        '<span>Museo Virtual<small>Patrimonio y memoria</small></span>' +
                    '</a>' +
                    '<button class="nav-toggle" id="btn-menu" aria-label="Abrir menú">&#9776;</button>' +
                    '<nav class="nav" id="menu-navegacion">' +
                        '<ul>' +
                            '<li><a href="index.html"' + (paginaActual === 'inicio' ? ' aria-current="page"' : '') + '>Inicio</a></li>' +
                            '<li><a href="museos.html"' + (paginaActual === 'museos' ? ' aria-current="page"' : '') + '>Museos</a></li>' +
                            '<li><a href="salas.html"' + (paginaActual === 'salas' ? ' aria-current="page"' : '') + '>Salas</a></li>' +
                            '<li><a href="obras.html"' + (paginaActual === 'obras' ? ' aria-current="page"' : '') + '>Obras</a></li>' +
                            '<li><a href="categorias.html"' + (paginaActual === 'categorias' ? ' aria-current="page"' : '') + '>Categorías</a></li>' +
                            '<li><a href="artistas.html"' + (paginaActual === 'artistas' ? ' aria-current="page"' : '') + '>Artistas</a></li>' +
                            '<li><a href="visitas.html"' + (paginaActual === 'visitas' ? ' aria-current="page"' : '') + '>Visitas</a></li>' +
                            '<li><a href="recorridos.html"' + (paginaActual === 'recorridos' ? ' aria-current="page"' : '') + '>Recorridos</a></li>' +
                        '</ul>' +
                    '</nav>' +
                '</div>' +
            '</header>';

        let btnMenu = document.getElementById('btn-menu');
        let nav = document.getElementById('menu-navegacion');
        if (btnMenu && nav) {
            btnMenu.addEventListener('click', function () {
                nav.classList.toggle('open');
            });
        }
    }

    let footer = document.getElementById('site-footer');
    if (footer) {
        footer.innerHTML =
            '<footer class="site-footer">' +
                '<div class="container">' +
                    '<p class="brandline">Museo Virtual</p>' +
                    '<p>Sistema de Gestión de Museos · Universidad Santo Tomás, Tunja · POO 2026-2</p>' +
                '</div>' +
            '</footer>';
    }
}

function iniciarModuloCRUD(configuracion) {
    let grid = document.getElementById('grid');
    let inputBuscar = document.getElementById('q');
    let btnNuevo = document.getElementById('btn-new');
    let estado = document.getElementById('state');
    let contenedorChips = document.getElementById('chips');

    let listaElementos = [];
    let filtroChipActual = 'all';

    async function cargarRegistros() {
        if (grid) {
            grid.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
        }
        if (estado) estado.hidden = true;

        if (configuracion.cargarRelaciones) {
            await configuracion.cargarRelaciones();
        }

        let datos = await consumirApi(configuracion.endpoint);
        if (!datos) {
            if (grid) grid.innerHTML = '';
            if (estado) {
                estado.hidden = false;
                estado.className = 'state error';
                estado.innerHTML = 'No se pudo conectar con la base de datos.<br>Asegúrate de que Quarkus esté encendido.';
            }
            return;
        }

        listaElementos = Array.isArray(datos) ? datos : [];
        dibujarRegistros();
    }

    // Dibujar las tarjetas en la pantalla
    function dibujarRegistros() {
        if (!grid) return;

        let terminoBusqueda = inputBuscar ? inputBuscar.value.trim().toLowerCase() : '';
        let elementosFiltrados = listaElementos;

        // Filtro por parámetro URL si aplica (ej: obras por sala o categoría)
        if (configuracion.filtroUrl) {
            elementosFiltrados = elementosFiltrados.filter(configuracion.filtroUrl);
        }


        if (configuracion.obtenerChip) {
            let opcionesChips = [];
            for (let i = 0; i < elementosFiltrados.length; i++) {
                let valor = configuracion.obtenerChip(elementosFiltrados[i]);
                if (valor && !opcionesChips.includes(valor)) {
                    opcionesChips.push(valor);
                }
            }
            opcionesChips.sort();

            if (contenedorChips) {
                if (opcionesChips.length > 0) {
                    let htmlChips = '<button class="chip" data-chip="all"' + (filtroChipActual === 'all' ? ' aria-pressed="true"' : '') + '>Todos</button>';
                    for (let i = 0; i < opcionesChips.length; i++) {
                        let activo = filtroChipActual === opcionesChips[i];
                        htmlChips += '<button class="chip" data-chip="' + escaparTexto(opcionesChips[i]) + '"' + (activo ? ' aria-pressed="true"' : '') + '>' + escaparTexto(opcionesChips[i]) + '</button>';
                    }
                    contenedorChips.innerHTML = htmlChips;
                } else {
                    contenedorChips.innerHTML = '';
                }
            }

            if (filtroChipActual !== 'all') {
                elementosFiltrados = elementosFiltrados.filter(function (elem) {
                    return configuracion.obtenerChip(elem) === filtroChipActual;
                });
            }
        }

        if (terminoBusqueda !== '') {
            elementosFiltrados = elementosFiltrados.filter(function (elem) {
                return JSON.stringify(elem).toLowerCase().includes(terminoBusqueda);
            });
        }

        if (listaElementos.length === 0) {
            grid.innerHTML = '';
            if (estado) {
                estado.hidden = false;
                estado.className = 'state';
                estado.innerHTML = 'Aún no hay ' + configuracion.plural + ' registrados.<br><button class="btn" id="btn-crear-primero">Crear ' + configuracion.singular + '</button>';
                let btnCrear = document.getElementById('btn-crear-primero');
                if (btnCrear) {
                    btnCrear.addEventListener('click', function () {
                        abrirFormulario(null);
                    });
                }
            }
            return;
        }

        if (elementosFiltrados.length === 0) {
            grid.innerHTML = '';
            if (estado) {
                estado.hidden = false;
                estado.className = 'state';
                estado.textContent = 'Sin resultados para tu búsqueda.';
            }
            return;
        }

        if (estado) estado.hidden = true;

        let htmlCards = '';
        for (let i = 0; i < elementosFiltrados.length; i++) {
            let item = elementosFiltrados[i];
            let accionesExtra = configuracion.accionesExtra ? configuracion.accionesExtra(item) : '';
            htmlCards +=
                '<article class="card" data-id="' + item.id + '">' +
                    configuracion.crearTarjeta(item) +
                    '<div class="card-actions">' +
                        accionesExtra +
                        '<span class="spacer"></span>' +
                        '<button class="btn ghost small" data-accion="editar">Editar</button>' +
                        '<button class="btn danger small" data-accion="eliminar">Eliminar</button>' +
                    '</div>' +
                '</article>';
        }
        grid.innerHTML = htmlCards;
    }

    function abrirFormulario(item) {
        let esEdicion = item !== null && item !== undefined;
        let tituloModal = (esEdicion ? 'Editar ' : 'Nuevo ') + configuracion.singular;
        let camposHtml = configuracion.crearCamposFormulario(item);

        abrirModal(tituloModal, camposHtml, async function (formulario) {
            let datosAEnviar = configuracion.leerCamposFormulario(formulario);

            let respuesta;
            if (esEdicion) {
          
                respuesta = await consumirApi(configuracion.endpoint + '/' + item.id, 'PUT', datosAEnviar);
            } else {
                
                respuesta = await consumirApi(configuracion.endpoint, 'POST', datosAEnviar);
            }

            if (respuesta) {
                mostrarMensaje(esEdicion ? 'Cambios guardados con éxito' : 'Registro creado con éxito');
                await cargarRegistros();
                return true;
            } else {
                return false;
            }
        });
    }

    
    function eliminarRegistro(item) {
        let nombre = item.name || configuracion.singular;
        confirmarAccion('¿Seguro que deseas eliminar «' + nombre + '»?', async function () {
            let respuesta = await consumirApi(configuracion.endpoint + '/' + item.id, 'DELETE');
            if (respuesta) {
                mostrarMensaje('Registro eliminado con éxito');
                await cargarRegistros();
            } else {
                mostrarMensaje('No se pudo eliminar. Verifique que no tenga dependencias asociadas.', 'error');
            }
        });
    }


    if (grid) {
        grid.addEventListener('click', function (evento) {
            let boton = evento.target.closest('button[data-accion]');
            if (!boton) return;

            let tarjeta = boton.closest('.card');
            let id = tarjeta ? tarjeta.dataset.id : null;
            let itemSeleccionado = listaElementos.find(function (elem) {
                return String(elem.id) === String(id);
            });

            if (!itemSeleccionado) return;

            if (boton.dataset.accion === 'editar') {
                abrirFormulario(itemSeleccionado);
            } else if (boton.dataset.accion === 'eliminar') {
                eliminarRegistro(itemSeleccionado);
            }
        });
    }

    if (contenedorChips) {
        contenedorChips.addEventListener('click', function (evento) {
            let botonChip = evento.target.closest('button[data-chip]');
            if (botonChip) {
                filtroChipActual = botonChip.dataset.chip;
                dibujarRegistros();
            }
        });
    }

    if (inputBuscar) {
        inputBuscar.addEventListener('input', function () {
            dibujarRegistros();
        });
    }

    if (btnNuevo) {
        btnNuevo.addEventListener('click', function () {
            abrirFormulario(null);
        });
    }

    // Cargar los registros al iniciar la página
    cargarRegistros();
}

// Iniciar cabecera y pie al cargar el documento
document.addEventListener('DOMContentLoaded', cargarCabeceraYPie);

