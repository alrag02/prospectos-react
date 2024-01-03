import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from 'reactstrap';
import React, { useState, useEffect } from 'react';

function App() {
  const baseUrl="https://localhost:3000/api/prospectos"
  const [data, setData]=useState([])
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [selectedItem, setSelectedItem]=useState({
    id: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    calle: '',
    numero: '',
    colonia: '',
    codigoPostal: '',
    telefono: '',
    rfc: '',
    estatus: '',
  })


  const handleChange=e=>{
    const {name, value}=e.target;
    setSelectedItem({
      ...selectedItem,
      [name]: value
    });
    console.log(selectedItem);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

   const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const petitionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const petitionPost=async()=>{
    delete selectedItem.id;
    selectedItem.estatus=parseInt(selectedItem.estatus);
    await axios.post(baseUrl, selectedItem)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const petitionPut=async()=>{
    selectedItem.estatus=parseInt(selectedItem.estatus);
    await axios.put(baseUrl+"/"+selectedItem.id, selectedItem)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(item=>{
        if(item.id===selectedItem.id){
          item.nombre=respuesta.nombre;
          item.apellidoPaterno=respuesta.apellidoPaterno;
          item.apellidoMaterno=respuesta.apellidoMaterno;
          item.calle=respuesta.calle;
          item.numero=respuesta.numero;
          item.colonia=respuesta.colonia;
          item.codigoPostal=respuesta.codigoPostal;
          item.telefono=respuesta.telefono;
          item.rfc=respuesta.rfc;
          item.estatus=respuesta.estatus;
        }
      });
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const petitionDelete=async()=>{
    await axios.delete(baseUrl+"/"+selectedItem.id)
    .then(response=>{
     setData(data.filter(item=>item.id!==response.data));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarItem=(item, caso)=>{
    setSelectedItem(item);
    (caso==="Editar")?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }

  useEffect(()=>{
    petitionGet();
  },[])

  return (
    <div className="App">
      <br></br>
      <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-info">Nuevo</button>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Calle</th>
            <th>Número</th>
            <th>Colonia</th>
            <th>Código Postal</th>
            <th>Teléfono</th>
            <th>RFC</th>
            <th>Estatus</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
        {data.map(item=>(
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.nombre}</td>
            <td>{item.apellidoPaterno}</td>
            <td>{item.apellidoMaterno}</td>
            <td>{item.calle}</td>
            <td>{item.numero}</td>
            <td>{item.colonia}</td>
            <td>{item.codigoPostal}</td>
            <td>{item.telefono}</td>
            <td>{item.rfc}</td>
            <td>{item.status}</td>
            <td>
              <button className="btn btn-primary" onClick={()=>seleccionarItem(item, "Editar")}>Editar</button> {"  "}
              <button className="btn btn-danger" onClick={()=>seleccionarItem(item, "Eliminar")}>Eliminar</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>


      <Modal isOpen={modalInsertar}>
        <ModalHeader>Inserte un nuevo prospecto</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="nombre"/>
            <br />
            <label>Apellido Paterno:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="apellidoPaterno" />
            <br />
            <label>Apellido Materno:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="apellidoMaterno" />
            <br />
            <label>Calle:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="calle" />
            <br />
            <label>Número:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="numero" />
            <br />
            <label>Colonia:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="colonia" />
            <br />
            <label>Código Postal:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="codigoPostal" />
            <br />
            <label>Teléfono:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="telefono" />
            <br />
            <label>RFC:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="rfc" />
            <br />
            <label>Estatus:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="estatus" />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>petitionPost()}>Insertar</button>{"   "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
      <ModalHeader>Editar prospecto seleccionado</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>ID: </label>
          <br />
          <input type="text" className="form-control" readOnly value={selectedItem && selectedItem.id}/>
          <br />
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="nombre" value={selectedItem && selectedItem.nombre}/>
          <br />
          <label>Apellido Paterno:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="apellidoPaterno" value={selectedItem && selectedItem.apellidoPaterno}/>
          <br />
          <label>Apellido Materno:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="apellidoMaterno" value={selectedItem && selectedItem.apellidoMaterno}/>
          <br />
          <label>Calle:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="calle" value={selectedItem && selectedItem.calle}/>
          <br />
          <label>Número:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="numero" value={selectedItem && selectedItem.numero}/>
          <br />
          <label>Colonia:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="colonia" value={selectedItem && selectedItem.colonia}/>
          <br />
          <label>Código Postal:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="codigoPostal" value={selectedItem && selectedItem.codigoPostal}/>
          <br />
          <label>Teléfono:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="telefono" value={selectedItem && selectedItem.telefono}/>
          <br />
          <label>RFC:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="rfc" value={selectedItem && selectedItem.rfc}/>
          <br />
          <label>Estatus:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="estatus" value={selectedItem && selectedItem.status}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>petitionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Eliminar este elemento: {selectedItem && selectedItem.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>petitionDelete()}>Sí</button>
          <button className="btn btn-secondary" onClick={()=>abrirCerrarModalEliminar()}>No</button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
