import Button from '../ui/Button.jsx';
import { SEAT_STATUS_LABEL } from '../../lib/enrollment.js';
import { useLanguage } from '../../context/LanguageContext';
import './BatchCalendar.css';

function formatDateRange(startDate, endDate) {
  const opts = { day: 'numeric', month: 'short', year: 'numeric' };
  const start = new Date(startDate + 'T00:00:00').toLocaleDateString('en-IN', opts);
  const end = new Date(endDate + 'T00:00:00').toLocaleDateString('en-IN', opts);
  return `${start} – ${end}`;
}

export default function BatchCalendar({ batches, loading }) {
  const { t } = useLanguage();

  if (loading) {
    return <p className="batch-calendar__hint">Loading batch availability…</p>;
  }

  if (batches.length === 0) {
    return <p className="batch-calendar__hint">No upcoming batches scheduled right now.</p>;
  }

  const sorted = [...batches].sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="batch-calendar">
      {sorted.map((batch) => (
        <div className="batch-row" key={batch.id}>
          <div className="batch-row__info">
            <span className="batch-row__course">{batch.courseName}</span>
            <span className="batch-row__dates">{formatDateRange(batch.startDate, batch.endDate)}</span>
          </div>

          <span className={`batch-row__badge batch-row__badge--${batch.status}`}>
            {SEAT_STATUS_LABEL[batch.status]}
            {batch.status !== 'full' && ` · ${batch.seatsLeft} left`}
          </span>

          <Button
            variant={batch.status === 'full' ? 'ghost' : 'secondary'}
            size="md"
            href={batch.status === 'full' ? undefined : `#/enroll?course=${batch.courseId}&batch=${batch.id}`}
            disabled={batch.status === 'full'}
          >
            {batch.status === 'full' ? t('academyPage.full') : t('academyPage.apply')}
          </Button>
        </div>
      ))}
    </div>
  );
}
