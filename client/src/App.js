import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';

const App = () => (
    <Router>
        <Routes>
            {/* <Route path="/" exact component={Join} /> */}
            {/* <Route path="/chat" component={Chat} /> */}
            <Route exact path="/" element={<Join/>}/>
            <Route exact path="/chat" element={<Chat/>}/>
        </Routes>
    </Router>
)

export default App;