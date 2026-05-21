import { useAuth0 } from '@auth0/auth0-react';

interface LoginButtonProps {
  className?: string;
  label?: string;
}

function LoginButton({ className = 'btn-primary text-sm', label = 'Log In' }: LoginButtonProps) {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      type="button"
      onClick={() => loginWithRedirect()}
      className={className}
    >
      {label}
    </button>
  );
}

export default LoginButton;
