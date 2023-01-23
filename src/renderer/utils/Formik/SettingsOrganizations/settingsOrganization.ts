import * as Yup from 'yup';

const SettingsOrganizationSchema = Yup.object().shape({
  name: Yup.string().required('Nome não pode ficar em branco').max(52).min(1),
  description: Yup.string().max(512, 'Maximo de caracteres 512'),
});

const SettingsOrganizationInitialValues = {
  name: '',
  description: '',
};

export default {
  SettingsOrganizationSchema,
  SettingsOrganizationInitialValues,
};
