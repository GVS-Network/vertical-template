import { Link, useNavigate, useParams } from 'react-router-dom';

import Loading from '../../../components/Loading';
import AdminEventForm from '../components/AdminEventForm';
import {
  createAdminEvent,
  updateAdminEvent,
  useAdminEvent,
} from '../hooks/useAdminEvents';
import type { EventWriteInput } from '../types';

function AdminEventEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isCreate = slug === 'new';
  const { event, loading, error } = useAdminEvent(isCreate ? undefined : slug);

  if (!isCreate && loading) {
    return <Loading />;
  }

  if (!isCreate && error) {
    return (
      <section>
        <p className="pack-message pack-message--error">{error}</p>
        <Link to="/admin/events" className="link">
          Back to events
        </Link>
      </section>
    );
  }

  const handleSubmit = async (input: EventWriteInput) => {
    if (isCreate) {
      if (!input.slug) {
        throw new Error('Slug is required');
      }
      const created = await createAdminEvent(input);
      navigate(`/admin/events/${created.slug}`, { replace: true });
      return;
    }
    if (!slug) {
      throw new Error('Missing event slug');
    }
    await updateAdminEvent(slug, input, event?.tags);
  };

  return (
    <section>
      <p className="pack-admin-back">
        <Link to="/admin/events" className="link">
          ← Events
        </Link>
      </p>
      <h2 className="pack-detail-title">
        {isCreate ? 'New event' : `Edit: ${event?.title ?? slug}`}
      </h2>
      <AdminEventForm
        mode={isCreate ? 'create' : 'edit'}
        initial={event}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

export default AdminEventEditor;
