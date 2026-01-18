/**
 * Input validation utilities for form security
 */

export const validators = {
  /**
   * Validate email format
   */
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  },

  /**
   * Validate French SIRET number (14 digits)
   */
  siret: (value: string): boolean => {
    const cleaned = value.replace(/\s/g, '');
    return /^\d{14}$/.test(cleaned);
  },

  /**
   * Validate French SIREN number (9 digits)
   */
  siren: (value: string): boolean => {
    const cleaned = value.replace(/\s/g, '');
    return /^\d{9}$/.test(cleaned);
  },

  /**
   * Validate phone number (French format or international)
   */
  phone: (value: string): boolean => {
    const cleaned = value.replace(/[\s.-]/g, '');
    // French phone or international format
    return /^(\+?33|0)[1-9](\d{8})$/.test(cleaned) ||
           /^\+?[\d]{10,15}$/.test(cleaned);
  },

  /**
   * Validate URL format
   */
  url: (value: string): boolean => {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * Check if value is within max length
   */
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  /**
   * Check if value contains no script tags or javascript: URLs
   */
  noScript: (value: string): boolean => {
    const lower = value.toLowerCase();
    return !/<script/i.test(lower) &&
           !/javascript:/i.test(lower) &&
           !/on\w+\s*=/i.test(lower) &&
           !/<iframe/i.test(lower) &&
           !/<object/i.test(lower) &&
           !/<embed/i.test(lower);
  },

  /**
   * Validate non-empty required field
   */
  required: (value: string): boolean => {
    return value.trim().length > 0;
  }
};

/**
 * Sanitize text input - removes potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 1000); // Max length for safety
}

/**
 * Sanitize and validate a text field
 */
export function validateTextField(
  value: string,
  fieldName: string,
  options: { required?: boolean; maxLength?: number } = {}
): string | null {
  const { required = false, maxLength = 1000 } = options;

  if (required && !validators.required(value)) {
    return `${fieldName} est requis`;
  }

  if (!validators.maxLength(value, maxLength)) {
    return `${fieldName} ne doit pas dépasser ${maxLength} caractères`;
  }

  if (!validators.noScript(value)) {
    return `${fieldName} contient des caractères non autorisés`;
  }

  return null;
}

/**
 * Validate form data object
 * Returns array of error messages, empty if valid
 */
export function validateFormData(data: Record<string, string>): string[] {
  const errors: string[] = [];

  // Validate each field based on its key
  for (const [key, value] of Object.entries(data)) {
    if (!validators.noScript(value)) {
      errors.push(`Le champ contient des caractères non autorisés`);
      break; // Stop on first dangerous content
    }
  }

  return errors;
}

/**
 * Validation error messages in French
 */
export const errorMessages = {
  email: 'Veuillez entrer une adresse email valide',
  siret: 'Le numéro SIRET doit contenir 14 chiffres',
  siren: 'Le numéro SIREN doit contenir 9 chiffres',
  phone: 'Veuillez entrer un numéro de téléphone valide',
  url: 'Veuillez entrer une URL valide (commençant par http:// ou https://)',
  required: 'Ce champ est requis',
  maxLength: (max: number) => `Ce champ ne doit pas dépasser ${max} caractères`,
  invalidContent: 'Ce champ contient des caractères non autorisés'
};
