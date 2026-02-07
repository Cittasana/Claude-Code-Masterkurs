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
      <div className="apple-card space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">Angaben gemäß § 5 TMG</h2>
          <div className="text-apple-textSecondary space-y-1">
            <p className="font-medium text-apple-text">Cittasana S.R.L.</p>
            <p>Vertreten durch: Cosmo Maximilian Gräf</p>
            <p>Strada Principala 69</p>
            <p>327065 Carasova, Caras-Severin</p>
            <p>Rumänien</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">Kontakt</h2>
          <div className="text-apple-textSecondary space-y-1">
            <p>E-Mail: <span className="text-apple-accent">office@cittasana.de</span></p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-apple-text mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <div className="text-apple-textSecondary space-y-1">
            <p className="font-medium text-apple-text">Cosmo Maximilian Gräf</p>
            <p>Strada Principala 69</p>
            <p>327065 Carasova, Caras-Severin, Rumänien</p>
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
      </div>
    </div>
  );
};

export default ImpressumView;
