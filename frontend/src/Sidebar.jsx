import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faUserGraduate,
  faChalkboardTeacher,
  faUserGroup,
  faSchool,
  faNewspaper,
  faCalendarAlt,
  faClock,
  faMoneyBill,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

/** Fixed sidebar (slides on mobile) */
export default function Sidebar({ isOpen, close }) {
  // local menu list
  const menuItems = [
    { label: 'Dashboard',  path: '/dashboard',  icon: faGauge },
    { label: 'Students',   path: '/students',   icon: faUserGraduate },
    { label: 'Teachers',   path: '/teachers',   icon: faChalkboardTeacher },
    { label: 'Guardian',   path: '/guardian',   icon: faUserGroup },
    { label: 'Classroom',  path: '/classroom',  icon: faSchool },
    { label: 'News',       path: '/news',       icon: faNewspaper },
    { label: 'Events',     path: '/events',     icon: faCalendarAlt },
    { label: 'Session',    path: '/session',    icon: faClock },
    { label: 'School Fee', path: '/school-fee', icon: faMoneyBill },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 z-30 bg-white border-r
                  flex flex-col justify-between px-6 py-8
                  transform transition-transform duration-300
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                  md:static md:translate-x-0`}
    >
      <div>
<h2></h2>

        <ul className="space-y-5">
          {menuItems.map(({ label, path, icon }) => (
            <li key={label} onClick={close}>
              <NavLink
                to={path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 text-base cursor-pointer 
                   ${isActive
                     ? 'text-orange-500 font-semibold'
                     : 'text-gray-800 hover:text-black'}`
                }
              >
                <FontAwesomeIcon icon={icon} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full mt-6">
        <FontAwesomeIcon icon={faRightFromBracket} />
        Log Out
      </button>
    </aside>
  );
}
