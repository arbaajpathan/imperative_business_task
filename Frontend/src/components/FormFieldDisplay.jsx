export default function FormFieldDisplay({ field, value, onChange, onFocus }) {
    const baseClasses = 'w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white';

    const renderInput = () => {
        switch (field.types) {
            case 'date':
                return <input type="date" value={value} onChange={e => onChange(e.target.value)} onFocus={onFocus} className={baseClasses} required={field.required} />;
            case 'integer':
                return <input type="number" value={value} onChange={e => onChange(e.target.value)} onFocus={onFocus} className={baseClasses} required={field.required} />;
            case 'email':
                return <input type="email" value={value} onChange={e => onChange(e.target.value)} onFocus={onFocus} placeholder={field.placeholder} className={baseClasses} required={field.required} />;
            case 'boolean':
                return <div className="flex items-center mt-2"><input type="checkbox" checked={value === 'true'} onChange={e => onChange(String(e.target.checked))} onFocus={onFocus} className="h-5 w-5" /></div>;
            default:
                return <input type="text" value={value} onChange={e => onChange(e.target.value)} onFocus={onFocus} placeholder={field.placeholder} className={baseClasses} required={field.required} maxLength={field.max_length || undefined} />;
        }
    };

    return (
        <div className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
            <label className="block text-sm font-medium text-gray-800 mb-1">
                {field.field_header || field.field_name}
            </label>

            {renderInput()}

            <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full font-medium">
                    Page: {field.annotation.page}
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    {field.field_type}
                </span>
                {field.required && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold">
                        Required
                    </span>
                )}
            </div>
        </div>
    );
}