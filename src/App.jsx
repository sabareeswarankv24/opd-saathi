import { Route, Routes, Link } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Layout from './components/Layout.jsx';
import { useSettings } from './lib/settings.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Slip from './pages/Slip.jsx';
import MyTurn from './pages/MyTurn.jsx';
import HaveSlip from './pages/HaveSlip.jsx';
import Find from './pages/Find.jsx';
import Emergency from './pages/Emergency.jsx';
import Settings from './pages/Settings.jsx';
import Staff from './pages/Staff.jsx';
import Counter from './pages/Counter.jsx';
import Board from './pages/Board.jsx';

function NotFound() {
  const { t } = useSettings();
  return (
    <Layout>
      <p className="card font-bold">{t('common.notFound')}</p>
      <Link to="/" className="btn mt-4 no-underline">{t('common.home')}</Link>
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/slip/:token" element={<Slip />} />
        <Route path="/turn" element={<MyTurn />} />
        <Route path="/turn/:token" element={<MyTurn />} />
        <Route path="/have" element={<HaveSlip />} />
        <Route path="/find" element={<Find />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/staff/counter" element={<Counter />} />
        <Route path="/board" element={<Board />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
