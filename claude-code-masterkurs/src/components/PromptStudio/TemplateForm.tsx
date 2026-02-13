import type { TemplateField } from '../../types/promptStudio';

interface TemplateFormProps {
  fields: TemplateField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const TemplateForm = ({ fields, values, onChange }: TemplateFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium mb-1.5 text-apple-text">
            {field.label}
          </label>
          {field.type === 'select' && field.options ? (
            <select
              value={values[field.key] || field.options[0]}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="w-full px-3 py-2.5 bg-apple-bg border border-apple-border rounded-apple text-apple-text text-sm font-mono outline-none focus:border-apple-accent/50 transition-colors"
            >
              {field.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              value={values[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              className="w-full px-3 py-2.5 bg-apple-bg border border-apple-border rounded-apple text-apple-text text-sm font-mono resize-y outline-none focus:border-apple-accent/50 transition-colors placeholder:text-apple-muted/50 leading-relaxed"
            />
          ) : (
            <input
              type="text"
              value={values[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2.5 bg-apple-bg border border-apple-border rounded-apple text-apple-text text-sm font-mono outline-none focus:border-apple-accent/50 transition-colors placeholder:text-apple-muted/50"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TemplateForm;
