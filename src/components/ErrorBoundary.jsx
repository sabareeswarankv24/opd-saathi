import { Component } from 'react';
import { translate } from '../i18n/index.js';

// A crash in one screen shows a calm message instead of a blank page.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    console.error('Screen error:', error);
  }
  render() {
    if (!this.state.error) return this.props.children;
    let lang = 'en';
    try {
      lang = JSON.parse(localStorage.getItem('opd.settings.v1') || '{}').lang || 'en';
    } catch {
      /* default */
    }
    const t = (k) => translate(lang, k);
    return (
      <div role="alert" style={{ padding: 20, maxWidth: 480, margin: '0 auto', fontSize: 18 }}>
        <h1 style={{ fontSize: 24 }}>{t('common.error.title')}</h1>
        <p>{t('common.error.body')}</p>
        <p style={{ fontSize: 14, opacity: 0.7 }}>{String(this.state.error && this.state.error.message)}</p>
        <button className="btn btn-primary" onClick={() => { this.setState({ error: null }); }}>
          {t('common.error.reload')}
        </button>
        <a className="btn" style={{ marginTop: 12, textDecoration: 'none' }} href="/">
          {t('common.home')}
        </a>
      </div>
    );
  }
}
