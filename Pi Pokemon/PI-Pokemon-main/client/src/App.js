import './App.css';
import Landing from './Components/Landing/Landing';
import { Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Route exact path='/' component={Landing}/>
    </div>
  );
}

export default App;
