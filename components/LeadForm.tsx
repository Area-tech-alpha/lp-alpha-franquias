"use client";

import { useEffect, useRef, useState } from "react";
import { brandButtonClass } from "@/components/CtaButton";
import {
  INVESTMENT_OPTIONS,
  PROFILE_OPTIONS,
  maskPhoneBR,
  suggestEmail,
  validateField,
  validateLead,
  type LeadErrors,
  type LeadFields,
} from "@/lib/lead";
import { captureTracking, getTracking } from "@/lib/tracking";

const LEAD_ENDPOINT = "/api/lead";

const SERVER_ERROR = "Não conseguimos registrar sua inscrição agora. Tente novamente em instantes.";
const NETWORK_ERROR = "Não foi possível enviar. Verifique sua conexão e tente novamente.";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY: LeadFields = { nome: "", email: "", whatsapp: "", perfil: "", investimento: "" };
const FIELD_ORDER: (keyof LeadFields)[] = ["nome", "email", "whatsapp", "perfil", "investimento"];

// font-size ≥16px em todos os breakpoints evita o zoom automático do iOS.
const fieldClass =
  "block h-[54px] w-full rounded-[4px] bg-field px-5 text-[17px] leading-[1.3] text-fg outline-none placeholder:text-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus aria-invalid:outline-2 aria-invalid:outline-solid aria-invalid:outline-danger lg:h-[55px] lg:px-6 lg:text-[20px]";

function Chevron() {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-5 h-2 w-3 -translate-y-1/2 text-fg lg:right-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M1 1l5 5 5-5" />
    </svg>
  );
}

export function LeadForm() {
  const [fields, setFields] = useState<LeadFields>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Guarda as UTMs do primeiro acesso para não se perderem em refresh/navegação.
  useEffect(() => {
    captureTracking();
  }, []);

  function update(name: keyof LeadFields, value: string) {
    setFields((prev) => ({ ...prev, [name]: name === "whatsapp" ? maskPhoneBR(value) : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validateOnBlur(name: keyof LeadFields) {
    setErrors((prev) => ({ ...prev, [name]: validateField(name, fields[name]) }));
  }

  function showErrors(found: LeadErrors) {
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((name) => found[name]);
    if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
    return Boolean(firstInvalid);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    setSubmitError("");
    if (showErrors(validateLead(fields))) return;

    setStatus("loading");
    let res: Response;
    try {
      res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          ...getTracking(),
          page_url: window.location.href,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          website: honeypotRef.current?.value ?? "",
        }),
      });
    } catch (err) {
      console.error("[lead] erro de rede ao enviar inscrição", err);
      setSubmitError(NETWORK_ERROR);
      setStatus("error");
      return;
    }

    if (res.ok) {
      setStatus("success");
      setFields(EMPTY);
      return;
    }

    const data = (await res.json().catch(() => null)) as { error?: string; errors?: LeadErrors } | null;
    console.error("[lead] inscrição recusada", res.status, data);
    if (res.status === 400) {
      setStatus("idle");
      if (!showErrors(data?.errors ?? {})) setSubmitError(data?.error ?? SERVER_ERROR);
      return;
    }
    setSubmitError(SERVER_ERROR);
    setStatus("error");
  }

  const emailSuggestion = suggestEmail(fields.email);

  if (status === "success") {
    return (
      <div role="status" className="mt-7 rounded-[4px] bg-field px-6 py-8 text-center">
        <p className="text-[20px] leading-[1.3] font-bold text-accent lg:text-[22px]">Inscrição confirmada!</p>
        <p className="mt-2 text-[16px] leading-[1.5] text-fg-muted">
          Você vai receber o link de acesso no seu WhatsApp e e-mail.
        </p>
      </div>
    );
  }

  const errorText = (name: keyof LeadFields) =>
    errors[name] ? (
      <p id={`${name}-erro`} className="mt-1.5 text-[14px] leading-[1.4] text-danger">
        {errors[name]}
      </p>
    ) : null;

  const a11y = (name: keyof LeadFields) => ({
    id: name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-erro` : undefined,
    onBlur: () => validateOnBlur(name),
  });

  const selectClass = (value: string) => `${fieldClass} appearance-none pr-12 ${value ? "" : "text-fg-muted"}`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-7 lg:mt-[25.5px]">
      {/* Honeypot: invisível para pessoas, bots costumam preencher. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input ref={honeypotRef} id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset disabled={status === "loading"} className="space-y-4">
        <div>
          <label htmlFor="nome" className="sr-only">Nome</label>
          <input
            {...a11y("nome")}
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            placeholder="* Nome"
            value={fields.nome}
            onChange={(e) => update("nome", e.target.value)}
            className={fieldClass}
          />
          {errorText("nome")}
        </div>
        <div>
          <label htmlFor="email" className="sr-only">E-mail</label>
          <input
            {...a11y("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="* E-mail"
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            className={fieldClass}
          />
          {emailSuggestion && (
            <button
              type="button"
              onClick={() => update("email", emailSuggestion)}
              className="mt-1.5 text-left text-[14px] leading-[1.4] text-accent underline underline-offset-2"
            >
              Você quis dizer @{emailSuggestion.split("@")[1]}?
            </button>
          )}
          {errorText("email")}
        </div>
        <div>
          <label htmlFor="whatsapp" className="sr-only">WhatsApp</label>
          <input
            {...a11y("whatsapp")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="* WhatsApp"
            value={fields.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            className={fieldClass}
          />
          {errorText("whatsapp")}
        </div>
        <div>
          <label htmlFor="perfil" className="sr-only">Qual seu perfil?</label>
          <div className="relative">
            <select
              {...a11y("perfil")}
              value={fields.perfil}
              onChange={(e) => update("perfil", e.target.value)}
              className={selectClass(fields.perfil)}
            >
              <option value="" disabled>* Qual seu perfil?</option>
              {PROFILE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <Chevron />
          </div>
          {errorText("perfil")}
        </div>
        <div>
          <label htmlFor="investimento" className="sr-only">Quanto tem para investir?</label>
          <div className="relative">
            <select
              {...a11y("investimento")}
              value={fields.investimento}
              onChange={(e) => update("investimento", e.target.value)}
              className={selectClass(fields.investimento)}
            >
              <option value="" disabled>* Quanto tem para investir?</option>
              {INVESTMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <Chevron />
          </div>
          {errorText("investimento")}
        </div>
      </fieldset>

      {submitError && (
        <p role="alert" className="mt-4 text-[14px] leading-[1.4] text-danger">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        className={`${brandButtonClass} mt-8 min-h-[56px] gap-3 px-3 py-3 text-center text-[14px] leading-[1.3] disabled:cursor-wait disabled:opacity-80 lg:mt-[51px] lg:text-[16px]`}
      >
        {status === "loading" && (
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-on-brand/30 border-t-on-brand" />
        )}
        {status === "loading" ? "Enviando..." : "Garantir minha vaga gratuita na live do dia 26"}
      </button>
    </form>
  );
}
