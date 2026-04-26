// Mente — All app screens. Render inside iOS or Android frame.
// Usage: <Screen name="dashboard" /> — picks the right screen component.

const TINTS = [
  "m-bg-primary",
  "m-bg-mint",
  "m-bg-amber",
  "m-bg-violet",
  "m-bg-sky",
  "m-bg-rose",
  "m-bg-coral",
  "m-bg-slate",
];
const initials = (name) =>
  name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
const tintFor = (name) =>
  TINTS[(name.charCodeAt(0) + name.length) % TINTS.length];

// ─── Shared chrome ───────────────────────────────────────────────
function AppBar({ title, subtitle, leading, trailing, big = true }) {
  return (
    <div
      className="m-appbar"
      style={{ paddingTop: big ? 12 : 8, paddingBottom: 8 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {leading}
        <div>
          {subtitle && <div className="m-appbar__sub">{subtitle}</div>}
          <div className="m-appbar__title" style={{ fontSize: big ? 28 : 20 }}>
            {title}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>{trailing}</div>
    </div>
  );
}

function IconBtn({ icon, badge, onClick }) {
  return (
    <button
      className={`m-appbar__icon ${badge ? "m-appbar__icon--badge" : ""}`}
      onClick={onClick}
      style={{ position: "relative", border: "none", cursor: "pointer" }}
    >
      <Icon name={icon} size={19} />
    </button>
  );
}

function TabBar({ active = "home", variant = "floating" }) {
  const tabs = [
    { id: "home", label: "Início", icon: "home" },
    { id: "patients", label: "Pacientes", icon: "users" },
    { id: "agenda", label: "Agenda", icon: "calendar" },
    { id: "wallet", label: "Financeiro", icon: "wallet" },
    { id: "settings", label: "Mais", icon: "settings" },
  ];
  const cls = `m-tabbar m-tabbar--${variant === "classic" ? "classic" : variant === "fab" ? "fab" : "floating"}`;
  if (variant === "fab") {
    // 4 tabs + center FAB
    const left = tabs.slice(0, 2);
    const right = tabs.slice(3, 5);
    return (
      <div className={cls}>
        <div className="m-fab">
          <Icon name="plus" size={26} stroke={2.4} />
        </div>
        {left.map((t) => (
          <div
            key={t.id}
            className={`m-tab ${active === t.id ? "m-tab--active" : ""}`}
          >
            <div className="m-tab__icon-wrap">
              <Icon name={t.icon} size={20} />
            </div>
            <span>{t.label}</span>
          </div>
        ))}
        <div style={{ width: 56 }} />
        {right.map((t) => (
          <div
            key={t.id}
            className={`m-tab ${active === t.id ? "m-tab--active" : ""}`}
          >
            <div className="m-tab__icon-wrap">
              <Icon name={t.icon} size={20} />
            </div>
            <span>{t.label}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={cls}>
      {tabs.map((t) => (
        <div
          key={t.id}
          className={`m-tab ${active === t.id ? "m-tab--active" : ""}`}
        >
          <div className="m-tab__icon-wrap">
            <Icon name={t.icon} size={20} />
          </div>
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Sample data ─────────────────────────────────────────────────
const PATIENTS = [
  {
    name: "Marina Albuquerque",
    tag: "Ansiedade",
    last: "há 3 dias",
    phone: "(11) 9 8821-4452",
    sessions: 18,
  },
  {
    name: "João Pedro Vasconcelos",
    tag: "TDAH",
    last: "há 1 semana",
    phone: "(21) 9 9763-1142",
    sessions: 7,
  },
  {
    name: "Beatriz Carvalho",
    tag: "Casal",
    last: "hoje",
    phone: "(11) 9 9012-3357",
    sessions: 24,
  },
  {
    name: "Rafael Tognon",
    tag: "Luto",
    last: "há 2 dias",
    phone: "(11) 9 9988-1023",
    sessions: 4,
  },
  {
    name: "Letícia Almeida",
    tag: "Adolescente",
    last: "há 4 dias",
    phone: "(11) 9 7710-2298",
    sessions: 11,
  },
  {
    name: "Henrique Sá",
    tag: "Burnout",
    last: "amanhã",
    phone: "(11) 9 8001-9876",
    sessions: 9,
  },
];

const TODAY_APPTS = [
  {
    time: "09:00",
    name: "Beatriz Carvalho",
    kind: "Presencial",
    status: "done",
  },
  { time: "11:30", name: "Marina Albuquerque", kind: "Online", status: "done" },
  { time: "14:00", name: "Rafael Tognon", kind: "Presencial", status: "next" },
  {
    time: "16:30",
    name: "Letícia Almeida",
    kind: "Online",
    status: "scheduled",
  },
  {
    time: "18:00",
    name: "Henrique Sá",
    kind: "Presencial",
    status: "scheduled",
  },
];

// ─────────────────────────────────────────────────────────────────
// 1. LOGIN
// ─────────────────────────────────────────────────────────────────
function ScreenLogin() {
  return (
    <div className="m-screen" style={{ background: "#0f172a" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--m-grad-mesh)",
          opacity: 0.95,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 50,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: 999,
          background: "rgba(255,255,255,0.1)",
          filter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 200,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: 999,
          background: "rgba(255,255,255,0.07)",
        }}
      />

      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "60px 24px 24px",
          color: "white",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Icon name="brain" size={28} stroke={2} color="white" />
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          Mente
        </div>
        <div style={{ fontSize: 15, opacity: 0.8, marginTop: 8 }}>
          Gestão da sua prática clínica.
          <br />
          Simples, segura, perto de você.
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 20,
            color: "var(--m-ink-900)",
            boxShadow: "0 24px 60px -20px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.01em" }}
          >
            Entrar
          </div>
          <div
            style={{ fontSize: 13, color: "var(--m-ink-500)", marginTop: 4 }}
          >
            Use seu e-mail profissional
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div className="m-field">
              <div className="m-field__label">E-mail</div>
              <div
                className="m-input"
                style={{ display: "flex", alignItems: "center" }}
              >
                nathaly.bruza@clinica.com
              </div>
            </div>
            <div className="m-field">
              <div className="m-field__label">Senha</div>
              <div
                className="m-input"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "var(--m-ink-500)",
                }}
              >
                <span>•••••••••••</span>
                <Icon name="lock" size={16} />
              </div>
            </div>
          </div>

          <button
            className="m-btn m-btn--primary m-btn--full m-btn--lg"
            style={{ marginTop: 16 }}
          >
            Entrar <Icon name="arrow" size={18} stroke={2.2} />
          </button>
          <div
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "var(--m-ink-500)",
              marginTop: 14,
            }}
          >
            Esqueceu sua senha?{" "}
            <span style={{ color: "var(--m-primary-600)", fontWeight: 700 }}>
              Recuperar
            </span>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            opacity: 0.7,
            marginTop: 18,
          }}
        >
          Sem conta?{" "}
          <span style={{ fontWeight: 700, color: "white" }}>Crie a sua</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 2. DASHBOARD
// ─────────────────────────────────────────────────────────────────
function ScreenDashboard({ tabVariant }) {
  return (
    <div className="m-screen">
      <AppBar
        title="Nathaly Bruza"
        subtitle="QUARTA, 26 ABR"
        trailing={
          <>
            <IconBtn icon="search" />
            <IconBtn icon="bell" badge />
          </>
        }
      />
      <div className="m-scroll">
        <div className="m-hero m-fade">
          <div className="m-hero__greet">Bom trabalho hoje 🌱</div>
          <div className="m-hero__name">2 sessões em sequência</div>
          <div className="m-hero__msg">
            Próxima atende às <strong>14h</strong> com Rafael Tognon. Você tem
            35 min para uma pausa.
          </div>
          <div className="m-hero__cta">
            Ver agenda <Icon name="chevron" size={14} stroke={2.4} />
          </div>
        </div>

        <div className="m-section-title">
          <span>Resumo</span>
          <span className="m-section-title__action">Esta semana</span>
        </div>

        <div className="m-grid-2">
          <StatTile
            color="m-bg-primary"
            icon="users"
            label="Pacientes ativos"
            value="48"
            delta="+3"
          />
          <StatTile
            color="m-bg-mint"
            icon="calendar"
            label="Sessões na semana"
            value="22"
            delta="+12%"
          />
          <StatTile
            color="m-bg-amber"
            icon="wallet"
            label="Receita do mês"
            value="R$ 14,8k"
            delta="+8%"
          />
          <StatTile
            color="m-bg-violet"
            icon="clock"
            label="Tempo médio"
            value="52min"
            delta="−2min"
            down
          />
          <StatTile
            color="m-bg-sky"
            icon="check"
            label="Taxa de presença"
            value="94%"
            delta="+1%"
          />
          <StatTile
            color="m-bg-coral"
            icon="heart"
            label="Retenção 90d"
            value="86%"
            delta="+4%"
          />
        </div>

        <div className="m-section-title">
          <span>Hoje</span>
          <span className="m-section-title__action">Ver tudo</span>
        </div>

        {TODAY_APPTS.slice(0, 3).map((a) => (
          <ApptRow key={a.time} {...a} />
        ))}

        <div className="m-section-title">
          <span>Alertas</span>
        </div>

        <div
          className="m-card m-fade"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <div
            className="m-avatar m-bg-amber"
            style={{ width: 38, height: 38, borderRadius: 12 }}
          >
            <Icon name="bell" size={18} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              3 prontuários sem nota
            </div>
            <div
              style={{ fontSize: 12, color: "var(--m-ink-500)", marginTop: 2 }}
            >
              Sessões da semana passada precisam de evolução.
            </div>
          </div>
          <Icon name="chevron" size={18} color="var(--m-ink-400)" />
        </div>

        <div style={{ height: 8 }} />

        <div
          className="m-card m-fade"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <div
            className="m-avatar m-bg-coral"
            style={{ width: 38, height: 38, borderRadius: 12 }}
          >
            <Icon name="wallet" size={18} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              2 pagamentos atrasados
            </div>
            <div
              style={{ fontSize: 12, color: "var(--m-ink-500)", marginTop: 2 }}
            >
              R$ 480 em aberto · enviar lembrete
            </div>
          </div>
          <Icon name="chevron" size={18} color="var(--m-ink-400)" />
        </div>
      </div>
      <TabBar active="home" variant={tabVariant} />
    </div>
  );
}

function StatTile({ color, icon, label, value, delta, down }) {
  return (
    <div className="m-stat m-fade">
      <div className={`m-stat__icon ${color}`}>
        <Icon name={icon} size={18} color="white" />
      </div>
      <div>
        <div className="m-stat__value">{value}</div>
        <div className="m-stat__label">{label}</div>
      </div>
      {delta && (
        <div className={`m-stat__delta ${down ? "m-stat__delta--down" : ""}`}>
          {delta}
        </div>
      )}
    </div>
  );
}

function ApptRow({ time, name, kind, status }) {
  const chipCls =
    status === "done"
      ? "m-chip m-chip--mint"
      : status === "next"
        ? "m-chip m-chip--primary"
        : "m-chip";
  const label =
    status === "done"
      ? "Concluída"
      : status === "next"
        ? "Próxima"
        : "Agendada";
  return (
    <div className="m-row m-fade">
      <div style={{ width: 52, textAlign: "center" }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "var(--m-ink-900)",
            letterSpacing: "-0.02em",
          }}
        >
          {time}
        </div>
        <div
          style={{ fontSize: 10, color: "var(--m-ink-400)", fontWeight: 600 }}
        >
          50 min
        </div>
      </div>
      <div
        style={{
          width: 1,
          alignSelf: "stretch",
          background: "var(--m-ink-150)",
        }}
      />
      <div className={`m-avatar ${tintFor(name)}`}>{initials(name)}</div>
      <div style={{ flex: 1 }}>
        <div className="m-row__title">{name}</div>
        <div
          className="m-row__sub"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <Icon
            name={kind === "Online" ? "video" : "pin"}
            size={11}
            color="var(--m-ink-500)"
          />
          {kind}
        </div>
      </div>
      <span className={chipCls}>
        <span className="m-chip__dot"></span>
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 3. PATIENTS LIST
// ─────────────────────────────────────────────────────────────────
function ScreenPatients({ tabVariant }) {
  return (
    <div className="m-screen">
      <AppBar
        title="Pacientes"
        subtitle="48 ATIVOS"
        trailing={
          <>
            <IconBtn icon="filter" />
            <IconBtn icon="plus" />
          </>
        }
      />
      <div className="m-scroll">
        <div className="m-input m-input--search" style={{ marginBottom: 6 }}>
          <Icon name="search" size={17} />
          <input placeholder="Buscar por nome ou telefone" />
        </div>
        <div className="m-filter-row">
          <div className="m-filter m-filter--active">Todos · 48</div>
          <div className="m-filter">Ansiedade</div>
          <div className="m-filter">TDAH</div>
          <div className="m-filter">Casal</div>
          <div className="m-filter">Adolescente</div>
        </div>
        <div className="m-section-title" style={{ margin: "12px 4px 8px" }}>
          <span>Em atendimento</span>
          <span className="m-section-title__action">Ordenar</span>
        </div>
        {PATIENTS.map((p) => (
          <div className="m-row m-fade" key={p.name}>
            <div className={`m-avatar ${tintFor(p.name)}`}>
              {initials(p.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="m-row__title"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {p.name}
              </div>
              <div
                className="m-row__sub"
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                <span
                  className="m-chip m-chip--primary"
                  style={{ padding: "2px 8px", fontSize: 10 }}
                >
                  {p.tag}
                </span>
                <span>{p.sessions} sessões</span>
              </div>
            </div>
            <div className="m-row__right">
              <div
                style={{
                  fontSize: 11,
                  color: "var(--m-ink-500)",
                  fontWeight: 600,
                }}
              >
                Última
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--m-ink-800)",
                }}
              >
                {p.last}
              </div>
            </div>
          </div>
        ))}
      </div>
      <TabBar active="patients" variant={tabVariant} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 4. PATIENT DETAIL
// ─────────────────────────────────────────────────────────────────
function ScreenPatientDetail({ tabVariant }) {
  const p = PATIENTS[0];
  return (
    <div className="m-screen">
      <AppBar
        title="Paciente"
        big={false}
        leading={<IconBtn icon="arrowback" />}
        trailing={
          <>
            <IconBtn icon="edit" />
            <IconBtn icon="more" />
          </>
        }
      />
      <div className="m-scroll">
        {/* Hero card */}
        <div className="m-card m-card--gradient m-fade" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="m-avatar"
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                fontSize: 20,
              }}
            >
              {initials(p.name)}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                }}
              >
                {p.name}
              </div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
                34 anos · Desde mar/2023
              </div>
            </div>
          </div>
          <div
            style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}
          >
            <span className="m-chip m-chip--ghost">
              <Icon name="brain" size={11} />
              Ansiedade
            </span>
            <span className="m-chip m-chip--ghost">
              <Icon name="clock" size={11} />
              Quartas 11h30
            </span>
            <span className="m-chip m-chip--ghost">
              <Icon name="video" size={11} />
              Online
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <div className="m-hero__cta" style={{ marginTop: 0 }}>
              <Icon name="msg" size={13} />
              Mensagem
            </div>
            <div className="m-hero__cta" style={{ marginTop: 0 }}>
              <Icon name="phone" size={13} />
              Ligar
            </div>
            <div
              className="m-hero__cta"
              style={{ marginTop: 0, marginLeft: "auto" }}
            >
              <Icon name="calendar" size={13} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="m-grid-3" style={{ marginTop: 14 }}>
          <MiniStat label="Sessões" value="18" />
          <MiniStat label="Presença" value="94%" />
          <MiniStat label="Em aberto" value="R$ 0" />
        </div>

        <div className="m-section-title">
          <span>Próximas sessões</span>
          <span className="m-section-title__action">Agendar</span>
        </div>
        <div className="m-row m-fade">
          <div style={{ width: 50, textAlign: "center" }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--m-primary-600)",
                fontWeight: 700,
              }}
            >
              QUA
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--m-ink-900)",
                letterSpacing: "-0.02em",
              }}
            >
              03
            </div>
            <div style={{ fontSize: 10, color: "var(--m-ink-400)" }}>MAI</div>
          </div>
          <div
            style={{
              width: 1,
              alignSelf: "stretch",
              background: "var(--m-ink-150)",
            }}
          />
          <div style={{ flex: 1 }}>
            <div className="m-row__title">11h30 · Sessão online</div>
            <div className="m-row__sub">50 min · Google Meet</div>
          </div>
          <span className="m-chip m-chip--primary">
            <span className="m-chip__dot"></span>Confirmada
          </span>
        </div>

        <div className="m-section-title">
          <span>Últimas evoluções</span>
          <span className="m-section-title__action">Todas</span>
        </div>
        {[
          {
            date: "19 ABR · QUA",
            title: "Sessão #18 · Trabalho cognitivo",
            body: "Avançamos com reestruturação de pensamentos automáticos no contexto profissional. Marina relatou melhora no sono.",
          },
          {
            date: "12 ABR · QUA",
            title: "Sessão #17 · Identificação",
            body: "Mapeamento de gatilhos e padrões durante a semana. Lição de casa: diário de pensamentos.",
          },
        ].map((n) => (
          <div
            className="m-card m-fade"
            key={n.date}
            style={{ marginBottom: 10 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="m-chip m-chip--primary">{n.date}</span>
              <Icon name="more" size={16} color="var(--m-ink-400)" />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 10 }}>
              {n.title}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--m-ink-600)",
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              {n.body}
            </div>
          </div>
        ))}
      </div>
      <TabBar active="patients" variant={tabVariant} />
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div
      className="m-card"
      style={{ padding: "12px 10px", textAlign: "center" }}
    >
      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "var(--m-ink-500)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 5. AGENDA
// ─────────────────────────────────────────────────────────────────
function ScreenAgenda({ tabVariant }) {
  const days = [
    { d: 24, w: "SEG", dot: 2 },
    { d: 25, w: "TER", dot: 1 },
    { d: 26, w: "QUA", dot: 5, active: true },
    { d: 27, w: "QUI", dot: 3 },
    { d: 28, w: "SEX", dot: 4 },
    { d: 29, w: "SÁB", dot: 0 },
    { d: 30, w: "DOM", dot: 0 },
  ];
  return (
    <div className="m-screen">
      <AppBar
        title="Agenda"
        subtitle="ABRIL · 2026"
        trailing={
          <>
            <IconBtn icon="search" />
            <IconBtn icon="filter" />
          </>
        }
      />
      <div className="m-scroll">
        {/* Week strip */}
        <div className="m-card m-card--elev m-fade" style={{ padding: 14 }}>
          <div
            style={{ display: "flex", gap: 6, justifyContent: "space-between" }}
          >
            {days.map((d) => (
              <div
                key={d.d}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 14,
                  textAlign: "center",
                  background: d.active
                    ? "var(--m-grad-primary)"
                    : "transparent",
                  color: d.active ? "white" : "var(--m-ink-700)",
                  boxShadow: d.active ? "var(--m-shadow-glow)" : "none",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    opacity: d.active ? 0.85 : 0.6,
                  }}
                >
                  {d.w}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    marginTop: 2,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {d.d}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    marginTop: 4,
                    height: 4,
                  }}
                >
                  {Array.from({ length: Math.min(d.dot, 4) }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 999,
                        background: d.active
                          ? "rgba(255,255,255,0.85)"
                          : "var(--m-primary-400)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="m-section-title">
          <span>Quarta · 26 abril</span>
          <span className="m-section-title__action">5 sessões</span>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: 8 }}>
          {TODAY_APPTS.map((a, i) => (
            <TimelineItem
              key={a.time}
              {...a}
              last={i === TODAY_APPTS.length - 1}
            />
          ))}
        </div>
      </div>
      <TabBar active="agenda" variant={tabVariant} />
    </div>
  );
}

function TimelineItem({ time, name, kind, status, last }) {
  const colorMap = {
    done: {
      bg: "var(--m-mint-100)",
      dot: "var(--m-mint-500)",
      text: "var(--m-mint-700)",
    },
    next: {
      bg: "var(--m-primary-100)",
      dot: "var(--m-primary-600)",
      text: "var(--m-primary-700)",
    },
    scheduled: {
      bg: "var(--m-ink-100)",
      dot: "var(--m-ink-400)",
      text: "var(--m-ink-600)",
    },
  };
  const c = colorMap[status];
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
      <div style={{ width: 50, paddingTop: 14, textAlign: "right" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: c.text,
            letterSpacing: "-0.01em",
          }}
        >
          {time}
        </div>
        <div
          style={{ fontSize: 10, color: "var(--m-ink-400)", fontWeight: 600 }}
        >
          50min
        </div>
      </div>
      <div style={{ position: "relative", width: 14, paddingTop: 18 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: c.dot,
            border: "3px solid white",
            boxShadow:
              status === "next" ? "0 0 0 4px var(--m-primary-100)" : "none",
            margin: "0 auto",
          }}
        />
        {!last && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 33,
              bottom: -10,
              width: 2,
              background: "var(--m-ink-150)",
              transform: "translateX(-50%)",
            }}
          />
        )}
      </div>
      <div
        className="m-card m-fade"
        style={{
          flex: 1,
          padding: 12,
          marginBottom: 0,
          borderColor:
            status === "next" ? "var(--m-primary-300)" : "var(--m-ink-150)",
          background: status === "next" ? "var(--m-primary-50)" : "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            className={`m-avatar ${tintFor(name)}`}
            style={{ width: 36, height: 36, fontSize: 13, borderRadius: 12 }}
          >
            {initials(name)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
            <div
              style={{
                fontSize: 11,
                color: "var(--m-ink-500)",
                display: "flex",
                gap: 4,
                alignItems: "center",
                marginTop: 1,
              }}
            >
              <Icon name={kind === "Online" ? "video" : "pin"} size={11} />
              {kind} · Sala {kind === "Online" ? "virtual" : "02"}
            </div>
          </div>
          {status === "next" && (
            <div
              style={{
                height: 32,
                padding: "0 12px",
                borderRadius: 10,
                background: "var(--m-grad-primary)",
                color: "white",
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 4,
                boxShadow: "var(--m-shadow-glow)",
              }}
            >
              Iniciar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 6. FINANCIAL
// ─────────────────────────────────────────────────────────────────
function ScreenFinancial({ tabVariant }) {
  const items = [
    { kind: "in", name: "Beatriz Carvalho", cat: "Sessão · 26/04", val: 280 },
    { kind: "in", name: "Marina Albuquerque", cat: "Sessão · 26/04", val: 280 },
    {
      kind: "out",
      name: "Aluguel consultório",
      cat: "Despesa fixa · 25/04",
      val: 1850,
    },
    {
      kind: "in",
      name: "João Pedro Vasconcelos",
      cat: "Pacote 4 sessões · 24/04",
      val: 1040,
    },
    {
      kind: "out",
      name: "Material · livraria",
      cat: "Despesa variável · 23/04",
      val: 142,
    },
    { kind: "in", name: "Letícia Almeida", cat: "Sessão · 22/04", val: 280 },
  ];
  return (
    <div className="m-screen">
      <AppBar
        title="Financeiro"
        subtitle="ABRIL · 2026"
        trailing={
          <>
            <IconBtn icon="download" />
            <IconBtn icon="filter" />
          </>
        }
      />
      <div className="m-scroll">
        {/* Balance hero */}
        <div
          className="m-card m-card--gradient m-fade"
          style={{ padding: 18, position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              right: -30,
              bottom: -50,
              width: 160,
              height: 160,
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>
            Saldo do mês
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginTop: 4,
            }}
          >
            R$ 12.948,00
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 14,
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 14,
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.85,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Icon name="arrowdown" size={11} stroke={2.4} />
                Entradas
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 4 }}>
                R$ 14.840
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 14,
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.85,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Icon name="arrowup" size={11} stroke={2.4} />
                Saídas
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 4 }}>
                R$ 1.892
              </div>
            </div>
          </div>
        </div>

        {/* Tiny chart */}
        <div className="m-card m-fade" style={{ marginTop: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--m-ink-500)",
                  fontWeight: 600,
                }}
              >
                Últimas 12 semanas
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  marginTop: 2,
                  letterSpacing: "-0.01em",
                }}
              >
                +18% vs trimestre
              </div>
            </div>
            <span className="m-chip m-chip--mint">
              <Icon name="trend" size={11} stroke={2.4} />
              Crescendo
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 4,
              height: 56,
              marginTop: 14,
            }}
          >
            {[34, 42, 38, 55, 48, 60, 52, 68, 62, 75, 70, 82].map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${v}%`,
                  background:
                    i >= 9 ? "var(--m-grad-primary)" : "var(--m-primary-200)",
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </div>

        <div className="m-filter-row" style={{ marginTop: 14 }}>
          <div className="m-filter m-filter--active">Tudo</div>
          <div className="m-filter">Entradas</div>
          <div className="m-filter">Saídas</div>
          <div className="m-filter">A receber</div>
        </div>

        <div className="m-section-title" style={{ marginTop: 4 }}>
          <span>Lançamentos</span>
          <span className="m-section-title__action">Exportar</span>
        </div>

        {items.map((it) => (
          <div className="m-row m-fade" key={it.name + it.cat}>
            <div
              className={`m-avatar ${it.kind === "in" ? "m-bg-mint" : "m-bg-coral"}`}
              style={{ width: 38, height: 38, borderRadius: 12 }}
            >
              <Icon
                name={it.kind === "in" ? "arrowdown" : "arrowup"}
                size={16}
                color="white"
                stroke={2.4}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="m-row__title"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {it.name}
              </div>
              <div className="m-row__sub">{it.cat}</div>
            </div>
            <div className="m-row__right">
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color:
                    it.kind === "in"
                      ? "var(--m-mint-700)"
                      : "var(--m-coral-600)",
                  letterSpacing: "-0.01em",
                }}
              >
                {it.kind === "in" ? "+" : "−"} R${" "}
                {it.val.toLocaleString("pt-BR")}
              </div>
            </div>
          </div>
        ))}
      </div>
      <TabBar active="wallet" variant={tabVariant} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 7. SETTINGS
// ─────────────────────────────────────────────────────────────────
function ScreenSettings({ tabVariant }) {
  const groups = [
    {
      title: "Conta",
      items: [
        { i: "user", t: "Perfil profissional", s: "CRP, bio, foto" },
        { i: "shield", t: "Privacidade & LGPD", s: "Termos com pacientes" },
        { i: "lock", t: "Senha e segurança", s: "Biometria · 2FA" },
      ],
    },
    {
      title: "Atendimento",
      items: [
        { i: "clock", t: "Horários disponíveis", s: "Seg–Sex · 8h às 19h" },
        { i: "video", t: "Sala virtual", s: "Google Meet conectado" },
        { i: "tag", t: "Valores e pacotes", s: "4 modalidades" },
      ],
    },
    {
      title: "Financeiro",
      items: [
        { i: "pix", t: "Chave Pix", s: "CPF cadastrada" },
        { i: "card", t: "Pagamento por link", s: "Stripe · ativo" },
        { i: "doc", t: "Recibos automáticos", s: "Modelo NFS-e" },
      ],
    },
    {
      title: "Aplicativo",
      items: [
        { i: "bell", t: "Notificações", s: "2 lembretes ativos" },
        { i: "moon", t: "Aparência", s: "Sistema · Claro / Escuro" },
        { i: "globe", t: "Idioma", s: "Português (BR)" },
      ],
    },
  ];
  return (
    <div className="m-screen">
      <AppBar
        title="Configurações"
        big={true}
        trailing={<IconBtn icon="search" />}
      />
      <div className="m-scroll">
        <div
          className="m-card m-fade"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: 14,
          }}
        >
          <div
            className="m-avatar m-bg-violet"
            style={{ width: 56, height: 56, borderRadius: 18, fontSize: 18 }}
          >
            AF
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Nathaly Bruza</div>
            <div
              style={{ fontSize: 12, color: "var(--m-ink-500)", marginTop: 1 }}
            >
              Psicóloga clínica · CRP 06/12345
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
              <span className="m-chip m-chip--mint">
                <span className="m-chip__dot"></span>Plano Pro
              </span>
              <span className="m-chip">Renova 12/05</span>
            </div>
          </div>
          <Icon name="chevron" size={18} color="var(--m-ink-400)" />
        </div>

        {groups.map((g) => (
          <React.Fragment key={g.title}>
            <div className="m-section-title">{g.title}</div>
            <div className="m-card" style={{ padding: 4 }}>
              {g.items.map((it, i) => (
                <div
                  key={it.t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 12px",
                    borderBottom:
                      i < g.items.length - 1
                        ? "1px solid var(--m-ink-100)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: "var(--m-primary-50)",
                      color: "var(--m-primary-600)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={it.i} size={17} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--m-ink-900)",
                      }}
                    >
                      {it.t}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--m-ink-500)",
                        marginTop: 1,
                      }}
                    >
                      {it.s}
                    </div>
                  </div>
                  <Icon name="chevron" size={16} color="var(--m-ink-400)" />
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}

        <div style={{ height: 16 }} />
        <button
          className="m-btn m-btn--ghost m-btn--full"
          style={{
            color: "var(--m-coral-600)",
            borderColor: "var(--m-coral-100)",
          }}
        >
          <Icon name="logout" size={17} /> Sair
        </button>
        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "var(--m-ink-400)",
            marginTop: 14,
          }}
        >
          Mente · v2.4.1
        </div>
      </div>
      <TabBar active="settings" variant={tabVariant} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 8. NEW APPOINTMENT (modal-style sheet)
// ─────────────────────────────────────────────────────────────────
function ScreenNewAppt({ tabVariant }) {
  return (
    <div className="m-screen">
      <AppBar
        title="Novo agendamento"
        big={false}
        leading={<IconBtn icon="x" />}
        trailing={<IconBtn icon="check" />}
      />
      <div className="m-scroll">
        <div className="m-card m-fade" style={{ padding: 4 }}>
          <SelectRow
            label="Paciente"
            value="Marina Albuquerque"
            tone="primary"
            icon="user"
          />
          <SelectRow
            label="Modalidade"
            value="Online · Google Meet"
            icon="video"
          />
          <SelectRow label="Data" value="Quarta, 03 de maio" icon="calendar" />
          <SelectRow label="Horário" value="11h30 — 12h20" icon="clock" last />
        </div>

        <div className="m-section-title">Recorrência</div>
        <div className="m-card" style={{ padding: 14 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["Não", "Semanal", "Quinzenal", "Mensal"].map((o, i) => (
              <div
                key={o}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  textAlign: "center",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  background:
                    i === 1 ? "var(--m-grad-primary)" : "var(--m-ink-100)",
                  color: i === 1 ? "white" : "var(--m-ink-600)",
                  boxShadow: i === 1 ? "var(--m-shadow-glow)" : "none",
                }}
              >
                {o}
              </div>
            ))}
          </div>
          <div
            style={{ fontSize: 12, color: "var(--m-ink-500)", marginTop: 12 }}
          >
            Próximas 8 sessões serão criadas automaticamente.
          </div>
        </div>

        <div className="m-section-title">Valor & cobrança</div>
        <div className="m-card" style={{ padding: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--m-ink-500)",
                  fontWeight: 600,
                }}
              >
                Sessão padrão
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  marginTop: 2,
                }}
              >
                R$ 280,00
              </div>
            </div>
            <span className="m-chip m-chip--mint">
              <Icon name="pix" size={11} />
              Pix automático
            </span>
          </div>
        </div>

        <div className="m-section-title">Observações</div>
        <div className="m-card" style={{ padding: 14, minHeight: 90 }}>
          <div
            style={{ fontSize: 13, color: "var(--m-ink-500)", lineHeight: 1.5 }}
          >
            Continuar trabalho de reestruturação cognitiva. Verificar lição de
            casa do diário de pensamentos.
          </div>
        </div>

        <button
          className="m-btn m-btn--primary m-btn--full m-btn--lg"
          style={{ marginTop: 16 }}
        >
          <Icon name="check" size={18} stroke={2.4} /> Confirmar agendamento
        </button>
      </div>
    </div>
  );
}

function SelectRow({ label, value, icon, tone, last }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 12px",
        borderBottom: last ? "none" : "1px solid var(--m-ink-100)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          background:
            tone === "primary" ? "var(--m-primary-100)" : "var(--m-ink-100)",
          color:
            tone === "primary" ? "var(--m-primary-600)" : "var(--m-ink-600)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={17} />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--m-ink-500)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--m-ink-900)",
            marginTop: 1,
          }}
        >
          {value}
        </div>
      </div>
      <Icon name="chevron" size={16} color="var(--m-ink-400)" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 9. NEW TRANSACTION (entrada / saída financeira)
// ─────────────────────────────────────────────────────────────────
function ScreenNewTx({ tabVariant }) {
  const [kind, setKind] = React.useState("in");
  const isIn = kind === "in";
  return (
    <div className="m-screen">
      <AppBar
        title="Nova transação"
        big={false}
        leading={<IconBtn icon="x" />}
        trailing={<IconBtn icon="check" />}
      />
      <div className="m-scroll">
        {/* Tipo: segmented control com gradient no ativo */}
        <div
          className="m-card m-fade"
          style={{ padding: 6, display: "flex", gap: 6 }}
        >
          <button
            onClick={() => setKind("in")}
            style={{
              flex: 1,
              height: 48,
              border: "none",
              cursor: "pointer",
              borderRadius: 14,
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: isIn ? "var(--m-grad-mint)" : "transparent",
              color: isIn ? "white" : "var(--m-ink-500)",
              boxShadow: isIn ? "var(--m-shadow-mint)" : "none",
            }}
          >
            <Icon name="arrowdown" size={16} stroke={2.4} /> Entrada
          </button>
          <button
            onClick={() => setKind("out")}
            style={{
              flex: 1,
              height: 48,
              border: "none",
              cursor: "pointer",
              borderRadius: 14,
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: !isIn ? "var(--m-grad-coral)" : "transparent",
              color: !isIn ? "white" : "var(--m-ink-500)",
              boxShadow: !isIn
                ? "0 12px 32px -8px rgba(244,63,94,0.30)"
                : "none",
            }}
          >
            <Icon name="arrowup" size={16} stroke={2.4} /> Saída
          </button>
        </div>

        {/* Valor — destaque grande */}
        <div
          className="m-card m-fade"
          style={{
            marginTop: 12,
            padding: 22,
            textAlign: "center",
            background: isIn
              ? "linear-gradient(135deg, var(--m-mint-50), white)"
              : "linear-gradient(135deg, var(--m-coral-50), white)",
            border: `1px solid ${isIn ? "var(--m-mint-100)" : "var(--m-coral-100)"}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--m-ink-500)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Valor
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 6,
              marginTop: 8,
              color: isIn ? "var(--m-mint-700)" : "var(--m-coral-600)",
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700 }}>R$</span>
            <span
              style={{
                fontSize: 44,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              280
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                opacity: 0.6,
              }}
            >
              ,00
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              justifyContent: "center",
              marginTop: 14,
              flexWrap: "wrap",
            }}
          >
            {["R$ 140", "R$ 280", "R$ 480", "R$ 1.040"].map((p) => (
              <div
                key={p}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "white",
                  border: "1px solid var(--m-ink-150)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--m-ink-600)",
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="m-section-title">Detalhes</div>
        <div className="m-card" style={{ padding: 4 }}>
          {isIn ? (
            <>
              <SelectRow
                label="Paciente"
                value="Beatriz Carvalho"
                tone="primary"
                icon="user"
              />
              <SelectRow
                label="Categoria"
                value="Sessão individual"
                icon="tag"
              />
              <SelectRow label="Forma de pagamento" value="Pix" icon="pix" />
              <SelectRow
                label="Data do recebimento"
                value="Hoje, 26 abr"
                icon="calendar"
                last
              />
            </>
          ) : (
            <>
              <SelectRow
                label="Categoria"
                value="Aluguel consultório"
                tone="primary"
                icon="tag"
              />
              <SelectRow
                label="Fornecedor"
                value="Coworking Itaim"
                icon="user"
              />
              <SelectRow
                label="Forma de pagamento"
                value="Cartão de crédito"
                icon="card"
              />
              <SelectRow
                label="Data do pagamento"
                value="Hoje, 26 abr"
                icon="calendar"
                last
              />
            </>
          )}
        </div>

        <div className="m-section-title">Status</div>
        <div className="m-card" style={{ padding: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {(isIn
              ? ["Recebido", "A receber", "Atrasado"]
              : ["Pago", "A pagar", "Atrasado"]
            ).map((o, i) => (
              <div
                key={o}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  textAlign: "center",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  background:
                    i === 0
                      ? isIn
                        ? "var(--m-grad-mint)"
                        : "var(--m-grad-coral)"
                      : "var(--m-ink-100)",
                  color: i === 0 ? "white" : "var(--m-ink-600)",
                  boxShadow:
                    i === 0
                      ? isIn
                        ? "var(--m-shadow-mint)"
                        : "0 12px 32px -8px rgba(244,63,94,0.30)"
                      : "none",
                }}
              >
                {o}
              </div>
            ))}
          </div>
        </div>

        <div className="m-section-title">Recorrência</div>
        <div className="m-card" style={{ padding: 14 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["Não", "Semanal", "Mensal", "Anual"].map((o, i) => (
              <div
                key={o}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  textAlign: "center",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  background:
                    i === 0 ? "var(--m-grad-primary)" : "var(--m-ink-100)",
                  color: i === 0 ? "white" : "var(--m-ink-600)",
                  boxShadow: i === 0 ? "var(--m-shadow-glow)" : "none",
                }}
              >
                {o}
              </div>
            ))}
          </div>
        </div>

        <div className="m-section-title">Anexos</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div
            className="m-card"
            style={{
              flex: 1,
              padding: 14,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 92,
              border: "1px dashed var(--m-ink-200)",
              background: "var(--m-ink-50)",
            }}
          >
            <Icon name="doc" size={20} color="var(--m-ink-500)" />
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--m-ink-600)",
                marginTop: 6,
              }}
            >
              Recibo
            </div>
          </div>
          <div
            className="m-card"
            style={{
              flex: 1,
              padding: 14,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 92,
              border: "1px dashed var(--m-ink-200)",
              background: "var(--m-ink-50)",
            }}
          >
            <Icon name="plus" size={20} color="var(--m-ink-500)" />
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--m-ink-600)",
                marginTop: 6,
              }}
            >
              Comprovante
            </div>
          </div>
        </div>

        <div className="m-section-title">Observações</div>
        <div className="m-card" style={{ padding: 14, minHeight: 80 }}>
          <div
            style={{ fontSize: 13, color: "var(--m-ink-500)", lineHeight: 1.5 }}
          >
            {isIn
              ? "Sessão #24 · pacote mensal · valor pré-acordado."
              : "Pagamento via boleto · vencimento dia 5."}
          </div>
        </div>

        <button
          className={`m-btn m-btn--full m-btn--lg`}
          style={{
            marginTop: 16,
            background: isIn ? "var(--m-grad-mint)" : "var(--m-grad-coral)",
            color: "white",
            boxShadow: isIn
              ? "var(--m-shadow-mint)"
              : "0 12px 32px -8px rgba(244,63,94,0.30)",
          }}
        >
          <Icon name="check" size={18} stroke={2.4} /> Salvar{" "}
          {isIn ? "entrada" : "saída"}
        </button>
      </div>
    </div>
  );
}

// ─── Master picker ──────────────────────────────────────────────
function Screen({ name, tabVariant = "floating" }) {
  switch (name) {
    case "login":
      return <ScreenLogin />;
    case "dashboard":
      return <ScreenDashboard tabVariant={tabVariant} />;
    case "patients":
      return <ScreenPatients tabVariant={tabVariant} />;
    case "patient":
      return <ScreenPatientDetail tabVariant={tabVariant} />;
    case "agenda":
      return <ScreenAgenda tabVariant={tabVariant} />;
    case "newappt":
      return <ScreenNewAppt tabVariant={tabVariant} />;
    case "newtx":
      return <ScreenNewTx tabVariant={tabVariant} />;
    case "financial":
      return <ScreenFinancial tabVariant={tabVariant} />;
    case "settings":
      return <ScreenSettings tabVariant={tabVariant} />;
    default:
      return <div>?</div>;
  }
}

window.Screen = Screen;
