import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import "./index.css"
import Clients from './Client/Clients';
import CreateClients from './Client/CreateClients';
import Layout from './Layout';
import Login from './Login';

import ViewPortfolio from './Portflio/ViewPortfolio';
import CreateProjets from './Projets/CreateProjets';
import Projets from './Projets/Projets';
import Register from './Register';
import CreateTaches from './Taches/CreateTaches';
import Create from './Users/Create';
import Users from './Users/Users';
import AjoutRendezvous from './Rendezvous/AjoutRendezvous';
import ModifierRendezvous from './Rendezvous/ModifierRendezvous';
import Rendezvous from './Rendezvous/Rendezvous';
import Tableauboard from './Tableauboard';
import RendezvousPasses from './Rendezvous/RendezvousPasses';
import DepensesP from './Projets/DepensesP';
import Taches from './Taches/Taches';
import EditTaches from './Taches/EditTaches';
import AllPortflios from './Portflio/AllPortflios';
import DetailsAvance from './Paiement/DetailsAvance';
import CreatePaiememnt from './Paiement/CreatePaiememnt';
import Paiement from './Paiement/Paiement';
import CreateAbonnment from './Abonnements/CreateAbonnment';
import Abonnment from './Abonnements/Abonnment';
import CreateBudget from './Budgets/CreateBudget';
import Risques from './Risques/Risques';
import CreateRisque from './Risques/CreateRisque';
import NotFoundPage from './NotFound/Notfound';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import ProjetsArchive from './Projets/ProjetsArchive';
import TaskByProject from './Taches/TaskByProject';
import Profile from './Users/Profile';
const root = createRoot(document.getElementById('root'));
const queryClient = new QueryClient()
root.render(
  <ConfigProvider theme={{
    components: {
      Input: {
        controlHeight: 40
      }, Select: {
        controlHeight: 40
      }
    }
  }}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />          <Route path="/CreateBudget/:projectId" element={<CreateBudget />} />
          <Route path="/details-avance/:projetId/:montantPaiement" element={<DetailsAvance />} />


          <Route path="/Risques" element={<Risques />} />
          <Route path="/CreateRisque/:id" element={<CreateRisque />} />


          <Route path="/CreatePaiememnt/:id" element={<CreatePaiememnt />} />
          <Route path="/Abonnment" element={<Abonnment />} />
          <Route path="/CreateAbonnment/:clientId" element={<CreateAbonnment />} />
          <Route path="/Layout" element={<Layout />} />
          <Route path="/Tableauboard" element={<Tableauboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Users" element={<Users />} />
          <Route path="/Create" element={<Create />} />
          <Route path="/projets/:idProject/taches" element={<Taches />} />
          <Route path="/CreateTaches" element={<CreateTaches />} />
          <Route path="/Taches/:idProject" element={<TaskByProject />} />
          <Route path="/Taches" element={<Taches />} />
          <Route path="/EditTaches/:id" element={<EditTaches />} />
          <Route path="/Projets" element={<Projets />} />
          <Route path="/CreateProjets/:clientId" element={<CreateProjets />} />
          <Route path="/DepensesP" element={<DepensesP />} />
          <Route path="/ProjetsArchive" element={<ProjetsArchive />} />
          <Route path="/Clients" element={<Clients />} />
          <Route path="/CreateClient" element={<CreateClients />} />
          <Route path="/fetchNotifications" element={<fetchNotifications />} />
          <Route path="/AllPortflios" element={<AllPortflios />} />
          <Route path="/RendezvousPasses" element={<RendezvousPasses />} /> {/* Ajoutez cette ligne */}
          <Route path="/Paiement" element={<Paiement />} /> {/* Ajoutez cette ligne */}
          <Route path="/ViewPortfolio/:clientId" element={<ViewPortfolio />} />
          <Route path="/fetchNotifications" element={<fetchNotifications />} />
          <Route path="/rendezvous" element={<Rendezvous />} /> {/* Ajoutez cette ligne */}
          <Route path="/ModifierRendezvous/:id" element={<ModifierRendezvous />} /> {/* Route pour la modification avec un paramètre :id */}
          <Route path="/AjoutRendezvous" element={<AjoutRendezvous />} />
          <Route path="/Profile" element={<Profile />} /> {/* Ajoutez cette ligne */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </ConfigProvider>
);