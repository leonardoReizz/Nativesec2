import * as Yup from 'yup';

const StepOneSchema = Yup.object().shape({});
const StepTwoSchema = Yup.object().shape({
  name: Yup.string().required('Nome não pode ficar em branco').max(52).min(1),
  description: Yup.string().max(512, 'Maximo de caracteres 512'),
});

const FourSchema = Yup.object().shape({
  email: Yup.string().email().max(255),
  isAdmin: Yup.boolean(),
});

export { StepOneSchema, StepTwoSchema, FourSchema };
