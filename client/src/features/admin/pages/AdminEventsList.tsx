import { Link } from 'react-router-dom';

import Loading from '../../../components/Loading';
import { useSiteConfig } from '../../../contexts/SiteConfigContext';
import { useAdminEventsList } from '../hooks/useAdminEvents';
import { formatEventDateTime } from '../utils/event-datetime';

function AdminEventsList() {
  const { config } = useSiteConfig();
  const timeZone = config.locale.timezone;
  const { events, loading, error } = useAdminEventsList();

  if (loading) {
    return <Loading />;
  }

  return (
    <section>
      <div className="pack-admin-header">
        <h2 className="pack-detail-title">Events</h2>
        <Link to="/admin/events/new" className="btn btn-primary">
          New event
        </Link>
      </div>

      {error && <p className="pack-message pack-message--error">{error}</p>}

      {!error && events.length === 0 && (
        <p className="pack-subhead">No events yet. Create your first event.</p>
      )}

      {events.length > 0 && (
        <ul className="pack-list">
          {events.map((event) => (
            <li key={event._id} className="pack-list-item">
              <Link to={`/admin/events/${event.slug}`} className="pack-list-link">
                {event.title}
              </Link>
              <p className="pack-admin-meta">
                <span>{formatEventDateTime(event.eventStart, timeZone)}</span>
                {event.eventLocation && <span>{event.eventLocation}</span>}
                <span>{event.slug}</span>
                <span className="pack-admin-badge">{event.status}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AdminEventsList;
