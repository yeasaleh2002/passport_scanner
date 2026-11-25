/** Shape returned by POST /api/passport/scan (and later stored in the DB). */
export interface PassportData {
  documentType: string;
  issuingCountry: string;
  surname: string;
  givenNames: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string | null;    // YYYY-MM-DD
  sex: string;                   // M | F | X
  expirationDate: string | null; // YYYY-MM-DD
  personalNumber: string;
  mrzValid: boolean;             // all check digits passed
  rawMrz: [string, string];
}
