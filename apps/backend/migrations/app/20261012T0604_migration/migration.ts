#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/4a9a1dc260e1975e10bf6467a8ab4d4f3790096446170d136a59f14d4a8a6eb4/contract';
import startContract from '../../snapshots/4a9a1dc260e1975e10bf6467a8ab4d4f3790096446170d136a59f14d4a8a6eb4/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/99e446fa9687d8469eda729e85d80fc2e677d6fea1c9d36e612c37398d60a467/contract';
import endContract from '../../snapshots/99e446fa9687d8469eda729e85d80fc2e677d6fea1c9d36e612c37398d60a467/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'user', column: 'passwordRestAt' }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('passwordResetAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.dropNotNull({ schema: 'public', table: 'user', column: 'password' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
