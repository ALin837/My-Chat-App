import HomePage from './components/home'
import Register from './components/register'
import ChatPage from './components/chat'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { Component }  from 'react';
import RequireAuth from './components/requireAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = '/' exact element={<HomePage/>}/>
        <Route path = '/register' exact element={<Register/>}/>

        <Route element = {<RequireAuth/>}>
          <Route path = '/chat' exact element={<ChatPage/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
