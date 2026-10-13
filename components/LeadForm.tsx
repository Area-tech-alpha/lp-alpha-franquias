"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  INVESTMENT_OPTIONS,
  PROFILE_OPTIONS,
  UTM_KEYS,
  maskPhoneBR,
  validateLead,
  type LeadErrors,
  type LeadFields,
} from "@/lib/lead";

const LEAD_ENDPOINT = "/api/lead";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY: LeadFields = { nome: "", email: "", whatsapp: "", perfil: "", investimento: "" };
const FIELD_ORDER: (keyof LeadFields)[] = ["nome", "email", "whatsapp", "perfil", "investimento"];

const subscribeNoop = () => () => {};

const fieldClass =
  "block h-[54px] w-full rounded-[4px] bg-field px-6 text-[17px] leading-[1.3] text-ink outline-none placeholder:text-ink/50 focus-visible:ring-2 focus-visible:ring-brand/60 aria-invalid:ring-2 aria-invalid:ring-brand lg:h-[55px] lg:text-[22px]";

function Chevron() {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-6 h-2 w-3 -translate-y-1/2 text-ink"
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
  const formRef = useRef<HTMLFormElement>(null);

  // Query string lida só no client (vazia no HTML do servidor), sem setState em efeito.
  const search = useSyncExternalStore(subscribeNoop, () => window.location.search, () => "");
  const utms = useMemo(() => {
    const params = new URLSearchParams(search);
    return Object.fromEntries(UTM_KEYS.map((key) => [key, params.get(key) ?? ""]));
  }, [search]);

  function update(name: keyof LeadFields, value: string) {
    setFields((prev) => ({ ...prev, [name]: name === "whatsapp" ? maskPhoneBR(value) : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const found = validateLead(fields);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((name) => found[name]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, ...utms, page_url: window.location.href }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      setFields(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="mt-[25px] rounded-[4px] bg-field px-6 py-8 text-center lg:mt-[25.5px]">
        <p className="text-[20px] leading-[1.3] font-bold text-maroon lg:text-[22px]">Inscrição confirmada!</p>
        <p className="mt-2 text-[16px] leading-[1.5] text-[#48433f]">
          Você vai receber as informações de acesso no e-mail e no WhatsApp informados.
        </p>
      </div>
    );
  }

  const errorText = (name: keyof LeadFields) =>
    errors[name] ? (
      <p id={`${name}-erro`} className="mt-1 text-[13px] leading-[1.4] text-brand">
        {errors[name]}
      </p>
    ) : null;

  const a11y = (name: keyof LeadFields) => ({
    id: name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-erro` : undefined,
  });

  const selectClass = (value: string) => `${fieldClass} appearance-none pr-12 ${value ? "" : "text-ink/50"}`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-[31px] lg:mt-[25.5px]">
      {UTM_KEYS.map((key) => (
        <input key={key} type="hidden" name={key} value={utms[key]} />
      ))}

      <fieldset disabled={status === "loading"} className="space-y-4">
        <div>
          <label htmlFor="nome" className="sr-only">Nome</label>
          <input
            {...a11y("nome")}
            type="text"
            autoComplete="name"
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
            placeholder="* E-mail"
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            className={fieldClass}
          />
          {errorText("email")}
        </div>
        <div>
          <label htmlFor="whatsapp" className="sr-only">WhatsApp</label>
          <input
            {...a11y("whatsapp")}
            type="tel"
            autoComplete="tel-national"
            inputMode="numeric"
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
                <option key={option} value={option} className="text-ink">{option}</option>
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
                <option key={option} value={option} className="text-ink">{option}</option>
              ))}
            </select>
            <Chevron />
          </div>
          {errorText("investimento")}
        </div>
      </fieldset>

      {status === "error" && (
        <p role="alert" className="mt-4 text-[14px] leading-[1.4] text-brand">
          Não foi possível concluir sua inscrição. Verifique sua conexão e tente novamente.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        className="mt-[40px] flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[4px] bg-brand px-2 py-3 text-center text-[14px] leading-[1.3] font-bold text-white uppercase transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-80 lg:mt-[51px] lg:text-[16px]"
      >
        {status === "loading" && (
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {status === "loading" ? "Enviando..." : "Garantir minha vaga gratuita na live do dia 26"}
      </button>
    </form>
  );
}
