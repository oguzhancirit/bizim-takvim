import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Person, Plan } from '../types';
import { daysUntil, firstName, longDate } from '../lib/dates';
import {
  acceptPlan, addActivity, cancelPlan, changeActivity, createPlan, returnToDraft, sendForApproval, setBusyDay, updatePlanField,
} from '../lib/store';
import { celebrate } from '../lib/confetti';
import { spring } from '../lib/motion';
import { Avatar, SyncedInput, Switch, personColor } from './ui';
import type { DayInfo } from './Calendar';
import { DiaTextReveal } from './magic/DiaTextReveal';
import { ShimmerButton } from './magic/ShimmerButton';

interface Props {
  day: string;
  info: DayInfo;
  me: Person;
  partner: Person | null;
  onToast: (msg: string) => void;
}

export function DayPanel({ day, info, me, partner, onToast }: Props) {
  const [busyAction, setBusyAction] = useState(false);
  const pName = partner ? firstName(partner.name) : 'Partnerin';
  const color = (p: Person | null) => personColor(p?.uid ?? '', [me, partner]);
  const d = daysUntil(day);

  const run = async (fn: () => Promise<unknown>, msg?: string) => {
    setBusyAction(true);
    try {
      await fn();
      if (msg) onToast(msg);
    } catch (e) {
      console.error(e);
      onToast('Bir şey ters gitti, tekrar dene');
    } finally {
      setBusyAction(false);
    }
  };

  return (
    <div className="day-panel">
      <p className="eyebrow">{d === 0 ? 'Bugün' : d === 1 ? 'Yarın' : d > 1 ? `${d} gün sonra` : 'Geçmiş gün'}</p>
      <DiaTextReveal as="h2" key={day} text={longDate(day)} className="panel-title" duration={1.1} />

      <div className="people">
        <div className="person-row">
          <Avatar person={me} color={color(me)} />
          <span className="pname">Sen</span>
          <span className={`pill ${info.meBusy ? 'busy' : 'free'}`}>{info.meBusy ? 'Dolu' : 'Boş'}</span>
          <Switch checked={info.meBusy} label="Bu gün doluyum" onChange={(v) => setBusyDay(me.uid, day, v)} />
        </div>
        <div className="person-row">
          <Avatar person={partner} color={color(partner)} />
          <span className="pname">{pName}</span>
          <span className={`pill ${info.partnerBusy ? 'busy' : 'free'}`}>{info.partnerBusy ? 'Dolu' : 'Boş'}</span>
          <span className="switch-spacer" />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {info.plan ? (
          <motion.div key="plan" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={spring}>
            <Planner plan={info.plan} me={me} partner={partner} busy={busyAction} run={run} color={color} />
          </motion.div>
        ) : info.meBusy || info.partnerBusy ? (
          <motion.p key="busy" className="hint busy-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {info.meBusy && info.partnerBusy ? 'İkiniz de bu gün dolusunuz.' : info.meBusy ? 'Bu gün sen dolusun.' : `${pName} bu gün dolu.`} Date için yeşil günlere bak.
          </motion.p>
        ) : (
          <motion.div key="free" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="hint">İkiniz de boşsunuz — bu günü ayırıp bir date planlayabilirsin.</p>
            <ShimmerButton
              className="big"
              disabled={busyAction}
              onClick={() => run(() => createPlan(day, me, partner), `Gün ayrıldı! ${pName} da taslağa ekleme yapabilir`)}
            >
              Bu günü ayır & date planla
            </ShimmerButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Planner({
  plan, me, partner, busy, run, color,
}: {
  plan: Plan; me: Person; partner: Person | null; busy: boolean;
  run: (fn: () => Promise<unknown>, msg?: string) => Promise<void>;
  color: (p: Person | null) => string;
}) {
  const [newText, setNewText] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const editable = plan.status === 'draft';
  const pName = partner ? firstName(partner.name) : 'Partnerin';
  const who = (uid: string) => (uid === me.uid ? me : partner);
  const canSend = !!plan.title.trim() || plan.activities.length > 0;
  const sentByMe = plan.sentBy === me.uid;

  const add = () => {
    const t = newText.trim();
    if (!t) return;
    setNewText('');
    addActivity(plan.id, me.uid, t);
  };

  const ribbon =
    plan.status === 'accepted'
      ? { cls: 'date', text: 'Date ayarlandı ✓' }
      : plan.status === 'pending'
        ? { cls: 'pending', text: sentByMe ? `${pName} onayını bekliyor` : `${pName} onayını istiyor` }
        : { cls: 'draft', text: 'Taslak · ikiniz de düzenleyebilirsiniz' };

  return (
    <div className="planner">
      <motion.div layout className={`ribbon ${ribbon.cls}`} transition={spring}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={ribbon.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {ribbon.text}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      <SyncedInput
        className="title-field"
        value={plan.title}
        placeholder="Date'in adı (ör. Sahilde gün batımı)"
        ariaLabel="Date başlığı"
        disabled={!editable}
        onSave={(v) => updatePlanField(plan.id, me.uid, 'title', v)}
      />
      <div className="row2">
        <label className="mini-field">
          <span>Saat</span>
          <SyncedInput type="time" value={plan.time} disabled={!editable} ariaLabel="Saat" onSave={(v) => updatePlanField(plan.id, me.uid, 'time', v)} />
        </label>
        <label className="mini-field grow">
          <span>Yer</span>
          <SyncedInput value={plan.place} placeholder="Nerede?" disabled={!editable} onSave={(v) => updatePlanField(plan.id, me.uid, 'place', v)} />
        </label>
      </div>

      <h4 className="section-label">Etkinlikler</h4>
      <motion.ul layout className="activities">
        <AnimatePresence initial={false}>
          {plan.activities.map((a) => (
            <motion.li
              key={a.id}
              layout
              initial={{ opacity: 0, x: -16, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 24, height: 0 }}
              transition={spring}
            >
              <Avatar person={who(a.by)} color={color(who(a.by))} size={24} />
              <SyncedInput
                className="act-field"
                value={a.text}
                disabled={!editable}
                ariaLabel="Etkinlik"
                onSave={(v) => (v.trim() ? changeActivity(plan.id, me.uid, a.id, v) : changeActivity(plan.id, me.uid, a.id, null))}
              />
              {editable && (
                <button className="x" aria-label="Etkinliği sil" onClick={() => changeActivity(plan.id, me.uid, a.id, null)}>×</button>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
        {plan.activities.length === 0 && !editable && <li className="empty">Etkinlik eklenmemiş</li>}
      </motion.ul>

      {editable && (
        <form
          className="add-row"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <input className="field" value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Etkinlik ekle: sinema, akşam yemeği…" aria-label="Yeni etkinlik" />
          <motion.button whileTap={{ scale: 0.9 }} className="btn soft" type="submit" disabled={!newText.trim()}>Ekle</motion.button>
        </form>
      )}

      <div className="actions">
        {plan.status === 'draft' && (
          <>
            <ShimmerButton
              className="big"
              disabled={busy || !canSend}
              onClick={() => run(() => sendForApproval(plan, me, partner), `${pName}'a onay isteği gitti 📨`)}
            >
              Onaya gönder
            </ShimmerButton>
            {!canSend && <p className="hint small">Göndermek için bir başlık ya da etkinlik ekle.</p>}
          </>
        )}

        {plan.status === 'pending' && !sentByMe && (
          <>
            <ShimmerButton
              className="big glow"
              duration="2s"
              disabled={busy}
              onClick={(e) => { const el = e.currentTarget; run(async () => { await acceptPlan(plan, me, partner); celebrate(el); }, 'Date ayarlandı! 🎉'); }}
            >
              Onayla ✓
            </ShimmerButton>
            <button className="btn ghost" disabled={busy} onClick={() => run(() => returnToDraft(plan, me, partner), 'Taslağa geri döndü')}>
              Değiştirmek istiyorum
            </button>
          </>
        )}

        {plan.status === 'pending' && sentByMe && (
          <>
            <div className="waiting"><span className="dot" /><span className="dot" /><span className="dot" /> Yanıt bekleniyor</div>
            <button className="btn ghost" disabled={busy} onClick={() => run(() => returnToDraft(plan, me, partner))}>Geri çek ve düzenle</button>
          </>
        )}

        <AnimatePresence initial={false} mode="wait">
          {confirmCancel ? (
            <motion.div key="c" className="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <span>{plan.status === 'accepted' ? "Date'i iptal edelim mi?" : 'Plan silinsin mi?'}</span>
              <button className="btn danger" disabled={busy} onClick={() => run(() => cancelPlan(plan, me, partner), plan.status === 'accepted' ? 'Date iptal edildi' : 'Plan silindi')}>Evet</button>
              <button className="btn ghost" onClick={() => setConfirmCancel(false)}>Vazgeç</button>
            </motion.div>
          ) : (
            <motion.button key="b" className="btn text-danger" onClick={() => setConfirmCancel(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {plan.status === 'accepted' ? "Date'i iptal et" : plan.status === 'pending' ? 'Planı sil' : 'Taslağı sil'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
