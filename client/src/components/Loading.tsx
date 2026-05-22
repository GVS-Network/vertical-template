function Loading() {
  return (
    <div className="shell-loading">
      <div className="shell-loading__inner">
        <div className="shell-loading__spinner" aria-hidden="true" />
        <p className="shell-loading__label">Loading…</p>
      </div>
    </div>
  );
}

export default Loading;
