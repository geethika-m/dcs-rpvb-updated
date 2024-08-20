import './App.css';
import './styling/main.css';
import { AuthProvider } from './contexts/authContext';
import Paths from './components/routes/routes';

function App() {
  return (
    <AuthProvider>
      <Paths />
    </AuthProvider>   
  )
}

export default App;
