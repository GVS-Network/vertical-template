import { scopedForTenant } from '../../db/scoped';
import { FormDefinition } from './schemas/form-definition';

export async function seedIntakeForms(tenantId: string): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const forms = scopedForTenant(FormDefinition, tenantId);
  const count = await forms.countDocuments();
  if (count > 0) {
    return;
  }

  await forms.create({
    slug: 'contact',
    title: 'Contact us',
    submitButtonLabel: 'Send message',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'message', type: 'textarea', required: true },
    ],
  });

  console.log('[intake:seed] inserted contact form');
}
