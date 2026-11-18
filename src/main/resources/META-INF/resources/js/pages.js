
async function iniciarInicio() {
    let modulos = ['museos', 'salas', 'obras', 'categorias', 'artistas', 'visitas'];

    for (let i = 0; i < modulos.length; i++) {
        let nombreModulo = modulos[i];
        let datos = await consumirApi('/' + nombreModulo);
        let contador = document.querySelector('[data-count="' + nombreModulo + '"]');

        if (contador && datos) {
            let cantidad = datos.length;
            contador.textContent = cantidad + (cantidad === 1 ? ' registro' : ' registros');
        }

    
        if (nombreModulo === 'obras' && datos) {
            let contenedorObras = document.getElementById('featured');
            let gridObras = document.getElementById('featured-grid');

            if (contenedorObras && gridObras) {
                let destacadas = [];
                for (let j = 0; j < datos.length; j++) {
                    if (datos[j].imageUrl && datos[j].imageUrl.trim() !== '') {
                        destacadas.push(datos[j]);
                        if (destacadas.length >= 3) break;
                    }
                }

                if (destacadas.length > 0) {
                    contenedorObras.hidden = false;
                    let html = '';
                    for (let k = 0; k < destacadas.length; k++) {
                        let obra = destacadas[k];
                        let categoriaNombre = obra.category ? obra.category.name : 'Obra';
                        html +=
                            '<article class="card">' +
                                crearImagenTarjeta(obra.imageUrl, obra.name, ICONOS.obra) +
                                '<div class="card-body">' +
                                    '<p class="card-kicker">' + escaparTexto(categoriaNombre) + '</p>' +
                                    '<h3>' + escaparTexto(obra.name) + '</h3>' +
                                    '<p class="desc">' + escaparTexto(obra.description || '') + '</p>' +
                                '</div>' +
                                '<div class="card-actions">' +
                                    '<a class="btn small" href="obras.html">Ver todas las obras</a>' +
                                '</div>' +
                            '</article>';
                    }
                    gridObras.innerHTML = html;
                }
            }
        }
    }
}

function iniciarCategorias() {
    iniciarModuloCRUD({
        endpoint: '/categorias',
        singular: 'categoría',
        plural: 'categorías',

        // Dibujar tarjeta de categoría
        crearTarjeta: function (categoria) {
            return (
                crearImagenTarjeta(null, categoria.name, ICONOS.categoria) +
                '<div class="card-body">' +
                    '<p class="card-kicker">Categoría</p>' +
                    '<h3>' + escaparTexto(categoria.name) + '</h3>' +
                    '<p class="desc">' + escaparTexto(categoria.description || 'Sin descripción.') + '</p>' +
                '</div>'
            );
        },


        accionesExtra: function (categoria) {
            return '<a class="btn small" href="obras.html?categoria=' + categoria.id + '">Ver obras</a>';
        },

        crearCamposFormulario: function (categoria) {
            let nombre = categoria ? categoria.name : '';
            let descripcion = categoria ? (categoria.description || '') : '';
            return (
                '<div class="form-grid">' +
                    '<label class="field full">' +
                        '<span>Nombre de la categoría <em>*</em></span>' +
                        '<input name="name" type="text" required maxlength="100" value="' + escaparTexto(nombre) + '">' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Descripción</span>' +
                        '<textarea name="description" maxlength="200">' + escaparTexto(descripcion) + '</textarea>' +
                    '</label>' +
                '</div>'
            );
        },


        leerCamposFormulario: function (formulario) {
            return {
                name: formulario.elements['name'].value.trim(),
                description: formulario.elements['description'].value.trim()
            };
        }
    });
}


function iniciarMuseos() {
    iniciarModuloCRUD({
        endpoint: '/museos',
        singular: 'museo',
        plural: 'museos',

        crearTarjeta: function (museo) {
            let coordenadas = museo.latitude && museo.longitude ? (museo.latitude + ', ' + museo.longitude) : '';
            let enlaceWeb = museo.url ? '<a class="link-inline" href="' + escaparTexto(museo.url) + '" target="_blank">Abrir sitio</a>' : '';

            let metaHtml = '<ul class="meta">';
            if (coordenadas) metaHtml += '<li><b>Coordenadas</b><span>' + escaparTexto(coordenadas) + '</span></li>';
            if (enlaceWeb) metaHtml += '<li><b>Sitio web</b><span>' + enlaceWeb + '</span></li>';
            metaHtml += '</ul>';

            return (
                crearImagenTarjeta(null, museo.name, ICONOS.museo) +
                '<div class="card-body">' +
                    '<p class="card-kicker">Museo</p>' +
                    '<h3>' + escaparTexto(museo.name) + '</h3>' +
                    '<p class="desc">' + escaparTexto(museo.description || 'Sin descripción.') + '</p>' +
                    metaHtml +
                '</div>'
            );
        },

        crearCamposFormulario: function (museo) {
            let name = museo ? museo.name : '';
            let description = museo ? (museo.description || '') : '';
            let latitude = museo ? (museo.latitude || '') : '';
            let longitude = museo ? (museo.longitude || '') : '';
            let url = museo ? (museo.url || '') : '';

            return (
                '<div class="form-grid">' +
                    '<label class="field full">' +
                        '<span>Nombre del museo <em>*</em></span>' +
                        '<input name="name" type="text" required maxlength="100" value="' + escaparTexto(name) + '">' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Descripción</span>' +
                        '<textarea name="description" maxlength="200">' + escaparTexto(description) + '</textarea>' +
                    '</label>' +
                    '<label class="field">' +
                        '<span>Latitud</span>' +
                        '<input name="latitude" type="text" maxlength="50" value="' + escaparTexto(latitude) + '">' +
                    '</label>' +
                    '<label class="field">' +
                        '<span>Longitud</span>' +
                        '<input name="longitude" type="text" maxlength="50" value="' + escaparTexto(longitude) + '">' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Sitio web (URL)</span>' +
                        '<input name="url" type="url" value="' + escaparTexto(url) + '">' +
                    '</label>' +
                '</div>'
            );
        },

        leerCamposFormulario: function (formulario) {
            return {
                name: formulario.elements['name'].value.trim(),
                description: formulario.elements['description'].value.trim(),
                latitude: formulario.elements['latitude'].value.trim(),
                longitude: formulario.elements['longitude'].value.trim(),
                url: formulario.elements['url'].value.trim()
            };
        }
    });
}


function iniciarSalas() {
    let listaMuseos = [];

    iniciarModuloCRUD({
        endpoint: '/salas',
        singular: 'sala',
        plural: 'salas',

        cargarRelaciones: async function () {
            let datos = await consumirApi('/museos');
            listaMuseos = Array.isArray(datos) ? datos : [];
        },

        obtenerChip: function (sala) {
            return sala.museum ? sala.museum.name : null;
        },

        crearTarjeta: function (sala) {
            let nombreMuseo = sala.museum ? sala.museum.name : 'Sala';
            let capacidadTexto = sala.capacity != null ? (sala.capacity + ' personas') : '';

            let metaHtml = '';
            if (capacidadTexto) {
                metaHtml = '<ul class="meta"><li><b>Capacidad</b><span>' + escaparTexto(capacidadTexto) + '</span></li></ul>';
            }

            return (
                crearImagenTarjeta(null, sala.name, ICONOS.sala) +
                '<div class="card-body">' +
                    '<p class="card-kicker">' + escaparTexto(nombreMuseo) + '</p>' +
                    '<h3>' + escaparTexto(sala.name) + '</h3>' +
                    '<p class="desc">' + escaparTexto(sala.description || 'Sin descripción.') + '</p>' +
                    metaHtml +
                '</div>'
            );
        },

        accionesExtra: function (sala) {
            return '<a class="btn small" href="obras.html?sala=' + sala.id + '">Ver obras</a>';
        },

        crearCamposFormulario: function (sala) {
            let idMuseoActual = sala && sala.museum ? sala.museum.id : '';
            let opcionesMuseos = '<option value="" disabled' + (!idMuseoActual ? ' selected' : '') + '>Selecciona un museo…</option>';
            for (let i = 0; i < listaMuseos.length; i++) {
                let m = listaMuseos[i];
                let seleccionado = String(m.id) === String(idMuseoActual) ? ' selected' : '';
                opcionesMuseos += '<option value="' + m.id + '"' + seleccionado + '>' + escaparTexto(m.name) + '</option>';
            }

            let name = sala ? sala.name : '';
            let description = sala ? (sala.description || '') : '';
            let capacity = sala && sala.capacity != null ? sala.capacity : '';

            return (
                '<div class="form-grid">' +
                    '<label class="field full">' +
                        '<span>Museo al que pertenece <em>*</em></span>' +
                        '<select name="museumId" required>' + opcionesMuseos + '</select>' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Nombre de la sala <em>*</em></span>' +
                        '<input name="name" type="text" required maxlength="100" value="' + escaparTexto(name) + '">' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Descripción</span>' +
                        '<textarea name="description" maxlength="200">' + escaparTexto(description) + '</textarea>' +
                    '</label>' +
                    '<label class="field">' +
                        '<span>Capacidad (personas)</span>' +
                        '<input name="capacity" type="number" min="0" value="' + capacity + '">' +
                    '</label>' +
                '</div>'
            );
        },

        leerCamposFormulario: function (formulario) {
            let museumId = formulario.elements['museumId'].value;
            let capacityVal = formulario.elements['capacity'].value;

            return {
                name: formulario.elements['name'].value.trim(),
                description: formulario.elements['description'].value.trim(),
                capacity: capacityVal !== '' ? Number(capacityVal) : null,
                museum: museumId ? { id: Number(museumId) } : null
            };
        }
    });
}


function iniciarArtistas() {
    iniciarModuloCRUD({
        endpoint: '/artistas',
        singular: 'artista',
        plural: 'artistas',

        obtenerChip: function (artista) {
            return artista.nationality || null;
        },

        crearTarjeta: function (artista) {
            return (
                crearImagenTarjeta(null, artista.name, ICONOS.artista) +
                '<div class="card-body">' +
                    '<p class="card-kicker">' + escaparTexto(artista.nationality || 'Artista') + '</p>' +
                    '<h3>' + escaparTexto(artista.name) + '</h3>' +
                    '<p class="desc">' + escaparTexto(artista.biography || 'Sin biografía registrada.') + '</p>' +
                '</div>'
            );
        },

        accionesExtra: function (artista) {
            return '<a class="btn small" href="obras.html?artista=' + artista.id + '">Ver obras</a>';
        },

        crearCamposFormulario: function (artista) {
            let name = artista ? artista.name : '';
            let nationality = artista ? (artista.nationality || '') : '';
            let biography = artista ? (artista.biography || '') : '';

            return (
                '<div class="form-grid">' +
                    '<label class="field full">' +
                        '<span>Nombre del artista <em>*</em></span>' +
                        '<input name="name" type="text" required maxlength="100" value="' + escaparTexto(name) + '">' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Nacionalidad</span>' +
                        '<input name="nationality" type="text" maxlength="100" value="' + escaparTexto(nationality) + '">' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Biografía</span>' +
                        '<textarea name="biography" maxlength="1000">' + escaparTexto(biography) + '</textarea>' +
                    '</label>' +
                '</div>'
            );
        },

        leerCamposFormulario: function (formulario) {
            return {
                name: formulario.elements['name'].value.trim(),
                nationality: formulario.elements['nationality'].value.trim(),
                biography: formulario.elements['biography'].value.trim()
            };
        }
    });
}

function iniciarVisitas() {
    function calcularEstado(visita) {
        let ahora = Date.now();
        let inicio = new Date(visita.startAt).getTime();
        let fin = new Date(visita.endAt).getTime();
        if (ahora < inicio) return 'Próxima';
        if (ahora > fin) return 'Finalizada';
        return 'Activa';
    }

    iniciarModuloCRUD({
        endpoint: '/visitas',
        singular: 'visita guiada',
        plural: 'visitas guiadas',

        obtenerChip: function (visita) {
            return calcularEstado(visita);
        },

        crearTarjeta: function (visita) {
            let estado = calcularEstado(visita);
            let claseBadge = estado === 'Activa' ? 'ok' : (estado === 'Próxima' ? 'warn' : 'off');
            let enlaceWeb = visita.url ? '<a class="link-inline" href="' + escaparTexto(visita.url) + '" target="_blank">Abrir sitio</a>' : '';

            let metaHtml = '<ul class="meta">' +
                '<li><b>Inicio</b><span>' + formatearFecha(visita.startAt, true) + '</span></li>' +
                '<li><b>Fin</b><span>' + formatearFecha(visita.endAt, true) + '</span></li>';
            if (enlaceWeb) metaHtml += '<li><b>Sitio web</b><span>' + enlaceWeb + '</span></li>';
            metaHtml += '</ul>';

            return (
                '<span class="badge card-badge ' + claseBadge + '">' + estado + '</span>' +
                crearImagenTarjeta(null, visita.name, ICONOS.visita) +
                '<div class="card-body">' +
                    '<p class="card-kicker">Visita guiada</p>' +
                    '<h3>' + escaparTexto(visita.name) + '</h3>' +
                    '<p class="desc">' + escaparTexto(visita.description || 'Sin descripción.') + '</p>' +
                    metaHtml +
                '</div>'
            );
        },

        accionesExtra: function (visita) {
            return '<a class="btn small" href="recorridos.html?visita=' + visita.id + '">Recorrido</a>';
        },

        crearCamposFormulario: function (visita) {
            let name = visita ? visita.name : '';
            let description = visita ? (visita.description || '') : '';
            let startAt = visita ? convertirFechaAInput(visita.startAt) : '';
            let endAt = visita ? convertirFechaAInput(visita.endAt) : '';
            let url = visita ? (visita.url || '') : '';

            return (
                '<div class="form-grid">' +
                    '<label class="field full">' +
                        '<span>Nombre de la visita <em>*</em></span>' +
                        '<input name="name" type="text" required maxlength="100" value="' + escaparTexto(name) + '">' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Descripción</span>' +
                        '<textarea name="description" maxlength="200">' + escaparTexto(description) + '</textarea>' +
                    '</label>' +
                    '<label class="field">' +
                        '<span>Fecha y hora de inicio <em>*</em></span>' +
                        '<input name="startAt" type="datetime-local" required value="' + startAt + '">' +
                    '</label>' +
                    '<label class="field">' +
                        '<span>Fecha y hora de fin <em>*</em></span>' +
                        '<input name="endAt" type="datetime-local" required value="' + endAt + '">' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Sitio web (URL)</span>' +
                        '<input name="url" type="url" value="' + escaparTexto(url) + '">' +
                    '</label>' +
                '</div>'
            );
        },

        leerCamposFormulario: function (formulario) {
            let inicio = formulario.elements['startAt'].value;
            let fin = formulario.elements['endAt'].value;
            if (inicio && inicio.length === 16) inicio += ':00';
            if (fin && fin.length === 16) fin += ':00';

            return {
                name: formulario.elements['name'].value.trim(),
                description: formulario.elements['description'].value.trim(),
                startAt: inicio || null,
                endAt: fin || null,
                url: formulario.elements['url'].value.trim()
            };
        }
    });
}


function iniciarObras() {
    let listaCategorias = [];
    let listaArtistas = [];
    let listaSalas = [];

    // Verificamos si en la URL hay filtros (ej: obras.html?sala=1 o ?categoria=2 o ?artista=3)
    let parametrosUrl = new URLSearchParams(window.location.search);
    let idSalaFiltro = parametrosUrl.get('sala');
    let idCategoriaFiltro = parametrosUrl.get('categoria');
    let idArtistaFiltro = parametrosUrl.get('artista');

    let filtroUrl = null;
    if (idSalaFiltro) {
        filtroUrl = function (o) { return o.exhibitionRoom && String(o.exhibitionRoom.id) === idSalaFiltro; };
    } else if (idCategoriaFiltro) {
        filtroUrl = function (o) { return o.category && String(o.category.id) === idCategoriaFiltro; };
    } else if (idArtistaFiltro) {
        filtroUrl = function (o) { return o.artist && String(o.artist.id) === idArtistaFiltro; };
    }

    iniciarModuloCRUD({
        endpoint: '/obras',
        singular: 'obra',
        plural: 'obras',
        filtroUrl: filtroUrl,

        cargarRelaciones: async function () {
            let [cats, arts, sals] = await Promise.all([
                consumirApi('/categorias'),
                consumirApi('/artistas'),
                consumirApi('/salas')
            ]);
            listaCategorias = Array.isArray(cats) ? cats : [];
            listaArtistas = Array.isArray(arts) ? arts : [];
            listaSalas = Array.isArray(sals) ? sals : [];
        },

        obtenerChip: function (obra) {
            return obra.category ? obra.category.name : null;
        },

        crearTarjeta: function (obra) {
            let nombreCategoria = obra.category ? obra.category.name : 'Obra';
            let nombreArtista = obra.artist ? obra.artist.name : 'Sin artista';
            let nombreSala = obra.exhibitionRoom ? obra.exhibitionRoom.name : '';

            let metaHtml = '<ul class="meta">' +
                '<li><b>Artista</b><span>' + escaparTexto(nombreArtista) + '</span></li>';
            if (nombreSala) metaHtml += '<li><b>Sala</b><span>' + escaparTexto(nombreSala) + '</span></li>';
            if (obra.createdAt) metaHtml += '<li><b>Creación</b><span>' + formatearFecha(obra.createdAt) + '</span></li>';
            if (obra.acquiredAt) metaHtml += '<li><b>Adquisición</b><span>' + formatearFecha(obra.acquiredAt) + '</span></li>';
            if (obra.conditionPercentage != null) metaHtml += '<li><b>Conservación</b><span>' + crearBarraConservacion(obra.conditionPercentage) + '</span></li>';
            metaHtml += '</ul>';

            return (
                crearImagenTarjeta(obra.imageUrl, obra.name, ICONOS.obra) +
                '<div class="card-body">' +
                    '<p class="card-kicker">' + escaparTexto(nombreCategoria) + '</p>' +
                    '<h3>' + escaparTexto(obra.name) + '</h3>' +
                    '<p class="desc">' + escaparTexto(obra.description || 'Sin descripción.') + '</p>' +
                    metaHtml +
                '</div>'
            );
        },

        crearCamposFormulario: function (obra) {
            let name = obra ? obra.name : '';
            let description = obra ? (obra.description || '') : '';
            let imageUrl = obra ? (obra.imageUrl || '') : '';
            let createdAt = obra ? convertirFechaAInput(obra.createdAt) : '';
            let acquiredAt = obra ? convertirFechaAInput(obra.acquiredAt) : '';
            let conditionPercentage = obra && obra.conditionPercentage != null ? obra.conditionPercentage : '';

            let catIdActual = obra && obra.category ? obra.category.id : '';
            let opcionesCats = '<option value="" disabled' + (!catIdActual ? ' selected' : '') + '>Selecciona categoría…</option>';
            for (let i = 0; i < listaCategorias.length; i++) {
                let c = listaCategorias[i];
                let sel = String(c.id) === String(catIdActual) ? ' selected' : '';
                opcionesCats += '<option value="' + c.id + '"' + sel + '>' + escaparTexto(c.name) + '</option>';
            }

            let artIdActual = obra && obra.artist ? obra.artist.id : '';
            let opcionesArts = '<option value="">— Ninguno (anónimo) —</option>';
            for (let i = 0; i < listaArtistas.length; i++) {
                let a = listaArtistas[i];
                let sel = String(a.id) === String(artIdActual) ? ' selected' : '';
                opcionesArts += '<option value="' + a.id + '"' + sel + '>' + escaparTexto(a.name) + '</option>';
            }

            let salaIdActual = obra && obra.exhibitionRoom ? obra.exhibitionRoom.id : '';
            let opcionesSalas = '<option value="" disabled' + (!salaIdActual ? ' selected' : '') + '>Selecciona sala…</option>';
            for (let i = 0; i < listaSalas.length; i++) {
                let s = listaSalas[i];
                let sel = String(s.id) === String(salaIdActual) ? ' selected' : '';
                let textoSala = s.name + (s.museum ? ' · ' + s.museum.name : '');
                opcionesSalas += '<option value="' + s.id + '"' + sel + '>' + escaparTexto(textoSala) + '</option>';
            }

            return (
                '<div class="form-grid">' +
                    '<label class="field full">' +
                        '<span>Nombre de la obra <em>*</em></span>' +
                        '<input name="name" type="text" required maxlength="100" value="' + escaparTexto(name) + '">' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Categoría <em>*</em></span>' +
                        '<select name="categoryId" required>' + opcionesCats + '</select>' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Sala de exposición <em>*</em></span>' +
                        '<select name="roomId" required>' + opcionesSalas + '</select>' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Artista (opcional)</span>' +
                        '<select name="artistId">' + opcionesArts + '</select>' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>Descripción</span>' +
                        '<textarea name="description" maxlength="200">' + escaparTexto(description) + '</textarea>' +
                    '</label>' +
                    '<label class="field full">' +
                        '<span>URL de la imagen</span>' +
                        '<input name="imageUrl" type="url" value="' + escaparTexto(imageUrl) + '">' +
                    '</label>' +
                    '<label class="field">' +
                        '<span>Fecha de creación</span>' +
                        '<input name="createdAt" type="datetime-local" value="' + createdAt + '">' +
                    '</label>' +
                    '<label class="field">' +
                        '<span>Fecha de adquisición</span>' +
                        '<input name="acquiredAt" type="datetime-local" value="' + acquiredAt + '">' +
                    '</label>' +
                    '<label class="field">' +
                        '<span>Conservación (%)</span>' +
                        '<input name="conditionPercentage" type="number" min="0" max="100" value="' + conditionPercentage + '">' +
                    '</label>' +
                '</div>'
            );
        },

        leerCamposFormulario: function (formulario) {
            let catId = formulario.elements['categoryId'].value;
            let artId = formulario.elements['artistId'].value;
            let roomId = formulario.elements['roomId'].value;
            let cond = formulario.elements['conditionPercentage'].value;
            let creado = formulario.elements['createdAt'].value;
            let adquirido = formulario.elements['acquiredAt'].value;
            if (creado && creado.length === 16) creado += ':00';
            if (adquirido && adquirido.length === 16) adquirido += ':00';

            return {
                name: formulario.elements['name'].value.trim(),
                description: formulario.elements['description'].value.trim(),
                imageUrl: formulario.elements['imageUrl'].value.trim(),
                createdAt: creado || null,
                acquiredAt: adquirido || null,
                conditionPercentage: cond !== '' ? Number(cond) : null,
                category: catId ? { id: Number(catId) } : null,
                artist: artId ? { id: Number(artId) } : null,
                exhibitionRoom: roomId ? { id: Number(roomId) } : null
            };
        }
    });
}

async function iniciarRecorridos() {
    let selectorVisitas = document.getElementById('tour-select');
    let cajaRecorrido = document.getElementById('route');
    let formularioAgregar = document.getElementById('add-form');
    let selectorSalas = document.getElementById('room-select');
    let inputOrden = document.getElementById('order-input');
    let panelInfo = document.getElementById('tour-info');

    let todasLasVisitas = [];
    let todasLasSalas = [];
    let paradasActuales = [];

    // Cargar listas iniciales de visitas y salas
    let [visitas, salas] = await Promise.all([
        consumirApi('/visitas'),
        consumirApi('/salas')
    ]);

    if (!visitas || !salas) {
        cajaRecorrido.innerHTML = '<p class="state error">No se pudo cargar la información de visitas y salas.</p>';
        return;
    }

    todasLasVisitas = visitas;
    todasLasSalas = salas;


    let opcionesVisitas = '<option value="">— Selecciona una visita guiada —</option>';
    for (let i = 0; i < todasLasVisitas.length; i++) {
        let v = todasLasVisitas[i];
        opcionesVisitas += '<option value="' + v.id + '">' + escaparTexto(v.name) + '</option>';
    }
    selectorVisitas.innerHTML = opcionesVisitas;


    let parametroVisita = new URLSearchParams(window.location.search).get('visita');
    if (parametroVisita) {
        selectorVisitas.value = parametroVisita;
    }


    function dibujarRecorrido() {
        let idVisita = selectorVisitas.value;
        if (!idVisita) {
            cajaRecorrido.innerHTML = '<p class="state">Elige una visita guiada para ver su recorrido.</p>';
            formularioAgregar.hidden = true;
            panelInfo.hidden = true;
            return;
        }

        let visitaSeleccionada = todasLasVisitas.find(function (v) {
            return String(v.id) === String(idVisita);
        });

        if (visitaSeleccionada) {
            panelInfo.hidden = false;
            panelInfo.innerHTML =
                '<h2>' + escaparTexto(visitaSeleccionada.name) + '</h2>' +
                '<p>' + escaparTexto(visitaSeleccionada.description || 'Sin descripción.') + '</p>' +
                '<p class="empty-hint">' + formatearFecha(visitaSeleccionada.startAt, true) + ' → ' + formatearFecha(visitaSeleccionada.endAt, true) + '</p>';
        }

        formularioAgregar.hidden = false;

        let idsSalasUsadas = [];
        for (let i = 0; i < paradasActuales.length; i++) {
            idsSalasUsadas.push(paradasActuales[i].exhibitionRoom.id);
        }

        let salasDisponibles = todasLasSalas.filter(function (sala) {
            return !idsSalasUsadas.includes(sala.id);
        });

        if (salasDisponibles.length > 0) {
            let htmlOpciones = '';
            for (let i = 0; i < salasDisponibles.length; i++) {
                let s = salasDisponibles[i];
                let texto = s.name + (s.museum ? ' · ' + s.museum.name : '');
                htmlOpciones += '<option value="' + s.id + '">' + escaparTexto(texto) + '</option>';
            }
            selectorSalas.innerHTML = htmlOpciones;
            selectorSalas.disabled = false;
            document.getElementById('add-btn').disabled = false;
        } else {
            selectorSalas.innerHTML = '<option value="">No quedan más salas por agregar</option>';
            selectorSalas.disabled = true;
            document.getElementById('add-btn').disabled = true;
        }

        inputOrden.value = paradasActuales.length + 1;

        if (paradasActuales.length === 0) {
            cajaRecorrido.innerHTML = '<p class="state">Esta visita todavía no tiene salas. Agrega la primera abajo.</p>';
            return;
        }

        let htmlLista = '<ol class="timeline">';
        for (let i = 0; i < paradasActuales.length; i++) {
            let parada = paradasActuales[i];
            let sala = parada.exhibitionRoom;
            let museoNombre = sala.museum ? sala.museum.name : '';
            let capacidadTexto = sala.capacity != null ? (' · capacidad ' + sala.capacity) : '';

            htmlLista +=
                '<li class="stop" data-room="' + sala.id + '" data-seq="' + parada.sequenceNumber + '">' +
                    '<div>' +
                        '<h3>' + parada.sequenceNumber + '. ' + escaparTexto(sala.name) + '</h3>' +
                        '<small>' + escaparTexto(museoNombre) + escaparTexto(capacidadTexto) + '</small>' +
                    '</div>' +
                    '<div class="card-actions">' +
                        '<button class="btn ghost small" data-accion="orden">Cambiar orden</button>' +
                        '<button class="btn danger small" data-accion="quitar">Quitar</button>' +
                    '</div>' +
                '</li>';
        }
        htmlLista += '</ol>';
        cajaRecorrido.innerHTML = htmlLista;
    }

    async function cargarParadasDeVisita() {
        let idVisita = selectorVisitas.value;
        if (!idVisita) {
            paradasActuales = [];
            dibujarRecorrido();
            return;
        }

        let datos = await consumirApi('/recorridos/visita/' + idVisita);
        if (datos && Array.isArray(datos)) {
           
            datos.sort(function (a, b) {
                return a.sequenceNumber - b.sequenceNumber;
            });
            paradasActuales = datos;
        } else {
            paradasActuales = [];
        }
        dibujarRecorrido();
    }

    selectorVisitas.addEventListener('change', cargarParadasDeVisita);

    formularioAgregar.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        let idVisita = Number(selectorVisitas.value);
        let idSala = Number(selectorSalas.value);
        let numOrden = Number(inputOrden.value);

        let cuerpoPeticion = {
            id: {
                tourId: idVisita,
                exhibitionRoomId: idSala
            },
            sequenceNumber: numOrden
        };

        let resultado = await consumirApi('/recorridos', 'POST', cuerpoPeticion);
        if (resultado) {
            mostrarMensaje('Sala agregada al recorrido con éxito');
            await cargarParadasDeVisita();
        } else {
            mostrarMensaje('No se pudo agregar la sala al recorrido.', 'error');
        }
    });

    cajaRecorrido.addEventListener('click', async function (evento) {
        let boton = evento.target.closest('button[data-accion]');
        if (!boton) return;

        let li = boton.closest('.stop');
        let idSala = li.dataset.room;
        let idVisita = selectorVisitas.value;

        if (boton.dataset.accion === 'quitar') {
            confirmarAccion('¿Deseas quitar esta sala del recorrido?', async function () {
                let resultado = await consumirApi('/recorridos/' + idVisita + '/' + idSala, 'DELETE');
                if (resultado) {
                    mostrarMensaje('Sala quitada del recorrido');
                    await cargarParadasDeVisita();
                } else {
                    mostrarMensaje('No se pudo quitar la sala.', 'error');
                }
            });
        } else if (boton.dataset.accion === 'orden') {
            let nuevoOrden = window.prompt('Ingresa la nueva posición (orden) para esta sala:', li.dataset.seq);
            if (nuevoOrden !== null && nuevoOrden.trim() !== '') {
                let resultado = await consumirApi('/recorridos/' + idVisita + '/' + idSala, 'PUT', {
                    sequenceNumber: Number(nuevoOrden)
                });
                if (resultado) {
                    mostrarMensaje('Orden actualizado con éxito');
                    await cargarParadasDeVisita();
                } else {
                    mostrarMensaje('No se pudo actualizar el orden.', 'error');
                }
            }
        }
    });

    // Cargar si ya había una visita seleccionada
    if (selectorVisitas.value) {
        await cargarParadasDeVisita();
    }
}


document.addEventListener('DOMContentLoaded', function () {
    let pagina = document.body.dataset.page;

    if (pagina === 'inicio') {
        iniciarInicio();
    } else if (pagina === 'categorias') {
        iniciarCategorias();
    } else if (pagina === 'museos') {
        iniciarMuseos();
    } else if (pagina === 'salas') {
        iniciarSalas();
    } else if (pagina === 'obras') {
        iniciarObras();
    } else if (pagina === 'artistas') {
        iniciarArtistas();
    } else if (pagina === 'visitas') {
        iniciarVisitas();
    } else if (pagina === 'recorridos') {
        iniciarRecorridos();
    }
});

