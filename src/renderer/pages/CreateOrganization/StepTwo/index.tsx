/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from 'renderer/components/Inputs/Input';
import browserImageSize from 'browser-image-size';
import { TextArea } from 'renderer/components/TextAreas/TextArea';
import { Button } from 'renderer/components/Buttons/Button';
import { BsFillTrashFill } from 'react-icons/bs';
import { IoCameraSharp } from 'react-icons/io5';
import logoNativeSec from '../../../../../assets/logoNativesec/256.png';
import { IStepProps } from '../types';

import styles from './styles.module.sass';

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function StepTwo({
  errors,
  handleChange,
  handleBlur,
  touched,
  values,
  setFieldValue,
  theme,
}: IStepProps) {
  const [messageError, setMessageError] = useState<string | undefined>(
    undefined
  );

  async function onDrop(file: File[]) {
    if (
      file[0].type === 'image/png' ||
      file[0].type === 'image/jpeg' ||
      file[0].type === 'image/jpg'
    ) {
      const imageSize = await browserImageSize(file[0]).then((result: any) => {
        return result;
      });
      if (imageSize.width > 512 || imageSize.height > 512) {
        setMessageError('Tamanho máximo 512x512');
        setFieldValue('icon', null);
      } else {
        setMessageError(undefined);
        const base64 = await toBase64(file[0]);
        const temp = base64;
        setFieldValue('icon', temp);
      }
    } else {
      setFieldValue('icon', null);
      setMessageError('Formato invalido');
    }
  }

  function handleRemoveImage() {
    setFieldValue('icon', null);
    setMessageError('');
  }

  const { getRootProps } = useDropzone({
    onDrop,
  });

  return (
    <div
      className={`${styles.stepTwo} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.stepTwo_dropzone}>
        <img src={values.icon ? values.icon : logoNativeSec} alt="" />
        <div className={styles.title}>
          <h3>Adicione uma imagem para sua organizacao</h3>
          <p>Tamanho maximo 512 x 512 </p>
          {messageError !== undefined && (
            <p className={styles.error_file}>{messageError}</p>
          )}
        </div>
        <div className={styles.buttons}>
          <div {...getRootProps()}>
            <Button text="Adicionar" Icon={<IoCameraSharp />} theme={theme} />
          </div>

          <Button
            text="Remover"
            className={styles.red}
            Icon={<BsFillTrashFill />}
            onClick={handleRemoveImage}
          />
        </div>
      </div>

      <Input
        text="Nome da Organização"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        isValid={!(Boolean(errors.name) && touched.name)}
        theme={theme}
      />
      <TextArea
        text="Descrição sobre a organização"
        style={{ height: 135 }}
        onChange={handleChange}
        name="description"
        value={values.description}
        onBlur={handleBlur}
        theme={theme}
      />
    </div>
  );
}
