/* eslint-disable import/no-webpack-loader-syntax */
import { AppRoutes } from 'renderer/routes';
import { ToastContainer } from 'react-toastify';
import { HashRouter } from 'react-router-dom';
import ReactModal from 'react-modal';
import '!style-loader!css-loader!sass-loader!react-toastify/dist/ReactToastify.css';
import { OrganizationsContextProvider } from './contexts/OrganizationsContext/OrganizationsContext';
import { SafeBoxesContextProvider } from './contexts/SafeBoxesContext/safeBoxesContext';
import { UserConfigContextProvider } from './contexts/UserConfigContext/UserConfigContext';

ReactModal.setAppElement('#root');
export default function App() {
  return (
    <>
      <ToastContainer />
      <HashRouter>
        <UserConfigContextProvider>
          <OrganizationsContextProvider>
            <SafeBoxesContextProvider>
              <AppRoutes />
            </SafeBoxesContextProvider>
          </OrganizationsContextProvider>
        </UserConfigContextProvider>
      </HashRouter>
    </>
  );
}
