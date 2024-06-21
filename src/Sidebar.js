import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const [role, setRole] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Ajout de isSidebarOpen dans le state

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      console.log(decodedToken);
      setRole(decodedToken.role);
    }
  }, []);

  return (
    <ul className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${isSidebarOpen ? "toggled" : ""}`} id="accordionSidebar">
      <hr className="sidebar-divider" />
      <div className="sidebar-heading">
        <img src="/img/logoDevIt.png" alt="Interface" style={{ width: '100px', marginRight: '10px' }} />
      </div>

      {/* Options communes à tous les rôles */}
      <li className="nav-item">
        <Link className="nav-link collapsed" to="/Tableauboard" data-toggle="collapse" data-target="#collapseDashboard" aria-expanded="true" aria-controls="collapseDashboard">
          <i className="fas fa-fw fa-chart-bar"></i>
          <span>Dashboard</span>
        </Link>
      </li>

      {/* Admin et Chef Projet */}
      {role === 0 && (
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/Users" data-toggle="collapse" data-target="#collapseEmployees" aria-expanded="true" aria-controls="collapseEmployees">
            <i className="fas fa-fw fa-user"></i>
            <span>Utilisateurs</span>
          </Link>


        </li>
      )}

      {(role === 2 || role === 0) && (
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/Projets" data-toggle="collapse" data-target="#collapseProjects" aria-expanded="true" aria-controls="collapseProjects">
            <i className="fas fa-fw fa-cog"></i>
            <span>Projets</span>
          </Link>
          <div id="collapseProjects" className="collapse" aria-labelledby="headingProjects" data-parent="#accordionSidebar">
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/ProjetsArchive">Projets archivés</Link>
              <Link className="collapse-item" to="/Projets">Projets</Link>
            </div>
          </div>
        </li>
      )}

      {/* Ajouter le lien pour les portfolios */}
      {role === 0 && (
        <li className="nav-item">
          <Link className="nav-link" to="/AllPortflios">
            <i className="fas fa-fw fa-folder"></i>
            <span>Portfolios</span>
          </Link>
          <Link className="nav-link collapsed" to="/Paiement" data-toggle="collapse" data-target="#collapsePaiement" aria-expanded="true" aria-controls="collapsePaiement">
            <i className="fas fa-fw fa-dollar-sign"></i>
            <span>Paiement</span>
          </Link>

        </li>
      )}

      {/* Role === 1 */}
      {role === 1 && (
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/Taches" data-toggle="collapse" data-target="#collapseTasks" aria-expanded="true" aria-controls="collapseTasks">
            <i className="fas fa-fw fa-tasks"></i>
            <span>Tâches</span>
          </Link>
          <div id="collapseTasks" className="collapse" aria-labelledby="headingTasks" data-parent="#accordionSidebar"></div>
        </li>
      )}
      {role === 2 && (
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/Risques" data-toggle="collapse" data-target="#collapseTasks" aria-expanded="true" aria-controls="collapseTasks">
            <i className="fas fa-fw fa-tasks"></i>
            <span>risques</span>
          </Link>
          <div id="collapseTasks" className="collapse" aria-labelledby="headingTasks" data-parent="#accordionSidebar"></div>
        </li>
      )}
      {/* Divider */}
      <hr className="sidebar-divider d-none d-md-block" />
      {/* Additional Sidebar Items */}
      {role === 0 && (
        <li className="nav-item">
          {/* Main Title - Vacation */}
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseRequests"
            aria-expanded="true"
            aria-controls="collapseRequests"
          >
            <i className="fas fa-fw fa-suitcase"></i>
            <span>Vacation Requests</span>
          </a>

          {/* Collapsible Content - List of Vacation Requests (Visible for role === 0) */}
          <div id="collapseRequests" className="collapse" aria-labelledby="headingRequests" data-parent="#accordionSidebar">
            <div className="bg-white py-2 collapse-inner rounded">
              {/* Link to List of Vacation Requests (Visible for role === 0) */}
              <Link className="collapse-item" to="/VacationRequestlist">List of vacation requests</Link>
              <Link className="collapse-item" to="/ReviewOfVacations">Employees vacations Review</Link>
            </div>
          </div>
        </li>
      )}
      {role === 3 && (
        <>

          <li className="nav-item">
            <Link className="nav-link collapsed" to="/AjoutRendezvous" data-toggle="collapse" data-target="#collapseTasks" aria-expanded="true" aria-controls="collapseTasks">
              <i className="fas fa-fw fa-tasks"></i>
              <span>Rendez-vous</span>
            </Link>
            <div id="collapseTasks" className="collapse" aria-labelledby="headingTasks" data-parent="#accordionSidebar">
              <div className="bg-white py-2 collapse-inner rounded">
                <Link className="collapse-item" to="/Rendezvous">
                  <span>À venir</span>
                </Link>
                <Link className="collapse-item" to="/RendezvousPasses">
                  <span>Passés</span>
                </Link>
              </div>
            </div>
          </li>
        </>
      )}

      {(role === 3 || role === 0) && (
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/Clients" data-toggle="collapse" data-target="#collapseTasks" aria-expanded="true" aria-controls="collapseTasks">
            <i className="fas fa-fw fa-users"></i>
            <span>Clients</span>
          </Link>

        </li>
      )}
    </ul>
  );
}

export default Sidebar;
