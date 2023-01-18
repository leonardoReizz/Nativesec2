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
  currentTheme,
}: IStepProps) {
  const [messageError, setMessageError] = useState<string | undefined>(
    undefined
  );
  // const handleUploadImage = async (e: File[]) => {
  //   if (
  //     e[0].type === 'image/png' ||
  //     e[0].type === 'image/jpeg' ||
  //     e[0].type === 'image/jpg'
  //   ) {
  //     const imageSize = await browserImageSize(e[0]).then((result: any) => {
  //       return result;
  //     });
  //     if (imageSize.width > 512 || imageSize.height > 512) {
  //       setMessageError('A imagem nao pode ter mais de 512x512');
  //     } else {
  //       setMessageError(undefined);
  //       const base64 = await toBase64(e[0]);
  //       const temp = base64;
  //       setFieldValue('icon', temp);
  //     }
  //   } else {
  //     setFieldValue('icon', null);
  //     setMessageError('Formato invalido');
  //   }
  // };

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
        currentTheme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.stepTwo_dropzone}>
        <img src={values.icon ? values.icon : logoNativeSec} alt="" />

        {/* <Dropzone
          onDrop={(acceptedFiles) => {
            handleUploadImage(acceptedFiles);
          }}
        >
          {({ getRootProps, getInputProps, acceptedFiles }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <img src={uploadImage} alt="Enviar Imagem" />
              </div>
              {messageError !== undefined ? (
                <p className={styles.error_file}>{messageError}</p>
              ) : (
                <p className={styles.name_file}>{acceptedFiles[0]?.name}</p>
              )}
              {acceptedFiles.length > 0 ? (
                acceptedFiles[0].type === 'image/png' ||
                acceptedFiles[0].type === 'image/jpeg' ? (
                  <p className={styles.name_file}>{acceptedFiles[0].name}</p>
                ) : (
                  <p className={styles.error_file}>
                    Formato de imagem não suportado
                  </p>
                )
              ) : (
                ''
              )}
            </section>
          )}
        </Dropzone> */}
        <div className={styles.title}>
          <h3>Adicione uma imagem para sua organizacao</h3>
          <p>Tamanho maximo 512 x 512 </p>
          {messageError !== undefined && (
            <p className={styles.error_file}>{messageError}</p>
          )}
        </div>
        <div className={styles.buttons}>
          <div {...getRootProps()}>
            <Button text="Adicionar" Icon={<IoCameraSharp />} />
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
        theme={currentTheme}
      />
      <TextArea
        text="Descrição sobre a organização"
        style={{ height: 135 }}
        onChange={handleChange}
        name="description"
        value={values.description}
        onBlur={handleBlur}
        theme={currentTheme}
      />
      {/* {errors.name && touched.name && (
        <p className={styles.form_error}>{errors.name as string}</p>
      )} */}
    </div>
  );
}
