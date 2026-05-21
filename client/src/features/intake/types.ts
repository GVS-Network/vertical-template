export type FormFieldType =
  | 'text'
  | 'email'
  | 'textarea'
  | 'select'
  | 'checkbox';

export interface FormFieldDefinition {
  name: string;
  type: FormFieldType;
  required: boolean;
  options?: string[];
}

export interface FormDefinition {
  _id: string;
  slug: string;
  title: string;
  fields: FormFieldDefinition[];
  submitButtonLabel: string;
}

export interface FormDefinitionResponse {
  status: string;
  data: FormDefinition;
}

export interface SubmissionResponse {
  status: string;
  data: { _id: string; formSlug: string };
}
