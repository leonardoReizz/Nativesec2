import * as Yup from 'yup';

const verifyNameSchema = Yup.object().shape({
  name: Yup.string().required('Nome não pode ficar em branco.').max(252),
  safetyPhrase: Yup.string()
    .required('Frase de segurança não pode ficar em branco.')
    .min(12, 'Frase de segurança Inválida.')
    .max(32),
});

const verifyNameValues = {
  name: '',
  safetyPhrase: '',
};

export { verifyNameSchema, verifyNameValues };
