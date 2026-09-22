import { Button, WarningCallout } from "nhsuk-react-components";
import { Modal } from "./Modal";
import { PageGate } from "../../utilities/pageGates";

type PageGateModalProps = {
  isOpen: boolean;
  gate?: PageGate;
  onProceed: () => void;
  onSkip: () => void;
  onCancel: () => void;
};

// Note: unlike typical ActionModal this has 3 outcomes (proceed / skip / stay put), so wrapped Modal directly instead of a Formik form.
export function PageGateModal({
  isOpen,
  gate,
  onProceed,
  onSkip,
  onCancel
}: Readonly<PageGateModalProps>) {
  if (!gate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      cancelBtnText={gate.cancelBtnText}
    >
      <WarningCallout data-cy="pageGateWarning">
        <WarningCallout.Heading visuallyHiddenText="" data-cy="pageGateLabel">
          {gate.warningLabel}
        </WarningCallout.Heading>
        <p data-cy="pageGateText">{gate.warningText}</p>
      </WarningCallout>
      <div className="nhsuk-button-group">
        <Button type="button" data-cy="gateProceedBtn" onClick={onProceed}>
          {gate.proceedBtnText}
        </Button>
        <Button
          type="button"
          secondary
          data-cy="gateSkipBtn"
          aria-describedby="gateSkipHint"
          onClick={onSkip}
        >
          {gate.skipBtnText}
        </Button>
      </div>
      <p className="nhsuk-hint" id="gateSkipHint" data-cy="gateSkipHint">
        {gate.skipHint}
      </p>
    </Modal>
  );
}
