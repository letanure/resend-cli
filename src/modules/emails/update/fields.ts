import type { CliField } from '@/types/index.js';
import { filterFieldsForCli } from '@/utils/fields.js';
import { commonEmailFields } from '../shared/fields.js';

// Fields used for update command
const updateFieldNames = ['id', 'scheduled_at'];

export const fields: Array<CliField> = filterFieldsForCli(updateFieldNames, commonEmailFields);
