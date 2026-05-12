"use client";

import Image from "next/image";
import { Coffee, QrCode, X } from "lucide-react";
import { useState } from "react";

export function BuyMeCoffeeCard() {
  const [showQrCode, setShowQrCode] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/90 bg-[#fffefd]/95 shadow-[0_24px_70px_rgba(45,62,47,0.1)] ring-1 ring-rose-100/70 backdrop-blur-md">
      <div className="relative h-40 overflow-hidden">
        <Image
          src="/images/donate.png"
          alt=""
          fill
          sizes="300px"
          className="object-cover object-[50%_62%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fffefd]/10 to-[#fffefd]"
        />
      </div>

      <div className="relative -mt-2 px-6 pb-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-rose-100" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b58375]">
            Support
          </p>
          <div className="h-px flex-1 bg-rose-100" />
        </div>

        <h3 className="text-center font-serif text-2xl font-normal leading-[1.35] tracking-normal text-text_primary">
          Buy me a coffee
        </h3>
        <p className="mt-4 text-center text-[13px] leading-7 text-[#8a7474]">
          Nếu bạn tìm thấy cảm hứng hay giá trị tích cực từ bài viết này, hãy
          ủng hộ để Becoming Blooming có thêm nguồn lực duy trì và phát triển
          bền vững. Một tách cà phê nhỏ từ bạn sẽ là nguồn tiếp sức ý nghĩa cho
          mình trên hành trình viết lách này.
        </p>

        <button
          type="button"
          aria-expanded={showQrCode}
          aria-controls="buy-me-coffee-qr"
          onClick={() => setShowQrCode((current) => !current)}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-[#7b6262] shadow-[0_10px_26px_rgba(214,156,161,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-400"
        >
          {showQrCode ? (
            <>
              <X className="h-4 w-4" />
              Ẩn mã QR
            </>
          ) : (
            <>
              <Coffee className="h-4 w-4" />
              Gửi một tách cà phê
            </>
          )}
        </button>

        <div
          id="buy-me-coffee-qr"
          className={`grid transition-all duration-500 ease-out ${
            showQrCode
              ? "mt-5 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-[24px] border border-rose-100 bg-white/90 p-3 shadow-[0_14px_36px_rgba(64,47,47,0.08)]">
              <Image
                src="/images/QR_code.jpg"
                alt="Mã QR ủng hộ Becoming Blooming"
                width={1080}
                height={1066}
                sizes="252px"
                className="h-auto w-full rounded-[18px]"
              />
            </div>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[#b09090]">
              <QrCode className="h-3.5 w-3.5" />
              Scan QR để gửi một tách cà phê
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
