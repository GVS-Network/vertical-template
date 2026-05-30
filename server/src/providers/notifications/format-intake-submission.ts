import type { IFormDefinition } from '../../features/intake/schemas/form-definition';
import type { ISubmission } from '../../features/intake/schemas/submission';
import type { SendIntakeSubmissionParams } from '../../types/notification-provider';

function formatFieldValue(raw: unknown): string {
  if (raw === undefined || raw === null) {
    return '';
  }
  if (typeof raw === 'boolean') {
    return raw ? 'Yes' : 'No';
  }
  return String(raw);
}

export function formatIntakeSubmissionEmail(
  params: SendIntakeSubmissionParams
): { subject: string; text: string } {
  const { siteName, form, submission } = params;
  const lines: string[] = [
    `New form submission for ${siteName}`,
    '',
    `Form: ${form.title} (${form.slug})`,
    `Submitted: ${submission.createdAt.toISOString()}`,
  ];

  if (submission.ip) {
    lines.push(`IP: ${submission.ip}`);
  }

  lines.push('', '---', '');

  for (const field of form.fields) {
    lines.push(`${field.name}: ${formatFieldValue(submission.data[field.name])}`);
  }

  return {
    subject: `[${siteName}] New ${form.title} submission`,
    text: lines.join('\n'),
  };
}
