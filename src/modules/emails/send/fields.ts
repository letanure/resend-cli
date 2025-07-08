import type { CliField } from '@/types/index.js';
import { filterFieldsForCli } from '@/utils/fields.js';
import { commonEmailFields } from '../shared/fields.js';

// Fields used for send command
const sendFieldNames = ['from', 'to', 'subject', 'bcc', 'cc', 'scheduledAt', 'replyTo', 'html', 'text'];

export const fields: Array<CliField> = filterFieldsForCli(sendFieldNames, commonEmailFields);
