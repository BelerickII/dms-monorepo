#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/24ceae1014de5aad540246628fdf63a61c63d45d0d01ff855068fdf865b09839/contract';
import endContract from '../../snapshots/24ceae1014de5aad540246628fdf63a61c63d45d0d01ff855068fdf865b09839/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/4a9a1dc260e1975e10bf6467a8ab4d4f3790096446170d136a59f14d4a8a6eb4/contract';
import startContract from '../../snapshots/4a9a1dc260e1975e10bf6467a8ab4d4f3790096446170d136a59f14d4a8a6eb4/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'user', column: 'passwordRestAt' }),
      this.createTable({
        schema: 'public',
        table: 'emailOutbox',
        columns: [
          col('attempts', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('kind', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('lastError', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('lockedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('maxAttempts', 'int4', {
            notNull: true,
            default: lit(5),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('nextAttemptAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('payload', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sentAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('pending'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'emailOutbox_kind_check_97830f45',
            "\"kind\" IN ('account invitation', 'document rejection', 'password reset')",
          ),
          checkExpression(
            'emailOutbox_status_check_528e266f',
            "\"status\" IN ('pending', 'sending', 'sent', 'cancelled', 'failed')",
          ),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('passwordResetAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.dropNotNull({ schema: 'public', table: 'user', column: 'password' }),
      this.createIndex({
        schema: 'public',
        table: 'emailOutbox',
        index: 'emailOutbox_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'emailOutbox',
        foreignKey: {
          name: 'emailOutbox_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
