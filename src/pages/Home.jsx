import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Icon from '../components/Icon.jsx';
import LanguagePicker from '../components/LanguagePicker.jsx';
import { Explain } from '../components/UI.jsx';
import { useSettings } from '../lib/settings.jsx';

function Big({ to, icon, title, sub, danger }) {
  return (
    <Link
      to={to}
      className={`flex min-h-[88px] items-center gap-4 rounded-2xl border-[3px] p-3 no-underline ${danger ? 'border-danger bg-danger text-ondanger' : 'border-brand bg-card text-ink'}`}
    >
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${danger ? 'bg-ondanger text-danger' : 'bg-brand text-onbrand'}`}>
        <Icon name={icon} size={34} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xl font-extrabold leading-tight">{title}</span>
        <span className="block text-base opacity-90">{sub}</span>
      </span>
      <Icon name="next" />
    </Link>
  );
}

export default function Home() {
  const { t, firstVisit, set, myToken } = useSettings();

  if (firstVisit) {
    return (
      <Layout>
        <div className="py-4 text-center">
          <Icon name="heart" size={56} className="mx-auto text-brand" />
          <h1 className="mt-2 text-3xl font-extrabold">{t('app.name')}</h1>
          <p className="mb-6 text-muted">{t('hospital.name')}</p>
          <h2 className="mb-1 text-2xl font-extrabold">Choose your language · अपनी भाषा चुनें</h2>
          <p className="mb-4 text-muted">{t('lp.sub')}</p>
          <LanguagePicker onPick={(id) => set({ lang: id })} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold">{t('home.hello')} <span aria-hidden="true">🙏</span></h1>
        <p className="text-lg text-muted">{t('app.tag')}</p>
        <p className="mt-2 text-xl font-bold">{t('home.sub')}</p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-3">
        {myToken ? <Big to={`/turn/${myToken}`} icon="ticket" title={t('home.mySlip', { token: myToken })} sub={t('home.mySlip.sub')} /> : null}
        <Big to="/register" icon="register" title={t('home.register')} sub={t('home.register.sub')} />
        <Big to="/have" icon="ticket" title={t('home.slip')} sub={t('home.slip.sub')} />
        <Big to="/find" icon="pin" title={t('home.find')} sub={t('home.find.sub')} />
        <Big to="/emergency" icon="siren" title={t('home.emergency')} sub={t('home.emergency.sub')} danger />
      </div>
      <div className="mt-5 space-y-2">
        <Explain>{t('home.opd')}</Explain>
        <Explain>{t('home.token')}</Explain>
        <p className="px-1 text-base">{t('home.help')}</p>
      </div>
      <div className="mt-4 grid gap-3">
        <Link to="/settings" className="btn no-underline"><Icon name="settings" /> <span>{t('home.settings')}</span></Link>
        <Link to="/staff" className="btn no-underline"><Icon name="users" /> <span>{t('home.staff')}</span></Link>
      </div>
    </Layout>
  );
}
