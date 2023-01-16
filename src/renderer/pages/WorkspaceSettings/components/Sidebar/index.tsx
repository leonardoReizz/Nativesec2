import { FaUserAlt } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import styles from './styles.module.sass';

export function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <header>
        {/* <img src="" alt="" /> */}
        <h2>OLA</h2>
      </header>
      <main>
        <ul>
          <li>
            <button type="button">
              <FaUserAlt /> Membros
            </button>
          </li>
          <li>
            <button type="button">
              <IoSettingsSharp />
              Configuraçoes
            </button>
          </li>
        </ul>
      </main>
    </div>
  );
}
