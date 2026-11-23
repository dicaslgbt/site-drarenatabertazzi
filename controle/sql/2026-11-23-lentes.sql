-- Especificação da lente (catarata) em cada caso de cirurgia.
-- Fonte: prontuário (EyecareBI / Amigo) tem prioridade; planilha só preenche quando o prontuário não tem nada;
-- o que a equipe editar à mão no portal (lente_fonte = 'manual') nunca é sobrescrito pela sincronização.
alter table public.casos add column if not exists lente_modelo text;
alter table public.casos add column if not exists lente_torica boolean;
alter table public.casos add column if not exists lente_dioptria_od text;
alter table public.casos add column if not exists lente_dioptria_oe text;
alter table public.casos add column if not exists lente_fonte text;      -- 'prontuario' | 'planilha' | 'manual'
alter table public.casos add column if not exists lente_conferir boolean default false;
alter table public.casos add column if not exists lente_trechos jsonb;   -- trechos originais [{data, origem, texto}]
alter table public.casos add column if not exists lente_em timestamptz;
