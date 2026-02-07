import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Shield, Cookie } from 'lucide-react';
import { resetCookieConsent } from '../components/UI/CookieConsent';

const DatenschutzView = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-apple-muted hover:text-apple-accent transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('common.backToDashboard')}
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-apple-accent/10">
            <Shield className="w-6 h-6 text-apple-accent" />
          </div>
          <h1 className="text-3xl font-bold text-apple-text">Datenschutzerklärung</h1>
        </div>
      </div>

      {/* Content */}
      <div className="apple-card space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">1. Datenschutz auf einen Blick</h2>
          <div className="text-apple-textSecondary space-y-3">
            <div>
              <h3 className="font-medium text-apple-text mb-1">Allgemeine Hinweise</h3>
              <p className="text-sm leading-relaxed">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
                werden können.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-apple-text mb-1">Datenerfassung auf dieser Website</h3>
              <p className="text-sm leading-relaxed">
                Diese Website speichert Ihre Lernfortschritte und Einstellungen ausschließlich
                lokal in Ihrem Browser (LocalStorage). Es werden <strong className="text-apple-text">keine
                personenbezogenen Daten</strong> an einen Server übermittelt.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">2. Hosting</h2>
          <p className="text-sm text-apple-textSecondary leading-relaxed">
            Diese Website wird bei <strong className="text-apple-text">Vercel Inc.</strong> gehostet
            (440 N Barranca Ave #4133, Covina, CA 91723, USA). Wenn Sie unsere Website besuchen,
            werden Ihre Anfragen durch die Server von Vercel geleitet. Dabei können
            Server-Logdateien erstellt werden, die Ihre IP-Adresse, Browsertyp, Betriebssystem,
            Referrer-URL und Zeitpunkt des Zugriffs enthalten können.
          </p>
          <p className="text-sm text-apple-textSecondary leading-relaxed mt-2">
            Die Nutzung von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben
            ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">3. Lokale Datenspeicherung (LocalStorage)</h2>
          <div className="text-apple-textSecondary space-y-2">
            <p className="text-sm leading-relaxed">
              Diese Anwendung speichert folgende Daten ausschließlich lokal in Ihrem Browser:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Lernfortschritt (abgeschlossene Lektionen, Quizzes, Projekte)</li>
              <li>Punktestand und Streak-Zähler</li>
              <li>Spracheinstellung</li>
              <li>Forum-Beiträge (nur lokal sichtbar)</li>
              <li>Spaced-Repetition-Daten</li>
              <li>Leaderboard-Profil (Name, Emoji)</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">
              Diese Daten werden <strong className="text-apple-text">nicht an Server übertragen</strong>.
              Sie können diese Daten jederzeit löschen, indem Sie den LocalStorage Ihres Browsers leeren
              (Browserdaten löschen).
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">4. Cookies</h2>
          <p className="text-sm text-apple-textSecondary leading-relaxed">
            Diese Website verwendet <strong className="text-apple-text">keine Cookies</strong>.
            Alle Daten werden über die LocalStorage-API gespeichert, die keine Cookies setzt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">5. Externe Dienste</h2>
          <div className="text-apple-textSecondary space-y-3">
            <div>
              <h3 className="font-medium text-apple-text mb-1">Google Fonts</h3>
              <p className="text-sm leading-relaxed">
                Diese Seite nutzt Google Fonts zur einheitlichen Darstellung von Schriftarten. Beim
                Aufruf einer Seite lädt Ihr Browser die benötigten Fonts direkt von Google
                (fonts.googleapis.com / fonts.gstatic.com). Dabei wird Ihre IP-Adresse an Google
                übermittelt.
              </p>
              <p className="text-sm leading-relaxed mt-1">
                Google Fonts wird von Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043,
                USA betrieben. Weitere Informationen:&nbsp;
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-apple-accent hover:underline"
                >
                  Google Datenschutzerklärung
                </a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">6. Ihre Rechte</h2>
          <p className="text-sm text-apple-textSecondary leading-relaxed">
            Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten
            personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der
            Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
            Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich
            jederzeit an uns wenden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">7. Verantwortliche Stelle</h2>
          <div className="text-apple-textSecondary space-y-1 text-sm">
            <p className="font-medium text-apple-text">Cittasana S.R.L.</p>
            <p>Vertreten durch: Cosmo Maximilian Gräf</p>
            <p>Strada Principala 69</p>
            <p>327065 Carasova, Caras-Severin</p>
            <p>Rumänien</p>
            <p>E-Mail: <span className="text-apple-accent">office@cittasana.de</span></p>
          </div>
        </section>

        {/* Cookie-Einstellungen */}
        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">8. Cookie-Einstellungen ändern</h2>
          <p className="text-sm text-apple-textSecondary leading-relaxed mb-4">
            Sie können Ihre Cookie-Einstellungen jederzeit ändern. Klicken Sie dazu auf den
            folgenden Button, um den Cookie-Banner erneut anzuzeigen.
          </p>
          <button
            onClick={resetCookieConsent}
            className="btn-secondary inline-flex items-center gap-2 text-sm"
          >
            <Cookie className="w-4 h-4" />
            Cookie-Einstellungen zurücksetzen
          </button>
        </section>
      </div>
    </div>
  );
};

export default DatenschutzView;
