// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import styles from "../auth.module.css";

// export default function RegisterPage() {
//   const [displayName, setDisplayName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [agreed, setAgreed] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // handle register
//   };

//   return (
//     <div className={styles.page}>
//       <div className={styles.card}>
//         {/* Brand */}
//         <div className={styles.brand}>
//           <span className={styles.brandNormal}>Becoming </span>
//           <span className={styles.brandItalic}>Blooming</span>
//         </div>
//         <p className={styles.subtitle}>
//           Tạo tài khoản để lưu bài và bình luận{" "}
//           <span className={styles.flowerIcon}>🌿</span>
//         </p>

//         {/* Google */}
//         <button className={styles.socialBtn}>
//           <GoogleIcon />
//           <span>Tiếp tục với Google</span>
//         </button>

//         {/* Divider */}
//         <div className={styles.divider}>
//           <span className={styles.dividerLine} />
//           <span className={styles.dividerText}>hoặc</span>
//           <span className={styles.dividerLine} />
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} noValidate>
//           <div className={styles.field}>
//             <label className={styles.label} htmlFor="displayName">
//               Tên hiển thị
//             </label>
//             <input
//               id="displayName"
//               className={styles.input}
//               type="text"
//               placeholder="Tên của bạn"
//               value={displayName}
//               onChange={(e) => setDisplayName(e.target.value)}
//               autoComplete="name"
//             />
//           </div>

//           <div className={styles.field}>
//             <label className={styles.label} htmlFor="email">
//               Email
//             </label>
//             <input
//               id="email"
//               className={styles.input}
//               type="email"
//               placeholder="email@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               autoComplete="email"
//             />
//           </div>

//           <div className={styles.field}>
//             <label className={styles.label} htmlFor="password">
//               Mật khẩu
//             </label>
//             <input
//               id="password"
//               className={styles.input}
//               type="password"
//               placeholder="Ít nhất 8 ký tự"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               autoComplete="new-password"
//             />
//           </div>

//           <div className={styles.field}>
//             <label className={styles.label} htmlFor="confirm">
//               Xác nhận mật khẩu
//             </label>
//             <input
//               id="confirm"
//               className={styles.input}
//               type="password"
//               placeholder="Nhập lại mật khẩu"
//               value={confirm}
//               onChange={(e) => setConfirm(e.target.value)}
//               autoComplete="new-password"
//             />
//           </div>

//           <div className={styles.checkboxRow}>
//             <input
//               id="agree"
//               type="checkbox"
//               className={styles.checkbox}
//               checked={agreed}
//               onChange={(e) => setAgreed(e.target.checked)}
//             />
//             <label htmlFor="agree" className={styles.checkboxLabel}>
//               Mình đồng ý với{" "}
//               <Link href="/terms" className={styles.checkboxLink}>
//                 điều khoản sử dụng
//               </Link>{" "}
//               và{" "}
//               <Link href="/privacy" className={styles.checkboxLink}>
//                 chính sách quyền riêng tư
//               </Link>
//             </label>
//           </div>

//           <button
//             type="submit"
//             className={`${styles.submitBtn} ${styles.submitBtnFlower} `}
//             disabled={!agreed}
//           >
//             Tạo tài khoản🌸
//           </button>
//         </form>

//         <p className={styles.switchText}>
//           Đã có tài khoản?{" "}
//           <Link href="/login" className={styles.switchLink}>
//             Đăng nhập
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// function GoogleIcon() {
//   return (
//     <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//       <path
//         d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
//         fill="#4285F4"
//       />
//       <path
//         d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
//         fill="#34A853"
//       />
//       <path
//         d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
//         fill="#FBBC05"
//       />
//       <path
//         d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
//         fill="#EA4335"
//       />
//     </svg>
//   );
// }
// ----------------------------
// import AuthCard from "@/components/common/AuthCard";
// import Link from "next/link";

// export default function RegisterPage() {
//   return (
//     <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#f7f2ed] bg-[radial-gradient(ellipse_65%_55%_at_10%_15%,#fce8eb_0%,transparent_65%),radial-gradient(ellipse_55%_45%_at_90%_85%,#dcefd8_0%,transparent_65%),radial-gradient(ellipse_40%_40%_at_55%_50%,#f9f2ee_0%,transparent_70%)] px-4 py-4 before:pointer-events-none before:absolute before:left-[4%] before:top-[8%] before:h-[120px] before:w-[180px] before:rotate-[-20deg] before:rounded-[50%_0_50%_0] before:bg-[#f2a7b0] before:opacity-[0.18] before:content-[''] after:pointer-events-none after:absolute after:bottom-[8%] after:right-[5%] after:h-[90px] after:w-[140px] after:rotate-[15deg] after:rounded-[50%_0_50%_0] after:bg-[#a8c89a] after:opacity-[0.18] after:content-[''] max-[520px]:px-3.5">
//       <div className="relative z-[1] max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-[40px]">
//         <AuthCard
//         title=""
//         subtitle="Tạo tài khoản để lưu bài và bình luận ✨"
//         footer={
//           <>
//             Đã có tài khoản?{" "}
//             <Link
//               href="/login"
//               className="text-rose-200 font-bold hover:text-sage-300 transition-colors underline"
//             >
//               Đăng nhập
//             </Link>
//           </>
//         }
//         >
//           <form className="space-y-3 text-left">
//           <div>
//             <label className="text-xs font-bold text-sage-800/40 uppercase ml-2 mb-1 block tracking-widest">
//               Tên hiển thị
//             </label>
//             <input
//               className="input-field border-rose-100"
//               placeholder="Tên của bạn"
//             />
//           </div>
//           <div>
//             <label className="text-xs font-bold text-sage-800/40 uppercase ml-2 mb-1 block tracking-widest">
//               Email
//             </label>
//             <input
//               type="email"
//               className="input-field border-rose-100"
//               placeholder="email@example.com"
//             />
//           </div>
//           <div>
//             <label className="text-xs font-bold text-sage-800/40 uppercase ml-2 mb-1 block tracking-widest">
//               Mật khẩu
//             </label>
//             <input
//               className="input-field border-rose-100"
//               type="password"
//               placeholder="Ít nhất 8 ký tự"
//             />
//           </div>
//           <div className="ml-1 mt-3 flex items-start gap-2">
//             <input type="checkbox" className="mt-1 accent-rose-200" />
//             <p className="text-xs text-sage-800/50 leading-relaxed">
//               Mình đồng ý với{" "}
//               <span className="text-rose-200 underline">
//                 điều khoản sử dụng
//               </span>{" "}
//               và{" "}
//               <span className="text-rose-200 underline">
//                 chính sách quyền riêng tư
//               </span>
//             </p>
//           </div>
//           <button
//             type="submit"
//             className="mt-4 w-full rounded-xl border border-rose-100 bg-rose-50 py-3 font-bold text-rose-200 transition-colors hover:bg-rose-100"
//           >
//             Tạo tài khoản 🌸
//           </button>
//           </form>
//         </AuthCard>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import Link from "next/link";
import { signInWithGoogle } from "@/services/auth.service";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return new URLSearchParams(window.location.search).get("error");
  });

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setGoogleError(null);

    const { error } = await signInWithGoogle();

    if (error) {
      console.error("[auth.google.start]", error);
      setGoogleError(error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex flex-1 w-full items-center justify-center overflow-y-auto bg-[#f7f2ed] bg-[radial-gradient(ellipse_65%_55%_at_10%_15%,#fce8eb_0%,transparent_65%),radial-gradient(ellipse_55%_45%_at_90%_85%,#dcefd8_0%,transparent_65%),radial-gradient(ellipse_40%_40%_at_55%_50%,#f9f2ee_0%,transparent_70%)] px-4 py-3 before:pointer-events-none before:absolute before:left-[4%] before:top-[8%] before:h-[120px] before:w-[180px] before:rotate-[-20deg] before:rounded-[50%_0_50%_0] before:bg-[#f2a7b0] before:opacity-[0.18] before:content-[''] after:pointer-events-none after:absolute after:bottom-[8%] after:right-[5%] after:h-[90px] after:w-[140px] after:rotate-[15deg] after:rounded-[50%_0_50%_0] after:bg-[#a8c89a] after:opacity-[0.18] after:content-[''] max-[520px]:px-3.5">
      <section
        className="relative z-[1] w-full max-w-[370px] max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[20px] border border-[#f0e6e0] bg-white px-8 pb-7 pt-8 text-center text-[#3a2520] shadow-[0_4px_32px_rgba(74,44,42,0.07)] max-[520px]:rounded-[14px] max-[520px]:px-[18px] max-[520px]:pb-[26px] max-[520px]:pt-7"
        aria-labelledby="register-title"
      >
        <h1
          id="register-title"
          className="mb-2 mt-0 font-serif text-2xl font-semibold leading-[1.2]"
        >
          <span className="text-[#d96e83]">Becoming </span>
          <span className="text-[#6b9b84] italic">Blooming</span>
        </h1>

        <p className="mb-5 mt-0 font-sans text-xs leading-normal text-[#b09090]">
          Tạo tài khoản để lưu bài và bình luận{" "}
          <span className="text-xs text-[#6b9b84]" aria-hidden="true">
            🌿
          </span>
        </p>

        <div className="grid gap-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="inline-flex min-h-9 w-full items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-[#ead9d3] bg-white font-sans text-xs font-normal leading-none text-[#3a2520] transition duration-150 hover:-translate-y-px hover:border-[#f2a7b0] hover:bg-[#fdf6f0]"
          >
            <GoogleIcon />
            <span>{isGoogleLoading ? "Đang chuyển hướng..." : "Tiếp tục với Google"}</span>
          </button>
        </div>
        {googleError && (
          <p className="mt-2 rounded-lg bg-[#fff1f2] px-3 py-2 text-left font-sans text-xs leading-relaxed text-[#be123c]">
            {googleError}
          </p>
        )}

        <div className="my-3 flex items-center gap-2.5">
          <span className="h-px flex-1 bg-[#ead9d3]" />
          <span className="font-sans text-xs text-[#b09090]">hoặc</span>
          <span className="h-px flex-1 bg-[#ead9d3]" />
        </div>

        <form className="text-left">
          <div className="mb-3">
            <label
              className="mb-[5px] block font-sans text-xs font-medium leading-tight text-[#7a5a55]"
              htmlFor="displayName"
            >
              Tên hiển thị
            </label>
            <input
              id="displayName"
              className="box-border block w-full min-w-0 rounded-lg border-[1.5px] border-[#2e1e1c] bg-[#2a1917] px-[13px] py-[9px] font-sans text-xs font-normal leading-tight text-[#fdf6f0] outline-none transition placeholder:text-[#6a4a48] focus:border-[#c9606e] focus:shadow-[0_0_0_3px_rgba(201,96,110,0.12)]"
              type="text"
              placeholder="Tên của bạn"
              autoComplete="name"
            />
          </div>

          <div className="mb-3">
            <label
              className="mb-[5px] block font-sans text-xs font-medium leading-tight text-[#7a5a55]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              className="box-border block w-full min-w-0 rounded-lg border-[1.5px] border-[#2e1e1c] bg-[#2a1917] px-[13px] py-[9px] font-sans text-xs font-normal leading-tight text-[#fdf6f0] outline-none transition placeholder:text-[#6a4a48] focus:border-[#c9606e] focus:shadow-[0_0_0_3px_rgba(201,96,110,0.12)]"
              type="email"
              placeholder="email@example.com"
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label
              className="mb-[5px] block font-sans text-xs font-medium leading-tight text-[#7a5a55]"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="password"
                className="box-border block w-full min-w-0 rounded-lg border-[1.5px] border-[#2e1e1c] bg-[#2a1917] px-[13px] py-[9px] pr-10 font-sans text-xs font-normal leading-tight text-[#fdf6f0] outline-none transition placeholder:text-[#6a4a48] focus:border-[#c9606e] focus:shadow-[0_0_0_3px_rgba(201,96,110,0.12)]"
                type={showPassword ? "text" : "password"}
                placeholder="Ít nhất 8 ký tự"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a4a48] hover:text-[#c9606e] transition-colors"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label
              className="mb-[5px] block font-sans text-xs font-medium leading-tight text-[#7a5a55]"
              htmlFor="confirm"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                id="confirm"
                className="box-border block w-full min-w-0 rounded-lg border-[1.5px] border-[#2e1e1c] bg-[#2a1917] px-[13px] py-[9px] pr-10 font-sans text-xs font-normal leading-tight text-[#fdf6f0] outline-none transition placeholder:text-[#6a4a48] focus:border-[#c9606e] focus:shadow-[0_0_0_3px_rgba(201,96,110,0.12)]"
                type={showConfirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a4a48] hover:text-[#c9606e] transition-colors"
                aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </div>

          <div className="mb-4 mt-3 flex items-start gap-2">
            <input
              id="agree"
              type="checkbox"
              className="mt-0.5 accent-[#c9606e] shrink-0"
            />
            <label
              htmlFor="agree"
              className="font-sans text-xs leading-relaxed text-[#b09090]"
            >
              Mình đồng ý với{" "}
              <Link
                href="/terms"
                className="text-[#c9606e] no-underline hover:text-[#e8768a] hover:underline"
              >
                điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link
                href="/privacy"
                className="text-[#c9606e] no-underline hover:text-[#e8768a] hover:underline"
              >
                chính sách quyền riêng tư
              </Link>
            </label>
          </div>

          <button
            type="button"
            className="w-full mb-3.5 mt-1 cursor-pointer rounded-[10px] border-0 bg-[#c9606e] px-4 py-2.5 font-sans text-sm font-medium leading-tight text-white transition duration-150 hover:-translate-y-px hover:bg-[#e8768a] hover:shadow-[0_4px_14px_rgba(201,96,110,0.28)]"
          >
            Tạo tài khoản 🌸
          </button>
        </form>

        <p className="m-0 font-sans text-xs leading-snug text-[#b09090]">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-medium text-[#c9606e] no-underline hover:text-[#e8768a] hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </section>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}
