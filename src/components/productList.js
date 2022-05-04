import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, InputGroup, FormControl, Form } from 'react-bootstrap';
import axios from 'axios';
import '../styles/productList.css'

const API = 'https://api.escuelajs.co/api/v1/products/'

const Tables = () => {
    // estados
    const [show, setShow] = useState(false);
    const [modal, setModal] = useState(false);
    const [eliminacion, setEliminacion] = useState('');
    const [modalEdit, setModalEdit] = useState(false);
    const [editar, setEditar] = useState('')
    const [state, setState] = React.useState({ title: '', price: '', description: '', categoryId: 1, images: [] });
    const [products, setProducts] = useState()
    const [validated, setValidated] = useState(false);



    // fin de estados


    // funciones que apertura y cierre de los modals
    const handleClose = () => {
        setShow(false);
        setValidated(false);
    }

    const handleShow = () => {
        setShow(true)
        setState(({ title: '', price: '', description: '', categoryId: 1, images: [] }))
    };
    const handleCloseOK = () => setModal(false);
    const handleCloseEdit = () => setModalEdit(false);
    // fin funciones que apertura y cierre de los modals


    // funcion que evita recargar la pagina
    const getData = async () => {
        const response = await axios(API)
        setProducts(response.data)
    }
    useEffect(() => {
        getData()
    }, [])
    // fin de la funcion que evita recargar la pagina


    // validacon de formularios
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if(form.checkValidity() === false){
            event.stopPropagation();
            setValidated(true)
        }
        else{
            axios.post(API, state)
            .then(function (response) {
                getData()
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
            setShow(false)
        }

    }
    // fin de validacion de formularios


    // clonando el estado
    const addProduct = { ...state }
    // fin de clonando el estado


    // funcion que obtiene los valores del input
    function onChangeInput(event) {
        addProduct[event.target.name] = event.target.name === "images" ? [event.target.value] : event.target.value;
        console.log(addProduct)
        setState(addProduct)
    }
    // fin de la funcion que obtiene los valores del input

    // funcion que abre el modal eliminar y funcion que elimina el producto
    function eliminar(id) {
        setModal(true)
        setEliminacion(id)
    }

    function confirmDelete(id) {
        axios.delete(`${API}${id}`)
            .then(function (deleted) {
                getData()
                console.log(deleted);
            })
            .catch(function (error) {
                console.log(error);
            });
        console.log(id)
        handleCloseEdit(true)
        setModal(false)
    }
    // fin de la funcion que abre el modal eliminar y funcion que elimina el producto


    // funcion que abre el modal de editar y funcion que edita un producto
    async function editProduct(id) {
        setModalEdit(true)
        setEditar(id)
        const response = await axios.get(`${API}${id}`)
        setState({ title: response.data.title, price: response.data.price, description: response.data.description, categoryId: 1, images: response.data.images })
    }

    function confirmEdit(event, id) {
        const form = event.currentTarget;
        event.preventDefault();

        if(form.checkValidity() === false){
            event.stopPropagation();
            setValidated(true)
        }
        else{
            axios.put(`${API}${id}`, state)
            .then(function (response) {
                getData()
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        setModalEdit(false)
        }

    }
    // fin de la funcion que abre el modal de editar y funcion que edita un producto

    return (
        <div className="containerTable">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Codigo</th>
                        <th>Imagen</th>
                        <th>Titulo</th>
                        <th>Precio</th>
                        <th>Descripcion</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product, key) => (
                        <tr key={key}>
                            <td>{product.id}</td>
                            <td><img className="tamanioImagen" src={product.images[0]} alt="imagenProducto" /></td>
                            <td>{product.title}</td>
                            <td>$. {product.price}</td>
                            <td>{product.description}</td>
                            <td className="buttonsProducts">
                                <Button onClick={() => editProduct(product.id)} variant="info">Editar</Button>{' '}<Button onClick={() => eliminar(product.id)} variant="danger">Eliminar</Button>
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
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <p>Ingrese el nombre del producto</p>
                        <InputGroup hasValidation className="mb-3">
                            <FormControl
                                name="title"
                                value={state.title}
                                onChange={onChangeInput}
                                placeholder="Nombre del producto"
                                aria-label="Nombre del producto"
                                aria-describedby="basic-addon1"
                                required
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
                                required
                                type= "number"
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
                                required
                            />
                        </InputGroup>
                        <p>Ingrese la URL del producto que desea ingresar</p>
                        <InputGroup className="mb-3">
                            <FormControl
                                name="images"
                                value={state.images}
                                onChange={onChangeInput}
                                placeholder="URL de la imagen del producto"
                                aria-label="URL de la imagen del producto"
                                aria-describedby="basic-addon1"
                                required
                            />
                        </InputGroup>
                        <div className="botonesAgregar">
                            <Button type="submit" variant="primary">
                                Save Changes
                            </Button>

                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Button onClick={handleShow} variant="info">Agregar Nuevo Producto</Button>

            <Modal
                show={modal}
                onHide={handleCloseOK}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
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


            <Modal
                show={modalEdit}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Editar el producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={(event) => {
                            event.preventDefault()
                            confirmEdit(event, editar)}
                        }>
                        <p>Ingrese el nombre del producto</p>
                        <InputGroup hasValidation className="mb-3">
                            <FormControl
                                name="title"
                                value={state.title}
                                onChange={onChangeInput}
                                placeholder="Nombre del producto"
                                aria-label="Nombre del producto"
                                aria-describedby="basic-addon1"
                                required
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
                                required
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
                                required
                            />
                        </InputGroup>
                        <p>Ingrese la URL del producto que desea ingresar</p>
                        <InputGroup className="mb-3">
                            <FormControl
                                name="images"
                                value={state.images}
                                onChange={onChangeInput}
                                placeholder="URL de la imagen del producto"
                                aria-label="URL de la imagen del producto"
                                aria-describedby="basic-addon1"
                                required
                            />
                        </InputGroup>
                        <div className="botonesAgregar">
                            <Button type="submit" variant="primary">Edit</Button>
                            <Button variant="secondary" onClick={handleCloseEdit}>
                                Cancel
                            </Button>
                        </div>
                        </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Tables;