import React, { Fragment, useState, useRef, useEffect } from 'react'
import ProductItem from './ProductItem'
import uuid4 from 'uuid4'
import { Modal, Button } from 'react-bootstrap'

const ProductList = () => {
    const KEY = "productos"

    const [productos, setProductos] = useState(() => {
        const storedProductos = JSON.parse(localStorage.getItem(KEY));
        return storedProductos || []
    });

    const [filtroCodigoBarras, setFiltroCodigoBarras] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [ordenacionAscendente, setOrdenacionAscendente] = useState(true);
    const [showModal, setShowModal] = useState(false)
    const productosPorPagina = 8

    const nombreRef = useRef()
    const precioRef = useRef()
    const categoriaRef = useRef()
    const cantidadStockRef = useRef()
    const codigoBarrasRef = useRef()

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(productos));
    }, [productos, KEY])

    const agregarProducto = () => {
        const nombre = nombreRef.current.value.trim();
        const precio = parseFloat(precioRef.current.value);
        const categoria = categoriaRef.current.value.trim();
        const cantidadStock = parseInt(cantidadStockRef.current.value);
        const codigoBarras = codigoBarrasRef.current.value.trim();

        if (nombre === '' || categoria === '' || isNaN(precio) || isNaN(cantidadStock) || codigoBarras === '') {
            return
        }
        if (nombre === '' || !nombre.match(/^[A-Z][a-z]/)) {
            alert('El nombre debe empezar con mayuscula y solo puede contener letras.')
            return
        }
    
        if (codigoBarras === '' || codigoBarras.length < 5 || isNaN(codigoBarras)) {
            alert('El número de código de barras debe tener al menos 5 dígitos numéricos.')
            return
        }
    
        if (categoria === '' || isNaN(precio) || isNaN(cantidadStock) ){
            alert('Por favor complete todos los campos correctamente.')
            return
        }

        const nuevoProducto = {
            id: uuid4(),
            nombre,
            categoria,
            precio,
            cantidadStock,
            codigoBarras,
            estado: false
        }

        setProductos(prevProductos => [...prevProductos, nuevoProducto]);

        nombreRef.current.value = ''
        categoriaRef.current.value = ''
        precioRef.current.value = ''
        cantidadStockRef.current.value = ''
        codigoBarrasRef.current.value = ''

        mensaje()
    }

    const cambiarEstadoProducto = (id) => {
        const nuevosProductos = productos.map(producto =>
            producto.id === id ? { ...producto, estado: !producto.estado } : producto
        );
        setProductos(nuevosProductos);
    }

    const editarProducto = (productoEditado) => {
        const nuevosProductos = productos.map(producto =>
            producto.id === productoEditado.id ? productoEditado : producto
        );
        setProductos(nuevosProductos)
    }

    const eliminarProducto = (id) => {
        const nuevosProductos = productos.filter(producto => producto.id !== id);
        setProductos(nuevosProductos)
    }

    const BuscarCodigoBarras = (e) => {
        setFiltroCodigoBarras(e.target.value.trim());
        setPaginaActual(1); 
    };

    const ordenarProductosPorNombre = () => {
        setOrdenacionAscendente(!ordenacionAscendente);
    };

    const productosFiltrados = productos.filter(producto =>
        producto.codigoBarras.includes(filtroCodigoBarras)
    );

    productosFiltrados.sort((a, b) => {
        const factorOrden = ordenacionAscendente ? 1 : -1;
        return factorOrden * a.nombre.localeCompare(b.nombre);
    });

    const indiceUltimoProducto = paginaActual * productosPorPagina;
    const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
    const productosPaginados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);

    const irAPaginaSiguiente = () => {
        if ((paginaActual + 1) <= Math.ceil(productosFiltrados.length / productosPorPagina)) {
            setPaginaActual(paginaActual + 1);
        }
    };

    const irAPaginaAnterior = () => {
        if ((paginaActual - 1) > 0) {
            setPaginaActual(paginaActual - 1);
        }
    };

    const irAPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    const mensaje = () => {
        setShowModal(true);
    };

    const numeroTotalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

    return (
        <Fragment>
            <h1 className="animate-charcter display-5 my-3 text-center">Lista de Productos 🛒</h1>

            <h2>Ingrese un nuevo producto</h2>
            <div className='input-group my-5'>
                <input type="text" className='form-control' placeholder='Nombre del producto' ref={nombreRef} />
                <input type="text" className='form-control ms-2' placeholder='Categoria' ref={categoriaRef} />
                <input type="number" className='form-control ms-2' placeholder='Precio' ref={precioRef} />
                <input type="number" className='form-control ms-2' placeholder='Cantidad en Stock' ref={cantidadStockRef} />
                <input type="number" className='form-control ms-2' placeholder='Numero Codigo de Barras' ref={codigoBarrasRef} />
                <button className='btn btn-primary ms-2' onClick={agregarProducto}>Agregar Producto</button>
            </div>

            <div className="input-group mb-3">
                <span className="input-group-text" id="buscarCodigoBarras">Buscar por Codigo de Barras</span>
                <input type="text" className="form-control" placeholder="Ingrese codigo de barras" onChange={BuscarCodigoBarras} />
                <button className="btn btn-outline-secondary me-2" onClick={ordenarProductosPorNombre}>
                    Nombre {ordenacionAscendente ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}
                </button>
            </div>

            <div className="product-list">
                {productosPaginados.map(producto => (
                    <ProductItem
                        key={producto.id}
                        producto={producto}
                        cambiarEstado={cambiarEstadoProducto}
                        editarProducto={editarProducto}
                        eliminarProducto={eliminarProducto}
                    />
                ))}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Producto agregado</Modal.Title>
                </Modal.Header>
                <Modal.Body>Producto agregado correctamente</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>


            <nav className="mt-3">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => irAPaginaAnterior()}>&laquo;</button>
                    </li>
                    {Array.from({ length: numeroTotalPaginas }, (_, index) => (
                        <li key={index} className={`page-item ${paginaActual === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => irAPagina(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${paginaActual === numeroTotalPaginas ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => irAPaginaSiguiente()}>&raquo;</button>
                    </li>
                </ul>
            </nav>

        </Fragment>
    );
};

export default ProductList