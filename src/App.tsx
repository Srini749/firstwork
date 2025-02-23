import './App.css';
import { FormBuilder } from './components/FormBuilder';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormPreview } from './components/FromPreview';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<FormBuilder />} />
          <Route path='/form/:formId/edit' element={<FormBuilder />} />
          <Route path='/form/:formId' element={<FormPreview />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
