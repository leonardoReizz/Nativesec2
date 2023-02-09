import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { Button } from 'renderer/components/Buttons/Button';
import {
  StepOneSchema,
  StepTwoSchema,
} from 'renderer/utils/Formik/CreateWorkspace/CreateWorkspace';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import Step from 'renderer/components/Steps/Step';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useLoading } from 'renderer/hooks/useLoading';
import { StepOne } from './StepOne';
import { StepThree } from './StepThree';
import { StepTwo } from './StepTwo';
import { IUsers } from './types';

import styles from './styles.module.sass';

const steps = [
  {
    number: 1,
    text: 'Bem Vindo',
  },
  {
    number: 2,
    text: 'Nova Organização',
  },
  {
    number: 3,
    text: 'Convidar Membros',
  },
];

export function CreateOrganization() {
  const navigate = useNavigate();
  const { theme } = useUserConfig();
  const { createOrganization } = useOrganization();
  const [step, setStep] = useState<number>(1);
  const [users, setUsers] = useState<IUsers[]>([]);
  const { loading, updateLoading } = useLoading();
  const handleNextStep = () => {
    const next = step === 3 ? 1 : step + 1;
    setStep(next);
  };

  const onSubmit = (values: any) => {
    if (step === 3) {
      updateLoading(true);
      createOrganization({
        ...values,
        theme: '',
        adminGuest: users
          .filter((user) => user.isAdmin === true)
          .map((user) => user.email),
        participantGuest: users
          .filter((user) => user.isAdmin === false)
          .map((user) => user.email),
      });
    } else {
      handleNextStep();
    }
  };

  function handleBack() {
    if (step === 1) {
      navigate('/home');
    } else {
      setStep(step - 1);
    }
  }

  return (
    <div
      className={`${styles.createWorkspace} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.steps}>
        <Step steps={steps} step={step} />
      </div>

      <div className={styles.createWorkspace_content}>
        <Formik
          initialValues={{
            name: '',
            description: '',
            icon: null,
          }}
          validationSchema={
            step === 1 ? StepOneSchema : step === 2 ? StepTwoSchema : ''
          }
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            touched,
            setFieldValue,
          }) => (
            <Form>
              <>
                {step === 1 ? (
                  <StepOne currentTheme={theme} />
                ) : step === 2 ? (
                  <StepTwo
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    theme={theme}
                  />
                ) : (
                  <StepThree setUsers={setUsers} users={users} theme={theme} />
                )}
              </>
              <div className={styles.createWorkspace_buttons}>
                <Button
                  text={
                    step === 1
                      ? 'Vamos Criar nosso Workspace'
                      : step === 2
                      ? 'Proximo'
                      : step === 3
                      ? 'Criar Workspace'
                      : ''
                  }
                  type="submit"
                  theme={theme}
                  isLoading={loading}
                  color="blue"
                />
                {step !== 1 && (
                  <div className={styles.backButton}>
                    <Button
                      text="Voltar"
                      type="button"
                      onClick={handleBack}
                      color="red"
                    />
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
