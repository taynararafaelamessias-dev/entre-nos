import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LanguageToggle } from './LanguageToggle.tsx';
import { LocaleProvider, useLocale } from './LocaleProvider.tsx';
import { LOCALE_STORAGE_KEY } from './locale.ts';

function Probe() {
  const { t } = useLocale();
  return <p data-testid="probe">{t('home.title')}</p>;
}

describe('LanguageToggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    cleanup();
  });

  it('troca PT → ES → PT, atualiza <html lang> e guarda a escolha', () => {
    render(
      <LocaleProvider>
        <LanguageToggle />
        <Probe />
      </LocaleProvider>,
    );

    expect(screen.getByRole('button', { name: 'PT' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('probe').textContent).toBe('Só vocês dois.');
    expect(document.documentElement.lang).toBe('pt-BR');

    fireEvent.click(screen.getByRole('button', { name: 'ES' }));
    expect(screen.getByRole('button', { name: 'ES' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('probe').textContent).toBe('Solo ustedes dos.');
    expect(document.documentElement.lang).toBe('es');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('es');

    fireEvent.click(screen.getByRole('button', { name: 'PT' }));
    expect(screen.getByRole('button', { name: 'PT' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('probe').textContent).toBe('Só vocês dois.');
    expect(document.documentElement.lang).toBe('pt-BR');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('pt');
  });
});
