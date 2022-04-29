import React, { useState } from 'react';
import { Table, Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import useGetProducts from '../hooks/useGetProducts';
import axios from 'axios';
import '../styles/table.css'

const API = 'https://api.escuelajs.co/api/v1/products/'

const Tables = () => {
    const [show, setShow] = useState(false);
    const [modal, setModal] = useState(false);
    const [eliminacion, setEliminacion] = useState('')
    const [state, setState] = React.useState({ title: '', price: '', description: '', categoryId: 1, images: [] });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseOK = () => setModal(false);

    const products = useGetProducts(API)

    const addProduct = { ...state }

    function onChangeInput(event) {
        addProduct[event.target.name] = event.target.value
        console.log(addProduct)
        setState(addProduct)
    }

    function add() {
        axios.post(API, state)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function eliminar(id) {
        setModal(true)
        setEliminacion(id)
    }

    function confirmDelete(id){
        axios.delete(`${API}${id}`)
        .then(function (deleted) {
            console.log(deleted);
        })
        .catch(function (error) {
            console.log(error);
        });
        console.log(id)
    }

    return (
        <div className="containerTable">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Codigo</th>
                        <th>Titulo</th>
                        <th>Precio</th>
                        <th>Descripcion</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, key) => (
                        <tr key={key}>
                            <td>{product.id}</td>
                            <td><img className="tamanioImagen" src={product.images[0]} /></td>
                            <td>{product.title}</td>
                            <td>$. {product.price}</td>
                            <td>{product.description}</td>
                            <td className="buttonsProducts">
                                <Button variant="info">Editar</Button>{' '}<Button onClick={() => eliminar(product.id)} variant="danger">Eliminar</Button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Agregar un nuevo producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Ingrese el nombre del producto</p>
                    <InputGroup className="mb-3">
                        <FormControl
                            name="title"
                            value={state.title}
                            onChange={onChangeInput}
                            placeholder="Nombre del producto"
                            aria-label="Nombre del producto"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                    <p>Ingrese el precio del producto</p>
                    <InputGroup className="mb-3">
                        <FormControl
                            name="price"
                            value={state.price}
                            onChange={onChangeInput}
                            placeholder="Precio del producto"
                            aria-label="Precio del producto"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                    <p>Ingrese una pequeña descripcion del producto</p>
                    <InputGroup className="mb-3">
                        <FormControl
                            name="description"
                            value={state.description}
                            onChange={onChangeInput}
                            placeholder="Descripcion del producto"
                            aria-label="Descripcion del producto"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={add}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Button onClick={handleShow} variant="info">Agregar Nuevo Producto</Button>

            <Modal
                show={modal}
                onHide={handleCloseOK}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Desea eliminar el producto?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseOK}>
                        Cancel
                    </Button>
                    <Button onClick={() => confirmDelete(eliminacion)} variant="primary">Ok</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Tables;