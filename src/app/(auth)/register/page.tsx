"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle register
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.brandNormal}>Becoming </span>
          <span className={styles.brandItalic}>Blooming</span>
        </div>
        <p className={styles.subtitle}>
          Tạo tài khoản để lưu bài và bình luận{" "}
          <span className={styles.flowerIcon}>🌿</span>
        </p>

        {/* Google */}
        <button className={styles.socialBtn}>
          <GoogleIcon />
          <span>Tiếp tục với Google</span>
        </button>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>hoặc</span>
          <span className={styles.dividerLine} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="displayName">
              Tên hiển thị
            </label>
            <input
              id="displayName"
              className={styles.input}
              type="text"
              placeholder="Tên của bạn"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Mật khẩu
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              placeholder="Ít nhất 8 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirm">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirm"
              className={styles.input}
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.checkboxRow}>
            <input
              id="agree"
              type="checkbox"
              className={styles.checkbox}
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree" className={styles.checkboxLabel}>
              Mình đồng ý với{" "}
              <Link href="/terms" className={styles.checkboxLink}>
                điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className={styles.checkboxLink}>
                chính sách quyền riêng tư
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className={`${styles.submitBtn} ${styles.submitBtnFlower} `}
            disabled={!agreed}
          >
            Tạo tài khoản🌸
          </button>
        </form>

        <p className={styles.switchText}>
          Đã có tài khoản?{" "}
          <Link href="/login" className={styles.switchLink}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
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
