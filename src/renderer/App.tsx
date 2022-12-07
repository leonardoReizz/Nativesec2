/* eslint-disable import/no-webpack-loader-syntax */
import { AppRoutes } from 'renderer/routes';
import { ToastContainer } from 'react-toastify';
import { HashRouter } from 'react-router-dom';
import '!style-loader!css-loader!sass-loader!react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
      <ToastContainer />
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </>
  );
}
