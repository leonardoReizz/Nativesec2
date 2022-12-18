import * as Yup from 'yup';

const TokenSchema = Yup.object().shape({
  token: Yup.string().required('Token não pode ficar em branco.').max(255),
  safetyPhrase: Yup.string()
    .required('Frase de segurança não pode ficar em branco.')
    .min(12, 'Frase de segurança Inválida.')
    .max(32),
});

const TokenInitialValues = {
  token: '',
  safetyPhrase: '',
};

export { TokenSchema, TokenInitialValues };
