import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email Inválido')
    .required('Email não pode ficar em branco')
    .max(112, 'Email Inválido')
    .min(10, 'Email Inválido'),
});

const LoginInitialValues = {
  email: '',
};

export { LoginSchema, LoginInitialValues };
