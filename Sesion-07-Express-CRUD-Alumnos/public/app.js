/**
 * app.js — Lógica del sitio (Fetch + Dialogs)
 * Tarea Sesión 7 · Desarrollo Web · UMG
 */

const API = '/alumnos';
const API_KEY = 'umg-2026';

const cabeceras = (conJson = true) => ({
    ...(conJson ? { 'Content-Type': 'application/json' } : {}),
    'x-api-key': API_KEY,
});

const tabla = document.querySelector('#tablaAlumnos tbody');
const mensaje = document.querySelector('#mensaje');
const dialogoForm = document.querySelector('#dialogoForm');
const dialogoEliminar = document.querySelector('#dialogoEliminar');
const form = document.querySelector('#formAlumno');
const tituloForm = document.querySelector('#tituloForm');
const nombreEliminar = document.querySelector('#nombreEliminar');
const btnNuevo = document.querySelector('#btnNuevo');
const btnCancelarForm = document.querySelector('#btnCancelarForm');
const btnCancelarEliminar = document.querySelector('#btnCancelarEliminar');
const btnConfirmarEliminar = document.querySelector('#btnConfirmarEliminar');

let idEnEdicion = null;
let idAEliminar = null;

async function cargarAlumnos() {
    try {
        const respuesta = await fetch(API);
        if (!respuesta.ok) throw new Error('Error al cargar alumnos');
        const alumnos = await respuesta.json();

        tabla.innerHTML = '';
        alumnos.forEach((a) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${a.nombre}</td>
                <td>${a.apellido}</td>
                <td>${a.email}</td>
                <td>${a.edad ?? ''}</td>
                <td>
                    <button class="btn-editar" data-id="${a.id}">Editar</button>
                    <button class="btn-eliminar" data-id="${a.id}" data-nombre="${a.nombre} ${a.apellido}">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });

        // Eventos locales para botones generados dinámicamente
        tabla.querySelectorAll('.btn-editar').forEach((btn) => {
            btn.addEventListener('click', () => abrirDialogoEditar(btn.dataset.id));
        });
        tabla.querySelectorAll('.btn-eliminar').forEach((btn) => {
            btn.addEventListener('click', () => eliminarAlumno(btn.dataset.id, btn.dataset.nombre));
        });
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

function abrirDialogoNuevo() {
    idEnEdicion = null;
    tituloForm.textContent = 'Nuevo alumno';
    form.reset();
    dialogoForm.showModal();
}

async function abrirDialogoEditar(id) {
    try {
        const respuesta = await fetch(`${API}/${id}`);
        if (!respuesta.ok) throw new Error('No se pudo obtener el alumno');
        const alumno = await respuesta.json();

        idEnEdicion = id;
        tituloForm.textContent = 'Editar alumno';
        form.nombre.value = alumno.nombre;
        form.apellido.value = alumno.apellido;
        form.email.value = alumno.email;
        form.edad.value = alumno.edad ?? '';

        dialogoForm.showModal();
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

async function guardarAlumno(event) {
    event.preventDefault();
    const datos = {
        nombre: form.nombre.value.trim(),
        apellido: form.apellido.value.trim(),
        email: form.email.value.trim(),
        edad: form.edad.value ? Number(form.edad.value) : undefined,
    };

    try {
        const url = idEnEdicion ? `${API}/${idEnEdicion}` : API;
        const metodo = idEnEdicion ? 'PUT' : 'POST';

        const respuesta = await fetch(url, {
            method: metodo,
            headers: cabeceras(true),
            body: JSON.stringify(datos),
        });

        if (!respuesta.ok) {
            const errData = await respuesta.json().catch(() => ({}));
            throw new Error(errData.error || 'Error al guardar el alumno');
        }

        dialogoForm.close();
        await cargarAlumnos();
        mostrarMensaje(idEnEdicion ? 'Alumno actualizado con éxito' : 'Alumno creado con éxito', 'ok');
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

function eliminarAlumno(id, nombreCompleto) {
    idAEliminar = id;
    if (nombreEliminar) nombreEliminar.textContent = nombreCompleto;
    dialogoEliminar.showModal();
}

async function confirmarEliminacion() {
    if (!idAEliminar) return;
    try {
        const respuesta = await fetch(`${API}/${idAEliminar}`, {
            method: 'DELETE',
            headers: cabeceras(false),
        });

        if (!respuesta.ok) throw new Error('Error al eliminar el alumno');

        dialogoEliminar.close();
        idAEliminar = null;
        await cargarAlumnos();
        mostrarMensaje('Alumno eliminado correctamente', 'ok');
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

function mostrarMensaje(texto, tipo = 'ok') {
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.className = tipo === 'error' ? 'mensaje-error' : 'mensaje-ok';
    setTimeout(() => {
        mensaje.textContent = '';
        mensaje.className = '';
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (btnNuevo) btnNuevo.addEventListener('click', abrirDialogoNuevo);
    if (form) form.addEventListener('submit', guardarAlumno);
    if (btnCancelarForm) btnCancelarForm.addEventListener('click', () => dialogoForm.close());
    if (btnCancelarEliminar) btnCancelarEliminar.addEventListener('click', () => dialogoEliminar.close());
    if (btnConfirmarEliminar) btnConfirmarEliminar.addEventListener('click', confirmarEliminacion);

    cargarAlumnos();
});