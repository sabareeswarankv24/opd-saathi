import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Icon from '../components/Icon.jsx';
import SlipCard, { slipInfo } from '../components/SlipCard.jsx';
import { Heading } from '../components/UI.jsx';
import { useSettings } from '../lib/settings.jsx';
import { normalizeToken, useHospital } from '../lib/store.js';

export default function Slip() {
  const { token: raw } = useParams();
  const token = normalizeToken(raw);
  const { t, set } = useSettings();
  const state = useHospital();
  const nav = useNavigate();
  const info = slipInfo(state, token, t);
  const [perm, setPerm] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');

  useEffect(() => {
    if (info) set({ myToken: token });
  }, [token, !!info]); // eslint-disable-line react-hooks/exhaustive-deps

  const allow = async () => {
    if (typeof Notification === 'undefined') return;
    try {
      setPerm(await Notification.requestPermission());
    } catch {
      /* ignore */
    }
  };

  if (!info) {
    return (
      <Layout>
        <Heading>{t('slip.title')}</Heading>
        <p role="alert" className="card border-danger font-bold">{t('slip.notFound')}</p>
        <Link to="/have" className="btn mt-4 no-underline"><Icon name="ticket" /> <span>{t('home.slip')}</span></Link>
      </Layout>
    );
  }
  return (
    <Layout>
      <Heading>{t('slip.title')}</Heading>
      <SlipCard info={info} />
      <div className="no-print mt-5 grid gap-3">
        <button type="button" className="btn btn-primary" onClick={() => nav(`/turn/${token}`)}>
          <Icon name="clock" /> <span>{t('slip.myTurn')}</span>
        </button>
        <Link to={`/find?to=${info.roomId}&from=entrance`} className="btn no-underline">
          <Icon name="pin" /> <span>{t('slip.walk')}</span>
        </Link>
        {perm === 'default' ? (
          <button type="button" className="btn" onClick={allow}>
            <Icon name="bell" /> <span>{t('slip.alerts')}</span>
          </button>
        ) : null}
        {perm === 'granted' ? <p className="flex items-center gap-2 font-bold"><Icon name="check" /> {t('slip.alerts.ok')}</p> : null}
        {perm === 'denied' ? <p className="text-muted">{t('slip.alerts.no')}</p> : null}
      </div>
    </Layout>
  );
}
