
export interface ReplacedPart {
  designation: string;
  quantity: string;
}

export interface Declaration {
  date: string;
  time: string;
  oldFridge: boolean;
  newFridge: boolean;
  sn: string;
  tagNumber: string;
  fridgeTypes: {
    fv400: boolean;
    fv420: boolean;
    sdm1500: boolean;
    sdm650: boolean;
    extro: boolean;
  };
  others: string;
  branding: string;
  localisation: string;
  quartier: string;
  emplacementExact: string;
  organisation: string;
  partenaire: string;
  villeDivision: string;
  issueDescription: string;
  signatures: {
    se_wse: string;
    abdm: string;
    tas: string;
    gulfFroid: string;
  };
}

export interface RepairStatus {
  date: string;
  detectedFailure: string;
  workPerformed: string;
  replacedParts: ReplacedPart[];
  technicianInfo: string;
  auditResult: string;
  comments: string;
  approvals: {
    gerant: string;
    se: string;
    abdm: string;
    tas: string;
  };
}

export interface RepairFormData {
  clientName: string;
  pdvName: string;
  declaration: Declaration;
  repairStatus: RepairStatus;
}
