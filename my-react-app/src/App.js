import logo from './logo.svg';
import './App.css';
import Puzzle from './Puzzle';
import Circle2 from './Circle2';
import Background from './background';


function App() {
  return (
    <div className="App">
      <div className="big-background">
        <Background />
      </div>
      <div className="circle"><Circle2/></div>

      
    </div>
  );
}

export default App;
