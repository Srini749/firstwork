import './App.css';
import { FormBuilder } from './components/FormBuilder';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FormPreview } from './components/FormPreview';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/new' />} />
          <Route path='/new' element={<FormBuilder />} />
          <Route path='/:formId/edit' element={<FormBuilder />} />
          <Route path='/:formId' element={<FormPreview />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
