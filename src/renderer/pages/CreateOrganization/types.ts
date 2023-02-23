/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikErrors, FormikTouched } from 'formik';
import { ThemeType } from 'renderer/contexts/UserConfigContext/types';

export interface IStepOneProps {
  currentTheme: ThemeType;
}
export interface StepFourProps {
  theme: ThemeType;
  users: IUsers[];
  setUsers: React.Dispatch<React.SetStateAction<IUsers[]>>;
}
export interface IStepProps {
  values: any;
  errors: FormikErrors<any>;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  touched: FormikTouched<any>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  theme: ThemeType;
}

export interface ICreateWorkspaceProps {
  handleSetIsLoading: (loading: boolean) => void;
}
export interface IUsers {
  email: string;
  isAdmin: boolean;
}
export interface IStepTwo {
  name: string;
}

export interface IStepThree {
  description: string;
  mainColor: string;
  secondColor: string;
  darkMode: boolean;
}

export interface IRefreshCreateOrganization {
  organizationId: string;
}
