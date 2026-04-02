"use client";

import Image from "next/image";
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_34%,#f8fafc_100%)]">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 md:px-6">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#103b73_0%,#1d4f91_28%,#2f6eb7_62%,#ea580c_100%)] p-10 text-white lg:block">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute left-8 top-8 h-40 w-40 rounded-full bg-sky-200 blur-3xl" />
              <div className="absolute bottom-10 right-10 h-44 w-44 rounded-full bg-orange-200 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl" />
            </div>

            <div className="relative">
              <div className="mb-8">
                <Image
                  src="/brand/logo-horizontal.png"
                  alt="premat logo"
                  width={300}
                  height={90}
                  className="h-auto w-[210px]"
                  priority
                />
              </div>

              <div className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-white/90 backdrop-blur">
                YÖNETİM GİRİŞİ
              </div>

              <h1 className="mt-5 max-w-md text-4xl font-black leading-tight tracking-[-0.03em]">
                İçerik yönetimi için
                <span className="block text-blue-100">kontrollü giriş</span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-blue-50 md:text-base">
                Arşivdeki içeriklerin düzenlenmesi, yeni kayıt eklenmesi ve
                seçili dökümanların yönetimi bu alandan yapılır.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  "Seçili içerik yönetimi",
                  "Düzenli arşiv akışı",
                  "Hızlı ve sade kontrol alanı",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm font-semibold text-white/95 backdrop-blur"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-[1.6rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <div className="text-xs font-semibold tracking-[0.08em] text-blue-100">
                  PANEL NOTU
                </div>
                <p className="mt-3 text-sm leading-7 text-white/90">
                  Bu ekran yalnızca yönetim tarafı içindir. Ziyaretçi akışıyla
                  karışmaması için sade ama kontrollü tutulur.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 lg:p-12">
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-5 lg:mx-0">
                <Image
                  src="/brand/logo-square.png"
                  alt="premat kare logo"
                  width={140}
                  height={140}
                  className="h-auto w-[84px] md:w-[94px]"
                  priority
                />
              </div>

              <div className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-blue-800">
                PREMAT PANEL
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] text-slate-950">
                İçerik girişi
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Devam etmek için e-posta ve şifreni gir. Bu alan yalnızca içerik
                yönetimi için kullanılır.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  E-posta
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                  placeholder="ornek@mail.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
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
                className="w-full rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </button>
            </form>

            <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-500">
                Erişim Notu
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Yetkisiz girişlere açık bir sayfa değildir. Buradaki işlem akışı
                yalnızca panel kullanımına ayrılmıştır.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}