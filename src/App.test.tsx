import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '@/App';

function renderApp() {
  const user = userEvent.setup();
  render(<App />);
  return user;
}

const primaryNav = () => screen.getByRole('navigation', { name: 'Primary' });
const heading = () => screen.getByRole('heading', { level: 1 });

describe('SPA navigation', () => {
  it('starts on Home', () => {
    renderApp();
    expect(heading()).toHaveTextContent(/HealthTech innovation/);
    expect(document.title).toMatch(/^Gesher Technologies/);
  });

  it('switches views from the menu without changing the URL', async () => {
    const user = renderApp();
    const urlBefore = window.location.href;

    await user.click(within(primaryNav()).getByRole('button', { name: 'About Us' }));
    expect(await screen.findByRole('heading', { level: 1, name: /bridge from Kerala/ })).toBeInTheDocument();
    expect(within(primaryNav()).getByRole('button', { name: 'About Us' })).toHaveAttribute('aria-current', 'page');

    await user.click(within(primaryNav()).getByRole('button', { name: 'Services' }));
    expect(await screen.findByRole('heading', { level: 1, name: /products and engineering services/ })).toBeInTheDocument();

    await user.click(within(primaryNav()).getByRole('button', { name: 'Contact Us' }));
    expect(await screen.findByRole('heading', { level: 1, name: /Book a demo/ })).toBeInTheDocument();

    expect(window.location.href).toBe(urlBefore);
    expect(document.title).toBe('Contact Us — Gesher Technologies');
  });

  it('opens Terms and Privacy from footer links only', async () => {
    const user = renderApp();
    expect(within(primaryNav()).queryByRole('button', { name: /Terms|Privacy/ })).not.toBeInTheDocument();

    const legal = screen.getByRole('navigation', { name: 'Legal' });
    await user.click(within(legal).getByRole('button', { name: 'Terms of Service' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Terms of Service' })).toBeInTheDocument();

    await user.click(within(legal).getByRole('button', { name: 'Privacy Policy' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument();
  });

  it('shows the app version in the footer', () => {
    renderApp();
    expect(screen.getByTitle('Website version')).toHaveTextContent(/^v\d+\.\d+\.\d+/);
  });
});

describe('Services', () => {
  it('opens the chosen product from a Home card and swaps panels with the switcher', async () => {
    const user = renderApp();

    await user.click(screen.getByRole('button', { name: /One-Touch-Service/ }));
    const tabs = await screen.findByRole('tablist', { name: 'Products and services' });
    expect(within(tabs).getByRole('tab', { name: /One-Touch-Service/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 2, name: /Find verified workers/ })).toBeInTheDocument();

    await user.click(within(tabs).getByRole('tab', { name: /Gesher Trade/ }));
    expect(await screen.findByRole('heading', { level: 2, name: /Buy and sell locally/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: /Find verified workers/ })).not.toBeInTheDocument();
  });

  it('filters the worker directory by category', async () => {
    const user = renderApp();
    await user.click(screen.getByRole('button', { name: /One-Touch-Service/ }));
    await screen.findByRole('heading', { level: 2, name: /Find verified workers/ });

    await user.click(screen.getByRole('radio', { name: /Unskilled/ }));
    expect(screen.getByText(/Showing 4 of 10 workers/)).toBeInTheDocument();
  });
});

describe('Contact form', () => {
  async function openContact() {
    const user = renderApp();
    await user.click(within(primaryNav()).getByRole('button', { name: 'Contact Us' }));
    await screen.findByRole('heading', { level: 1, name: /Book a demo/ });
    return user;
  }

  it('marks email and company as optional', async () => {
    await openContact();
    expect(screen.getByLabelText(/Work email/)).not.toBeRequired();
    expect(screen.getByLabelText(/Company name/)).not.toBeRequired();
    expect(screen.getByLabelText(/Full name/)).toBeRequired();
    expect(screen.getByLabelText(/WhatsApp number/)).toBeRequired();
    expect(screen.getByLabelText(/How can we help/)).toBeRequired();
  });

  it('shows errors only for required fields when submitted empty', async () => {
    const user = await openContact();
    await user.click(screen.getByRole('button', { name: 'Send request' }));

    const alerts = await screen.findAllByRole('alert');
    expect(alerts.map((a) => a.id)).toEqual(['name-error', 'phone-error', 'message-error']);
    expect(screen.getByLabelText(/Full name/)).toHaveFocus();
  });

  it('submits with only name, WhatsApp number and message', async () => {
    const user = await openContact();
    await user.type(screen.getByLabelText(/Full name/), 'Anita Mathew');
    await user.type(screen.getByLabelText(/WhatsApp number/), '98470 12345');
    await user.type(screen.getByLabelText(/How can we help/), 'We run three centres and want recalls automated.');
    await user.click(screen.getByRole('button', { name: 'Send request' }));

    const dialog = await screen.findByRole('dialog', { name: 'Request received' }, { timeout: 3000 });
    expect(within(dialog).getByRole('button', { name: /Copy reference GT-LAB-/ })).toBeInTheDocument();
  });

  it('preselects the lab demo inquiry from the header button', async () => {
    const user = renderApp();
    await user.click(screen.getAllByRole('button', { name: /Book Lab Demo|Lab Demo/ })[0]!);
    await screen.findByRole('heading', { level: 1, name: /Book a demo/ });
    expect(screen.getByRole('radio', { name: /Schedule Healthcare Lab Demo/ })).toHaveAttribute('aria-checked', 'true');
  });
});
