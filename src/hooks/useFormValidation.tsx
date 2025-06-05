
import { useState, useCallback } from 'react';

interface ValidationRules {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const fieldRules = rules[name];
    if (!fieldRules) return null;

    if (fieldRules.required && (!value || value.toString().trim() === '')) {
      return 'Ce champ est obligatoire';
    }

    if (value && fieldRules.minLength && value.toString().length < fieldRules.minLength) {
      return `Minimum ${fieldRules.minLength} caractères requis`;
    }

    if (value && fieldRules.maxLength && value.toString().length > fieldRules.maxLength) {
      return `Maximum ${fieldRules.maxLength} caractères autorisés`;
    }

    if (value && fieldRules.pattern && !fieldRules.pattern.test(value.toString())) {
      return 'Format invalide';
    }

    if (fieldRules.custom) {
      return fieldRules.custom(value);
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((data: Record<string, any>): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, data[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError
  };
}
