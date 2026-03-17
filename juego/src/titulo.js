import acertijo from './acertijo.png'

function Titulo(){
    return(
        <div>
            <h1>EL ACERTIJO</h1>
            <hr/>
            <img src={acertijo} alt="logo"></img>
        </div>
    );
}

export default Titulo;