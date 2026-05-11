import { useTranslation } from 'react-i18next';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  nameKey: string;
  roleKey: string;
  quoteKey: string;
  avatar: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial1',
    nameKey: 'testimonials.name1',
    roleKey: 'testimonials.role1',
    quoteKey: 'testimonials.quote1',
    avatar: 'MK',
    rating: 5,
  },
  {
    id: 'testimonial2',
    nameKey: 'testimonials.name2',
    roleKey: 'testimonials.role2',
    quoteKey: 'testimonials.quote2',
    avatar: 'SL',
    rating: 5,
  },
  {
    id: 'testimonial3',
    nameKey: 'testimonials.name3',
    roleKey: 'testimonials.role3',
    quoteKey: 'testimonials.quote3',
    avatar: 'JW',
    rating: 5,
  },
  {
    id: 'testimonial4',
    nameKey: 'testimonials.name4',
    roleKey: 'testimonials.role4',
    quoteKey: 'testimonials.quote4',
    avatar: 'AR',
    rating: 4,
  },
];

const TestimonialSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-14 sm:py-20 border-t border-apple-border bg-apple-surface/30">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-apple-accent font-mono text-xs uppercase tracking-widest mb-3">
            {t('testimonials.sectionLabel')}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-apple-text mb-3">
            {t('testimonials.title')}
          </h2>
          <p className="text-apple-textSecondary max-w-xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { t } = useTranslation();

  return (
    <div className="apple-card relative group hover:border-apple-borderLight transition-colors">
      {/* Quote icon */}
      <Quote
        size={28}
        className="absolute top-4 right-4 text-apple-accent/10 group-hover:text-apple-accent/20 transition-colors"
      />

      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < testimonial.rating
                ? 'text-apple-accent fill-apple-accent'
                : 'text-apple-border'
            }
          />
        ))}
      </div>

      {/* Quote text */}
      <p className="text-apple-textSecondary text-sm leading-relaxed mb-4">
        &ldquo;{t(testimonial.quoteKey)}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-apple-border/50">
        <div className="w-9 h-9 rounded-full bg-apple-accent/15 flex items-center justify-center text-apple-accent text-xs font-bold font-mono">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-apple-text text-sm font-medium">
            {t(testimonial.nameKey)}
          </p>
          <p className="text-apple-muted text-xs">{t(testimonial.roleKey)}</p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialSection;
