import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

const ProductItem = ({ producto, editarProducto, eliminarProducto }) => {
    const [editando, setEditando] = useState(false)
    const [nombre, setNombre] = useState(producto.nombre)
    const [precio, setPrecio] = useState(producto.precio.toString())
    const [categoria, setCategoria] = useState(producto.categoria)
    const [cantidadStock, setCantidadStock] = useState(producto.cantidadStock.toString());
    const [codigoBarras, setCodigoBarras] = useState(producto.codigoBarras)
    const [showModal, setShowModal] = useState(false)

    const handleEditar = () => {
        setEditando(true);
        setNombre(producto.nombre)
        setCategoria(producto.categoria)
        setPrecio(producto.precio.toString())
        setCantidadStock(producto.cantidadStock.toString())
        setCodigoBarras(producto.codigoBarras)
    }

    const handleGuardar = () => {
        const productoEditado = {
            ...producto,
            nombre: nombre.trim(),
            categoria: categoria.trim(),
            precio: parseFloat(precio),
            cantidadStock: parseInt(cantidadStock),
            codigoBarras: codigoBarras.trim()
        }

        editarProducto(productoEditado);
        setEditando(false);
    }

    const handleCancelar = () => {
        setEditando(false);
    }

    const handleEliminar = () => {
        setShowModal(true)
    }

    const confirmDelete = () => {
        eliminarProducto(producto.id);
        setShowModal(false)
    }

    return (
        <div className="product-item">
            {!editando ? (
                <>
                    <h3>{producto.nombre}</h3>
                    <p>Categoría: {producto.categoria}</p>
                    <p>Precio: ${producto.precio}</p>
                    <p>Cantidad en Stock: {producto.cantidadStock}</p>
                    <p>Código de Barras: {producto.codigoBarras}</p>
                    <button className="btn btn-info ms-2" onClick={handleEditar}>
                        Editar
                    </button>
                    <button className="btn btn-danger ms-2" onClick={handleEliminar}>
                        Eliminar
                    </button>
                </>
            ) : (
                <>
                    <input type="text" className="form-control mt-2" defaultValue={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del producto" />
                    <input type="text" className="form-control mt-2" defaultValue={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Categoría" />
                    <input type="number" className="form-control mt-2" defaultValue={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" />
                    <input type="number" className="form-control mt-2" defaultValue={cantidadStock} onChange={(e) => setCantidadStock(e.target.value)} placeholder="Cantidad en Stock" />
                    <input type="text" className="form-control mt-2" defaultValue={codigoBarras} onChange={(e) => setCodigoBarras(e.target.value)} placeholder="Número Código de Barras" />
                    <button className="btn btn-success mt-2" onClick={handleGuardar}>
                        Guardar
                    </button>
                    <button className="btn btn-secondary ms-2 mt-2" onClick={handleCancelar}>
                        Cancelar
                    </button>
                </>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que quieres eliminar este producto?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductItem
