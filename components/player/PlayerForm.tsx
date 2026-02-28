"use client";

import { FormEvent, useMemo, useState } from "react";

type PlayerFormValues = {
  name: string;
  trueFact1: string;
  trueFact2: string;
  falseFact1: string;
};

type PlayerFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: PlayerFormValues) => Promise<void>;
  error: string | null;
};

const FACT_LIMIT = 60;
const NAME_LIMIT = 60;

export function PlayerForm({ isSubmitting, onSubmit, error }: PlayerFormProps) {
  const [name, setName] = useState("");
  const [trueFact1, setTrueFact1] = useState("");
  const [trueFact2, setTrueFact2] = useState("");
  const [falseFact1, setFalseFact1] = useState("");

  const isValid = useMemo(() => {
    return (
      name.trim().length > 0 &&
      trueFact1.trim().length > 0 &&
      trueFact2.trim().length > 0 &&
      falseFact1.trim().length > 0
    );
  }, [falseFact1, name, trueFact1, trueFact2]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || isSubmitting) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      trueFact1,
      trueFact2,
      falseFact1,
    });
  }

  return (
    <section className="mx-auto w-full max-w-2xl rounded-3xl border-4 border-indigo-100 bg-white p-8 shadow-[0_16px_0_0_rgba(49,46,129,1)] sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-extrabold text-indigo-700">Join The Room</h2>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-indigo-700">
          Two truths + one lie
        </span>
      </div>
      <p className="mt-2 text-indigo-900">
        Keep each fact short and punchy. The host will generate the Kahoot file in one click.
      </p>
      <div className="mt-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-indigo-700">
          Quick tips
        </p>
        <ul className="mt-2 grid gap-1 text-sm font-semibold text-indigo-800 sm:grid-cols-2">
          <li>Use specific details for fun guesses.</li>
          <li>Facts are capped at 60 characters each.</li>
          <li>One statement should be believable but false.</li>
          <li>Do not include sensitive personal info.</li>
        </ul>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="block text-xs font-black uppercase tracking-[0.12em] text-indigo-800"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            maxLength={NAME_LIMIT}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border-4 border-indigo-200 px-4 py-3 text-indigo-950 outline-none ring-0 transition-all focus:-translate-y-px focus:border-indigo-500 focus:shadow-[0_8px_0_0_rgba(99,102,241,0.35)]"
            placeholder="Your name"
            required
          />
          <p className="text-xs font-semibold text-indigo-500">Max {NAME_LIMIT} characters.</p>
        </div>

        <FactInput
          id="true_fact_1"
          label="True Fact 1"
          value={trueFact1}
          onChange={setTrueFact1}
          placeholder="Example: I can solve a Rubik's cube in under 2 minutes."
        />
        <FactInput
          id="true_fact_2"
          label="True Fact 2"
          value={trueFact2}
          onChange={setTrueFact2}
          placeholder="Example: I learned to bake sourdough bread this year."
        />
        <FactInput
          id="false_fact_1"
          label="False Fact 1"
          value={falseFact1}
          onChange={setFalseFact1}
          placeholder="Example: I have never had pizza in my life."
        />

        {error ? (
          <p
            aria-live="assertive"
            className="rounded-xl border-2 border-rose-200 bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full rounded-xl bg-yellow-400 px-6 py-4 text-lg font-black text-indigo-950 shadow-[0_8px_0_0_rgba(202,138,4,1)] transition-all enabled:hover:brightness-105 enabled:active:translate-y-[2px] enabled:active:shadow-[0_6px_0_0_rgba(202,138,4,1)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Facts"}
        </button>
      </form>
    </section>
  );
}

type FactInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

function FactInput({ id, label, value, onChange, placeholder }: FactInputProps) {
  const remaining = FACT_LIMIT - value.length;

  return (
    <div className="space-y-2 rounded-2xl bg-indigo-50 p-4">
      <div className="flex items-center justify-between">
        <label
          className="block text-xs font-black uppercase tracking-[0.12em] text-indigo-800"
          htmlFor={id}
        >
          {label}
        </label>
        <span
          className={`text-sm font-black ${remaining <= 10 ? "text-rose-600" : "text-indigo-700"}`}
        >
          {value.length}/{FACT_LIMIT}
        </span>
      </div>
      <textarea
        id={id}
        name={id}
        maxLength={FACT_LIMIT}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-xl border-4 border-indigo-200 bg-white px-4 py-3 text-indigo-950 outline-none ring-0 transition-all focus:-translate-y-px focus:border-indigo-500 focus:shadow-[0_8px_0_0_rgba(99,102,241,0.25)]"
        required
      />
      <div className="h-2 overflow-hidden rounded-full bg-indigo-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${(value.length / FACT_LIMIT) * 100}%` }}
        />
      </div>
    </div>
  );
}
