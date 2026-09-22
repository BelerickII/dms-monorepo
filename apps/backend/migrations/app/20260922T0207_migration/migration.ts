#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/abd6ea91d9db085081451075f74b7ccc4f39b6a7fa201cf7611a90a2cb9cdf74/contract';
import endContract from '../../snapshots/abd6ea91d9db085081451075f74b7ccc4f39b6a7fa201cf7611a90a2cb9cdf74/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'department',
        columns: [
          col('department', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('max_level', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'department_department_check_236ec08d',
            "\"department\" IN ('computer science', 'software engineering', 'data science', 'cybersecurity')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'document',
        columns: [
          col('comment', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('documentType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('fileName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('filePath', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lockedAt', 'date', { codecRef: { codecId: 'pg/date-temporal@1' } }),
          col('lockedBy', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('reviewDate', 'date', { codecRef: { codecId: 'pg/date-temporal@1' } }),
          col('sessionId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('staffId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('pending'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('uploadDate', 'date', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/date-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'document_status_check_19a2b525',
            "\"status\" IN ('pending', 'approved', 'rejected')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'notification',
        columns: [
          col('createdAt', 'date', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/date-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isRead', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('message', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('staffId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'registration',
        columns: [
          col('dateRegistered', 'date', { codecRef: { codecId: 'pg/date-temporal@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sessionId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('not started'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'registration_status_check_37f3e80e',
            "\"status\" IN ('not started', 'ongoing', 'completed', 'failed')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'requiredDocuments',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'requiredDocumentsMAPstudentCategories',
        columns: [
          col('reqDocsId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('stuCategoryId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['stuCategoryId', 'reqDocsId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'session',
        columns: [
          col('endDate', 'date', { codecRef: { codecId: 'pg/date-temporal@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('sessionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('startDate', 'date', { notNull: true, codecRef: { codecId: 'pg/date-temporal@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'staff',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('staffId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'student',
        columns: [
          col('academicSession', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('categoryId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('department', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('departmentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('graduated', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('level', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('matric_no', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mode_of_entry', 'text', {
            notNull: true,
            default: lit('utme'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'student_department_check_236ec08d',
            "\"department\" IN ('computer science', 'software engineering', 'data science', 'cybersecurity')",
          ),
          checkExpression(
            'student_mode_of_entry_check_b80d282f',
            "\"mode_of_entry\" IN ('utme', 'transfer', 'direct entry')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'studentCategories',
        columns: [
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'studentCategories_category_check_3836ff40',
            "\"category\" IN ('fresher', 'returning', 'finalist')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'date', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/date-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('firstName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('lastName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mustResetPassword', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('passwordRestAt', 'date', { codecRef: { codecId: 'pg/date-temporal@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('admin'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('user_role_check_c56bdbf2', "\"role\" IN ('student', 'staff', 'admin')"),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'registration',
        constraint: 'registration_studentId_key',
        columns: ['studentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'registration',
        constraint: 'registration_sessionId_key',
        columns: ['sessionId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'session',
        constraint: 'session_sessionId_key',
        columns: ['sessionId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'staff',
        constraint: 'staff_userId_key',
        columns: ['userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'student',
        constraint: 'student_matric_no_key',
        columns: ['matric_no'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'student',
        constraint: 'student_userId_key',
        columns: ['userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'document',
        index: 'document_sessionId_idx_29f415d4',
        columns: ['sessionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'document',
        index: 'document_staffId_idx_ce92c64e',
        columns: ['staffId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'document',
        index: 'document_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'notification',
        index: 'notification_staffId_idx_ce92c64e',
        columns: ['staffId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'notification',
        index: 'notification_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'requiredDocumentsMAPstudentCategories',
        index: 'requiredDocumentsMAPstudentCategories_reqDocsId_idx_3fd624fe',
        columns: ['reqDocsId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'requiredDocumentsMAPstudentCategories',
        index: 'requiredDocumentsMAPstudentCategories_stuCategoryId_id_bedf0fd7',
        columns: ['stuCategoryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'student',
        index: 'student_departmentId_idx_8e261ed8',
        columns: ['departmentId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'document',
        foreignKey: {
          name: 'document_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'student', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'document',
        foreignKey: {
          name: 'document_staffId_fkey',
          columns: ['staffId'],
          references: { schema: 'public', table: 'staff', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'document',
        foreignKey: {
          name: 'document_sessionId_fkey',
          columns: ['sessionId'],
          references: { schema: 'public', table: 'session', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'notification',
        foreignKey: {
          name: 'notification_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'student', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'notification',
        foreignKey: {
          name: 'notification_staffId_fkey',
          columns: ['staffId'],
          references: { schema: 'public', table: 'staff', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'registration',
        foreignKey: {
          name: 'registration_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'student', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'registration',
        foreignKey: {
          name: 'registration_sessionId_fkey',
          columns: ['sessionId'],
          references: { schema: 'public', table: 'session', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'requiredDocumentsMAPstudentCategories',
        foreignKey: {
          name: 'requiredDocumentsMAPstudentCategories_stuCategoryId_fkey',
          columns: ['stuCategoryId'],
          references: { schema: 'public', table: 'studentCategories', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'requiredDocumentsMAPstudentCategories',
        foreignKey: {
          name: 'requiredDocumentsMAPstudentCategories_reqDocsId_fkey',
          columns: ['reqDocsId'],
          references: { schema: 'public', table: 'requiredDocuments', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'staff',
        foreignKey: {
          name: 'staff_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'student',
        foreignKey: {
          name: 'student_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'student',
        foreignKey: {
          name: 'student_departmentId_fkey',
          columns: ['departmentId'],
          references: { schema: 'public', table: 'department', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
