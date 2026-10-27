import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Scanner } from './pages/Scanner';
import { ARDisplay } from './pages/ARDisplay';
import { MedicineLibrary } from './pages/MedicineLibrary';
import { MedicineDetails } from './pages/MedicineDetails';
import { Reminders } from './pages/Reminders';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="scanner" element={<Scanner />} />
          <Route path="ar" element={<ARDisplay />} />
          <Route path="library" element={<MedicineLibrary />} />
          <Route path="library/:id" element={<MedicineDetails />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
