const toast = Object.assign(jest.fn(), {
  error: jest.fn(),
  success: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  warn: jest.fn(),
  dismiss: jest.fn(),
});

const ToastContainer = () => null;

module.exports = { toast, ToastContainer };
