import type { CliField } from '@/types/index.js';
import { filterFieldsForCli, filterFieldsForDisplay } from '@/utils/fields.js';
import { commonEmailFields, EMAIL_DETAIL_FIELDS } from '../shared/fields.js';

// Fields for CLI input (only what the user can specify)
const inputFieldNames = ['id'];

// Export input fields for CLI registration
export const fields: Array<CliField> = filterFieldsForCli(inputFieldNames, commonEmailFields);

// Export display fields for result formatting (using shared constant)
export const displayFields: Array<CliField> = filterFieldsForDisplay(EMAIL_DETAIL_FIELDS, commonEmailFields);
