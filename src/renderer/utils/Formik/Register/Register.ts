import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Nome não pode ficar em branco')
    .max(112, 'Nome Inválido')
    .min(10, 'Nome Inválido'),
  email: Yup.string()
    .email('Email Inválido')
    .required('Email não pode ficar em branco')
    .max(112, 'Email Inválido')
    .min(10, 'Email Inválido'),
  safetyPhrase: Yup.string()
    .required('Frase de segurança não pode ficar em branco.')
    .min(12, 'Frase de segurança Inválida.')
    .max(32),
  confirmSafetyPhrase: Yup.string()
    .required('Frase de segurança não pode ficar em branco.')
    .min(12, 'Frase de segurança Inválida.')
    .max(32),
});

const RegisterInitialValues = {
  fullName: '',
  email: '',
  safetyPhrase: '',
  confirmSafetyPhrase: '',
};

export { RegisterSchema, RegisterInitialValues };
