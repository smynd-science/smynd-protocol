#!/bin/bash

# ۱. دریافت آخرین تغییرات از مخزن گیت
git pull

# تعیین فرمت تاریخ و زمان برای نام فایل نهایی (مثال: 2026-06-13_11-52)
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")

# تعیین مسیر دایرکتوری جدید در مسیر والد (استفاده از تیک ثانیه برای دایرکتوری موقت)
NEW_DIR="../project_snapshot_$(date +%s)"
mkdir -p "$NEW_DIR"

# ۲. کپی کردن تمام محتویات دایرکتوری فعلی (.) به دایرکتوری جدید
# از a- استفاده می‌کنیم تا فایل‌های پنهان (مثل .env) هم به درستی کپی شوند
cp -a . "$NEW_DIR"

# ۳. حذف پوشه‌های اضافی و کش‌ها از دایرکتوری جدید

rm -rf "$NEW_DIR/node_modules"
rm -rf "$NEW_DIR/.git"
rm -rf "$NEW_DIR/.pytest_cache"
rm -rf "$NEW_DIR/.venv"

# ۴. رفتن به دایرکتوری جدید برای اجرای دستور شما
cd "$NEW_DIR" || exit

# اجرای دستور برای چسباندن فایل‌های متنی و ذخیره با نام تاریخ‌دار
find . -type f -exec sh -c '
  for f; do
    if file --mime-type "$f" | grep -q text/; then
      printf "\n\n--- [%s] ---\n" "$f"
      cat "$f"
    fi
  done
' sh {} + > "../all_text_files_${TIMESTAMP}.txt"

# بازگشت به دایرکتوری اولیه
cd - > /dev/null
rm -rf "$NEW_DIR"

echo "✅ عملیات انجام شد. فایل نهایی در ../all_text_files_${TIMESTAMP}.txt ذخیره شده است."
