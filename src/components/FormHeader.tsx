import React from 'react';

interface FormHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onPreview: () => void;
  lastSaved: Date | null;
  saving: boolean;
  canPreview: boolean;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  onTitleChange,
  onSave,
  onPreview,
  lastSaved,
  saving,
  canPreview,
}) => (
  <div className="flex justify-between items-center mb-6">
    <input
      type="text"
      value={title}
      onChange={(e) => onTitleChange(e.target.value)}
      className="text-2xl font-bold border-none focus:outline-none"
      placeholder="Enter form title..."
    />
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {saving && <div className="loader"></div>}
        <p className="text-sm text-gray-500">
          {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="save-form bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Save Form
        </button>
        {canPreview && (
          <button
            onClick={onPreview}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Preview
          </button>
        )}
      </div>
    </div>
  </div>
);