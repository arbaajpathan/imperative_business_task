import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function FieldMappingPanel({ onDrawRequest, onSaveMappings }) {
    const [mappings, setMappings] = useState([]);
    const [currentField, setCurrentField] = useState({
        field_name: '', field_header: '', field_type: 'CharField', required: false, max_length: 50,
    });

    const fieldTypes = ['CharField', 'TextField', 'DateField', 'IntegerField', 'DecimalField', 'EmailField', 'BooleanField'];

    const handleDrawRequest = () => {
        if (!currentField.field_name) {
            alert('Please enter a Field Name before drawing.');
            return;
        }

        onDrawRequest((bbox, page) => {
            const newMapping = {
                ...currentField,
                bbox: [bbox.x1, bbox.y1, bbox.x2, bbox.y2],
                page,
                metadata: { required: currentField.required, max_length: currentField.max_length },
            };
            setMappings(prev => [...prev, newMapping]);
            setCurrentField({ field_name: '', field_header: '', field_type: 'CharField', required: false, max_length: 50 });
        });
    };

    return (
        <div className="flex flex-col h-full bg-white border-l w-96">
            <div className="p-4 border-b"><h2 className="text-xl font-bold">Field Mapping</h2></div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
                <div>
                    <label className="text-sm font-semibold">Field Name</label>
                    <input type="text" placeholder="e.g., first_name" value={currentField.field_name} onChange={e => setCurrentField({ ...currentField, field_name: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-semibold">Field Header</label>
                    <input type="text" placeholder="e.g., First Name" value={currentField.field_header} onChange={e => setCurrentField({ ...currentField, field_header: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-semibold">Field Type</label>
                    <select value={currentField.field_type} onChange={e => setCurrentField({ ...currentField, field_type: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded bg-white">
                        {fieldTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2"><input id="req" type="checkbox" checked={currentField.required} onChange={e => setCurrentField({ ...currentField, required: e.target.checked })} className="h-4 w-4" /><label htmlFor="req">Required</label></div>

                <button onClick={handleDrawRequest} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <Plus size={20} /> Draw Field Area
                </button>

                <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold mb-2">Mapped Fields ({mappings.length})</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {mappings.map((m, i) => (
                            <div key={i} className="p-2 bg-gray-100 rounded border flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-medium">{m.field_name}</p>
                                    <p className="text-xs text-gray-500">Page {m.page} - {m.field_type}</p>
                                </div>
                                <button onClick={() => setMappings(mappings.filter((_, idx) => i !== idx))} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        {mappings.length === 0 && <p className="text-sm text-gray-500">Draw areas on the PDF to map fields.</p>}
                    </div>
                </div>
            </div>
            <div className="p-4 border-t">
                <button onClick={() => onSaveMappings(mappings)} disabled={mappings.length === 0} className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 font-bold">Save All Mappings ({mappings.length})</button>
            </div>
        </div>
    );
}