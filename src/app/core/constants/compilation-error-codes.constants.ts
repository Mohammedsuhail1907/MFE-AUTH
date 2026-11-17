
/**
 * Compilation error codes for development and build-time issues.
 * These constants categorize compilation and build failures.
 */
export const COMPILATION_ERROR_CODES = {
  TYPESCRIPT_COMPILATION_FAILED: 'COMP-001',
  ANGULAR_TEMPLATE_COMPILATION_FAILED: 'COMP-002',
  STYLESHEET_COMPILATION_FAILED: 'COMP-003',
  MODULE_RESOLUTION_FAILED: 'COMP-004',
  DEPENDENCY_RESOLUTION_FAILED: 'COMP-005',
  BUILD_FAILED: 'COMP-006'
} as const;

export type CompilationErrorCode =
  typeof COMPILATION_ERROR_CODES[keyof typeof COMPILATION_ERROR_CODES];
