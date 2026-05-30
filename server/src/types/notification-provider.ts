import type { IFormDefinition } from '../features/intake/schemas/form-definition';
import type { ISubmission } from '../features/intake/schemas/submission';

export type SendIntakeSubmissionParams = {
  to: string;
  siteName: string;
  form: IFormDefinition;
  submission: ISubmission;
};

/**
 * Notification seam contract (Phase 6.4). Implementations in server/src/providers/notifications/.
 */
export interface NotificationProvider {
  key: 'resend';
  sendIntakeSubmission(params: SendIntakeSubmissionParams): Promise<void>;
}
