import './App.css';
import Titulo from './titulo.js';
import Juego from './juego.js';

function App() {
  return (
    <div className="App">
      <Titulo />
      <Juego limite="10"/>
    </div>
  );
}

export default App;
