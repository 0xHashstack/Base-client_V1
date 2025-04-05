import React from 'react';

interface ValidationErrorProps {
  error: string;
  availableText?: string;
  availableValue?: string;
  availableSymbol?: string;
}

/**
 * A reusable component for displaying validation errors in forms
 */
const ValidationError: React.FC<ValidationErrorProps> = ({
  error,
  availableText,
  availableValue,
  availableSymbol,
}) => {
  return (
    <div className='mb-2 py-2 px-3 bg-badge-error border text-badge-error rounded-md'>
      <p className='text-sm'>
        {error}
        {availableText && availableValue && (
          <span className='block text-xs mt-1'>
            {availableText}: {availableValue} {availableSymbol || ''}
          </span>
        )}
      </p>
    </div>
  );
};

export default ValidationError;
