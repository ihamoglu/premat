"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function PanelLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/panel");
    }
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const result = await login(email, password);

    if (!result.ok) {
      setError(result.message || "Giriş başarısız.");
      setSubmitting(false);
      return;
    }

    setError("");
    setSubmitting(false);
    router.push("/panel");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_35%,#f8fafc_100%)]">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 md:px-6">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden bg-[linear-gradient(180deg,#103b73_0%,#2f69b3_100%)] p-10 text-white lg:block">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-sky-200 blur-3xl" />
              <div className="absolute bottom-10 right-10 h-44 w-44 rounded-full bg-blue-300 blur-3xl" />
            </div>

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                <span className="text-xl">🦉</span>
                premat.com
              </div>

              <h1 className="max-w-md text-4xl font-black leading-tight">
                İçerik Yönetimi İçin
                <span className="block text-blue-100">Kontrollü Giriş</span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-blue-100 md:text-base">
                Arşivdeki içeriklerin düzenlenmesi, yeni kayıt eklenmesi ve seçili
                dokümanların yönetimi bu alandan yapılır.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Seçili içerik yönetimi",
                  "Düzenli arşiv akışı",
                  "Hızlı ve sade kontrol alanı",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm font-bold text-white/95 backdrop-blur"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-orange-500 text-xl text-white shadow-lg lg:mx-0">
                🦉
              </div>

              <h2 className="text-3xl font-black text-slate-900">
                Yönetim Girişi
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Devam etmek için e-posta ve şifreni gir.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  E-posta
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
                  placeholder="ornek@mail.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
                  placeholder="Şifre"
                  required
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-blue-800 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-800/20 transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </button>
            </form>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-500">
                Erişim Notu
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Bu alan yalnızca içerik yönetimi için kullanılır.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}