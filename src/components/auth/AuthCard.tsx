// src/components/common/AuthCard.tsx
import React from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ subtitle, children, footer }) => {
  return (
    <div className="w-full max-w-md rounded-[32px] border border-rose-100 bg-white p-6 text-center shadow-xl md:p-8">
      {/* Icon hoa đặc trưng */}
      <div className="text-rose-200 text-4xl mb-4 flex justify-center">🌸</div>

      {/* Logo phối màu */}
      <h2 className="font-serif text-2xl mb-2 flex justify-center items-center gap-2">
        <span className="text-[#d96e83]">Becoming</span>
        <span className="text-[#6b9b84] ">Blooming</span>
      </h2>
      <p className="mb-5 text-sm text-sage-800/60">{subtitle}</p>

      <div className="mb-5 space-y-4">
        {/* Nút Google chuẩn thiết kế */}
        <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium">
          <img
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google"
            className="w-5"
          />
          Tiếp tục với Google
        </button>
      </div>

      {/* Dải phân cách "hoặc" */}
      <div className="relative my-5">
        <hr className="border-rose-100/50" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs  text-rose-100">
          hoặc
        </span>
      </div>

      {children}

      <div className="mt-5 text-xs text-sage-800/60">{footer}</div>
    </div>
  );
};

export default AuthCard;
