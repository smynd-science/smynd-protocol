# پروتکل Smynd

این ریپو برای آزمایش‌ها و توسعه عمومیِ لایه اثبات Smynd ساخته شده است: اثبات مشارکت پژوهشی، اثبات تأیید، رجیستری عمومی proof و ابزارهایی که بتوانند بدون افشای داده خام کاربر، مشارکت پژوهشی را قابل بررسی کنند.

این ریپو جایگزین وب‌سایت اصلی Smynd نیست و کد backend، دیتابیس، احراز هویت، سیستم پاداش، منطق ضدتقلب یا اطلاعات واقعی کاربران را منتشر نمی‌کند.

## هدف اصلی

هدف این است که بتوانیم به شکل عمومی و قابل بررسی نشان دهیم:

- یک مشارکت پژوهشی انجام شده است؛
- یک مشارکت توسط صادرکننده معتبر تأیید شده است؛
- proof قابل verify است؛
- داده خام کاربر، پاسخ‌ها، ایمیل، شماره تماس، IP و اطلاعات حساس فاش نمی‌شود؛
- اگر proof اشتباه صادر شد، امکان revoke وجود دارد.

## وضعیت فعلی

وضعیت: آزمایشی / غیرتولیدی.

این ریپو برای توسعه عمومی، جلب مشارکت، شفاف‌سازی معماری و ساخت نمونه اولیه مناسب است. برای استفاده تولیدی، مالی، قانونی، پزشکی یا هویتی، audit و review جداگانه لازم است.

## شروع سریع

```bash
npm install
npm run lint
npm run test
npm run build
npm run contract:compile
npm run contract:test
npm run proof:hash -- examples/sample-proof.json
```

## چه چیزی نباید در این ریپو باشد؟

```text
داده واقعی کاربران
پاسخ‌های questionnaire
داده خام cognitive task
ایمیل، موبایل، IP، نام کاربر
کلید خصوصی، secret، token
منطق داخلی ضدتقلب
کد اصلی backend یا frontend محصول
```

## ساختار ریپو

```text
contracts/      قراردادهای آزمایشی Solidity
src/            ابزارهای TypeScript برای proof و hashing
cli/            ابزار خط فرمان
scripts/        اسکریپت deploy و bootstrap گیت‌هاب
examples/       نمونه‌های synthetic و غیرواقعی
docs/           مستندات معماری، حریم خصوصی و threat model
test/           تست‌ها
.github/        CI، issue template و PR template
```

## نام پیشنهادی ریپو

```text
smynd-protocol
```

توضیح ریپو در GitHub:

```text
Open protocol experiments for privacy-preserving research proofs and future Smynd ecosystem primitives
```
