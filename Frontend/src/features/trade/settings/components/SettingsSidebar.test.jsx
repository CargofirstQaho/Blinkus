import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsSidebar from './SettingsSidebar';
import { renderWithProviders } from '../../../../tests/utils';

function renderSidebar(props = {}) {
  const onChange = props.onChange ?? jest.fn();
  const active   = props.active ?? 'general';
  return {
    onChange,
    ...renderWithProviders(<SettingsSidebar active={active} onChange={onChange} />),
  };
}

describe('SettingsSidebar', () => {
  describe('Rendering', () => {
    it('renders all five navigation tabs', () => {
      renderSidebar();
      expect(screen.getAllByText('General').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Account').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Privacy').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Billing').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Support').length).toBeGreaterThan(0);
    });

    it('renders a mobile horizontal tab row', () => {
      const { container } = renderSidebar();
      const mobileRow = container.querySelector('.flex.md\\:hidden');
      expect(mobileRow).toBeInTheDocument();
    });

    it('renders a desktop vertical nav', () => {
      const { container } = renderSidebar();
      const desktopNav = container.querySelector('nav.hidden.md\\:flex');
      expect(desktopNav).toBeInTheDocument();
    });

    it('renders a "Settings" label in desktop nav', () => {
      renderSidebar();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('Active tab', () => {
    it('applies accent styles to the active tab in mobile row', () => {
      const { container } = renderSidebar({ active: 'account' });
      const mobileRow = container.querySelector('.flex.md\\:hidden');
      const buttons = mobileRow.querySelectorAll('button');
      const accountBtn = Array.from(buttons).find((b) => b.textContent.includes('Account'));
      expect(accountBtn.className).toMatch(/bg-accent/);
    });

    it('active tab in desktop nav has accent text color', () => {
      const { container } = renderSidebar({ active: 'billing' });
      const desktopNav = container.querySelector('nav.hidden.md\\:flex');
      const buttons = desktopNav.querySelectorAll('button');
      const billingBtn = Array.from(buttons).find((b) => b.textContent.includes('Billing'));
      expect(billingBtn.className).toMatch(/text-accent/);
    });

    it('inactive tabs do not have accent background in mobile row', () => {
      const { container } = renderSidebar({ active: 'general' });
      const mobileRow = container.querySelector('.flex.md\\:hidden');
      const buttons = mobileRow.querySelectorAll('button');
      const privacyBtn = Array.from(buttons).find((b) => b.textContent.includes('Privacy'));
      expect(privacyBtn.className).not.toMatch(/bg-accent\s/);
    });
  });

  describe('Tab switching', () => {
    it('calls onChange with "account" when Account tab is clicked', async () => {
      const { onChange } = renderSidebar({ active: 'general' });
      const accountBtns = screen.getAllByText('Account');
      await userEvent.click(accountBtns[0]);
      expect(onChange).toHaveBeenCalledWith('account');
    });

    it('calls onChange with "billing" when Billing tab is clicked', async () => {
      const { onChange } = renderSidebar({ active: 'general' });
      const billingBtns = screen.getAllByText('Billing');
      await userEvent.click(billingBtns[0]);
      expect(onChange).toHaveBeenCalledWith('billing');
    });

    it('calls onChange with "privacy" when Privacy tab is clicked', async () => {
      const { onChange } = renderSidebar({ active: 'general' });
      const privacyBtns = screen.getAllByText('Privacy');
      await userEvent.click(privacyBtns[0]);
      expect(onChange).toHaveBeenCalledWith('privacy');
    });

    it('calls onChange with "support" when Support tab is clicked', async () => {
      const { onChange } = renderSidebar({ active: 'general' });
      const supportBtns = screen.getAllByText('Support');
      await userEvent.click(supportBtns[0]);
      expect(onChange).toHaveBeenCalledWith('support');
    });

    it('calls onChange with "general" when General tab is clicked', async () => {
      const { onChange } = renderSidebar({ active: 'account' });
      const generalBtns = screen.getAllByText('General');
      await userEvent.click(generalBtns[0]);
      expect(onChange).toHaveBeenCalledWith('general');
    });
  });

  describe('Mobile scroll behaviour', () => {
    it('mobile tab container has overflow-x-auto class', () => {
      const { container } = renderSidebar();
      const mobileRow = container.querySelector('.flex.md\\:hidden');
      expect(mobileRow.className).toMatch(/overflow-x-auto/);
    });

    it('mobile tab container has w-full class to constrain scroll within viewport', () => {
      const { container } = renderSidebar();
      const mobileRow = container.querySelector('.flex.md\\:hidden');
      expect(mobileRow.className).toMatch(/w-full/);
    });

    it('mobile tab container has overscroll-x-contain to prevent page scroll', () => {
      const { container } = renderSidebar();
      const mobileRow = container.querySelector('.flex.md\\:hidden');
      expect(mobileRow.className).toMatch(/overscroll-x-contain/);
    });

    it('tab buttons have whitespace-nowrap to stay on one line', () => {
      const { container } = renderSidebar();
      const mobileRow = container.querySelector('.flex.md\\:hidden');
      const firstBtn = mobileRow.querySelector('button');
      expect(firstBtn.className).toMatch(/whitespace-nowrap/);
    });
  });
});
