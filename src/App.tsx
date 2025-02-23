import './App.css';
import { ErrorProvider } from './components/ErrorProvider';
import { FormBuilder } from './components/FormBuilder';

function App() {
  return (
    <div className="App">
      <ErrorProvider>
      <FormBuilder />
      </ErrorProvider>
    </div>
  );
}

export default App;
