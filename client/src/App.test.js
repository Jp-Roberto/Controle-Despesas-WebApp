import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { ExpenseProvider } from './contexts/ExpenseContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Mock do Firebase para os testes
jest.mock('./firebaseConfig', () => ({
  auth: {},
  db: {}
}));

// Mock do react-toastify
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  }
}));

// Mock do recharts
jest.mock('recharts', () => ({
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Legend: () => <div data-testid="legend" />
}));

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <FamilyProvider>
          <ExpenseProvider>
            {component}
          </ExpenseProvider>
        </FamilyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

test('renders app without crashing', () => {
  renderWithProviders(<App />);
  // O app deve renderizar sem erros
  expect(document.body).toBeInTheDocument();
});
