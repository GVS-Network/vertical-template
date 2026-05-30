import { useState } from 'react';

import Loading from '../../../components/Loading';
import { useSiteConfig } from '../../../contexts/SiteConfigContext';
import {
  formatFieldLabel,
  formatSubmissionValue,
  markSubmissionProcessed,
  useAdminSubmissions,
} from '../hooks/useAdminSubmissions';
import type { IntakeSubmission, SubmissionProcessedFilter } from '../types';

const FILTER_OPTIONS: { value: SubmissionProcessedFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'processed', label: 'Processed' },
];

function SubmissionRow({
  submission,
  onUpdated,
}: {
  submission: IntakeSubmission;
  onUpdated: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleToggleProcessed = async () => {
    setSaving(true);
    setActionError(null);
    try {
      await markSubmissionProcessed(submission._id, !submission.processed);
      onUpdated();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const fields = Object.entries(submission.data);

  return (
    <li className="pack-list-item pack-submission">
      <div className="pack-admin-header">
        <div>
          <p className="pack-submission__title">{submission.formSlug}</p>
          <p className="pack-admin-meta">
            <span>{new Date(submission.createdAt).toLocaleString()}</span>
            <span className="pack-admin-badge">
              {submission.processed ? 'Processed' : 'New'}
            </span>
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary pack-btn-sm"
          disabled={saving}
          onClick={() => void handleToggleProcessed()}
        >
          {saving
            ? 'Saving…'
            : submission.processed
              ? 'Mark unprocessed'
              : 'Mark processed'}
        </button>
      </div>

      {fields.length > 0 && (
        <dl className="pack-submission__fields">
          {fields.map(([name, value]) => (
            <div key={name} className="pack-submission__field">
              <dt className="pack-form-label">{formatFieldLabel(name)}</dt>
              <dd className="pack-submission__value">
                {formatSubmissionValue(value)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {actionError && (
        <p className="pack-message pack-message--error">{actionError}</p>
      )}
    </li>
  );
}

function AdminSubmissionsInbox() {
  const { config } = useSiteConfig();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<SubmissionProcessedFilter>('new');
  const { submissions, meta, loading, error, reload } = useAdminSubmissions(
    page,
    filter
  );

  const handleFilterChange = (next: SubmissionProcessedFilter) => {
    setFilter(next);
    setPage(1);
  };

  if (!config.features.intake) {
    return (
      <p className="pack-subhead">Intake is disabled for this site.</p>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <section>
      <div className="pack-admin-header">
        <h2 className="pack-detail-title">Submissions</h2>
      </div>

      <div className="pack-admin-filters" role="tablist" aria-label="Filter submissions">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={filter === option.value}
            className={
              filter === option.value
                ? 'btn btn-primary pack-btn-sm'
                : 'btn btn-secondary pack-btn-sm'
            }
            onClick={() => handleFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error && <p className="pack-message pack-message--error">{error}</p>}

      {!error && submissions.length === 0 && (
        <p className="pack-subhead">No submissions in this view.</p>
      )}

      {submissions.length > 0 && (
        <ul className="pack-list">
          {submissions.map((submission) => (
            <SubmissionRow
              key={submission._id}
              submission={submission}
              onUpdated={() => void reload()}
            />
          ))}
        </ul>
      )}

      {meta.totalPages > 1 && (
        <nav className="pack-pagination" aria-label="Submissions pages">
          <button
            type="button"
            className="btn btn-secondary pack-btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </button>
          <span className="pack-pagination__label">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            type="button"
            className="btn btn-secondary pack-btn-sm"
            disabled={page >= meta.totalPages}
            onClick={() =>
              setPage((current) => Math.min(meta.totalPages, current + 1))
            }
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}

export default AdminSubmissionsInbox;
