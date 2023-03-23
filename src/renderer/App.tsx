/* eslint-disable import/no-webpack-loader-syntax */
import { AppRoutes } from 'renderer/routes';
import { ToastContainer } from 'react-toastify';
import { HashRouter } from 'react-router-dom';
import ReactModal from 'react-modal';
import '!style-loader!css-loader!sass-loader!react-toastify/dist/ReactToastify.css';

import { ChakraProvider } from '@chakra-ui/react';
import { OrganizationsContextProvider } from './contexts/OrganizationsContext/OrganizationsContext';
import { SafeBoxesContextProvider } from './contexts/SafeBoxesContext/safeBoxesContext';
import { UserConfigContextProvider } from './contexts/UserConfigContext/UserConfigContext';
import { LoadingContextProvider } from './contexts/LoadingContext/LoadingContext';
import { NotificationsContextProvider } from './contexts/NotificationsContext/NotificationsContext';
import { SafeBoxGroupContextProvider } from './contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import {
  CreateSafeBoxContext,
  CreateSafeBoxContextProvider,
} from './contexts/CreateSafeBox/createSafeBoxContext';

ReactModal.setAppElement('#root');
export default function App() {
  return (
    <>
      <ToastContainer />
      <ChakraProvider>
        <HashRouter>
          <LoadingContextProvider>
            <UserConfigContextProvider>
              <OrganizationsContextProvider>
                <SafeBoxesContextProvider>
                  <NotificationsContextProvider>
                    <SafeBoxGroupContextProvider>
                      <CreateSafeBoxContextProvider>
                        <AppRoutes />
                      </CreateSafeBoxContextProvider>
                    </SafeBoxGroupContextProvider>
                  </NotificationsContextProvider>
                </SafeBoxesContextProvider>
              </OrganizationsContextProvider>
            </UserConfigContextProvider>
          </LoadingContextProvider>
        </HashRouter>
      </ChakraProvider>
    </>
  );
}
