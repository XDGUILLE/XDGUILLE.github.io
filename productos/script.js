async function obtenerTodos(){
    try{
        fetch('https://my-json-server.typicode.com/fedegaray/telefonos/db',{
            method: 'GET',
            header:{
                "Content-Type": "aplication/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(data =>{
            let cuerpoTabla = document.getElementById("tdlContenido");
            let salida = "";
            for(let elemento of data.dispositivos){
                salida += `
                    <tr>
                        <td>${elemento.id}</td>
                        <td>${elemento.marca}</td>
                        <td>${elemento.modelo}</td>
                        <td>${elemento.color}</td>
                        <td>${elemento.almacenamiento}</td>
                        <td>${elemento.procesador}</td>
                    </tr>
                `;
            }
            cuerpoTabla.innerHTML = salida;
        })
        .catch(error => {throw new Error('Error en la solicitud: ' + error)})
    }catch(error){
        console.error(error);
    }
}

async function consultarUno(){
    try{
        let id = document.getElementById('txtConsulta').value;
        if(id ===''){
            alert("No has ingresado ningun ID");
            return;
        }

        axios.get('https://my-json-server.typicode.com/fedegaray/telefonos/dispositivos/'+id)
        .then(respuesta =>{
            let dispositivo = respuesta.data;
            document.getElementById('consultaNombre').value = dispositivo.nombre;
            document.getElementById('consultaModelo').value = dispositivo.modelo;
            document.getElementById('consultaColor').value = dispositivo.color;
            document.getElementById('consultaAlmacenamiento').value = dispositivo.almacenamiento + 'GB';
            document.getElementById('consultaProcesador').value = dispositivo.procesador;
        })
        .catch(error => {throw new Error("Error en la solicitud: "+error)})
    }catch(error){
        console.error()
    }
}

async function agregarUno(){
    try{
        let marca = document.getElementById("inputMarca").value;
        let modelo = document.getElementById("inputModelo").value;
        let color = document.getElementById("inputColor").value;
        let almacenamiento = document.getElementById("inputAlmacenamiento").value;
        let procesador = document.getElementById("inputProcesador").value;

        fetch('https://my-json-server.typicode.com/fedegaray/telefonos/dispositivos/',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                marca: marca,
                modelo: modelo,
                color: color,
                almacenamiento: almacenamiento,
                procesador: procesador
                })
            })
            .then(respuesta => respuesta.json())
            .then(data =>{
                obtenerTodos();
                alert(`Se ha agregado un nuevo archivo:\nMarca: ${data.marca}\nModelo: ${data.modelo}\nColor: ${data.color}\nAlmacenamiento: ${data.almacenamiento}\nProcesador: ${data.procesador}`);
        })
        .catch(error => { throw new Error("Error en la solicitud: " + error)})
    } catch(error){
        console.error(error);
    }
}