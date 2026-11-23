-- Diagnósticos (CID) e refração lidos do histórico do EyecareBI, para classificar os grupos de risco da aba Exames.
-- A leitura é feita na aba do EyecareBI (somente leitura lá) e gravada aqui pelas funções abaixo.
-- A chave não fica no repositório: só o hash dela.
create table if not exists public.paciente_cid (
  paciente_id   text primary key,          -- id do paciente no EyecareBI
  nome          text,
  cids          text[] not null default '{}',  -- "H269 - Catarata não especificada", ...
  esf_min       numeric,                   -- grau esférico mais negativo encontrado (miopia)
  ultima_data   date,                      -- último atendimento lido
  atualizado_em timestamptz not null default now()
);
alter table public.paciente_cid enable row level security;
drop policy if exists p_pac_cid on public.paciente_cid;
create policy p_pac_cid on public.paciente_cid for select to authenticated using (autorizado());

create or replace function public._chave_cid_ok(chave text) returns boolean language sql immutable as $$
  select encode(sha256(convert_to(coalesce(chave,''),'UTF8')),'hex') = 'e4ce03b1d4e8bfca01a0ee4dfc276f85eb4a0810a4ff4b868bd9c215fc53f5d3'
$$;

-- Pacientes do EyecareBI ainda não lidos, ou com atendimento novo depois da última leitura (mais recentes primeiro)
create or replace function public.cid_pendentes(chave text, lim int default 150)
returns table(paciente_id text, nome text, unidade text, ultima date)
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
begin
  if not public._chave_cid_ok(chave) then raise exception 'chave inválida'; end if;
  return query
  with a as (
    select t.paciente_id, max(t.paciente) as nome, max(t.unidade) as unidade, max(t.data) as ultima
    from atendimentos t
    where t.origem = 'eyecare' and t.paciente_id is not null and t.status = 'FINISHED'
    group by t.paciente_id)
  select a.paciente_id, a.nome, a.unidade, a.ultima
  from a left join paciente_cid c on c.paciente_id = a.paciente_id
  where c.paciente_id is null or a.ultima > coalesce(c.ultima_data, '1900-01-01')
  order by (c.paciente_id is null) desc, a.ultima desc
  limit greatest(1, least(coalesce(lim,150), 400));
end $$;

-- Grava o que foi lido (só acrescenta / atualiza; nunca apaga)
create or replace function public.receber_cid(chave text, itens jsonb)
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public._chave_cid_ok(chave) then raise exception 'chave inválida'; end if;
  insert into paciente_cid(paciente_id, nome, cids, esf_min, ultima_data, atualizado_em)
  select x->>'paciente_id', x->>'nome',
         coalesce(array(select jsonb_array_elements_text(x->'cids')), '{}'),
         nullif(x->>'esf_min','')::numeric, nullif(x->>'ultima','')::date, now()
  from jsonb_array_elements(itens) x
  where coalesce(x->>'paciente_id','') <> ''
  on conflict (paciente_id) do update set nome = excluded.nome, cids = excluded.cids,
    esf_min = excluded.esf_min, ultima_data = greatest(paciente_cid.ultima_data, excluded.ultima_data), atualizado_em = now();
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.cid_pendentes(text,int) from public;
revoke all on function public.receber_cid(text,jsonb) from public;
grant execute on function public.cid_pendentes(text,int) to anon, authenticated;
grant execute on function public.receber_cid(text,jsonb) to anon, authenticated;
