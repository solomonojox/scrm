import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionMode = "single" | "bulk";

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface SingleQuestion {
  examinationId: string;
  questionType: string;
  questionText: string;
  options: QuestionOption[];
}

export interface BulkPayload {
  examinationId: string;
  questions: SingleQuestion[];
}

interface AddExamQuestionsProps {
  open: boolean;
  mode: QuestionMode;
  examinationId: string;
  examinationTitle: string;
  onClose: () => void;
  onAddSingle: (payload: SingleQuestion) => Promise<void>;
  onAddBulk: (payload: BulkPayload) => Promise<void>;
}

// ─── Default builders ─────────────────────────────────────────────────────────

function emptyOption(): QuestionOption {
  return { text: "", isCorrect: false };
}

function emptyQuestion(examinationId: string): SingleQuestion {
  return {
    examinationId,
    questionType: "General",
    questionText: "",
    options: [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
  };
}

// ─── Option Row ───────────────────────────────────────────────────────────────

interface OptionRowProps {
  index: number;
  option: QuestionOption;
  onChange: (index: number, field: keyof QuestionOption, value: string | boolean) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const OptionRow: React.FC<OptionRowProps> = ({ index, option, onChange, onRemove, canRemove }) => (
  <div className="aq-option-row">
    <span className="aq-option-label">{String.fromCharCode(65 + index)}</span>
    <input
      className="aq-input aq-option-input"
      type="text"
      placeholder={`Option ${String.fromCharCode(65 + index)}`}
      value={option.text}
      onChange={(e) => onChange(index, "text", e.target.value)}
    />
    <label className="aq-correct-toggle" title="Mark as correct answer">
      <input
        type="checkbox"
        checked={option.isCorrect}
        onChange={(e) => onChange(index, "isCorrect", e.target.checked)}
      />
      <span className="aq-correct-label">Correct</span>
    </label>
    {canRemove && (
      <button className="aq-icon-btn aq-remove-btn" type="button" onClick={() => onRemove(index)} title="Remove option">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    )}
  </div>
);

// ─── Single Question Form ─────────────────────────────────────────────────────

interface SingleQuestionFormProps {
  question: SingleQuestion;
  index?: number;           // for bulk mode — shows "Question N" header
  onUpdate: (updated: SingleQuestion) => void;
  onRemove?: () => void;    // bulk mode only
}

const SingleQuestionForm: React.FC<SingleQuestionFormProps> = ({
  question,
  index,
  onUpdate,
  onRemove,
}) => {
  function updateField(field: keyof SingleQuestion, value: string) {
    onUpdate({ ...question, [field]: value });
  }

  function updateOption(i: number, field: keyof QuestionOption, value: string | boolean) {
    const opts = question.options.map((o, idx) =>
      idx === i ? { ...o, [field]: value } : o
    );
    onUpdate({ ...question, options: opts });
  }

  function addOption() {
    if (question.options.length >= 6) return;
    onUpdate({ ...question, options: [...question.options, emptyOption()] });
  }

  function removeOption(i: number) {
    if (question.options.length <= 2) return;
    onUpdate({ ...question, options: question.options.filter((_, idx) => idx !== i) });
  }

  const isBulkItem = index !== undefined;

  return (
    <div className={`aq-question-block ${isBulkItem ? "aq-question-block--bulk" : ""}`}>
      {isBulkItem && (
        <div className="aq-question-block-header">
          <span className="aq-q-index">Question {index! + 1}</span>
          {onRemove && (
            <button className="aq-icon-btn aq-remove-q-btn" type="button" onClick={onRemove}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Remove
            </button>
          )}
        </div>
      )}

      <div className="aq-field">
        <label className="aq-label">Question Type</label>
        <select
          className="aq-input aq-select"
          value={question.questionType}
          onChange={(e) => updateField("questionType", e.target.value)}
        >
          <option value="General">General</option>
          <option value="Theory">Theory</option>
          <option value="Practical">Practical</option>
        </select>
      </div>

      <div className="aq-field">
        <label className="aq-label">Question Text <span className="aq-required">*</span></label>
        <textarea
          className="aq-input aq-textarea"
          rows={3}
          placeholder="Enter your question here…"
          value={question.questionText}
          onChange={(e) => updateField("questionText", e.target.value)}
        />
      </div>

      <div className="aq-field">
        <div className="aq-options-header">
          <label className="aq-label">Options <span className="aq-required">*</span></label>
          <span className="aq-hint">Check at least one correct answer</span>
        </div>
        <div className="aq-options-list">
          {question.options.map((opt, i) => (
            <OptionRow
              key={i}
              index={i}
              option={opt}
              onChange={updateOption}
              onRemove={removeOption}
              canRemove={question.options.length > 2}
            />
          ))}
        </div>
        {question.options.length < 6 && (
          <button className="aq-add-option-btn" type="button" onClick={addOption}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add Option
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AddExamQuestions: React.FC<AddExamQuestionsProps> = ({
  open,
  mode,
  examinationId,
  examinationTitle,
  onClose,
  onAddSingle,
  onAddBulk,
}) => {
  const [singleQuestion, setSingleQuestion] = useState<SingleQuestion>(
    emptyQuestion(examinationId)
  );
  const [bulkQuestions, setBulkQuestions] = useState<SingleQuestion[]>([
    emptyQuestion(examinationId),
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  if (!open) return null;

  // ── Validation ──────────────────────────────────────────────────────────────

  function validateQuestion(q: SingleQuestion, prefix = ""): string[] {
    const errs: string[] = [];
    if (!q.questionText.trim())
      errs.push(`${prefix}Question text is required.`);
    if (q.options.some((o) => !o.text.trim()))
      errs.push(`${prefix}All option fields must be filled.`);
    if (!q.options.some((o) => o.isCorrect))
      errs.push(`${prefix}At least one option must be marked correct.`);
    return errs;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    let errs: string[] = [];

    if (mode === "single") {
      errs = validateQuestion(singleQuestion);
    } else {
      bulkQuestions.forEach((q, i) => {
        errs.push(...validateQuestion(q, `Question ${i + 1}: `));
      });
    }

    if (errs.length) {
      setErrors(errs);
      return;
    }

    setErrors([]);
    setSubmitting(true);

    try {
      if (mode === "single") {
        await onAddSingle({ ...singleQuestion, examinationId });
      } else {
        const payload: BulkPayload = {
          examinationId,
          questions: bulkQuestions.map((q) => ({ ...q, examinationId })),
        };
        await onAddBulk(payload);
      }
      // Reset on success
      setSingleQuestion(emptyQuestion(examinationId));
      setBulkQuestions([emptyQuestion(examinationId)]);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  // ── Bulk helpers ────────────────────────────────────────────────────────────

  function addBulkQuestion() {
    setBulkQuestions((prev) => [...prev, emptyQuestion(examinationId)]);
  }

  function updateBulkQuestion(i: number, updated: SingleQuestion) {
    setBulkQuestions((prev) => prev.map((q, idx) => (idx === i ? updated : q)));
  }

  function removeBulkQuestion(i: number) {
    if (bulkQuestions.length === 1) return;
    setBulkQuestions((prev) => prev.filter((_, idx) => idx !== i));
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const isSingle = mode === "single";

  return (
    <>
      <style>{aqStyles}</style>

      <div className="aq-overlay" role="dialog" aria-modal="true">
        <div className="aq-panel">
          {/* Header */}
          <div className="aq-panel-header">
            <div className="aq-panel-title-group">
              <div className={`aq-mode-badge ${isSingle ? "aq-mode-single" : "aq-mode-bulk"}`}>
                {isSingle ? "Single Question" : "Bulk Questions"}
              </div>
              <h2 className="aq-panel-title">Add Questions</h2>
              <p className="aq-panel-subtitle">{examinationTitle}</p>
            </div>
            <button className="aq-close-btn" onClick={onClose} disabled={submitting}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="aq-panel-body">
            {/* Error summary */}
            {errors.length > 0 && (
              <div className="aq-error-box">
                <strong>Please fix the following:</strong>
                <ul>
                  {errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            {isSingle ? (
              <SingleQuestionForm
                question={singleQuestion}
                onUpdate={setSingleQuestion}
              />
            ) : (
              <div className="aq-bulk-list">
                {bulkQuestions.map((q, i) => (
                  <SingleQuestionForm
                    key={i}
                    question={q}
                    index={i}
                    onUpdate={(updated) => updateBulkQuestion(i, updated)}
                    onRemove={bulkQuestions.length > 1 ? () => removeBulkQuestion(i) : undefined}
                  />
                ))}

                <button className="aq-add-question-btn" type="button" onClick={addBulkQuestion}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Add Another Question
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="aq-panel-footer">
            <span className="aq-q-count">
              {isSingle ? "1 question" : `${bulkQuestions.length} question${bulkQuestions.length !== 1 ? "s" : ""}`}
            </span>
            <div className="aq-footer-actions">
              <button className="aq-btn aq-btn-ghost" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button
                className="aq-btn aq-btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="aq-spinner" />
                    Saving…
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Save {isSingle ? "Question" : `${bulkQuestions.length} Questions`}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const aqStyles = `
  .aq-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: 1000;
  }

  .aq-panel {
    width: 100%;
    max-width: 580px;
    height: 100vh;
    background: #fff;
    display: flex;
    flex-direction: column;
    box-shadow: -8px 0 40px rgba(0,0,0,.15);
    animation: aq-slide-in .25s cubic-bezier(.4,0,.2,1);
    overflow: hidden;
  }

  @keyframes aq-slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }

  /* Header */
  .aq-panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 24px 24px 20px;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;
  }

  .aq-panel-title-group { display: flex; flex-direction: column; gap: 4px; }

  .aq-mode-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    width: fit-content;
  }

  .aq-mode-single { background: #dbeafe; color: #1d4ed8; }
  .aq-mode-bulk   { background: #fce7f3; color: #9d174d; }

  .aq-panel-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .aq-panel-subtitle {
    font-size: 0.8rem;
    color: #64748b;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 380px;
  }

  .aq-close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
    transition: background .15s, color .15s;
  }
  .aq-close-btn:hover { background: #f1f5f9; color: #475569; }

  /* Body */
  .aq-panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Error box */
  .aq-error-box {
    background: #fff5f5;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 12px 16px;
    color: #991b1b;
    font-size: 0.8rem;
    margin-bottom: 20px;
  }
  .aq-error-box ul { margin: 6px 0 0 16px; padding: 0; line-height: 1.8; }
  .aq-error-box strong { display: block; margin-bottom: 2px; }

  /* Question block */
  .aq-question-block {
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 8px;
  }

  .aq-question-block--bulk {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
    background: #fafafa;
  }

  .aq-question-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .aq-q-index {
    font-size: 0.78rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: .06em;
  }

  /* Fields */
  .aq-field { display: flex; flex-direction: column; gap: 6px; }

  .aq-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
  }

  .aq-required { color: #dc2626; }

  .aq-input {
    font-family: inherit;
    font-size: 0.875rem;
    color: #1e293b;
    border: 1px solid #d1d5db;
    border-radius: 7px;
    padding: 9px 12px;
    transition: border-color .15s, box-shadow .15s;
    background: #fff;
    width: 100%;
    box-sizing: border-box;
  }
  .aq-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,.1);
  }

  .aq-select { cursor: pointer; }
  .aq-textarea { resize: vertical; min-height: 80px; }

  /* Options */
  .aq-options-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .aq-hint {
    font-size: 0.72rem;
    color: #94a3b8;
  }

  .aq-options-list { display: flex; flex-direction: column; gap: 8px; }

  .aq-option-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .aq-option-label {
    font-size: 0.78rem;
    font-weight: 700;
    color: #94a3b8;
    width: 18px;
    flex-shrink: 0;
    text-align: center;
  }

  .aq-option-input { flex: 1; }

  .aq-correct-toggle {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    flex-shrink: 0;
    user-select: none;
  }

  .aq-correct-toggle input[type="checkbox"] {
    width: 15px;
    height: 15px;
    cursor: pointer;
    accent-color: #16a34a;
  }

  .aq-correct-label {
    font-size: 0.75rem;
    color: #64748b;
    white-space: nowrap;
  }

  .aq-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 5px;
    color: #94a3b8;
    display: flex;
    align-items: center;
    transition: background .15s, color .15s;
    flex-shrink: 0;
  }
  .aq-icon-btn:hover { background: #fee2e2; color: #dc2626; }

  .aq-add-option-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 8px;
    background: none;
    border: 1px dashed #cbd5e1;
    border-radius: 7px;
    padding: 6px 14px;
    font-size: 0.78rem;
    color: #64748b;
    cursor: pointer;
    transition: border-color .15s, color .15s, background .15s;
  }
  .aq-add-option-btn:hover { border-color: #3b82f6; color: #2563eb; background: #eff6ff; }

  /* Bulk helpers */
  .aq-bulk-list { display: flex; flex-direction: column; }

  .aq-add-question-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px;
    background: none;
    border: 2px dashed #cbd5e1;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: border-color .15s, color .15s, background .15s;
  }
  .aq-add-question-btn:hover { border-color: #6366f1; color: #4f46e5; background: #f5f3ff; }

  .aq-remove-q-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: #ef4444;
    padding: 4px 8px;
  }
  .aq-remove-q-btn:hover { background: #fee2e2; color: #b91c1c; }

  /* Footer */
  .aq-panel-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-top: 1px solid #f1f5f9;
    background: #fafafa;
    flex-shrink: 0;
    gap: 12px;
  }

  .aq-q-count {
    font-size: 0.78rem;
    color: #94a3b8;
    font-weight: 500;
    white-space: nowrap;
  }

  .aq-footer-actions {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }

  .aq-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: background .15s, transform .1s;
    white-space: nowrap;
  }
  .aq-btn:active { transform: scale(.97); }
  .aq-btn:disabled { opacity: .6; cursor: not-allowed; }

  .aq-btn-ghost {
    background: transparent;
    border: 1px solid #e2e8f0;
    color: #475569;
  }
  .aq-btn-ghost:hover:not(:disabled) { background: #f1f5f9; }

  .aq-btn-primary {
    background: #4f46e5;
    color: #fff;
    box-shadow: 0 1px 4px rgba(79,70,229,.3);
  }
  .aq-btn-primary:hover:not(:disabled) { background: #4338ca; }

  /* Inline spinner */
  .aq-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: aq-spin .7s linear infinite;
    display: inline-block;
  }
  @keyframes aq-spin { to { transform: rotate(360deg); } }

  /* Responsive */
  @media (max-width: 600px) {
    .aq-panel { max-width: 100%; }
  }
`;

export default AddExamQuestions;
