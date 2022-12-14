import { Routes, Route } from 'react-router-dom';
import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Authentification from './routes/authentification/authentification.component';

const Shop = () => {
  return (
    <div>
      <h1>shop</h1>
    </div>
  )
}

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigation/>}>
        <Route index element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/auth' element={<Authentification />} />
      </Route>
      
    </Routes>
  );
}

export default App;
