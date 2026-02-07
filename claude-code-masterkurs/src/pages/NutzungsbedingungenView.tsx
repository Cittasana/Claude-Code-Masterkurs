import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, FileText } from 'lucide-react';

const NutzungsbedingungenView = () => {
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
            <FileText className="w-6 h-6 text-apple-accent" />
          </div>
          <h1 className="text-3xl font-bold text-apple-text">Nutzungsbedingungen</h1>
        </div>
        <p className="text-apple-muted mt-2 text-sm">
          Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Content */}
      <div className="apple-card space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">1. Geltungsbereich</h2>
          <p className="text-sm text-apple-textSecondary leading-relaxed">
            Diese Nutzungsbedingungen gelten für die Nutzung der Lernplattform
            &quot;Claude Code Masterkurs&quot; (nachfolgend &quot;Plattform&quot;). Mit der Registrierung
            und Nutzung der Plattform erklären Sie sich mit diesen Nutzungsbedingungen einverstanden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">2. Leistungsbeschreibung</h2>
          <div className="text-sm text-apple-textSecondary leading-relaxed space-y-2">
            <p>Die Plattform bietet:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Interaktive Lektionen zum Erlernen von Claude Code</li>
              <li>Quizzes und Challenges zur Wissensüberprüfung</li>
              <li>Einen Playground zum Experimentieren mit Befehlen</li>
              <li>Community-Funktionen wie Forum und Leaderboard</li>
              <li>Fortschrittsverfolgung und Zertifikate</li>
            </ul>
            <p className="mt-2">
              Die Plattform wird in der aktuellen Fassung bereitgestellt. Wir behalten uns das Recht
              vor, Funktionen jederzeit zu ändern, zu erweitern oder einzuschränken.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">3. Registrierung und Benutzerkonto</h2>
          <div className="text-sm text-apple-textSecondary leading-relaxed space-y-2">
            <p>
              Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich.
              Sie sind verpflichtet, bei der Registrierung wahrheitsgemäße Angaben zu machen.
            </p>
            <p>
              Sie sind für die Geheimhaltung Ihrer Zugangsdaten selbst verantwortlich und haften
              für alle Aktivitäten, die unter Ihrem Benutzerkonto stattfinden.
            </p>
            <p>
              Bitte informieren Sie uns unverzüglich, wenn Sie den Verdacht haben, dass Ihr Konto
              unbefugt genutzt wird.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">4. Nutzungsrechte und -pflichten</h2>
          <div className="text-sm text-apple-textSecondary leading-relaxed space-y-3">
            <div>
              <h3 className="font-medium text-apple-text mb-1">Erlaubte Nutzung</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Persönliches Lernen und Weiterbildung</li>
                <li>Teilnahme an Community-Diskussionen</li>
                <li>Nutzung des Playgrounds für Übungszwecke</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-apple-text mb-1">Untersagte Nutzung</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Verbreitung rechtswidriger, beleidigender oder diskriminierender Inhalte</li>
                <li>Automatisiertes Scraping oder Crawling der Plattform</li>
                <li>Versuch, die Sicherheit der Plattform zu umgehen</li>
                <li>Kommerzielle Weiterverwendung der Kursinhalte ohne Genehmigung</li>
                <li>Manipulation von Leaderboard-Daten oder Fortschrittsanzeigen</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">5. Geistiges Eigentum</h2>
          <p className="text-sm text-apple-textSecondary leading-relaxed">
            Alle Inhalte der Plattform (Texte, Grafiken, Code-Beispiele, Quizfragen, Lektionen)
            sind urheberrechtlich geschützt. Das Herunterladen, Kopieren oder Verbreiten von Inhalten
            ist ohne ausdrückliche Genehmigung nicht gestattet. Die Nutzung im Rahmen des persönlichen
            Lernens ist hiervon ausgenommen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">6. Community-Inhalte</h2>
          <div className="text-sm text-apple-textSecondary leading-relaxed space-y-2">
            <p>
              Für Inhalte, die Sie im Forum oder in anderen Community-Bereichen veröffentlichen,
              räumen Sie uns ein einfaches, zeitlich unbegrenztes Nutzungsrecht ein. Sie behalten
              das Urheberrecht an Ihren Beiträgen.
            </p>
            <p>
              Wir behalten uns das Recht vor, Community-Inhalte zu moderieren und Beiträge zu
              entfernen, die gegen diese Nutzungsbedingungen verstoßen.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">7. Haftungsbeschränkung</h2>
          <div className="text-sm text-apple-textSecondary leading-relaxed space-y-2">
            <p>
              Die Plattform wird &quot;wie besehen&quot; bereitgestellt. Wir übernehmen keine Garantie
              für die ständige Verfügbarkeit, Vollständigkeit oder Fehlerfreiheit der Inhalte.
            </p>
            <p>
              Die Nutzung der Plattform erfolgt auf eigenes Risiko. Für Schäden, die durch die
              Anwendung der erlernten Konzepte entstehen, übernehmen wir keine Haftung.
            </p>
            <p>
              Die Haftung für leichte Fahrlässigkeit wird ausgeschlossen, soweit nicht wesentliche
              Vertragspflichten (Kardinalpflichten) betroffen sind. Dies gilt nicht für Schäden aus
              der Verletzung des Lebens, des Körpers oder der Gesundheit.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">8. Datenschutz</h2>
          <p className="text-sm text-apple-textSecondary leading-relaxed">
            Informationen zur Verarbeitung Ihrer personenbezogenen Daten finden Sie in unserer{' '}
            <Link to="/datenschutz" className="text-apple-accent hover:underline">
              Datenschutzerklärung
            </Link>
            . Die Datenschutzerklärung ist Bestandteil dieser Nutzungsbedingungen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">9. Kündigung und Account-Löschung</h2>
          <div className="text-sm text-apple-textSecondary leading-relaxed space-y-2">
            <p>
              Sie können Ihr Benutzerkonto jederzeit über Ihre{' '}
              <Link to="/profile" className="text-apple-accent hover:underline">
                Profilseite
              </Link>{' '}
              löschen. Mit der Löschung werden alle serverseitigen Daten unwiderruflich entfernt
              (Art. 17 DSGVO &ndash; Recht auf Löschung).
            </p>
            <p>
              Lokal im Browser gespeicherte Daten (Lernfortschritt, Einstellungen) werden durch
              die Account-Löschung nicht automatisch entfernt. Diese können Sie manuell über die
              Browser-Einstellungen löschen.
            </p>
            <p>
              Wir behalten uns das Recht vor, Benutzerkonten bei Verstoß gegen diese
              Nutzungsbedingungen zu sperren oder zu löschen.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">10. Änderungen der Nutzungsbedingungen</h2>
          <p className="text-sm text-apple-textSecondary leading-relaxed">
            Wir behalten uns vor, diese Nutzungsbedingungen jederzeit zu ändern. Über wesentliche
            Änderungen werden registrierte Nutzer informiert. Die fortgesetzte Nutzung der Plattform
            nach einer Änderung gilt als Zustimmung zu den geänderten Bedingungen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">11. Schlussbestimmungen</h2>
          <div className="text-sm text-apple-textSecondary leading-relaxed space-y-2">
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
              UN-Kaufrechts.
            </p>
            <p>
              Sollten einzelne Bestimmungen dieser Nutzungsbedingungen unwirksam sein oder
              werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. An die Stelle
              der unwirksamen Bestimmung tritt eine Regelung, die dem wirtschaftlichen Zweck der
              unwirksamen Bestimmung am nächsten kommt.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">12. Kontakt</h2>
          <div className="text-apple-textSecondary space-y-1 text-sm">
            <p className="font-medium text-apple-text">Cittasana S.R.L.</p>
            <p>Vertreten durch: Cosmo Maximilian Gräf</p>
            <p>Strada Principala 69</p>
            <p>327065 Carasova, Caras-Severin, Rumänien</p>
            <p>E-Mail: <span className="text-apple-accent">office@cittasana.de</span></p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NutzungsbedingungenView;
