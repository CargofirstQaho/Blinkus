import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import VerifyOtp from './VerifyOtp';
import { createTestStore } from '../tests/utils';

jest.mock('../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() { super('session_expired'); this.name = 'SessionExpiredError'; }
  },
}));

function renderVerifyOtp({ email, sessionEmail } = {}) {
  if (sessionEmail) {
    window.sessionStorage.getItem.mockImplementation((key) =>
      key === 'blinkus_verify_email' ? sessionEmail : null
    );
  }

  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: '/verify-otp', state: email ? { email } : undefined }]}
      >
        <Routes>
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/signup" element={<div>Signup Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('VerifyOtp Page', () => {
  describe('Rendering with email', () => {
    it('renders check your email heading', () => {
      renderVerifyOtp({ email: 'user@example.com' });
      expect(screen.getByText('Check your email')).toBeInTheDocument();
    });

    it('shows the target email address', () => {
      renderVerifyOtp({ email: 'user@example.com' });
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });

    it('renders 6 OTP input boxes', () => {
      renderVerifyOtp({ email: 'user@example.com' });
      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(6);
    });

    it('renders verify email button', () => {
      renderVerifyOtp({ email: 'user@example.com' });
      expect(screen.getByRole('button', { name: /verify email/i })).toBeInTheDocument();
    });

    it('renders resend code link', () => {
      renderVerifyOtp({ email: 'user@example.com' });
      expect(screen.getByRole('button', { name: /resend/i })).toBeInTheDocument();
    });
  });

  describe('Redirect when no email', () => {
    it('redirects to /signup when no email in state or session', async () => {
      window.sessionStorage.getItem.mockReturnValue(null);
      renderVerifyOtp({});
      await waitFor(() => {
        expect(screen.getByText('Signup Page')).toBeInTheDocument();
      });
    });
  });

  describe('Session email fallback', () => {
    it('renders correctly using sessionStorage email', () => {
      renderVerifyOtp({ sessionEmail: 'stored@example.com' });
      expect(screen.getByText('stored@example.com')).toBeInTheDocument();
    });
  });
});
