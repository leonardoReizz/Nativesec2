/* eslint-disable react/jsx-props-no-spreading */
import { CloudArrowUp } from 'phosphor-react';
import { Buffer } from 'buffer';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { useAuth } from 'renderer/hooks/useAuth/useAuth';
import { toastOptions } from 'renderer/utils/options/Toastify';
import styles from './styles.module.sass';

interface SearchKeyProps {
  changeLoadingState: (state: boolean) => void;
}

export function SearchKey({ changeLoadingState }: SearchKeyProps) {
  const { ValidatePrivateKey } = useAuth();

  const readFile = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async function onDrop(acceptedFiles: File[]) {
    const result = await readFile(acceptedFiles[0]);
    const buff = Buffer.from(result as string, 'base64').toString('utf-8');
    toast.dismiss('invalidPrivateKey');
    if (
      buff.startsWith('-----BEGIN PGP PRIVATE KEY BLOCK-----') &&
      buff.includes('-----END PGP PRIVATE KEY BLOCK-----')
    ) {
      changeLoadingState(true);
      ValidatePrivateKey(buff);
    } else {
      toast.error('Chave Privada Invalida.', {
        ...toastOptions,
        toastId: 'invalidPrivateKey',
      });
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <div className={styles.searchKey}>
      <p>**Não encontramos sua chave privada</p>
      <div className={styles.box} {...getRootProps()}>
        <input {...getInputProps()} />
        <CloudArrowUp size={64} />
        <p>Insira sua chave Privada</p>
      </div>
    </div>
  );
}
