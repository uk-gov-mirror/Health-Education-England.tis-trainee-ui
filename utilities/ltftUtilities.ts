import dayjs from "dayjs";
import { ReasonMsgObj } from "../components/common/ActionModal";
import { LtftDto, LtftObjNew } from "../models/LtftTypes";
import { PersonalDetails } from "../models/PersonalDetails";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { unsubmitLtftForm, withdrawLtftForm } from "../redux/slices/ltftSlice";
import store from "../redux/store/store";
import { ACTION_REASONS } from "./Constants";
import { computedValueGenerators, isFormDeleted } from "./FormBuilderUtilities";
import { ActionState } from "./hooks/useActionState";

export function populateLtftDraftNew(
  personalDetails: PersonalDetails,
  traineeTisId: string
): LtftObjNew {
  const draftLtftForm: LtftObjNew = {
    traineeTisId: traineeTisId,
    pmId: "",
    pmName: "",
    pmNumber: "",
    pmStartDate: "",
    pmEndDate: "",
    designatedBodyCode: "",
    managingDeanery: "",
    type: "LTFT",
    canGiveCompliantStartDate: null,
    startDate: null,
    altStartDate: null,
    exceptionalReasons: null,
    exceptionalReasonsDate: null,
    wteBeforeChange: null,
    wte: null,
    declarations: {
      discussedWithTpd: true,
      informationIsCorrect: null,
      notGuaranteed: null
    },
    tpdName: "",
    tpdEmail: "",
    otherDiscussions: null,
    personalDetails: {
      title: personalDetails?.title ?? null,
      surname: personalDetails?.surname ?? null,
      forenames: personalDetails?.forenames ?? null,
      telephoneNumber: personalDetails?.telephoneNumber ?? null,
      mobileNumber: personalDetails?.mobileNumber ?? null,
      email: personalDetails?.email ?? null,
      gmcNumber: personalDetails?.gmcNumber ?? null,
      gdcNumber: personalDetails?.gdcNumber ?? null,
      publicHealthNumber: personalDetails?.publicHealthNumber ?? null
    },
    skilledWorkerVisaHolder: null,
    reasonsSelected: null,
    reasonsOtherDetail: null,
    supportingInformation: null,
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
    }
  };
  return draftLtftForm;
}

export const mapLtftObjToDto = (ltftObj: LtftObjNew): LtftDto => {
  return {
    traineeTisId: ltftObj.traineeTisId ?? "",
    id: ltftObj.id ?? null,
    formRef: ltftObj.formRef ?? null,
    name: ltftObj.name ?? null,
    change: {
      type: "LTFT",
      startDate: ltftObj.startDate,
      altStartDate: ltftObj.altStartDate ? ltftObj.altStartDate : null,
      wte: ltftObj.wte ? ltftObj.wte / 100 : 0,
      id: null
    },
    declarations: {
      discussedWithTpd: ltftObj.declarations.discussedWithTpd ?? true,
      informationIsCorrect: ltftObj.declarations.informationIsCorrect ?? null,
      notGuaranteed: ltftObj.declarations.notGuaranteed ?? null
    },
    discussions: {
      tpdName: ltftObj.tpdName,
      tpdEmail: ltftObj.tpdEmail,
      other:
        ltftObj.otherDiscussions?.map(discussion => ({
          name: discussion?.name ?? "",
          email: discussion?.email ?? "",
          role: discussion?.role ?? ""
        })) || []
    },
    personalDetails: {
      title: ltftObj.personalDetails.title ?? null,
      surname: ltftObj.personalDetails.surname ?? null,
      forenames: ltftObj.personalDetails.forenames ?? null,
      telephoneNumber: ltftObj.personalDetails.telephoneNumber ?? null,
      mobileNumber: ltftObj.personalDetails.mobileNumber ?? null,
      email: ltftObj.personalDetails.email ?? null,
      gmcNumber: ltftObj.personalDetails.gmcNumber ?? null,
      gdcNumber: ltftObj.personalDetails.gdcNumber ?? null,
      publicHealthNumber: ltftObj.personalDetails.publicHealthNumber ?? null,
      skilledWorkerVisaHolder: ltftObj.skilledWorkerVisaHolder ?? null
    },
    programmeMembership: {
      id: ltftObj.pmId ?? null,
      name: ltftObj.pmName ?? null,
      programmeNumber: ltftObj.pmNumber ?? null,
      startDate: ltftObj.pmStartDate ?? null,
      endDate: ltftObj.pmEndDate ?? null,
      wte: ltftObj.wteBeforeChange ? ltftObj.wteBeforeChange / 100 : 0,
      designatedBodyCode: ltftObj.designatedBodyCode ?? null,
      managingDeanery: ltftObj.managingDeanery ?? null
    },
    reasons: {
      selected: ltftObj.reasonsSelected || [],
      otherDetail: ltftObj.reasonsOtherDetail ?? "",
      supportingInformation: ltftObj.supportingInformation ?? null
    },
    exceptionalReasons: {
      // Note: the persisted DTO field is the inverse (exceptional). 'No' -> true.
      exceptional:
        ltftObj.canGiveCompliantStartDate == null
          ? null
          : !ltftObj.canGiveCompliantStartDate,
      supportingInformation: ltftObj.exceptionalReasons ?? null,
      startDate: ltftObj.exceptionalReasonsDate ?? null
    },
    status: {
      current: {
        state: ltftObj.status.current.state,
        detail: {
          reason: ltftObj.status.current.detail.reason,
          message: ltftObj.status.current.detail.message
        },
        modifiedBy: {
          name: ltftObj.status.current.modifiedBy.name,
          email: ltftObj.status.current.modifiedBy.email,
          role: ltftObj.status.current.modifiedBy.role
        },
        timestamp: ltftObj.status.current.timestamp,
        revision: ltftObj.status.current.revision
      },
      history:
        ltftObj.status.history?.map(historyItem => ({
          state: historyItem.state,
          timestamp: historyItem.timestamp,
          detail: {
            reason: historyItem.detail.reason,
            message: historyItem.detail.message
          },
          modifiedBy: {
            name: historyItem.modifiedBy.name,
            email: historyItem.modifiedBy.email,
            role: historyItem.modifiedBy.role
          },
          revision: historyItem.revision
        })) || []
    },
    created: ltftObj.created ?? "",
    lastModified: ltftObj.lastModified ?? ""
  };
};

export const mapLtftDtoToObj = (ltftDto: LtftDto): LtftObjNew => {
  return {
    traineeTisId: ltftDto.traineeTisId,
    id: ltftDto.id ?? "",
    formRef: ltftDto.formRef ?? "",
    name: ltftDto.name ?? "",
    pmId: ltftDto.programmeMembership.id ?? "",
    pmName: ltftDto.programmeMembership.name ?? "",
    pmNumber: ltftDto.programmeMembership.programmeNumber ?? "",
    pmStartDate: ltftDto.programmeMembership.startDate ?? null,
    pmEndDate: ltftDto.programmeMembership.endDate ?? "",
    designatedBodyCode: ltftDto.programmeMembership.designatedBodyCode ?? "",
    managingDeanery: ltftDto.programmeMembership.managingDeanery ?? "",
    type: ltftDto.change.type,
    canGiveCompliantStartDate:
      ltftDto.exceptionalReasons?.exceptional == null
        ? null
        : !ltftDto.exceptionalReasons.exceptional,
    startDate: ltftDto.change.startDate,
    altStartDate: ltftDto.change.altStartDate ?? null,
    exceptionalReasons:
      ltftDto.exceptionalReasons?.supportingInformation ?? null,
    exceptionalReasonsDate: ltftDto.exceptionalReasons?.startDate ?? null,
    wteBeforeChange: ltftDto.programmeMembership.wte
      ? Math.round(ltftDto.programmeMembership.wte * 100)
      : null,
    wte: ltftDto.change.wte ? Math.round(ltftDto.change.wte * 100) : null,
    declarations: {
      discussedWithTpd: ltftDto.declarations.discussedWithTpd,
      informationIsCorrect: ltftDto.declarations.informationIsCorrect,
      notGuaranteed: ltftDto.declarations.notGuaranteed
    },
    tpdName: ltftDto.discussions.tpdName,
    tpdEmail: ltftDto.discussions.tpdEmail,
    otherDiscussions: ltftDto.discussions.other.map(discussion => ({
      name: discussion.name,
      email: discussion.email,
      role: discussion.role
    })),
    personalDetails: {
      title: ltftDto.personalDetails.title,
      surname: ltftDto.personalDetails.surname,
      forenames: ltftDto.personalDetails.forenames,
      telephoneNumber: ltftDto.personalDetails.telephoneNumber ?? null,
      mobileNumber: ltftDto.personalDetails.mobileNumber ?? null,
      email: ltftDto.personalDetails.email ?? null,
      gmcNumber: ltftDto.personalDetails.gmcNumber ?? null,
      gdcNumber: ltftDto.personalDetails.gdcNumber ?? null,
      publicHealthNumber: ltftDto.personalDetails.publicHealthNumber ?? null
    },
    skilledWorkerVisaHolder:
      ltftDto.personalDetails.skilledWorkerVisaHolder ?? null,
    reasonsSelected: ltftDto.reasons.selected,
    reasonsOtherDetail: ltftDto.reasons.otherDetail ?? null,
    supportingInformation: ltftDto.reasons.supportingInformation ?? null,
    status: {
      current: {
        state: ltftDto.status.current.state,
        detail: {
          reason: ltftDto.status.current.detail.reason ?? null,
          message: ltftDto.status.current.detail.message ?? null
        },
        modifiedBy: {
          name: ltftDto.status.current.modifiedBy.name ?? null,
          email: ltftDto.status.current.modifiedBy.email ?? null,
          role: ltftDto.status.current.modifiedBy.role ?? null
        },
        timestamp: ltftDto.status.current.timestamp,
        revision: ltftDto.status.current.revision
      },
      history: ltftDto.status.history.map(historyItem => ({
        state: historyItem.state,
        timestamp: historyItem.timestamp,
        detail: {
          reason: historyItem.detail.reason ?? null,
          message: historyItem.detail.message ?? null
        },
        modifiedBy: {
          name: historyItem.modifiedBy.name ?? null,
          email: historyItem.modifiedBy.email ?? null,
          role: historyItem.modifiedBy.role ?? null
        },
        revision: historyItem.revision
      }))
    },
    created: ltftDto.created,
    lastModified: ltftDto.lastModified
  };
};

// Note: canGiveCompliantStartDate is the trigger
export const clearStartDateSection = (ltftObj: LtftObjNew): LtftObjNew => ({
  ...ltftObj,
  startDate: null,
  altStartDate: null,
  exceptionalReasons: null,
  exceptionalReasonsDate: null
});

export const hasLegacyStartDateData = (ltftObj: LtftObjNew): boolean =>
  ltftObj.canGiveCompliantStartDate === null &&
  (ltftObj.startDate != null || ltftObj.altStartDate != null);

// Note: legacy DRAFT, canGiveCompliantStartDate is null. Its old start date answers no longer fit the new start date flow, so clear and make trainee complete that page from scratch. ('New' drafts that haven't answered the question yet already have these fields null).
export const resetLegacyStartDateSection = (
  ltftObj: LtftObjNew
): LtftObjNew => {
  const isLegacyDraft =
    ltftObj.status?.current?.state === "DRAFT" &&
    ltftObj.canGiveCompliantStartDate === null;
  return isLegacyDraft ? clearStartDateSection(ltftObj) : ltftObj;
};

export async function handleLtftSummaryModalSub(
  currentAction: ActionState,
  reasonObj?: ReasonMsgObj
) {
  if (currentAction.type === "Delete") {
    return await isFormDeleted("ltft", currentAction.id);
  }
  if (currentAction.type === "Unsubmit") {
    return await store.dispatch(
      unsubmitLtftForm({
        id: currentAction.id,
        reasonObj: reasonObj as ReasonMsgObj
      })
    );
  }
  if (currentAction.type === "Withdraw") {
    return await store.dispatch(
      withdrawLtftForm({
        id: currentAction.id,
        reasonObj: reasonObj as ReasonMsgObj
      })
    );
  }
  return false;
}

export function getStatusReasonLabel(
  status: string,
  statusReason: string
): string {
  if (status === "UNSUBMITTED" && statusReason) {
    return (
      ACTION_REASONS.UNSUBMIT.find(reason => reason.value === statusReason)
        ?.label ?? statusReason
    );
  }

  if (status === "WITHDRAWN" && statusReason) {
    return (
      ACTION_REASONS.WITHDRAW.find(reason => reason.value === statusReason)
        ?.label ?? statusReason
    );
  }

  return statusReason || "";
}

export function makeValidProgrammeOptions(
  pmsNotPast: ProgrammeMembership[],
  progIdsFromFeatFlags: string[]
): { value: string; label: string }[] {
  if (progIdsFromFeatFlags.length === 0 || pmsNotPast.length === 0) {
    return [];
  }

  const programmeOptions = pmsNotPast.reduce((progOptions, prog) => {
    if (prog.tisId && progIdsFromFeatFlags.includes(prog.tisId)) {
      progOptions.push({
        value: prog.tisId,
        label: `${prog.programmeName} (${dayjs(prog.startDate).format(
          "DD/MM/YYYY"
        )} to ${dayjs(prog.endDate).format("DD/MM/YYYY")})`
      });
    }
    return progOptions;
  }, [] as { value: string; label: string }[]);

  return programmeOptions;
}

// Note: A date stamped by a previous submission is kept and only cleared if the trainee revisits Start date page while editing unsubmitted.
export function stampLtftStartDateOnSubmit(formData: LtftObjNew): LtftObjNew {
  if (formData.canGiveCompliantStartDate !== false || formData.startDate) {
    return formData;
  }
  return {
    ...formData,
    startDate: computedValueGenerators.ltft16WeeksNoticeDate()
  };
}

export function findLatestSubmissionDate(formData: LtftObjNew): string | null {
  const { current, history = [] } = formData.status ?? {};

  return [current, ...history].reduce((latest: string | null, item) => {
    if (item?.state === "SUBMITTED" && item?.timestamp) {
      if (!latest) {
        return item.timestamp;
      }
      return dayjs(item.timestamp).isAfter(latest) ? item.timestamp : latest;
    }
    return latest;
  }, null);
}
