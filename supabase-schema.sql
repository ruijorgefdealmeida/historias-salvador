-- Corre isto uma vez no Supabase: SQL Editor → New query → colar → Run
-- Só o e-mail autorizado consegue ler os capítulos e ver as fotografias.

create table if not exists public.capitulos (
  numero   int primary key,
  titulo   text not null,
  slug     text not null unique,
  fase     text not null,
  legenda  text,
  texto    text not null,
  foto     text,              -- nome do ficheiro no bucket "fotos"
  largura  int,
  altura   int,
  criado_em timestamptz default now()
);

create or replace function public.leitor_autorizado() returns boolean
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) in ('lurdesalvado_76@hotmail.com')
$$;

alter table public.capitulos enable row level security;
drop policy if exists "leitura publica" on public.capitulos;
drop policy if exists "so leitor autorizado" on public.capitulos;
create policy "so leitor autorizado" on public.capitulos
  for select to authenticated using (public.leitor_autorizado());

-- Bucket PRIVADO para as fotografias
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', false)
on conflict (id) do update set public = false;

drop policy if exists "fotos so leitor autorizado" on storage.objects;
create policy "fotos so leitor autorizado" on storage.objects
  for select to authenticated using (bucket_id = 'fotos' and public.leitor_autorizado());
