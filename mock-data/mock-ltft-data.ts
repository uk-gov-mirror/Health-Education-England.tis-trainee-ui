import { LtftDto, LtftObjNew, LtftSummaryObj } from "../models/LtftTypes";
import dayjs from "dayjs";

export const pmStartDate = dayjs().subtract(3, "year").format("YYYY-MM-DD");
export const pmEndDate = dayjs(pmStartDate).add(6, "year").format("YYYY-MM-DD");
export const wteBeforeChange = 100;
export const wte = 80;
export const startDate = dayjs().add(15, "week").format("YYYY-MM-DD"); // A late/legacy start date, within 16 weeks of today.
export const compliantStartDate = dayjs().add(16, "week").format("YYYY-MM-DD"); // The compliant date stamped onto a "No" (canGiveCompliantStartDate === false) form at submission at least 16 weeks away.
export const exceptionalRequestedDate = dayjs()
  .add(8, "week")
  .format("YYYY-MM-DD");

// Summary list
export const mockLtftDraftList: LtftSummaryObj[] = [
  {
    id: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
    name: "",
    programmeMembershipId: "a6de88b8-de41-48dd-9492-a518f5001176",
    status: "DRAFT",
    created: "2025-01-01T14:50:36.941Z",
    lastModified: "2025-01-15T15:50:36.941Z",
    formRef: "",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b407",
    status: "DRAFT",
    created: "2024-12-15T14:50:36.941Z",
    lastModified: "2024-12-15T15:50:36.941Z",
    formRef: "",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Programme hours reduction 2",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "UNSUBMITTED",
    statusReason: "changePercentage",
    statusMessage: "",
    modifiedByRole: "ADMIN",
    created: "2024-10-15T14:50:36.941Z",
    lastModified: "2024-10-15T15:50:36.941Z",
    formRef: "ltft_-1_003"
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174002",
    name: "Programme hours reduction 5",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "UNSUBMITTED",
    statusReason: "other",
    statusMessage: "Mock status message with long long long paragraph",
    modifiedByRole: "TRAINEE",
    created: "2024-08-15T14:50:36.941Z",
    lastModified: "2024-08-15T15:50:36.941Z",
    formRef: "ltft_-1_004"
  }
];
export const mockLtftsList1 = [
  {
    id: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
    name: "",
    programmeMembershipId: "a6de88b8-de41-48dd-9492-a518f5001176",
    status: "DRAFT",
    created: "2025-01-01T14:50:36.941Z",
    lastModified: "2025-01-15T15:50:36.941Z",
    formRef: "",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "Programme hours reduction 1",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b407",
    status: "APPROVED",
    created: "2024-12-15T14:50:36.941Z",
    lastModified: "2024-12-15T15:50:36.941Z",
    formRef: "ltft_-1_002",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Programme hours reduction 2",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "SUBMITTED",
    created: "2024-10-15T14:50:36.941Z",
    lastModified: "2024-10-15T15:50:36.941Z",
    formRef: "ltft_-1_003",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Programme hours reduction 3",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "SUBMITTED",
    created: "2024-09-15T14:50:36.941Z",
    lastModified: "2024-09-15T15:50:36.941Z",
    formRef: "ltft_-1_004",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Programme hours reduction 4",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "WITHDRAWN",
    created: "2024-08-15T14:50:36.941Z",
    lastModified: "2024-08-15T15:50:36.941Z",
    formRef: "ltft_-1_005",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Programme hours reduction 5",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "REJECTED",
    created: "2024-08-15T14:50:36.941Z",
    lastModified: "2024-08-15T15:50:36.941Z",
    formRef: "ltft_-1_006",
    statusReason: "Rejected Reason",
    statusMessage: "Rejected Message",
    modifiedByRole: ""
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Programme hours reduction 6",
    programmeMembershipId: "2861fb68-6c08-4af5-a3a1-6f561a37b406",
    status: "UNDER_REVIEW",
    created: "2024-08-10T14:50:36.941Z",
    lastModified: "2024-08-10T15:50:36.941Z",
    formRef: "ltft_-1_007",
    statusReason: "",
    statusMessage: "",
    modifiedByRole: ""
  }
];

// New form Obj
export const mockLtftNewFormObj: LtftObjNew = {
  declarations: {
    discussedWithTpd: true,
    informationIsCorrect: null,
    notGuaranteed: null
  },
  designatedBodyCode: "",
  managingDeanery: "",
  otherDiscussions: null,
  personalDetails: {
    title: "Mr",
    surname: "Gilliam",
    forenames: "Anthony Mara",
    telephoneNumber: "01632960363",
    mobileNumber: "08465879348",
    email: "email@email.com",
    gmcNumber: "1111111",
    gdcNumber: null,
    publicHealthNumber: null
  },
  pmEndDate: "",
  pmId: "",
  pmName: "",
  pmNumber: "",
  pmStartDate: "",
  reasonsOtherDetail: null,
  reasonsSelected: null,
  skilledWorkerVisaHolder: null,
  canGiveCompliantStartDate: null,
  startDate: null,
  altStartDate: null,
  exceptionalReasons: null,
  exceptionalReasonsDate: null,
  status: {
    current: {
      state: "DRAFT",
      detail: {
        reason: "",
        message: ""
      },
      modifiedBy: {
        name: "",
        email: "",
        role: ""
      },
      timestamp: "",
      revision: 0
    },
    history: []
  },
  supportingInformation: null,
  tpdEmail: "",
  tpdName: "",
  traineeTisId: "47165",
  type: "LTFT",
  wte: null,
  wteBeforeChange: null
};

export const mockLtftDraftUpdatedPmFormObjNoSave: LtftObjNew = {
  ...mockLtftNewFormObj,
  managingDeanery: "East of England",
  pmEndDate: "2028-01-01",
  pmId: "7ab1aae3-83c2-4bb6-b1f3-99146e79b362",
  pmName: "Cardiology",
  pmNumber: "EOE8945",
  pmStartDate: "2025-07-01"
};

// DTO (first save payload)
export const mockLtftDraftUpdatedPmFormDtoFirstSavePayload: LtftDto = {
  traineeTisId: "47165",
  id: null,
  formRef: null,
  name: null,
  change: {
    type: "LTFT",
    startDate: null,
    altStartDate: null,
    wte: 0,
    id: null
  },
  declarations: {
    discussedWithTpd: true,
    informationIsCorrect: null,
    notGuaranteed: null
  },
  discussions: { tpdName: "", tpdEmail: "", other: [] },
  personalDetails: {
    title: "Mr",
    surname: "Gilliam",
    forenames: "Anthony Mara",
    telephoneNumber: "01632960363",
    mobileNumber: "08465879348",
    email: "email@email.com",
    gmcNumber: "1111111",
    gdcNumber: null,
    publicHealthNumber: null,
    skilledWorkerVisaHolder: null
  },
  programmeMembership: {
    id: "7ab1aae3-83c2-4bb6-b1f3-99146e79b362",
    name: "Cardiology",
    programmeNumber: "EOE8945",
    startDate: "2025-07-01",
    endDate: "2028-01-01",
    wte: 0,
    designatedBodyCode: "",
    managingDeanery: "East of England"
  },
  reasons: { selected: [], otherDetail: "", supportingInformation: null },
  exceptionalReasons: {
    exceptional: null,
    supportingInformation: null,
    startDate: null
  },
  status: {
    current: {
      state: "DRAFT",
      detail: { reason: "", message: "" },
      modifiedBy: { name: "", email: "", role: "" },
      timestamp: "",
      revision: 0
    },
    history: []
  },
  created: "",
  lastModified: ""
};

// DTO (first save response)
export const mockLtftDraftFirstSuccessSaveResponseDto: LtftDto = {
  id: "68c4d30e-bc10-4556-a9f3-7effe265f466",
  traineeTisId: "47165",
  formRef: null,
  revision: 0,
  name: null,
  personalDetails: {
    id: "47165",
    title: "Mr",
    forenames: "Anthony Mara",
    surname: "Gilliam",
    email: "email@email.com",
    telephoneNumber: "01632960363",
    mobileNumber: "08465879348",
    gmcNumber: "1111111",
    gdcNumber: null,
    skilledWorkerVisaHolder: null
  },
  programmeMembership: {
    id: "7ab1aae3-83c2-4bb6-b1f3-99146e79b362",
    name: "Cardiology",
    programmeNumber: "EOE8945",
    designatedBodyCode: "",
    managingDeanery: "East of England",
    startDate: "2025-07-01",
    endDate: "2028-01-01",
    wte: 0.0
  },
  declarations: {
    discussedWithTpd: true,
    informationIsCorrect: null,
    notGuaranteed: null
  },
  discussions: {
    tpdName: "",
    tpdEmail: "",
    other: []
  },
  change: {
    id: null,
    calculationId: null,
    type: "LTFT",
    wte: 0.0,
    startDate: null,
    endDate: null
  },
  reasons: {
    selected: [],
    otherDetail: "",
    supportingInformation: null
  },
  exceptionalReasons: {
    exceptional: null,
    supportingInformation: null,
    startDate: null
  },
  tpdEmailStatus: null,
  status: {
    current: {
      state: "DRAFT",
      detail: {
        reason: null,
        message: null
      },
      modifiedBy: {
        role: "TRAINEE"
      },
      timestamp: "2026-01-13T18:15:08.374018506Z",
      revision: 0
    },
    submitted: null,
    history: [
      {
        state: "DRAFT",
        detail: {
          reason: null,
          message: null
        },
        modifiedBy: {
          role: "TRAINEE"
        },
        timestamp: "2026-01-13T18:15:08.374018506Z",
        revision: 0
      }
    ]
  },
  created: "2026-01-13T18:15:08.376574339Z",
  lastModified: "2026-01-13T18:15:08.376574339Z"
};

// Mapped Obj after first save
export const mockLtftFormObjAfterFirstSave: LtftObjNew = {
  created: "2026-01-13T18:15:08.376574339Z",
  declarations: {
    discussedWithTpd: true,
    informationIsCorrect: null,
    notGuaranteed: null
  },
  designatedBodyCode: "",
  formRef: "",
  id: "68c4d30e-bc10-4556-a9f3-7effe265f466",
  lastModified: "2026-01-13T18:15:08.376574339Z",
  managingDeanery: "East of England",
  name: "",
  otherDiscussions: [],
  personalDetails: {
    email: "email@email.com",
    forenames: "Anthony Mara",
    gdcNumber: null,
    gmcNumber: "1111111",
    mobileNumber: "08465879348",
    publicHealthNumber: null,
    surname: "Gilliam",
    telephoneNumber: "01632960363",
    title: "Mr"
  },
  pmEndDate: "2028-01-01",
  pmId: "7ab1aae3-83c2-4bb6-b1f3-99146e79b362",
  pmName: "Cardiology",
  pmNumber: "EOE8945",
  pmStartDate: "2025-07-01",
  reasonsOtherDetail: "",
  reasonsSelected: [],
  skilledWorkerVisaHolder: null,
  canGiveCompliantStartDate: null,
  startDate: null,
  altStartDate: null,
  exceptionalReasons: null,
  exceptionalReasonsDate: null,
  status: {
    current: {
      detail: { message: null, reason: null },
      modifiedBy: { email: null, name: null, role: "TRAINEE" },
      revision: 0,
      state: "DRAFT",
      timestamp: "2026-01-13T18:15:08.374018506Z"
    },
    history: [
      {
        detail: { message: null, reason: null },
        modifiedBy: { email: null, name: null, role: "TRAINEE" },
        revision: 0,
        state: "DRAFT",
        timestamp: "2026-01-13T18:15:08.374018506Z"
      }
    ]
  },
  supportingInformation: null,
  tpdEmail: "",
  tpdName: "",
  traineeTisId: "47165",
  type: "LTFT",
  wte: null,
  wteBeforeChange: null
};

export const mockLtftSubmittedFormObj: LtftObjNew = {
  traineeTisId: "47165",
  id: "68c4d30e-bc10-4556-a9f3-7effe265f466",
  formRef: "ltft_47165_001",
  name: "my submitted ltft application",
  pmId: "7ab1aae3-83c2-4bb6-b1f3-99146e79b362",
  pmName: "Cardiology",
  pmNumber: "EOE8945",
  pmStartDate: pmStartDate,
  pmEndDate: pmEndDate,
  designatedBodyCode: "",
  managingDeanery: "East of England",
  type: "LTFT",
  canGiveCompliantStartDate: false,
  startDate: compliantStartDate,
  altStartDate: null,
  exceptionalReasons: "My exceptional reason for a late application",
  exceptionalReasonsDate: exceptionalRequestedDate,
  wteBeforeChange: wteBeforeChange,
  wte: wte,
  declarations: {
    discussedWithTpd: true,
    informationIsCorrect: true,
    notGuaranteed: true
  },
  tpdName: "my pre-approver",
  tpdEmail: "my@pre.approver",
  otherDiscussions: [
    {
      name: "other discussion name1",
      email: "other@discussion.name",
      role: "Educational Supervisor (ES)"
    }
  ],
  personalDetails: {
    title: "Mr",
    surname: "Gilliam",
    forenames: "Anthony Mara",
    telephoneNumber: "01632960363",
    mobileNumber: "08465879348",
    email: "email@email.com",
    gmcNumber: "1111111",
    gdcNumber: null,
    publicHealthNumber: null
  },
  skilledWorkerVisaHolder: false,
  reasonsSelected: ["Caring responsibilities", "Unique opportunities"],
  reasonsOtherDetail: "",
  supportingInformation: "My supporting info text.",
  status: {
    current: {
      state: "SUBMITTED",
      detail: {
        reason: null,
        message: null
      },
      modifiedBy: {
        name: null,
        email: null,
        role: "TRAINEE"
      },
      timestamp: "2026-01-14T15:45:49.952Z",
      revision: 0
    },
    history: [
      {
        state: "SUBMITTED",
        timestamp: "2026-01-14T15:45:49.952Z",
        detail: {
          reason: null,
          message: null
        },
        modifiedBy: {
          name: null,
          email: null,
          role: "TRAINEE"
        },
        revision: 0
      }
    ]
  },
  created: "2026-01-13T18:15:08.376574339Z",
  lastModified: "2026-01-14T15:48:51.988186250Z"
};

export const mockLtftUnsubmittedFormObj: LtftObjNew = {
  ...mockLtftSubmittedFormObj,
  name: "my Unsubmitted LTFT",
  status: {
    current: {
      state: "UNSUBMITTED",
      detail: {
        reason: "changePercentage",
        message: "status reason message"
      },
      modifiedBy: {
        name: "TIS Admin",
        email: "tisadmin@example.com",
        role: "ADMIN"
      },
      timestamp: "2026-01-14T15:45:49.952Z",
      revision: 1
    },
    history: []
  }
};

export const mockLtftRejectedFormObj: LtftObjNew = {
  ...mockLtftSubmittedFormObj,
  status: {
    current: {
      state: "REJECTED",
      detail: {
        reason: "Rejected reason",
        message: "Rejected message"
      },
      modifiedBy: {
        name: "Admin Name",
        email: "admin@nhs.net",
        role: "ADMIN"
      },
      timestamp: "2026-01-14T15:45:49.952Z",
      revision: 0
    },
    history: []
  }
};

export const mockLtftWithNoSubmissionHistory: LtftObjNew = {
  ...mockLtftNewFormObj,
  status: {
    current: {
      state: "DRAFT",
      detail: { reason: null, message: null },
      modifiedBy: { name: "", email: "", role: "TRAINEE" },
      timestamp: "2026-01-13T10:00:00.000Z",
      revision: 0
    },
    history: []
  }
};

export const mockLtftWithSingleSubmissionHistory: LtftObjNew = {
  ...mockLtftNewFormObj,
  status: {
    current: {
      state: "APPROVED",
      detail: { reason: null, message: null },
      modifiedBy: { name: "", email: "", role: "ADMIN" },
      timestamp: "2026-01-15T12:00:00.000Z",
      revision: 1
    },
    history: [
      {
        state: "SUBMITTED",
        detail: { reason: null, message: null },
        modifiedBy: { name: "", email: "", role: "TRAINEE" },
        timestamp: "2026-01-14T10:00:00.000Z",
        revision: 0
      }
    ]
  }
};

export const mockLtftWithMultipleSubmissionHistory: LtftObjNew = {
  ...mockLtftNewFormObj,
  status: {
    current: {
      state: "APPROVED",
      detail: { reason: null, message: null },
      modifiedBy: { name: "", email: "", role: "ADMIN" },
      timestamp: "2026-01-20T12:00:00.000Z",
      revision: 3
    },
    history: [
      {
        state: "SUBMITTED",
        detail: { reason: null, message: null },
        modifiedBy: { name: "", email: "", role: "TRAINEE" },
        timestamp: "2026-01-18T10:00:00.000Z",
        revision: 2
      },
      {
        state: "UNSUBMITTED",
        detail: { reason: null, message: null },
        modifiedBy: { name: "", email: "", role: "ADMIN" },
        timestamp: "2026-01-16T12:00:00.000Z",
        revision: 1
      },
      {
        state: "SUBMITTED",
        detail: { reason: null, message: null },
        modifiedBy: { name: "", email: "", role: "TRAINEE" },
        timestamp: "2026-01-14T10:00:00.000Z",
        revision: 0
      }
    ]
  }
};

export const mockLtftWithCurrentSubmission: LtftObjNew = {
  ...mockLtftNewFormObj,
  status: {
    current: {
      state: "SUBMITTED",
      detail: { reason: null, message: null },
      modifiedBy: { name: "", email: "", role: "TRAINEE" },
      timestamp: "2026-01-25T10:00:00.000Z",
      revision: 2
    },
    history: [
      {
        state: "UNSUBMITTED",
        detail: { reason: null, message: null },
        modifiedBy: { name: "", email: "", role: "ADMIN" },
        timestamp: "2026-01-20T12:00:00.000Z",
        revision: 1
      },
      {
        state: "SUBMITTED",
        detail: { reason: null, message: null },
        modifiedBy: { name: "", email: "", role: "TRAINEE" },
        timestamp: "2026-01-15T10:00:00.000Z",
        revision: 0
      }
    ]
  }
};
