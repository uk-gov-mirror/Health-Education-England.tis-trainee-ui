import * as Yup from "yup";
import { CombinedReferenceData } from "../models/CombinedReferenceData";
import { FormRPartA } from "../models/FormRPartA";
import { KeyValue } from "../models/KeyValue";
import {
  saveFormA,
  updateFormA,
  deleteFormA,
  loadSavedFormA,
  resetToInitFormA,
  updatedEditPageNumber,
  updatedFormA
} from "../redux/slices/formASlice";
import store from "../redux/store/store";
import type {
  ComputedValueName,
  Field,
  Form,
  FormData,
  FormName,
  MatcherName,
  VisibilityCondition,
  VisibilityMatcherName,
  Warning
} from "../components/forms/form-builder/FormBuilder";
import {
  saveFormB,
  updateFormB,
  deleteFormB,
  loadSavedFormB,
  resetToInitFormB,
  updatedEditPageNumberB,
  updatedFormB
} from "../redux/slices/formBSlice";
import { FormRPartB } from "../models/FormRPartB";
import { LifeCycleState } from "../models/LifeCycleState";
import { CurriculumKeyValue } from "../models/CurriculumKeyValue";
import { IFormR } from "../models/IFormR";
import dayjs from "dayjs";
import history from "../components/navigation/history";
import {
  deleteLtft,
  loadSavedLtft,
  resetToInitLtft,
  saveLtft,
  updatedCanEditLtft,
  updatedEditPageNumberLtft,
  updatedLtft,
  updateLtft
} from "../redux/slices/ltftSlice";
import { updatedFormsRefreshNeeded } from "../redux/slices/formsSlice";
import { updatedLtftFormsRefreshNeeded } from "../redux/slices/ltftSummaryListSlice";
import { LtftObjNew } from "../models/LtftTypes";
import { isPastIt } from "./DateUtilities";
import { findLinkedProgramme } from "./CctUtilities";
import { processLinkedFormData } from "./FormRUtilities";

export function mapItemToNewFormat(item: KeyValue): {
  value: string;
  label: string;
} {
  return {
    value: item.label,
    label: item.label
  };
}

// ----------------------------------------------------------
// Note - Lots of these functions below repeat the same logic for formA and formB - look to combine the form slices into one slice?

export async function loadTheSavedForm(
  pathName: string,
  id: string,
  history: any
) {
  if (pathName === "/formr-a") {
    await store.dispatch(loadSavedFormA({ id }));
  } else if (pathName === "/formr-b") {
    await store.dispatch(loadSavedFormB({ id }));
  } else if (pathName === "/ltft" || pathName === "/ltft/confirm") {
    await store.dispatch(loadSavedLtft(id));
  }
  if (pathName === "/ltft/confirm") {
    store.dispatch(updatedCanEditLtft(true));
    history.push(pathName);
  } else history.push(`${pathName}/create`);
}

// This is used in FormBuilder to set the initial page value (needed because when reviewing/editing mutli-page form needs to take user to the correct page)
export function getEditPageNumber(formName: string) {
  if (formName === "formA") {
    return store.getState().formA.editPageNumber;
  } else if (formName === "formB") {
    return store.getState().formB.editPageNumber;
  } else if (formName === "ltft") {
    return store.getState().ltft.editPageNumber;
  }
  return 0;
}

export function resetForm(formName: string) {
  if (formName === "formA") {
    store.dispatch(resetToInitFormA());
  } else if (formName === "formB") {
    store.dispatch(resetToInitFormB());
  } else if (formName === "ltft") {
    store.dispatch(resetToInitLtft());
  }
}

function handleFormrToConfirm(formName: FormName, formData: FormData) {
  const redirectPath = formName === "formA" ? "/formr-a" : "/formr-b";
  let id: string | undefined;

  if (formName === "formA") {
    id = formData.id ?? store.getState().formA.newFormId;
    store.dispatch(updatedFormA(formData as FormRPartA));
  } else if (formName === "formB") {
    id = formData.id ?? store.getState().formB.newFormId;
    store.dispatch(updatedFormB(formData as FormRPartB));
  }
  const suffix = id ? `/${id}/view` : "/new/view";
  const fullPath = `${redirectPath}${suffix}`;
  history.push(fullPath, { fromFormCreate: true });
}

export function prepLtftFormData(
  formData: LtftObjNew,
  returnPreppedData: boolean = false
) {
  const pmArrayNotPast = store
    .getState()
    .traineeProfile.traineeProfileData.programmeMemberships.filter(
      prog => !isPastIt(prog.endDate)
    );
  const linkedProgramme = findLinkedProgramme(formData.pmId, pmArrayNotPast);
  if (linkedProgramme) {
    const {
      programmeName,
      programmeNumber,
      startDate,
      endDate,
      designatedBodyCode,
      managingDeanery
    } = linkedProgramme;

    const preppedData = {
      ...formData,
      pmName: programmeName ?? "",
      pmNumber: programmeNumber ?? "",
      pmStartDate: startDate ?? "",
      pmEndDate: endDate ?? "",
      designatedBodyCode: designatedBodyCode ?? "",
      managingDeanery: managingDeanery ?? ""
    };

    store.dispatch(updatedLtft(preppedData));

    if (returnPreppedData) {
      return preppedData;
    }
  }
}

function handleLtftToConfirm(formData: FormData) {
  prepLtftFormData(formData as LtftObjNew);
  store.dispatch(updatedCanEditLtft(true));
  history.push("/ltft/confirm");
}

export function continueToConfirm(formName: FormName, formData: FormData) {
  if (formName === "ltft") {
    handleLtftToConfirm(formData);
  } else {
    handleFormrToConfirm(formName, formData);
  }
}

// review & submit
export function setEditPageNumber(formName: string, pageNumber: number) {
  if (formName === "formA") {
    store.dispatch(updatedEditPageNumber(pageNumber));
  } else if (formName === "formB") {
    store.dispatch(updatedEditPageNumberB(pageNumber));
  } else if (formName === "ltft") {
    store.dispatch(updatedEditPageNumberLtft(pageNumber));
  }
}

// TODO: Rename function  and refactor these blocks when LTFT is added ----------------
function getFormREditPageLocation(
  formName: Extract<FormName, "formA" | "formB">,
  fieldName: string
) {
  // TODO: change Type to FormName when LTFT is added
  const getPath = (name: Extract<FormName, "formA" | "formB">, id?: string) => {
    const urlName = mapFormNameToUrl(name);
    return id ? `/${urlName}/${id}/create` : `/${urlName}/new/create`;
  };

  const pathnameMap: Record<
    Extract<FormName, "formA" | "formB">,
    () => string
  > = {
    formA: () => {
      const id =
        store.getState().formA.formData?.id ?? store.getState().formA.newFormId;
      return getPath("formA", id);
    },
    formB: () => {
      const id =
        store.getState().formB.formData?.id ?? store.getState().formB.newFormId;
      return getPath("formB", id);
    }
    // ,
    // ltft: () => {
    //   const id =
    //     store.getState().ltft.formData?.id ?? store.getState().ltft.newFormId;
    //   return getPath("ltft", id);
    // }
  };

  const pathname = pathnameMap[formName]();

  return {
    pathname,
    state: { fieldName }
  };
}

export function getEditPageLocation(formName: FormName, fieldName: string) {
  if (formName === "ltft") {
    return {
      pathname: "/ltft/create",
      state: { fieldName }
    };
  } else {
    return getFormREditPageLocation(formName, fieldName);
  }
}

// ----------------------------------------------------------------------

export async function isFormDeleted(
  formName: FormName,
  formId: string
): Promise<boolean> {
  if (formName === "formA") {
    await store.dispatch(deleteFormA(formId));
  } else if (formName === "formB") {
    await store.dispatch(deleteFormB(formId));
  } else if (formName === "ltft") {
    await store.dispatch(deleteLtft(formId));
  }
  const state = store.getState();
  return state[formName].status === "succeeded";
}

export type BtnLocation = "formsList" | "form" | "formView";

export function checkPush(formName: FormName, btnLocation: BtnLocation) {
  resetForm(formName);
  if (btnLocation === "formsList") {
    if (formName !== "ltft") {
      store.dispatch(updatedFormsRefreshNeeded(true));
    } else store.dispatch(updatedLtftFormsRefreshNeeded(true));
  } else {
    const mappedUrl = mapFormNameToUrl(formName);
    history.push(`/${mappedUrl}`);
  }
}

// ----------------------------------------------------------

export function filterCurriculumOptions(
  curriculumOptions: CurriculumKeyValue[] | null,
  curriculumSubType: string | null | undefined
) {
  return curriculumOptions
    ?.filter(c => c?.curriculumSubType === curriculumSubType)
    .map(option => mapItemToNewFormat(option));
}

export function transformReferenceData(
  data: CombinedReferenceData
): CombinedReferenceData {
  const transformedData = {} as CombinedReferenceData;

  Object.keys(data).forEach(key => {
    transformedData[key] = data[key].map(mapItemToNewFormat);
  });

  return transformedData;
}

export function isDateWithin16WeeksOfFirstDate(
  dateVal: Date | string,
  firstDate: Date | string = new Date()
): boolean {
  const subDate = dayjs(firstDate).startOf("day");
  const inputDate = dayjs(dateVal).startOf("day");
  return inputDate.isBefore(subDate.add(16, "week"));
}

export function getFieldWarningMsgs(
  inputValue: string | number,
  warnings: Warning[],
  formData?: FormData
): string[] {
  const stringTypeChecks: Partial<
    Record<MatcherName, (val: string) => boolean>
  > = {
    prevDateTest: (val: string) => {
      const testDate = dayjs().subtract(1, "day");
      return dayjs(val).isBefore(testDate);
    },
    postcodeTest: (val: string) =>
      !/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i.test(val),
    ltft16WeeksTest: (val: string) => isDateWithin16WeeksOfFirstDate(val)
  };

  const numberTypeChecks: Partial<
    Record<MatcherName, (val: number) => boolean>
  > = {
    ltftStandardWteTest: (val: number) => {
      const standard = [100, 80, 70, 60, 50];
      return !!val && !standard.includes(val);
    }
  };

  return warnings.reduce((messages: string[], w) => {
    let valueToCheck = inputValue;
    const hasConditionalField = !!(w.conditionalField && formData);

    if (hasConditionalField) {
      valueToCheck = formData[w.conditionalField as string];
    } else if (!inputValue && inputValue !== 0) {
      return messages;
    }

    const stringCheck = stringTypeChecks[w.matcher];
    const numberCheck = numberTypeChecks[w.matcher];

    if (stringCheck) {
      const valStr =
        valueToCheck === undefined || valueToCheck === null
          ? ""
          : String(valueToCheck);
      if (stringCheck(valStr)) {
        messages.push(w.msgText);
      }
    } else if (numberCheck) {
      const numVal = Number(valueToCheck);
      if (!Number.isNaN(numVal) && numberCheck(numVal)) {
        messages.push(w.msgText);
      }
    }
    return messages;
  }, []);
}

export function setTextFieldWidth(width: number) {
  return width < 20 ? 20 : Math.floor(width / 10) * 10;
}

export function handleKeyDown(
  e: React.KeyboardEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
  >
) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
}

export function handleNumberInput(
  isNumberField: boolean | undefined,
  e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  maxDigits?: number
) {
  if (isNumberField) {
    const input = e.target as HTMLInputElement;
    input.value = input.value.replaceAll(/\D/g, "");
    if (maxDigits !== undefined && input.value.length > maxDigits) {
      input.value = input.value.slice(0, maxDigits);
    }
  }
}

export function sumFieldValues(formData: FormData, fields: Field[]) {
  return fields.reduce(
    (sum, field) => sum + Number(formData[field.name] ?? 0),
    0
  );
}

export interface DraftFormProps {
  id?: string;
  lifecycleState: LifeCycleState;
  programmeMembershipId?: string | null;
}

export function setDraftFormRProps(forms: IFormR[]): DraftFormProps | null {
  if (forms.every(form => form.lifecycleState === LifeCycleState.Submitted))
    return null;

  const unsubmittedForm = forms.find(
    form => form.lifecycleState === LifeCycleState.Unsubmitted
  );
  if (unsubmittedForm) {
    return {
      id: unsubmittedForm.id,
      lifecycleState: LifeCycleState.Unsubmitted,
      programmeMembershipId: unsubmittedForm.programmeMembershipId
    };
  }

  const draftForm = forms.find(
    form => form.lifecycleState === LifeCycleState.Draft
  );

  if (draftForm) {
    return {
      id: draftForm.id,
      lifecycleState: LifeCycleState.Draft,
      programmeMembershipId: draftForm.programmeMembershipId
    };
  }
  return null;
}
// NOTE: This function sets the hidden form fields to null whilst retaining the precious formData for submission
export function setFormRDataForSubmit(
  jsonForm: Form,
  formData: FormRPartA | FormRPartB
): FormRPartA | FormRPartB {
  const { programmeMemberships } =
    store.getState().traineeProfile.traineeProfileData;
  const { linkedProgramme, localOfficeName } = processLinkedFormData(
    {
      isArcp: formData.isArcp ?? null,
      programmeMembershipId: formData.programmeMembershipId ?? null
    },
    programmeMemberships
  );
  const preciousFormDataBoth = {
    lifecycleState: LifeCycleState.Submitted,
    lastModifiedDate: new Date(),
    submissionDate: new Date(),
    traineeTisId: formData.traineeTisId,
    isArcp: formData.isArcp,
    programmeMembershipId: formData.programmeMembershipId,
    programmeName: linkedProgramme?.programmeName ?? formData.programmeName,
    localOfficeName: localOfficeName ?? formData.localOfficeName,
    programmeSpecialty:
      linkedProgramme?.programmeName ?? formData.programmeSpecialty
  };

  // NOTE: Have to account for the seemingly useless isLeadingToCct field in formA
  const myPreciousFormDataFields =
    jsonForm.name === "formB"
      ? preciousFormDataBoth
      : {
          ...preciousFormDataBoth,
          isLeadingToCct: (formData as FormRPartA).isLeadingToCct
        };

  const newFormData = jsonForm.pages.reduce((fd, page) => {
    page.sections.forEach(section => {
      section.fields.forEach(field => {
        if (showFormField(field, fd)) {
          (fd as FormData)[field.name] = (formData as FormData)[field.name];
        } else {
          (fd as FormData)[field.name] = null;
        }
      });
    });
    return fd;
  }, {} as FormRPartA | FormRPartB);

  const formDataToSubmit = { ...newFormData, ...myPreciousFormDataFields };

  return jsonForm.name === "formB"
    ? setBlankWorkSitesToNull(formDataToSubmit as FormRPartB)
    : formDataToSubmit;
}

function setBlankWorkSitesToNull(formData: FormRPartB): FormRPartB {
  if (!Array.isArray(formData.work)) return formData;
  const blankToNull = (value: string | null) => (value?.trim() ? value : null);
  return {
    ...formData,
    work: formData.work.map(workPanel => ({
      ...workPanel,
      site: blankToNull(workPanel.site),
      siteLocation: blankToNull(workPanel.siteLocation),
      siteKnownAs: blankToNull(workPanel.siteKnownAs)
    }))
  };
}

function prepFormRData(
  formData: Extract<FormDataType, FormRPartA | FormRPartB>,
  isSubmit: boolean,
  jsonForm: Form
) {
  if (isSubmit) {
    return setFormRDataForSubmit(jsonForm, formData);
  }
  if (formData.lifecycleState !== LifeCycleState.Unsubmitted) {
    return {
      ...formData,
      submissionDate: null,
      lifecycleState: LifeCycleState.Draft,
      lastModifiedDate: new Date()
    };
  }
  return {
    ...formData,
    lastModifiedDate: new Date()
  };
}

async function updateForm(
  formName: string,
  formData: FormData,
  isAutoSave: boolean,
  isSubmit: boolean,
  showFailToastOnly: boolean = false
) {
  if (formName === "formA") {
    await store.dispatch(
      updateFormA({
        formData: formData as FormRPartA,
        isAutoSave,
        isSubmit
      })
    );
  } else if (formName === "formB") {
    await store.dispatch(
      updateFormB({
        formData: formData as FormRPartB,
        isAutoSave,
        isSubmit
      })
    );
  } else if (formName === "ltft") {
    await store.dispatch(
      updateLtft({
        formData: formData as LtftObjNew,
        isAutoSave,
        isSubmit,
        showFailToastOnly
      })
    );
  }
}

async function saveForm(
  formName: string,
  formData: FormData,
  isAutoSave: boolean,
  isSubmit: boolean,
  showFailToastOnly: boolean
) {
  if (formName === "formA") {
    await store.dispatch(
      saveFormA({
        formData: formData as FormRPartA,
        isAutoSave,
        isSubmit
      })
    );
  } else if (formName === "formB") {
    await store.dispatch(
      saveFormB({ formData: formData as FormRPartB, isAutoSave, isSubmit })
    );
  } else if (formName === "ltft")
    await store.dispatch(
      saveLtft({
        formData: formData as LtftObjNew,
        isAutoSave,
        isSubmit,
        showFailToastOnly
      })
    );
}

export const getDraftFormId = (
  formData: FormDataType,
  formName: string
): string | null => {
  if (formName === "formA") {
    return formData?.id ?? store.getState().formA?.newFormId ?? null;
  } else if (formName === "formB") {
    return formData?.id ?? store.getState().formB?.newFormId ?? null;
  } else if (formName === "ltft")
    return formData?.id ?? store.getState().ltft?.newFormId ?? null;
  return null;
};

const getSaveStatus = (formName: string) => {
  if (formName === "formA") {
    return store.getState().formA.saveStatus;
  } else if (formName === "formB") {
    return store.getState().formB.saveStatus;
  } else if (formName === "ltft") return store.getState().ltft.saveStatus;
  return "idle";
};

export type FormDataType = FormRPartA | FormRPartB | LtftObjNew;

export async function saveDraftForm(
  jsonForm: Form,
  formData: FormDataType,
  isAutoSave: boolean = false,
  isSubmit: boolean = false,
  showFailToastOnly: boolean = false,
  shouldRedirect: boolean = true
) {
  const formName = jsonForm.name;
  const draftFormId = getDraftFormId(formData, formName);
  const isFormR = formName === "formA" || formName === "formB";
  const preppedFormData = isFormR
    ? prepFormRData(
        formData as Extract<FormDataType, FormRPartA | FormRPartB>,
        isSubmit,
        jsonForm
      )
    : prepLtftFormData(formData as LtftObjNew, true);

  if (draftFormId) {
    await updateForm(
      formName,
      { ...preppedFormData, id: draftFormId },
      isAutoSave,
      isSubmit,
      showFailToastOnly
    );
  } else {
    await saveForm(
      formName,
      preppedFormData as FormData,
      isAutoSave,
      isSubmit,
      showFailToastOnly
    );
  }
  handleSaveRedirect(formName, shouldRedirect);
}

export function mapFormNameToUrl(formName: FormName): string {
  switch (formName) {
    case "formA":
      return "formr-a";
    case "formB":
      return "formr-b";
    default:
      return formName;
  }
}

export function handleSaveRedirect(
  formName: FormName,
  shouldRedirect: boolean
) {
  const saveStatus = getSaveStatus(formName);
  if (saveStatus === "succeeded" && shouldRedirect) {
    history.push(`/${mapFormNameToUrl(formName)}`);
  }
}

export function createErrorObject(err: {
  inner: { path: string; message: string }[];
}) {
  const newErrors: unknown = {};
  const setNestedValue = (obj: any, path: string, value: string) => {
    const keys = path.split(".");
    const lastKey = keys.pop() as string;
    const lastObj = keys.reduce((obj, key, i) => {
      if (key.includes("[")) {
        const [arrayKey, arrayIndex] = key.split(/[[\]]/).filter(Boolean);
        obj[arrayKey] = obj[arrayKey] ?? [];
        obj[arrayKey][arrayIndex] = obj[arrayKey][arrayIndex] ?? {};
        return obj[arrayKey][arrayIndex];
      } else {
        obj[key] = obj[key] ?? (keys[i + 1]?.includes("[") ? [] : {});
        return obj[key];
      }
    }, obj);
    lastObj[lastKey] = value;
  };

  err.inner.forEach(({ path, message }) => {
    setNestedValue(newErrors, path, message);
  });
  return newErrors;
}

export function validateFields(
  fields: Field[],
  values: FormData,
  validationSchema: any
) {
  let finalValidationSchema = Yup.object().shape({});
  finalValidationSchema = fields.reduce((schema, field) => {
    const fieldSchema = validationSchema.fields[field.name];
    // info-type (and other schema-less) fields have nothing to validate
    if (!fieldSchema) return schema;
    const isVisible = showFormField(field, values);
    if (isVisible) {
      if (field.type === "array" && values[field.name]?.length > 0) {
        const nestedFields = Object.keys(values[field.name][0]).reduce(
          (nestedSchema: { [key: string]: any }, nestedField: string) => {
            nestedSchema[nestedField] =
              fieldSchema.innerType.fields[nestedField];
            return nestedSchema;
          },
          {}
        );
        const nestedSchema = Yup.object().shape(nestedFields);
        schema = schema.shape({
          [field.name]: Yup.array().of(nestedSchema)
        });
      } else if (field.type === "dto") {
        const dtoFields = field.objectFields ?? [];
        const visibleDtoFields = dtoFields.filter(dtoField =>
          showFormField(dtoField, values[field.name] ?? {})
        );
        const dtoSchema = visibleDtoFields.reduce((dtoSchema, dtoField) => {
          const dtoFieldSchema = fieldSchema.fields[dtoField.name];
          return dtoSchema.shape({
            [dtoField.name]: dtoFieldSchema
          });
        }, Yup.object().shape({}));
        schema = schema.shape({
          [field.name]: dtoSchema
        });
      } else {
        schema = schema.shape({
          [field.name]: fieldSchema
        });
      }
    }
    return schema;
  }, finalValidationSchema);
  return finalValidationSchema.validate(values, { abortEarly: false });
}

export function filteredOptions(optionsKey: string | undefined, options: any) {
  return optionsKey && options?.[optionsKey]?.length > 0
    ? options[optionsKey]
    : [];
}

export function formatFieldName(fieldName: string) {
  let words = fieldName.split(/(?=[A-Z])/);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ");
}

type VisibilityMatcher = (
  fieldValue: unknown,
  cond: VisibilityCondition
) => boolean;

const visibilityMatchers: Record<VisibilityMatcherName, VisibilityMatcher> = {
  valueInList: (fieldValue, cond) => {
    if (!cond.values) return false;
    if (Array.isArray(fieldValue)) {
      return fieldValue.some(v => cond.values!.includes(v));
    }
    return cond.values.includes(fieldValue);
  },
  lessThan16WeeksTest: fieldValue =>
    !!fieldValue && isDateWithin16WeeksOfFirstDate(fieldValue as string)
};

export function showFormField(field: Field, formData: FormData) {
  if (field.visible) return true;
  if (!field.visibleIf) return false;
  const matcher = visibilityMatchers[field.visibleIf.matcher];
  if (!matcher) return false;
  return matcher(formData[field.visibleIf.field], field.visibleIf);
}

export function clearHiddenFieldValues(
  fields: Field[],
  formData: FormData
): FormData {
  const valsToClear = fields.filter(
    field => !showFormField(field, formData) && formData[field.name] != null
  );
  if (valsToClear.length === 0) return formData;

  const cleaned = { ...formData };
  for (const field of valsToClear) {
    cleaned[field.name] = null;
  }
  return cleaned;
}

export const computedValueGenerators: Record<ComputedValueName, () => string> =
  {
    ltft16WeeksNoticeDate: () => dayjs().add(16, "week").format("YYYY-MM-DD")
  };

// Bug fix to also reset the option to empty string where no match against filtered curriculum data e.g. programmeSpecialty field.
export function isValidOption(
  key: "curriculum" | "localOffice" | "gender",
  option: string | null | undefined,
  refData?: any,
  filteredCurriculumData?: any
): string {
  const searchedArray = refData ? refData[key] : filteredCurriculumData;
  const result = searchedArray?.some(
    (item: { label: string | null | undefined }) => item.label === option
  );
  return result ? (option as string) : "";
}

export const determineCurrentValue = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  selectedOption?: any,
  checkedStatus?: boolean
) => {
  let value: string | boolean = event.currentTarget.value;
  if (value === "Yes") value = true;
  if (value === "No") value = false;
  if (selectedOption) {
    if (Array.isArray(selectedOption)) {
      return selectedOption.map((option: any) => option.value);
    }
    return selectedOption.value;
  } else if (checkedStatus !== undefined) {
    return checkedStatus;
  } else {
    return value;
  }
};

// react-select styles
export const colourStyles = {
  option: (baseStyles: any, { isFocused }: any) => ({
    ...baseStyles,
    background: isFocused ? "#2884FF" : "none",
    color: isFocused ? "white" : undefined,
    zIndex: 1,
    fontSize: "1rem",
    "@media (min-width: 40.0625em)": {
      ...baseStyles["@media (min-width: 40.0625em)"],
      fontSize: "1.1875rem"
    },
    paddingTop: "1px",
    paddingBottom: "1px"
  }),
  control: (baseStyles: any, { isFocused }: any) => ({
    ...baseStyles,
    border: "0.0625rem solid #4C6272",
    borderColor: "#4C6272",
    "&:hover": {
      borderColor: "#4C6272"
    },
    boxShadow: isFocused ? "inset 0 0 0 2px" : "none",
    outline: isFocused ? "4px solid #ffeb3b" : "1px solid #4c6272"
  }),
  singleValue: (baseStyles: any) => ({
    ...baseStyles,
    fontSize: "1rem",
    "@media (min-width: 40.0625em)": {
      ...baseStyles["@media (min-width: 40.0625em)"],
      fontSize: "1.1875rem"
    }
  }),
  dropdownIndicator: (baseStyles: any) => ({
    ...baseStyles,
    padding: "0 2px 0 2px",
    width: "1.125rem",
    color: "#212b32"
  }),
  clearIndicator: (baseStyles: any) => ({
    ...baseStyles,
    padding: "0 2px 0 0",
    width: "1.125rem",
    color: "#212b32"
  }),
  container: (baseStyles: any) => ({
    ...baseStyles,
    width: "max-content",
    minWidth: "70%",
    maxWidth: "100%"
  })
};
