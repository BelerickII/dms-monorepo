export enum Department {
    COMPUTER_SCIENCE = "computer science",
    SOFTWARE_ENGINEERING = "software engineering",
    DATA_SCIENCE = "data science",
    CYBERSECURITY = "cybersecurity",
}

export enum ModeOfEntry {
    UTME = 'utme',
    TRANSFER = 'transfer',
    DIRECT_ENTRY = 'direct entry',
}

export enum userRole {
    STUDENT = 'student',
    STAFF = 'staff',
    ADMIN = 'admin',
}

export enum mailType {
  ACCOUNT_INVITATION = "account invitation",
  DOCUMENT_REJECTION = "document rejection",
  PASSWORD_RESET = "password reset"
}

export enum mailStatus {
  PENDING = "pending",
  SENDING = "sending",
  SENT = "sent",
  CANCELLED = "cancelled",
  FAILED = "failed"
}