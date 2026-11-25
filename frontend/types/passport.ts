export interface PassportData {
  documentType: string; issuingCountry: string; surname: string; givenNames: string;
  passportNumber: string; nationality: string; dateOfBirth: string | null; sex: string;
  expirationDate: string | null; personalNumber: string; mrzValid: boolean; rawMrz: [string, string];
}
