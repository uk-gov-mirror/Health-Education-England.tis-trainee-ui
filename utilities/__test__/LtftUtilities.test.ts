import dayjs from "dayjs";
import { mockPersonalDetails } from "../../mock-data/trainee-profile";
import {
  findLatestSubmissionDate,
  hasLegacyStartDateData,
  mapLtftDtoToObj,
  mapLtftObjToDto,
  populateLtftDraftNew,
  resetLegacyStartDateSection,
  stampLtftStartDateOnSubmit
} from "../ltftUtilities";
import {
  mockLtftDraftFirstSuccessSaveResponseDto,
  mockLtftDraftUpdatedPmFormDtoFirstSavePayload,
  mockLtftDraftUpdatedPmFormObjNoSave,
  mockLtftFormObjAfterFirstSave,
  mockLtftNewFormObj,
  mockLtftWithCurrentSubmission,
  mockLtftWithMultipleSubmissionHistory,
  mockLtftWithNoSubmissionHistory,
  mockLtftWithSingleSubmissionHistory
} from "../../mock-data/mock-ltft-data";

describe("populateLtftDraftNew", () => {
  const personalDetails = mockPersonalDetails;
  const traineeTisId = "47165";
  it("should populate the ltft draft correctly", () => {
    const ltftDraft = populateLtftDraftNew(personalDetails, traineeTisId);

    const expectedLtftDraft = {
      ...mockLtftNewFormObj,
      personalDetails: {
        ...mockLtftNewFormObj.personalDetails,
        mobileNumber: "07465879348",
        gdcNumber: "",
        publicHealthNumber: ""
      }
    };
    expect(ltftDraft).toEqual(expectedLtftDraft);
  });
});

describe("mapLtftObjToDto", () => {
  it("should map LtftObj to DTO correctly", () => {
    const mappedDto = mapLtftObjToDto(mockLtftDraftUpdatedPmFormObjNoSave);
    expect(mappedDto).toEqual(mockLtftDraftUpdatedPmFormDtoFirstSavePayload);
    expect(mappedDto.programmeMembership).toMatchObject({
      name: "Cardiology",
      programmeNumber: "EOE8945"
    });
  });

  it("should map empty altStartDate to null", () => {
    const mappedDto = mapLtftObjToDto({
      ...mockLtftDraftUpdatedPmFormObjNoSave,
      altStartDate: ""
    });

    expect(mappedDto.change.altStartDate).toBeNull();
  });

  it("maps the No path (canGiveCompliantStartDate false) to exceptional true", () => {
    const noPath = {
      ...mockLtftDraftUpdatedPmFormObjNoSave,
      canGiveCompliantStartDate: false
    };
    expect(mapLtftObjToDto(noPath).exceptionalReasons?.exceptional).toBe(true);
  });

  it("maps the Yes path (canGiveCompliantStartDate true) to exceptional false", () => {
    const yesPath = {
      ...mockLtftDraftUpdatedPmFormObjNoSave,
      canGiveCompliantStartDate: true
    };
    expect(mapLtftObjToDto(yesPath).exceptionalReasons?.exceptional).toBe(
      false
    );
  });

  it("maps a legacy null through to exceptional null (no inversion)", () => {
    const legacy = {
      ...mockLtftDraftUpdatedPmFormObjNoSave,
      canGiveCompliantStartDate: null
    };
    expect(mapLtftObjToDto(legacy).exceptionalReasons?.exceptional).toBeNull();
  });

  it("maps the exceptional reasons text and date into the nested sub-object", () => {
    const noPath = {
      ...mockLtftDraftUpdatedPmFormObjNoSave,
      canGiveCompliantStartDate: false,
      exceptionalReasons: "Sudden disability",
      exceptionalReasonsDate: "2026-03-01"
    };
    expect(mapLtftObjToDto(noPath).exceptionalReasons).toEqual({
      exceptional: true,
      supportingInformation: "Sudden disability",
      startDate: "2026-03-01"
    });
  });
});

describe("mapDtoToLtftObj", () => {
  it("should map DTO to LtftObj correctly", () => {
    const ltftObj = mapLtftDtoToObj(mockLtftDraftFirstSuccessSaveResponseDto);
    expect(ltftObj).toEqual(mockLtftFormObjAfterFirstSave);
    expect(ltftObj).toMatchObject({
      pmName: "Cardiology",
      pmNumber: "EOE8945"
    });
  });

  it("maps exceptional true back to canGiveCompliantStartDate false (No path)", () => {
    const dto = {
      ...mockLtftDraftFirstSuccessSaveResponseDto,
      exceptionalReasons: {
        exceptional: true,
        supportingInformation: null,
        startDate: null
      }
    };
    expect(mapLtftDtoToObj(dto).canGiveCompliantStartDate).toBe(false);
  });

  it("maps exceptional false back to canGiveCompliantStartDate true (Yes path)", () => {
    const dto = {
      ...mockLtftDraftFirstSuccessSaveResponseDto,
      exceptionalReasons: {
        exceptional: false,
        supportingInformation: null,
        startDate: null
      }
    };
    expect(mapLtftDtoToObj(dto).canGiveCompliantStartDate).toBe(true);
  });

  it("maps a missing/null exceptional to canGiveCompliantStartDate null (legacy)", () => {
    expect(
      mapLtftDtoToObj(mockLtftDraftFirstSuccessSaveResponseDto)
        .canGiveCompliantStartDate
    ).toBeNull();
  });

  it("maps the nested sub-object back onto the flat FE fields", () => {
    const dto = {
      ...mockLtftDraftFirstSuccessSaveResponseDto,
      exceptionalReasons: {
        exceptional: true,
        supportingInformation: "Sudden disability",
        startDate: "2026-03-01"
      }
    };
    const ltftObj = mapLtftDtoToObj(dto);
    expect(ltftObj.exceptionalReasons).toBe("Sudden disability");
    expect(ltftObj.exceptionalReasonsDate).toBe("2026-03-01");
  });

  it("survives the BE returning a null exceptionalReasons sub-object", () => {
    const ltftObj = mapLtftDtoToObj({
      ...mockLtftDraftFirstSuccessSaveResponseDto,
      exceptionalReasons: null
    });
    expect(ltftObj.canGiveCompliantStartDate).toBeNull();
    expect(ltftObj.exceptionalReasons).toBeNull();
    expect(ltftObj.exceptionalReasonsDate).toBeNull();
  });
});

describe("hasLegacyStartDateData", () => {
  it("is true when canGiveCompliantStartDate is null and a startDate was given", () => {
    expect(
      hasLegacyStartDateData({
        ...mockLtftNewFormObj,
        startDate: "2026-01-01"
      })
    ).toBe(true);
  });

  it("is true when canGiveCompliantStartDate is null and only an altStartDate was given", () => {
    expect(
      hasLegacyStartDateData({
        ...mockLtftNewFormObj,
        altStartDate: "2026-06-01"
      })
    ).toBe(true);
  });

  it("is false for a new form that has not reached the Start date page yet", () => {
    expect(hasLegacyStartDateData(mockLtftNewFormObj)).toBe(false);
  });

  it("is false once the legacy section has been reset, so the trainee is not warned twice", () => {
    const reset = {
      ...mockLtftNewFormObj,
      startDate: null,
      altStartDate: null,
      status: {
        ...mockLtftNewFormObj.status,
        current: {
          ...mockLtftNewFormObj.status.current,
          state: "UNSUBMITTED" as const
        }
      }
    };

    expect(hasLegacyStartDateData(reset)).toBe(false);
  });

  it("is false once canGiveCompliantStartDate has been answered", () => {
    expect(
      hasLegacyStartDateData({
        ...mockLtftNewFormObj,
        canGiveCompliantStartDate: true,
        startDate: "2026-06-01"
      })
    ).toBe(false);
  });
});

describe("resetLegacyStartDateSection", () => {
  it("clears the start-date fields for a legacy DRAFT (canGiveCompliantStartDate null)", () => {
    const legacyDraft = {
      ...mockLtftNewFormObj,
      startDate: "2026-01-01",
      altStartDate: "2026-06-01",
      exceptionalReasons: "legacy reason",
      exceptionalReasonsDate: "2026-02-01"
    };

    const result = resetLegacyStartDateSection(legacyDraft);

    expect(result.startDate).toBeNull();
    expect(result.altStartDate).toBeNull();
    expect(result.exceptionalReasons).toBeNull();
    expect(result.exceptionalReasonsDate).toBeNull();
    expect(result.canGiveCompliantStartDate).toBeNull();
  });

  it("leaves the form untouched once canGiveCompliantStartDate has been answered", () => {
    const answeredDraft = {
      ...mockLtftNewFormObj,
      canGiveCompliantStartDate: true,
      startDate: "2026-06-01"
    };

    expect(resetLegacyStartDateSection(answeredDraft)).toBe(answeredDraft);
  });

  it("leaves non-DRAFT forms untouched even when canGiveCompliantStartDate is null", () => {
    const submittedLegacy = {
      ...mockLtftNewFormObj,
      altStartDate: "2026-06-01",
      status: {
        ...mockLtftNewFormObj.status,
        current: {
          ...mockLtftNewFormObj.status.current,
          state: "SUBMITTED" as const
        }
      }
    };

    expect(resetLegacyStartDateSection(submittedLegacy)).toBe(submittedLegacy);
  });
});

describe("stampLtftStartDateOnSubmit", () => {
  const compliantDate = dayjs().add(16, "week").format("YYYY-MM-DD");

  it("stamps the 16-week compliant date onto a No-path form with no startDate", () => {
    const noPath = {
      ...mockLtftNewFormObj,
      canGiveCompliantStartDate: false,
      startDate: null
    };
    const result = stampLtftStartDateOnSubmit(noPath);
    expect(result.startDate).toBe(compliantDate);
  });

  it("keeps an already-stamped startDate (re-derivation only follows a clear-on-edit)", () => {
    const previouslyStamped = dayjs().add(10, "week").format("YYYY-MM-DD");
    const noPath = {
      ...mockLtftNewFormObj,
      canGiveCompliantStartDate: false,
      startDate: previouslyStamped
    };
    const result = stampLtftStartDateOnSubmit(noPath);
    expect(result).toBe(noPath);
    expect(result.startDate).toBe(previouslyStamped);
  });

  it("leaves the Yes path untouched, where startDate is user-entered", () => {
    const yesPath = {
      ...mockLtftNewFormObj,
      canGiveCompliantStartDate: true,
      startDate: null
    };
    expect(stampLtftStartDateOnSubmit(yesPath)).toBe(yesPath);
  });

  it("leaves a legacy form (canGiveCompliantStartDate null) untouched", () => {
    const legacy = {
      ...mockLtftNewFormObj,
      canGiveCompliantStartDate: null,
      startDate: null
    };
    expect(stampLtftStartDateOnSubmit(legacy)).toBe(legacy);
  });
});

describe("findLatestSubmissionDate", () => {
  it("should return null if there is no submission history", () => {
    expect(
      findLatestSubmissionDate(mockLtftWithNoSubmissionHistory)
    ).toBeNull();
  });

  it("should return the correct date when there is a single submission in history", () => {
    expect(
      findLatestSubmissionDate(mockLtftWithSingleSubmissionHistory)
    ).toEqual("2026-01-14T10:00:00.000Z");
  });

  it("should return the latest date when there are multiple submissions in history", () => {
    expect(
      findLatestSubmissionDate(mockLtftWithMultipleSubmissionHistory)
    ).toEqual("2026-01-18T10:00:00.000Z");
  });

  it("should return the current timestamp if the current status is SUBMITTED and is latest", () => {
    expect(findLatestSubmissionDate(mockLtftWithCurrentSubmission)).toEqual(
      "2026-01-25T10:00:00.000Z"
    );
  });
});
