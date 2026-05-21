import { useAuth0 } from '@auth0/auth0-react';

interface LogoutButtonProps {
  className?: string;
  label?: string;
}

function LogoutButton({
  className = 'btn-secondary text-sm',
  label = 'Log Out',
}: LogoutButtonProps) {
  const { logout } = useAuth0();

  return (
    <button
      type="button"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className={className}
    >
      {label}
    </button>
  );
}

export default LogoutButton;
