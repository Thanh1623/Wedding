-- Chạy trong SQL Editor của project Supabase.

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  attendance text not null check (attendance in ('yes', 'no')),
  guests int not null default 0 check (guests >= 0 and guests <= 20),
  message text not null default '',
  created_at timestamptz not null default now()
);

alter table rsvps enable row level security;
-- Không tạo policy: khách không đọc/ghi trực tiếp. App dùng service_role trên server.
