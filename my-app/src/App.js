import logo from './logo.svg';
import HomePage from './components/home'
import Register from './components/register'
import Chat from './components/chat'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = '/' exact element={<HomePage/>}/>
        <Route path = '/register' exact element={<Register/>}/>
       {/*</Register><Route path = '/chat' exact element={Chat}/>*/}
      </Routes>
    </Router>
  );
}

export default App;
