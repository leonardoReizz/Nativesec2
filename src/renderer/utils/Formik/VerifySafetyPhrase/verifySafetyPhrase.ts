import * as Yup from 'yup';

const verirySafetyPhraseSchema = Yup.object().shape({
  safetyPhrase: Yup.string()
    .required('Frase de segurança não pode ficar em branco.')
    .min(12, 'Frase de segurança Inválida.')
    .max(32),
});

const verirySafetyPhraseValues = {
  safetyPhrase: '',
};

export { verirySafetyPhraseSchema, verirySafetyPhraseValues };
