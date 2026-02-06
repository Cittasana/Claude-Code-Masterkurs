import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Scale } from 'lucide-react';

const ImpressumView = () => {
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
            <Scale className="w-6 h-6 text-apple-accent" />
          </div>
          <h1 className="text-3xl font-bold text-apple-text">Impressum</h1>
        </div>
      </div>

      {/* Content */}
      <div className="card p-8 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">Angaben gemäß § 5 TMG</h2>
          <div className="text-apple-textSecondary space-y-1">
            <p className="font-medium text-apple-text">[Vor- und Nachname / Firmenname]</p>
            <p>[Straße und Hausnummer]</p>
            <p>[PLZ Ort]</p>
            <p>Deutschland</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">Kontakt</h2>
          <div className="text-apple-textSecondary space-y-1">
            <p>E-Mail: <span className="text-apple-accent">[deine@email.de]</span></p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <div className="text-apple-textSecondary space-y-1">
            <p className="font-medium text-apple-text">[Vor- und Nachname]</p>
            <p>[Straße und Hausnummer]</p>
            <p>[PLZ Ort]</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">Haftungsausschluss</h2>
          <div className="text-apple-textSecondary space-y-3">
            <div>
              <h3 className="font-medium text-apple-text mb-1">Haftung für Inhalte</h3>
              <p className="text-sm leading-relaxed">
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
                Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
                nach den allgemeinen Gesetzen verantwortlich.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-apple-text mb-1">Haftung für Links</h3>
              <p className="text-sm leading-relaxed">
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
                der Seiten verantwortlich.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">Urheberrecht</h2>
          <p className="text-apple-textSecondary text-sm leading-relaxed">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
            des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>

        {/* Hinweis-Banner */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-6">
          <p className="text-amber-400 text-sm font-medium">
            ⚠️ Platzhalter: Bitte ersetze alle [eckigen Klammern] mit deinen echten Angaben
            bevor du die Seite veröffentlichst.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpressumView;
