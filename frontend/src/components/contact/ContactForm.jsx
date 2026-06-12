import { useState, useRef, useCallback, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import ContactSuccessState from "./ContactSuccessState";

const CATEGORIES = ["Bug Report", "Feature Request", "Partnership", "General"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_DEFAULTS = {
  General: { name: "", email: "", message: "" },
  "Bug Report": {
    email: "",
    platform: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
  },
  "Feature Request": {
    email: "",
    platform: "",
    description: "",
  },
  Partnership: { company: "", email: "", proposal: "" },
};

const FIELD_LABELS = {
  General: {
    name: "Name",
    email: "Email",
    message: "Message",
  },
  "Bug Report": {
    email: "Email",
    platform: "Platform",
    stepsToReproduce: "Steps to Reproduce",
    expectedBehavior: "Expected Behavior",
    actualBehavior: "Actual Behavior",
  },
  "Feature Request": {
    email: "Email",
    platform: "Platform",
    description: "Description",
  },
  Partnership: {
    company: "Company",
    email: "Email",
    proposal: "Proposal",
  },
};

const FIELD_TYPES = {
  company: "text",
  name: "text",
  email: "email",
  platform: "text",
  message: "textarea",
  stepsToReproduce: "textarea",
  expectedBehavior: "textarea",
  actualBehavior: "textarea",
  description: "textarea",
  proposal: "textarea",
};

const FIELD_MAX_LENGTH = {
  name: 100,
  company: 100,
  platform: 100,
  email: 254,
  message: 2000,
  stepsToReproduce: 2000,
  expectedBehavior: 1000,
  actualBehavior: 1000,
  description: 2000,
  proposal: 2000,
};

function validateEmail(email) {
  return EMAIL_RE.test(email);
}

function buildValidator() {
  return function validateField(name, value) {
    if (name === "email") {
      if (!value) return "Email is required";
      if (!validateEmail(value)) return "Invalid email address";
    }
    if (name === "name" && !value) return "Name is required";
    if (name === "company" && !value) return "Company is required";
    if (name === "platform" && !value) return "Platform is required";
    if (name === "message" && !value) return "Message is required";
    if (name === "stepsToReproduce" && !value)
      return "Steps to reproduce is required";
    if (name === "expectedBehavior" && !value)
      return "Expected behavior is required";
    if (name === "actualBehavior" && !value)
      return "Actual behavior is required";
    if (name === "description" && !value) return "Description is required";

    if (name === "proposal" && !value) return "Proposal is required";
    return null;
  };
}

function isFormValid(category, values) {
  const fields = Object.keys(FIELD_LABELS[category]);
  for (const field of fields) {
    const trimmed = (values[field] || "").trim();
    if (!trimmed) return false;
    if (field === "email" && !validateEmail(trimmed)) return false;
  }
  return true;
}

function AutoTextarea({ value, onChange, onBlur, maxLength, id, name, required, placeholder, hasError, hasSuccess }) {
  const ref = useRef(null);
  const handleInput = useCallback((e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
    onChange(e);
  }, [onChange]);

  return (
    <textarea
      ref={ref}
      id={id}
      name={name}
      value={value}
      onChange={handleInput}
      onBlur={onBlur}
      maxLength={maxLength}
      required={required}
      placeholder={placeholder}
      rows={3}
      className={`block w-full border bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-all duration-200 resize-none focus:outline-none focus:ring-2 focus:ring-offset-0 ${
        hasError
          ? "border-red-400 focus:ring-red-400"
          : hasSuccess
          ? "border-neutral-400 focus:ring-neutral-400"
          : "border-neutral-200 focus:ring-neutral-900"
      }`}
      aria-invalid={hasError || undefined}
      aria-describedby={hasError ? `${id}-error` : undefined}
    />
  );
}

function TextInput({ value, onChange, onBlur, type, id, name, required, placeholder, hasError, hasSuccess }) {
  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        className={`block w-full border bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 pr-10 ${
          hasError
            ? "border-red-400 focus:ring-red-400"
            : hasSuccess
            ? "border-neutral-400 focus:ring-neutral-400"
            : "border-neutral-200 focus:ring-neutral-900"
        }`}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      {name === "email" && value && validateEmail(value) && (
        <Check className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-900" />
      )}
    </div>
  );
}

export default function ContactForm() {
  const [category, setCategory] = useState("General");
  const [values, setValues] = useState(FIELD_DEFAULTS["General"]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = useMemo(() => buildValidator(), []);

  const switchCategory = useCallback((cat) => {
    setCategory(cat);
    setValues(FIELD_DEFAULTS[cat]);
    setErrors({});
    setTouched({});
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      const newValues = { ...values, [name]: value };
      setValues(newValues);
      if (touched[name]) {
        const err = validate(name, value);
        setErrors((prev) => ({ ...prev, [name]: err }));
      }
    },
    [values, touched, validate],
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const err = validate(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    },
    [validate],
  );

  const valid = useMemo(() => isFormValid(category, values), [category, values]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!valid || submitting) return;
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 1500);
    },
    [valid, submitting],
  );

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setValues(FIELD_DEFAULTS["General"]);
    setErrors({});
    setTouched({});
    setCategory("General");
  }, []);

  const fields = Object.entries(FIELD_LABELS[category]);

  const currentMaxLength = useCallback(
    (fieldName) => FIELD_MAX_LENGTH[fieldName] || 2000,
    [],
  );

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ContactSuccessState category={category} onReset={handleReset} />
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-0">
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => switchCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
                    category === cat
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:text-neutral-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              {fields.map(([name, label]) => {
                const type = FIELD_TYPES[name] || "text";
                const maxLen = currentMaxLength(name);
                const val = values[name] || "";
                const err = errors[name];
                const isTouched = touched[name];
                const hasError = isTouched && !!err;
                const hasSuccess =
                  isTouched && !err && (name === "email" ? validateEmail(val) : !!val.trim());
                const inputId = `contact-${category}-${name}`;

                return (
                  <div key={name}>
                    <label
                      htmlFor={inputId}
                      className="mb-1.5 block text-xs font-medium text-neutral-500"
                    >
                      {label}
                      <span className="text-neutral-300 ml-0.5">*</span>
                    </label>

                    {type === "textarea" ? (
                      <AutoTextarea
                        id={inputId}
                        name={name}
                        value={val}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={maxLen}
                        required
                        placeholder={`Enter ${label.toLowerCase()}`}
                        hasError={hasError}
                        hasSuccess={hasSuccess}
                      />
                    ) : (
                      <TextInput
                        id={inputId}
                        name={name}
                        type={type}
                        value={val}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder={`Enter ${label.toLowerCase()}`}
                        hasError={hasError}
                        hasSuccess={hasSuccess}
                      />
                    )}

                    {type === "textarea" && (
                      <div className="mt-1 flex justify-between items-center">
                        {hasError ? (
                          <p
                            id={`${inputId}-error`}
                            className="text-xs text-red-500"
                            role="alert"
                          >
                            {err}
                          </p>
                        ) : (
                          <span />
                        )}
                        <span className="text-xs text-neutral-400 font-mono">
                          {val.length} / {maxLen}
                        </span>
                      </div>
                    )}

                    {type !== "textarea" && hasError && (
                      <p
                        id={`${inputId}-error`}
                        className="mt-1 text-xs text-red-500"
                        role="alert"
                      >
                        {err}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={!valid || submitting}
                className="inline-flex items-center justify-center gap-2 bg-neutral-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
