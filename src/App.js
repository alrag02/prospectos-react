import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import React, { useState, useEffect } from 'react';

function App() {
  const baseUrl="https://localhost:44386/api/"
  const [data, setData]=useState([])
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [modalInsertarDocumento, setModalInsertarDocumento]=useState(false);
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
  const [selectedDocumento, setSelectedDocumento]=useState({
    id: '',
    nombre: '',
    prospectoId: '',
    urlDocumento: ''
  })


  const getEstatusText = (value) => {
    switch (value) {
      case 1:
        return 'Aceptado';
      case 2:
        return 'Pendiente';
      case 3:
        return 'Rechazado';
      default:
        return '';
    }
  };

  const handleChange=e=>{
    const {name, value}=e.target;
    setSelectedItem({
      ...selectedItem,
      [name]: value
    });
    console.log(selectedItem);
  }

  const handleChangeDocumento=e=>{
    const {name, value}=e.target;
    setSelectedDocumento({
      ...selectedDocumento,
      prospectoId: selectedItem.id,
      [name]: value
    });
    console.log(selectedDocumento);
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

  const abrirCerrarModalInsertarDocumento=()=>{
    setModalInsertarDocumento(!modalInsertarDocumento);
  }

  const petitionGet=async()=>{
    await axios.get(baseUrl+"prospectos")
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const petitionPost=async()=>{
    delete selectedItem.id;
    selectedItem.estatus=parseInt(selectedItem.estatus);
    await axios.post(baseUrl+"prospectos", selectedItem)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const petitionPut=async()=>{
    selectedItem.estatus=parseInt(selectedItem.estatus);
    await axios.put(baseUrl+"prospectos/"+selectedItem.id, selectedItem)
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
    await axios.delete(baseUrl+"prospectos/"+selectedItem.id)
    .then(response=>{
     setData(data.filter(item=>item.id!==response.data));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }


  const petitionPostDocumento=async()=>{
    delete selectedDocumento.id;
    selectedDocumento.prospectoId=parseInt(selectedDocumento.prospectoId);
    await axios.post(baseUrl+"documentos", selectedDocumento)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertarDocumento();
    }).catch(error=>{
      console.log(error);
    })
  }



  const seleccionarItem=(item, caso)=>{
    setSelectedItem(item);
    switch (caso) {
      case "Eliminar":
        abrirCerrarModalEliminar()
        break;
      case "Documento":
        abrirCerrarModalInsertarDocumento()
        break;
      default:
        abrirCerrarModalEditar()
        break;
    }
  }

  useEffect(()=>{
    petitionGet();
  },[])

  return (
    <div className="App"> 
    <br></br>
        <div className='container'>
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
              <td>{getEstatusText(item.estatus)}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>seleccionarItem(item, "Editar")}>Editar</button> {"  "}
                <button className="btn btn-danger" onClick={()=>seleccionarItem(item, "Eliminar")}>Eliminar</button>
                <button className="btn btn-success" onClick={()=>seleccionarItem(item, "Documento")}>Documento</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        </div>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Inserte un nuevo prospecto</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="nombre" required maxLength="50"/>
            <br />
            <label>Apellido Paterno:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="apellidoPaterno" required maxLength="50"/>
            <br />
            <label>Apellido Materno:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="apellidoMaterno" />
            <br />
            <label>Calle:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="calle" required maxLength="100"/>
            <br />
            <label>Número:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="numero" required maxLength="20"/>
            <br />
            <label>Colonia:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="colonia" required maxLength="100"/>
            <br />
            <label>Código Postal:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="codigoPostal" required maxLength="5" pattern='^[0-9]{5}$'/>
            <br />
            <label>Teléfono:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="telefono" required maxLength="15"/>
            <br />
            <label>RFC:</label>
            <br />
            <input type="text" className="form-control" onChange={handleChange} name="rfc" required maxLength="13" pattern='^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$'/>
            <br />
            <label>Estatus:</label>
            <br />
            <select className="form-control" onChange={handleChange} name="estatus" required>
              <option value={1}>Enviado</option>
              <option value={2}>Autorizado</option>
              <option value={3}>Rechazado</option>
            </select>
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
          <input type="text" className="form-control" onChange={handleChange} name="nombre" required maxLength="50" value={selectedItem && selectedItem.nombre}/>
          <br />
          <label>Apellido Paterno:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="apellidoPaterno" required maxLength="50" value={selectedItem && selectedItem.apellidoPaterno}/>
          <br />
          <label>Apellido Materno:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="apellidoMaterno" value={selectedItem && selectedItem.apellidoMaterno}/>
          <br />
          <label>Calle:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="calle" required maxLength="100" value={selectedItem && selectedItem.calle}/>
          <br />
          <label>Número:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="numero" required maxLength="20" value={selectedItem && selectedItem.numero}/>
          <br />
          <label>Colonia:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="colonia" required maxLength="100" value={selectedItem && selectedItem.colonia}/>
          <br />
          <label>Código Postal:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="codigoPostal" required maxLength="5" pattern='^[0-9]{5}$' value={selectedItem && selectedItem.codigoPostal}/>
          <br />
          <label>Teléfono:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="telefono" required maxLength="15" value={selectedItem && selectedItem.telefono}/>
          <br />
          <label>RFC:</label>
          <br />
          <input type="text" className="form-control" onChange={handleChange} name="rfc" required maxLength="13" pattern='^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$' value={selectedItem && selectedItem.rfc}/>
          <br />
          <label>Estatus:</label>
          <br />
          <select className="form-control" onChange={handleChange} name="estatus" value={selectedItem && selectedItem.estatus}>
            <option value={1}>Enviado</option>
            <option value={2}>Autorizado</option>
            <option value={3}>Rechazado</option>
          </select>
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

      <Modal isOpen={modalInsertarDocumento}>
      <ModalHeader>Agregue un Documento</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>ID: </label>
          <br />
          <input type="text" className="form-control" onLoad={handleChangeDocumento} name="prospectoId" readOnly value={selectedItem && selectedItem.id}/>
          <br />
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" onChange={handleChangeDocumento} name="nombre" required maxLength="50"/>
          <br />
          <label>Documento:</label>
          <br />
          <input className="form-control" type="file" onChange={handleChangeDocumento} name="urlDocumento"/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>petitionPostDocumento()}>Agregar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertarDocumento()}>Cancelar</button>
      </ModalFooter>
    </Modal>



    </div>
  );
}

export default App;
