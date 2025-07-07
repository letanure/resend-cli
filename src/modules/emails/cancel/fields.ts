import type { CliField } from '@/types/index.js';
import { filterFieldsForCli } from '@/utils/fields.js';
import { commonEmailFields } from '../shared/fields.js';

// Fields used for cancel command (only id needed)
const cancelFieldNames = ['id'];

export const fields: Array<CliField> = filterFieldsForCli(cancelFieldNames, commonEmailFields);
