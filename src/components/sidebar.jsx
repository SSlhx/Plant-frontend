import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header bloc-titre">MENU</div>
      <div className='sidebar-content'>
      <div className="sidebar-item">
        <Link to="/">
          <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="#ffffff"><path d="M160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680h120q33 0 56.5 23.5T360-600H160Zm80 360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm540 0q25 0 42.5-17.5T840-300q0-25-17.5-42.5T780-360q-25 0-42.5 17.5T720-300q0 25 17.5 42.5T780-240Zm-540-60q-25 0-42.5-17.5T180-360q0-25 17.5-42.5T240-420q25 0 42.5 17.5T300-360q0 25-17.5 42.5T240-300Zm560-139q26 5 43 13.5t37 27.5v-242q0-33-23.5-56.5T800-720H548l-42-44 56-56-28-28-142 142 30 28 56-56 42 42v92q0 33-23.5 56.5T440-520h-81q23 17 37 35t28 45h16q66 0 113-47t47-113v-40h200v201ZM641-320q6-27 14.5-43.5T682-400H436q4 23 4 40t-4 40h205Zm139 160q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-540 0q-83 0-141.5-58.5T40-360q0-83 58.5-141.5T240-560q83 0 141.5 58.5T440-360q0 83-58.5 141.5T240-160Zm393-360Z"/></svg>
        </Link>
      </div>
        <h3 className='sidebar-title'>Parcelle</h3>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-item">
          <Link to="/ListePlante">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19 23H7C4.27504 23 2 20.7055 2 18V6C2 3.23858 4.23858 1 7 1H19C20.6569 1 22 2.34315 22 4V20C22 21.6569 20.6569 23 19 23ZM7 3C5.34315 3 4 4.34315 4 6V14.9996C4.83566 14.3719 5.87439 14 7 14H19C19.3506 14 19.6872 14.0602 20 14.1707V4C20 3.44772 19.5523 3 19 3H18V9C18 9.3688 17.797 9.70765 17.4719 9.88167C17.1467 10.0557 16.7522 10.0366 16.4453 9.83205L14 8.20185L11.5547 9.83205C11.2478 10.0366 10.8533 10.0557 10.5281 9.88167C10.203 9.70765 10 9.3688 10 9V3H7ZM12 3H16V7.13148L14.5547 6.16795C14.2188 5.94402 13.7812 5.94402 13.4453 6.16795L12 7.13148V3ZM19 16C19.5523 16 20 16.4477 20 17V20C20 20.5523 19.5523 21 19 21H7C5.5135 21 4.04148 19.9162 4.04148 18.5C4.04148 17.0532 5.5135 16 7 16H19Z" fill="#ffffff"></path> </g></svg>
          </Link>
        </div>
        <h3 className='sidebar-title'>Plante</h3>      
      </div>
      <div className="sidebar-content">
        <div className="sidebar-item">
          <Link to="/calendrier">
          <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="#ffffff"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>
          </Link>
        </div>
        <h3 className='sidebar-title'>Calendrier</h3>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-item">
          <Link to="/profile"><svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="#fff"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
          </Link>
        </div>
        <h3 className='sidebar-title'>Profile</h3>
      </div>
    </aside>
  );
};

export default Sidebar;
