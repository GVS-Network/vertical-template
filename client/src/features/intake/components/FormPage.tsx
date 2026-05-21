import { useParams } from 'react-router-dom';
import GenericFormRenderer from './GenericFormRenderer';
import { useFormDefinition } from '../hooks/useFormDefinition';

function FormPage() {
  const { slug } = useParams<{ slug: string }>();
  const { form, loading, error, submit } = useFormDefinition(slug);

  if (loading) {
    return <p className="text-gray-600">Loading form…</p>;
  }

  if (error || !form) {
    return <p className="text-red-600">{error ?? 'Form not found'}</p>;
  }

  return (
    <GenericFormRenderer
      form={form}
      onSubmit={async (data) => {
        await submit(data);
      }}
    />
  );
}

export default FormPage;
